import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { S3StorageAdapter } from "../adapter/s3StorageAdapter";

export class GetSecretDownloadAvatarCommmand {
	constructor(
		public userId: string,
		public paymentId: string
	) {}
}

@CommandHandler(GetSecretDownloadAvatarCommmand)
export class GetSecretDownloadAvatarUseCase implements ICommandHandler<GetSecretDownloadAvatarCommmand> {
	constructor(
		protected readonly s3StorageAdapter: S3StorageAdapter
	) {}
	async execute(command: GetSecretDownloadAvatarCommmand): Promise<any> {
		
	}
}