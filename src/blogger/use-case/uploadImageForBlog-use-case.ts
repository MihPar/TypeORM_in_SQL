import { PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { S3StorageAdapter } from "../adapter/s3StorageAdapter";
import sharp from "sharp";
import { BlogsRepository } from "../../blogs/blogs.repository";
import { BadRequestException } from "@nestjs/common";

export class UploadImageForBlogCommand {
	constructor(
		public blogId: string,
		public userId: string,
		public mimetype: string,
		public originalname: string,
		public buffer: Buffer
	) { }
}

@CommandHandler(UploadImageForBlogCommand)
export class UploadImageForBlogUseCase implements ICommandHandler<UploadImageForBlogCommand> {
		constructor(
			protected readonly s3StorageAdapter: S3StorageAdapter,
			protected readonly blogsRepository: BlogsRepository
		) {}
	async execute(command: UploadImageForBlogCommand): Promise<any> {

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

			if(infoImage.width !== 156 || infoImage.height !== 156) {
				throw new BadRequestException([{message: 'Width and height are not according'}])
			}

			if(infoImage.size > 100000) {
				throw new BadRequestException([{message: 'Sizes are not according'}])
			}
		const objectCommand = new PutObjectCommand(bucketParams)
		try {
			const uploadResult: PutObjectCommandOutput = await this.s3StorageAdapter.s3Client.send(objectCommand)
			await this.blogsRepository.updateMainForBlogs(command.blogId, url, infoImage)
			return {
					wallpaper: null,
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