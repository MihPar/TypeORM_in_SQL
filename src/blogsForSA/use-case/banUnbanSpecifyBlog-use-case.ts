import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BannedType } from "../../blogger/dto-class";
import { BlogsRepository } from "../../blogs/blogs.repository";
import { NotFoundException } from "@nestjs/common";
import { PostsRepository } from "../../posts/posts.repository";

export class BanUnbanBlogCommand {
	constructor(
		public id: string,
		public ban: BannedType,
	) {}
}

@CommandHandler(BanUnbanBlogCommand)
export class BanUnbanBlogUseCase implements ICommandHandler<BanUnbanBlogCommand> {
	constructor(
		protected readonly blogsRepository: BlogsRepository,
		protected readonly postsRepository: PostsRepository
	) {}
	async execute(command: BanUnbanBlogCommand): Promise<void> {
		const findBlog = await this.blogsRepository.findBlogById(command.id)
		if(!findBlog) throw new NotFoundException([{message: 'Blog not found'}])

		const banBlog = await this.blogsRepository.banBlog(
			command.id,
			command.ban.isBanned, 
			new Date().toISOString()
		)
		const banPosts = await this.postsRepository.banUnbanPostByUserId(
			findBlog.userId, 
			command.ban.isBanned
		)
	}

}