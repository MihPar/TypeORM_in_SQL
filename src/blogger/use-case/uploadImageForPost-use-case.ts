import { PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { S3StorageAdapter } from '../adapter/s3StorageAdapter';
import sharp from 'sharp';

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
			const uploadResult: PutObjectCommandOutput = await this.s3StorageAdapter.s3Client.send(objectCommand)
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