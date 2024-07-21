import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../blogs.repository";

export class DeleteAllImagesCommand {
	constructor() {}
}

@CommandHandler(DeleteAllImagesCommand)
export class DeleteAllImagesUseCase implements ICommandHandler<DeleteAllImagesCommand> {
	constructor(
		protected readonly blogsRepository: BlogsRepository
	) {}
	async execute(command: DeleteAllImagesCommand): Promise<void> {
		await this.blogsRepository.deleteAllImages()
	}
}