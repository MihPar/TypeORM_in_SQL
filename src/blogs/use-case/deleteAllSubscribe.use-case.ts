import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../blogs.queryReposity";

export class DeleteSubscribeCommand {
	constructor() {}
}

@CommandHandler(DeleteSubscribeCommand)
export class DeleteSubscribeUseCase implements ICommandHandler<DeleteSubscribeCommand> {
	constructor(
		protected readonly blogsQueryRepository: BlogsQueryRepository
	){}
	async execute(command: DeleteSubscribeCommand): Promise<any> {
		await this.blogsQueryRepository.deleteAllSubscribe()
	}
}