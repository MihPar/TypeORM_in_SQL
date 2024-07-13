import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { PutObjectCommand, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3"
import { SaveFileResultType } from "../typtBlogger"


export class S3StorageAdapterCommand {
	constructor(
		public userId: string,
		public blogId: string, 
		public originalname: string, 
		public buffer: Buffer
	) {}
}


@CommandHandler(S3StorageAdapterCommand)
export class S3StorageAdapterUseCase implements ICommandHandler<S3StorageAdapterCommand, any> {
	s3Client: S3Client
	// bucketName: `michael-paramonov`
	constructor() {
		const REGION = 'us-east-1'
		this.s3Client = new S3Client({
			region: REGION,
			endpoint: 'https://storage.yandexcloud.net',
			credentials: {
				secretAccessKey: "YCPYEGcmqi6x2EWQDk07BIBTgowJgFtN7CeEHI4n",
				accessKeyId: 'YCAJEXc7e_rINV6X5mObUjCJI'
			}
		})
	}

	async execute(command: S3StorageAdapterCommand): Promise<SaveFileResultType> {
		const key = `/content/users/${command.userId}/avatars/${command.originalname}`
		const bucketParams = {
			Bucket: `michael-paramonov`,
			Key: key,
			Body: command.buffer,
			ContentType: 'image/png'
		}
		const objectCommand = new PutObjectCommand(bucketParams)
		try {
			const uploadResult: PutObjectCommandOutput = await this.s3Client.send(objectCommand)
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