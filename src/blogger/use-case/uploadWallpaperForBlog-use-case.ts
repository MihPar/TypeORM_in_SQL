import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3"
import { SaveFileResultType } from "../typtBlogger"
import { S3StorageAdapter } from "../adapter/s3StorageAdapter"
import sharp from "sharp";
import { BlogsRepository } from "../../blogs/blogs.repository";



export class UploadWallpaperForBlogCommand {
	constructor(
		public userId: string,
		public blogId: string, 
		public originalname: string, 
		public buffer: Buffer
	) {}
}


@CommandHandler(UploadWallpaperForBlogCommand)
export class UploadWallpaperForBlogUseCase implements ICommandHandler<UploadWallpaperForBlogCommand, any> {
	
	constructor(
		protected readonly s3StorageAdapter: S3StorageAdapter,
		protected readonly blogsRepository: BlogsRepository
	) {}

	async execute(command: UploadWallpaperForBlogCommand): Promise<SaveFileResultType> {
		// const infoImage = await sharp(command.buffer).metadata()
		const infoImage = await sharp(command.buffer)
		.resize(320, 240)
		.toFile('output.webp', (err, info) => {});

		const key = `/content/users/${command.blogId}/avatars/${command.blogId}_avatar.png`
		const bucketParams = {
			Bucket: `michael-paramonov`,
			Key: key,
			Body: command.buffer,
			ContentType: 'image/png'
		}
		const objectCommand = new PutObjectCommand(bucketParams)
		// console.log("33: ")
		try {
		// console.log("35: ")
			const uploadResult: PutObjectCommandOutput = await this.s3StorageAdapter.s3Client.send(objectCommand)
			// console.log("uploadResult: ", uploadResult)

		const url = `https://storage.yandexcloud.net/michael-paramonov/${key}`

		// await this.blogsRepository.updateBlogForWallpaper(command.blogId, url, infoImage)

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