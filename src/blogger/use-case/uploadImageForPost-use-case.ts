import { PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { S3StorageAdapter } from '../adapter/s3StorageAdapter';
import sharp from 'sharp';
import { BlogsRepository } from '../../blogs/blogs.repository';
import { BadRequestException } from '@nestjs/common';

export class UploadImageForPostCommand {
	constructor(
		public blogId: string,
		public postId: string,
		public userId: string,
		public mimetype: string,
		public originalname: string,
		public buffer: Buffer
	) {}
}

@CommandHandler(UploadImageForPostCommand)
export class UploadImageForPostUseCase implements ICommandHandler<UploadImageForPostCommand> {
	constructor(
		protected readonly s3StorageAdapter: S3StorageAdapter,
		protected readonly blogsRepository: BlogsRepository
	) {}
	async execute(command: UploadImageForPostCommand): Promise<any> {
		const key = `/content/users/${command.blogId}/avatars/${command.blogId}_avatar.jpeg`
		const bucketParams = {
			Bucket: `michael-paramonov`,
			Key: key,
			Body: command.buffer,
			ContentType: 'image/jpeg'
		}
		const url = `https://storage.yandexcloud.net/michael-paramonov/${key}`
		
		if(command.mimetype !== ("image/jpeg" || "image/jpg" || "image/png")) {
			throw new BadRequestException([{message: 'This type are not according'}])
		}

		const infoImage = await sharp(command.buffer).metadata();

		if((infoImage.width !== (940 || 300 || 149)) &&  (infoImage.height !== (432 || 180 || 96))) {
				throw new BadRequestException([{message: 'This width and height are not according'}])
			}

		if(infoImage.size > 100000) {
				throw new BadRequestException([{message: 'This sizes are not according'}])
			}

		const objectCommand = new PutObjectCommand(bucketParams)
		try {
			const uploadResult: PutObjectCommandOutput = await this.s3StorageAdapter.s3Client.send(objectCommand)
			await this.blogsRepository.updateMainForPost(command.blogId, command.postId, url, infoImage)
			return {
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