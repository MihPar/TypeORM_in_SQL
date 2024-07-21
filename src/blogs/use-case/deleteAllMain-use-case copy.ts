import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../blogs.repository";

export class DeleteAllMainCommand {
	constructor() {}
}

@CommandHandler(DeleteAllMainCommand)
export class DeleteAllMainUseCase implements ICommandHandler<DeleteAllMainCommand> {
	constructor(
		protected readonly blogsRepository: BlogsRepository
	) {}
	async execute(command: DeleteAllMainCommand): Promise<void> {
		await this.blogsRepository.deleteAllMain()
	}
}