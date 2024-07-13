import { PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

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
	s3Client: S3Client
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
	async execute(command: UploadImageForPostCommand): Promise<any> {
		const key = `/content/users/${command.blogId}/${command.postId}/avatars/${command.originalname}`
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
					  width: "940px",
					  height: "432px",
					  fileSize: "100KB"
					},
					main: [
					  {
						url: key,
					  width: "940px",
					  height: "432px",
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