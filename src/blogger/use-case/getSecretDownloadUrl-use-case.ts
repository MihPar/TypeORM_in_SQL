import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { S3StorageAdapter } from "../adapter/s3StorageAdapter";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export class GetSecretDownloadAvatarCommmand {
	constructor(
		public fileId: string
	) {}
}

@CommandHandler(GetSecretDownloadAvatarCommmand)
export class GetSecretDownloadAvatarUseCase implements ICommandHandler<GetSecretDownloadAvatarCommmand> {
	constructor(
		protected readonly s3StorageAdapter: S3StorageAdapter
	) {}
	async execute(command: GetSecretDownloadAvatarCommmand): Promise<any> {
		const bucketParams = {
			Bucket: `michael-paramonov`,
			Key: command.fileId,
			Body: 'BODY',
		}
		const getObjectCommand = new GetObjectCommand(bucketParams)
		const signUrl = await getSignedUrl(
			this.s3StorageAdapter.s3Client, 
			getObjectCommand, 
			{expiresIn: 100}
		)
		return signUrl
	}
}