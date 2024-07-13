import { PutObjectCommand, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { S3StorageAdapter } from "../adapter/s3StorageAdapter";

export class UploadImageForBlogCommand {
	constructor(
		public blogId: string,
		public userId: string,
		public originalname: string,
		public buffer: Buffer
	) { }
}

@CommandHandler(UploadImageForBlogCommand)
export class UploadImageForBlogUseCase implements ICommandHandler<UploadImageForBlogCommand> {
		constructor(
			protected readonly s3StorageAdapter: S3StorageAdapter
		) {}
	async execute(command: UploadImageForBlogCommand): Promise<any> {
		const key = `/content/users/${command.blogId}/avatars/${command.originalname}`
		const bucketParams = {
			Bucket: `michael-paramonov`,
			Key: key,
			Body: command.buffer,
			ContentType: 'image/png'
		}
		const objectCommand = new PutObjectCommand(bucketParams)
		try {
			const uploadResult: PutObjectCommandOutput = await this.s3StorageAdapter.s3Client.send(objectCommand)
			return {
					wallpaper: {
					  url: key,
					  width: "156px",
					  height: "156px",
					  fileSize: "100KB"
					},
					main: [
					  {
						url: key,
					  width: "156px",
					  height: "156px",
					  fileSize: "100KB"
					  }
					]
			}
		} catch(exeption) {
			console.log(exeption)
			throw exeption
		}
	}
}