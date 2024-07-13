import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {join} from 'node:path'
import { ensureDirSync, saveFileAsync } from "../../utils/fs-utils";
import { SaveFileResultType, SaveFileType } from "../typtBlogger";
import { DeleteObjectCommand, PutObjectCommand, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";


export class FileStorageAdapterCommand {
	constructor(
		public blogId: string, 
		public originalname: string, 
		public buffer: Buffer
	) {}
}

@CommandHandler(FileStorageAdapterCommand)
export class FileStorageAdapterUseCase implements ICommandHandler<FileStorageAdapterCommand> {
	constructor() {}
	async execute(command: FileStorageAdapterCommand): Promise<SaveFileType> {
		const dirPath = join("content", "users", command.blogId, "avatars")	
		await ensureDirSync(dirPath)
		const relativaPath = join(dirPath, command.originalname)
		await saveFileAsync(relativaPath, command.buffer)
		return {
			url: `/content/users${command.blogId}/avatars/${command.originalname}`,
			fileId: relativaPath
		}
	}
}


