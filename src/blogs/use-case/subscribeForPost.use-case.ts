import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscribe } from "../entity/subscribe.entity";
import { Repository } from "typeorm";
import { BlogsQueryRepository } from "../blogs.queryReposity";
import { SubscribeEnum } from "../enum/subscribeEnum";
import { UsersQueryRepository } from "../../users/users.queryRepository";

export class SubscribeForPostCommand {
	constructor(
		public blogId: string
	) {}
}

@CommandHandler(SubscribeForPostCommand)
export class SubscribeForPostUseCase implements ICommandHandler<SubscribeForPostCommand> {
	constructor(
		protected readonly blogsQueryRepository: BlogsQueryRepository,
		protected readonly usersQueryRepository: UsersQueryRepository,
		@InjectRepository(Subscribe) protected readonly subscribeRepositor: Repository<Subscribe>,
	) {}
	async execute(command: SubscribeForPostCommand): Promise<void | null> {
		const findBlog = await this.blogsQueryRepository.getBlogByBlogId(command.blogId)
		const findUser = await this.usersQueryRepository.findUserByBlogId(command.blogId)
		
		const subscribeForBlog = new Subscribe()
		subscribeForBlog.blogId = command.blogId
		subscribeForBlog.userId = findUser.id
		subscribeForBlog.currentUserSubscriptionStatus = SubscribeEnum.Subscribed
		subscribeForBlog.subscribersCount = 0

		const subscribe: Subscribe = await this.subscribeRepositor.save(subscribeForBlog)
			if(!subscribe) return null
		const id = subscribe.id
		const count = await this.subscribeRepositor.increment(
			{id},
			'subscribersCount',
			1
		)
			return 
	}
}