import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscribe } from "../entity/subscribe.entity";
import { Repository } from "typeorm";
import { BlogsQueryRepository } from "../blogs.queryReposity";
import { SubscribeEnum } from "../enum/subscribeEnum";
import { UsersQueryRepository } from "../../users/users.queryRepository";

export class SubscribeForPostCommand {
	constructor(
		public blogId: string,
		public userId: string
	) {}
}

@CommandHandler(SubscribeForPostCommand)
export class SubscribeForPostUseCase implements ICommandHandler<SubscribeForPostCommand> {
	constructor(
		protected readonly blogsQueryRepository: BlogsQueryRepository,
		protected readonly usersQueryRepository: UsersQueryRepository,
		@InjectRepository(Subscribe) protected readonly subscribeRepositor: Repository<Subscribe>,
	) {}
	async execute(command: SubscribeForPostCommand): Promise<void> {
		const findBlog = await this.blogsQueryRepository.getBlogByBlogIdSubscription(command.blogId)
		// console.log("findBlog: ", findBlog)
		// const findUser = await this.usersQueryRepository.findUserByBlogId(command.blogId)
		const findSubscription = await this.blogsQueryRepository.findSubscribe(command.blogId, command.userId)
		if(!findSubscription) {
			const subscribeForBlog = new Subscribe()
			subscribeForBlog.blogId = command.blogId
			subscribeForBlog.userId = command.userId
			subscribeForBlog.currentUserSubscriptionStatus = SubscribeEnum.Subscribed
			// subscribeForBlog.subscribersCount = 0
			// console.log("score: ", subscribeForBlog.subscribersCount)
	
			await this.subscribeRepositor.save(subscribeForBlog)
	
			// console.log("subscribeForBlog 39: ", subscribeForBlog)
			const id = subscribeForBlog.id
			const count = await this.subscribeRepositor.increment(
				{id},
				'subscribersCount',
				1
			)
			const getScore = await this.blogsQueryRepository.findSubscribe(command.blogId, command.userId)
			// console.log("getScore 47: ", getScore)
				return 
		} else if(findSubscription.currentUserSubscriptionStatus === SubscribeEnum.Subscribed) {
			return 
		} 
		// else if(findSubscription.currentUserSubscriptionStatus === SubscribeEnum.None) {
		// 	const id = findSubscription.id
		// 	const count = await this.subscribeRepositor.increment(
		// 		{id},
		// 		'subscribersCount',
		// 		1
		// 	)
		// 	// console.log("count: ", count)
		// 		return 
		// }
		
	}
}