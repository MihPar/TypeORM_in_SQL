import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Blogs } from "../../blogs/entity/blogs.entity";
import { BlogsQueryRepositoryForSA } from "../blogsForSA.queryReposity";
import { User } from "../../users/entities/user.entity";
import { UsersQueryRepository } from "../../users/users.queryRepository";
import { NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../../users/users.repository";
import { BlogsRepository } from "../../blogs/blogs.repository";
import { BanBlogInputModel } from "../dto/blogs.class-pipe";
import { PostsRepository } from "../../posts/posts.repository";

export class BandBlogCommand {
	constructor(
		public id: string,
		public userId: string,
		// public ban: BanBlogInputModel
	) { }
}

@CommandHandler(BandBlogCommand)
export class BandBlogUseCase implements ICommandHandler<BandBlogCommand> {
	constructor(
		@InjectRepository(Blogs) protected readonly blogsQueryRepositoryForSA: BlogsQueryRepositoryForSA,
			protected readonly usersQueryRepository: UsersQueryRepository,
			protected readonly usersRepository: UsersRepository,
			protected readonly blogsRepository: BlogsRepository,
			protected readonly postsRepository: PostsRepository
	) { }
	async execute(command: BandBlogCommand): Promise<void | null> {
		const blogById = await this.usersRepository.findBlogByIdAndUserId(command.id, command.userId)
		if (!blogById) {
				throw new NotFoundException(
					[
						{ mesage: 'Blog not foud' }
					]
				)
			}
		
		const bindBlogById = await this.blogsRepository.bindBlogByIdUserId(command.id, command.userId)
			if(!bindBlogById) {
				throw new NotFoundException([
					{message: 'Blog did not binded'}
				])
			}

		// await this.postsRepository.bindPostByUserId(bindBlogById.userId,)
		return
	}
}