import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3"
import { SaveFileResultType } from "../typtBlogger"
import { S3StorageAdapter } from "../adapter/s3StorageAdapter"


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
		protected readonly s3StorageAdapter: S3StorageAdapter
	) {}

	async execute(command: UploadWallpaperForBlogCommand): Promise<SaveFileResultType> {
		const key = `/content/users/${command.userId}/avatars/${command.originalname}`
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
			return {
					wallpaper: {
					  url: key,
					  width: "1028px",
					  height: "312px",
					  fileSize: "100KB"
					},
					main: [
					  {
						url: key,
					  width: "1028px",
					  height: "312px",
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