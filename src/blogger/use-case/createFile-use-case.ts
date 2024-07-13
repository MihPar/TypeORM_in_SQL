import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {join} from 'node:path'
import { ensureDirSync, saveFileAsync } from "../../utils/fs-utils";
import { FileStorageAdapterCommand, FileStorageAdapterUseCase } from "./fileStorageAdapter-use-case";



export class CreateFileCommand {
	constructor(
		public blogId: string, 
		public originalname: string, 
		public buffer: Buffer
	) {}
}

@CommandHandler(CreateFileCommand)
export class CreateFileUseCase implements ICommandHandler<CreateFileCommand> {
	constructor(
		protected commandBus: CommandBus

	) {}
	async execute(command: CreateFileCommand): Promise<any> {
		// const saveFile = new CreateFileCommand(command.blogId, command.originalname, command.buffer)
		const fileStorage = new FileStorageAdapterCommand(command.blogId, command.originalname, command.buffer)
		await this.commandBus.execute<FileStorageAdapterCommand>(fileStorage)
		// await this.fileStorageAdapterUseCase.execute(saveFile)
	}
}