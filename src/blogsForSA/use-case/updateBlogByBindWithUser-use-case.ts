import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Blogs } from "../../blogs/entity/blogs.entity";
import { BlogsQueryRepositoryForSA } from "../blogsForSA.queryReposity";
import { User } from "../../users/entities/user.entity";
import { UsersQueryRepository } from "../../users/users.queryRepository";
import { NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../../users/users.repository";

export class BandBlogCommand {
	constructor(
		public id: string,
		public userId: string
	) { }
}

@CommandHandler(BandBlogCommand)
export class BandBlogUseCase implements ICommandHandler<BandBlogCommand> {
	constructor(
		@InjectRepository(Blogs) protected readonly blogsQueryRepositoryForSA: BlogsQueryRepositoryForSA,
		@InjectRepository(User) protected readonly usersQueryRepository: UsersQueryRepository,
		@InjectRepository(User) protected readonly usersRepository: UsersRepository
	) { }
	async execute(command: BandBlogCommand): Promise<boolean | null> {
		const blogById = await this.usersRepository.findBlogByIdAndUserId(command.id, command.userId)
		if (!blogById) {
				throw new NotFoundException(
					[
						{ mesage: 'Blog not foud' }
					]
				)
			}
		
		const bindBlogById = await this.usersRepository.bindBlogByIdUserId(command.id, command.userId)
			if(!bindBlogById) {
				throw new NotFoundException([
					{message: 'Blog did not binded'}
				])
			}
		return bindBlogById
	}
}