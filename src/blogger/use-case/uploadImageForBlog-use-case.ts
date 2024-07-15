import { PutObjectCommand, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { S3StorageAdapter } from "../adapter/s3StorageAdapter";
import sharp from "sharp";

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
		const key = `/content/users/${command.blogId}/avatars/${command.blogId}_avatar.png`
		const bucketParams = {
			Bucket: `michael-paramonov`,
			Key: key,
			Body: command.buffer,
			ContentType: 'image/png'
		}
		const url = `https://storage.yandexcloud.net/michael-paramonov/${key}`
		const objectCommand = new PutObjectCommand(bucketParams)
		try {
			const infoImage = await sharp(command.buffer).metadata();
			// console.log("infoImage: ", infoImage)

			const uploadResult: PutObjectCommandOutput = await this.s3StorageAdapter.s3Client.send(objectCommand)
			// console.log("uploadResult: ", uploadResult)
			return {
					wallpaper: {
					  url,
					  width: infoImage.width,
					  height: infoImage.height,
					  fileSize: infoImage.size
					},
					main: [
					  {
						url,
						width: infoImage.width,
						height: infoImage.height,
						fileSize: infoImage.size
					  }
					]
			}
		} catch(exeption) {
			console.log(exeption)
			throw exeption
		}
	}
}