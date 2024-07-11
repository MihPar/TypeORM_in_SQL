import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {join} from 'node:path'
import { ensureDirSync, saveFileAsync } from "../../utils/fs-utils";


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
	async execute(command: FileStorageAdapterCommand): Promise<any> {
		const dirPath = join("content", "users", "10", "avatars")	
		await ensureDirSync(dirPath)
		await saveFileAsync(
			join(dirPath, command.originalname
			), 
			command.buffer
		)
	}
}