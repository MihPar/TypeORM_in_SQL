import { PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { S3StorageAdapter } from '../adapter/s3StorageAdapter';

export class UploadImageForPostCommand {
	constructor(
		public blogId: string,
		public postId: string,
		public userId: string,
		public originalname: string,
		public buffer: Buffer
	) {}
}

@CommandHandler(UploadImageForPostCommand)
export class UploadImageForPostUseCase implements ICommandHandler<UploadImageForPostCommand> {
	constructor(
		protected readonly s3StorageAdapter: S3StorageAdapter
	) {}
	async execute(command: UploadImageForPostCommand): Promise<any> {
		const key = `/content/users/${command.blogId}/${command.postId}/avatars/${command.originalname}`
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
					  width: "940px",
					  height: "432px",
					  fileSize: "100KB"
					},
					main: [
					  {
						url: key,
					  width: "940px",
					  height: "432px",
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