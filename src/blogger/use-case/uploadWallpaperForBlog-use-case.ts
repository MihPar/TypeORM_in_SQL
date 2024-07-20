import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3"
import { SaveFileResultType } from "../typtBlogger"
import { S3StorageAdapter } from "../adapter/s3StorageAdapter"
import sharp from "sharp";
import { BlogsRepository } from "../../blogs/blogs.repository";
import { BadRequestException } from "@nestjs/common";



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
		console.log("originalname: ", command.originalname)
		const key = `/content/users/${command.blogId}/avatars/${command.blogId}_avatar.jpeg`
		const bucketParams = {
			Bucket: `michael-paramonov`,
			Key: key,
			Body: command.buffer,
			ContentType: 'image/jpeg'
		}
		const url = `https://storage.yandexcloud.net/michael-paramonov/${key}`
		
		let infoImage = await sharp(command.buffer)
		// .resize({width: 1028, height: 312})
		.metadata()

		if(infoImage.width !== 1028 && infoImage.height !== 312 && infoImage.size > 100) {
			throw new BadRequestException([{message: 'This sizes are not according'}])
		}


		// const resizeImages = () => {
		// 	const today = new Date()
		// 	const year = today.getFullYear()
		// 	const month = `${today.getMonth + 1}`.padStart(2, "0")

		// 	const sizes = [
		// 		{
		// 			path: 'origin',
		// 			width: 940,
		// 			heigth: 432
		// 		},
		// 		{
		// 			path: 'middle',
		// 			width: 300,
		// 			heigth: 180
		// 		},
		// 		{
		// 			path: 'small',
		// 			width: 149,
		// 			heigth: 96
		// 		},
		// 	]
		// }

		// const resizeFile = new MulterSharpResizer(
		// 	sizes,
		// 	key,
		// 	url,
		// )

		// await resizeFile.resize()
		// const infoImage = await sharp(command.buffer).metadata()
		// console.log("command.buffer: ", command.buffer)
		// let infoImage = await sharp(command.buffer)
		// .metadata()
		// .resize({width: 1028, height: 312})
		// .toBuffer()
		// .toFormat("png")
		// .png({quality: 100})
		// .toFile('optimized.png');
		// console.log("infoImage: ", infoImage)
		// const result = fs.readdirSync('optimized.png')
		// console.log("result: ", result)

		

		const objectCommand = new PutObjectCommand(bucketParams)
		try {
			const uploadResult: PutObjectCommandOutput = 
				await this.s3StorageAdapter.s3Client.send(objectCommand)
				// console.log("uploadResult: ", uploadResult)
				await this.blogsRepository.updateBlogForWallpaper(command.blogId, url, infoImage)
			return {
					wallpaper: {
					  url,
					  width: infoImage.width,
					  height: infoImage.height,
					  fileSize: infoImage.size
					},
					main: [
					//   {
					// 	url,
					// 	width: infoImage.width,
					// 	height: infoImage.height,
					// 	fileSize: infoImage.size
					//   }
					]
			}
		} catch(exeption) {
			console.log(exeption)
			throw exeption
		}
	}
}