import { PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { S3StorageAdapter } from '../adapter/s3StorageAdapter';
import sharp from 'sharp';
import { BlogsRepository } from '../../blogs/blogs.repository';
import { BadRequestException } from '@nestjs/common';
import { Main } from '../../blogs/entity/main.entity';

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
			throw new BadRequestException([{message: 'Type are not according'}])
		}

		const originalPhoto = await sharp(command.buffer).metadata();

		if((originalPhoto.width !== 940) ||  (originalPhoto.height !== 432)) {
				throw new BadRequestException([{message: 'This width and height are not according'}])
			}

		if(originalPhoto.size > 100000) {
				throw new BadRequestException([{message: 'This sizes are not according'}])
			}

		const objectCommand = new PutObjectCommand(bucketParams)
		try {
			const uploadResult: PutObjectCommandOutput = await this.s3StorageAdapter.s3Client.send(objectCommand)
			const createMain = await this.blogsRepository.updateMainForPost(command.blogId, command.postId, url, originalPhoto)

			const createPostByBlogId = await this.blogsRepository.getMain(createMain.raw[0].id)

			const middlePhoto = await sharp(command.buffer)
			.resize({width: 300, height: 180})
			.metadata();

			const smallPhoto = await sharp(command.buffer)
			.resize({width: 149, height: 96})
			.metadata();

			return {
				main: [
				  {
					url,
					width: originalPhoto.width,
					height: originalPhoto.height,
					fileSize: originalPhoto.size
				  },
				  {
					url,
					width: middlePhoto.width,
					height: middlePhoto.height,
					fileSize: middlePhoto.size
				  },
				  {
					url,
					width: smallPhoto.width,
					height: smallPhoto.height,
					fileSize: smallPhoto.size
				  }
				]
		}
		} catch(exeption) {
			console.log(exeption)
			throw exeption
		}
	}
}