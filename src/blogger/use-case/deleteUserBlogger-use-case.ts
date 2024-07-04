import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../../blogs/blogs.repository";

export class DeleteUserBloggerCommand {
	constructor() {}
}

@CommandHandler(DeleteUserBloggerCommand)
export class DeleteUserBloggerUseCase implements ICommandHandler<DeleteUserBloggerCommand> {
	constructor(
		protected readonly blogsRepository: BlogsRepository
	) {}
 	async execute(command: DeleteUserBloggerCommand): Promise<any> {
		return await this.blogsRepository.deleteUserBanBlogger();
	}
}