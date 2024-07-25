import { Metadata } from 'sharp';
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
		const originalKey = `/content/users/${command.blogId}/avatars/${command.blogId}_original_avatar.jpeg`
		const bucketParamsOriginal = {
			Bucket: `michael-paramonov`,
			Key: originalKey,
			Body: command.buffer,
			ContentType: 'image/jpeg'
		}
		const urlOriginal = `https://storage.yandexcloud.net/michael-paramonov/${originalKey}`
		
		if((command.mimetype !== "image/jpeg") && (command.mimetype !== "image/jpg") && (command.mimetype !== "image/png")) {
			throw new BadRequestException([{message: 'Type are not according'}])
		}
		const originalPhoto = await sharp(command.buffer).metadata();
		if((originalPhoto.width !== 940) ||  (originalPhoto.height !== 432)) {
				throw new BadRequestException([{message: 'This width and height are not according'}])
			}

		if(originalPhoto.size > 100000) {
				throw new BadRequestException([{message: 'This sizes are not according'}])
			}
		const objectCommandOriginal = new PutObjectCommand(bucketParamsOriginal)

		const middlePhotoBuffer= await sharp(command.buffer)
			.resize({width: 300, height: 180})
			.toBuffer()
		const middlePhoto = await sharp(middlePhotoBuffer).metadata()
		const middleKey = `/content/users/${command.blogId}/avatars/${command.blogId}_middle_avatar.jpeg`
		const bucketParamsMiddle = {
			Bucket: `michael-paramonov`,
			Key: middleKey,
			Body: middlePhotoBuffer,
			ContentType: 'image/jpeg'
		}
		const urlMiddle = `https://storage.yandexcloud.net/michael-paramonov/${middleKey}`
		const objectCommandMiddle = new PutObjectCommand(bucketParamsMiddle)


		const smallPhotoBuffer= await sharp(command.buffer)
			.resize({width: 149, height: 96})
			.toBuffer()
		const smallPhoto = await sharp(smallPhotoBuffer).metadata()
		const smallKey = `/content/users/${command.blogId}/avatars/${command.blogId}_small_avatar.jpeg`
		const bucketParamsSmall = {
			Bucket: `michael-paramonov`,
			Key: smallKey,
			Body: smallPhotoBuffer,
			ContentType: 'image/jpeg'
		}
		const urlSmall = `https://storage.yandexcloud.net/michael-paramonov/${smallKey}`
		const objectCommandSmall = new PutObjectCommand(bucketParamsSmall)

		try {
			const uploadResultOriginal: PutObjectCommandOutput = await this.s3StorageAdapter.s3Client.send(objectCommandOriginal)
			const uploadResultMiddle: PutObjectCommandOutput = await this.s3StorageAdapter.s3Client.send(objectCommandMiddle)
			const uploadResultSmall: PutObjectCommandOutput = await this.s3StorageAdapter.s3Client.send
			(objectCommandSmall)


			const createMainOriginal = await this.blogsRepository.updateMainForPost(command.blogId, command.postId, urlOriginal, originalPhoto)
			// console.log("original: ", createMainOriginal)

			const createMainMiddle = await this.blogsRepository.updateMainForPost(command.blogId, command.postId, urlMiddle, middlePhoto)
			// console.log("middle: ", createMainMiddle)

			const createMainSmall = await this.blogsRepository.updateMainForPost(command.blogId, command.postId, urlSmall, smallPhoto)
			// console.log("small: ", createMainSmall)


		
			// console.log("originalPhoto: ", originalPhoto)
			// console.log("middle: ", middlePhoto)
			// console.log("smallPhoto: ", smallPhoto)

			return {
				main: [
				  {
					url: urlOriginal,
					width: originalPhoto.width,
					height: originalPhoto.height,
					fileSize: originalPhoto.size
				  },
				  {
					url: urlMiddle,
					width: middlePhoto.width,
					height: middlePhoto.height,
					fileSize: middlePhoto.size
				  },
				  {
					url: urlSmall,
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