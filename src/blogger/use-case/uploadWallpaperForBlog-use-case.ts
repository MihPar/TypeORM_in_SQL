import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3"
import { SaveFileResultType } from "../typtBlogger"
import { S3StorageAdapter } from "../adapter/s3StorageAdapter"
import sharp from "sharp";
import { BlogsRepository } from "../../blogs/blogs.repository";
import { BadRequestException } from "@nestjs/common";



export class UploadImageForBlogWallpaperCommand {
	constructor(
		public userId: string,
		public blogId: string, 
		public mimetype: string,
		public originalname: string, 
		public buffer: Buffer
	) {}
}

@CommandHandler(UploadImageForBlogWallpaperCommand)
export class UploadWallpaperForBlogUseCase implements ICommandHandler<UploadImageForBlogWallpaperCommand, any> {
	
	constructor(
		protected readonly s3StorageAdapter: S3StorageAdapter,
		protected readonly blogsRepository: BlogsRepository
	) {}

	async execute(command: UploadImageForBlogWallpaperCommand): Promise<SaveFileResultType> {
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

		let infoImage = await sharp(command.buffer).metadata()

		if(infoImage.width !== 1028 || infoImage.height !== 312) {
			throw new BadRequestException([{message: 'Width and heigth are not according'}])
		}

		if(infoImage.size > 100000) {
			throw new BadRequestException([{message: 'Sizes are not according'}])
		}

		const objectCommand = new PutObjectCommand(bucketParams)
		try {
			const uploadResult: PutObjectCommandOutput = 
				await this.s3StorageAdapter.s3Client.send(objectCommand)
				await this.blogsRepository.createWallpaperForBlogs(command.blogId, url, infoImage)
			return {
					wallpaper: {
					  url,
					  width: infoImage.width,
					  height: infoImage.height,
					  fileSize: infoImage.size
					},
					main: []
			}
		} catch(exeption) {
			console.log(exeption)
			throw exeption
		}
	}
}