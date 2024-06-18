import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { inputModelUpdataPost } from "../dto/blogs.class-pipe";
import { PostsRepository } from "../../posts/posts.repository";
import { BlogsQueryRepositoryForSA } from "../blogsForSA.queryReposity";
import { PostsQueryRepository } from "../../posts/postQuery.repository";
import { NotFoundException } from "@nestjs/common";

export class DeletePostByIdCommand {
	constructor(
		public dto: inputModelUpdataPost,
		public userId: string
	) {}
}

@CommandHandler(DeletePostByIdCommand)
export class DeletePostByIdCommandUseCase implements ICommandHandler<DeletePostByIdCommand> {
	constructor(
		protected readonly postRepository: PostsRepository,
		protected readonly blogsQueryRepositoryForSA: BlogsQueryRepositoryForSA,
		protected readonly postsQueryRepository: PostsQueryRepository
	) {}
 	async execute(command: DeletePostByIdCommand): Promise<any> {
		await this.blogsQueryRepositoryForSA.findBlogByIdBlogger(command.dto.blogId, command.userId);
		const findPost = await this.postsQueryRepository.findPostsById(command.dto.postId)
		if (!findPost) throw new NotFoundException("404")
		return await this.postRepository.deletedPostByIdWithBlogId(command.dto.postId, command.dto.blogId);
	}
}