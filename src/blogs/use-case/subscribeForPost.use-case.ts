import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscribe } from "../entity/subscribe.entity";
import { Repository } from "typeorm";
import { BlogsQueryRepository } from "../blogs.queryReposity";

export class SubscribeForPostCommand {
	constructor(
		public blogId: string
	) {}
}

@CommandHandler(SubscribeForPostCommand)
export class SubscribeForPostUseCase implements ICommandHandler<SubscribeForPostCommand> {
	constructor(
		protected readonly blogsQueryRepository: BlogsQueryRepository,
		@InjectRepository(Subscribe) protected readonly telegrammRepositor: Repository<Subscribe>,
	) {}
	async execute(command: SubscribeForPostCommand): Promise<void> {
		await this.blogsQueryRepository.getBlogByBlogId(command.blogId)
		const subscribe = await this.telegrammRepositor
			.createQueryBuilder()
			.insert()
			.into(Subscribe)
			.values([
				{subscribe: true}
			])
			.execute()
			return 
	}
}