import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../blogs.queryReposity";

export class DeleteSubscribeForPostCommand {
	constructor(
		public blogId: string
	) {}
}

@CommandHandler(DeleteSubscribeForPostCommand)
export class DeleteSubscribeForPostUseCase implements ICommandHandler<DeleteSubscribeForPostCommand> {
	constructor(
		protected readonly blogsQueryRepository: BlogsQueryRepository
	) {}
	async execute(command: DeleteSubscribeForPostCommand): Promise<void> {
		await this.blogsQueryRepository.deleteSubscribeForPost(command.blogId)
		return
	}
}