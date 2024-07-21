import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../blogs.repository";

export class DeleteAllWallpaperCommand {
	constructor() {}
}

@CommandHandler(DeleteAllWallpaperCommand)
export class DeleteAllWallpaperUseCase implements ICommandHandler<DeleteAllWallpaperCommand> {
	constructor(
		protected readonly blogsRepository: BlogsRepository
	) {}
	async execute(command: DeleteAllWallpaperCommand): Promise<void> {
		await this.blogsRepository.deleteAllWallpaper()
	}
}