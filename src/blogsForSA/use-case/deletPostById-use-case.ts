import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { inputModelUpdataPost } from "../dto/blogs.class-pipe";
import { PostsRepository } from "../../posts/posts.repository";
import { PostsQueryRepository } from "../../posts/postQuery.repository";
import { NotFoundException } from "@nestjs/common";
import { BlogsRepositoryForSA } from "../blogsForSA.repository";

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
		protected readonly postsQueryRepository: PostsQueryRepository,
		private readonly blogsRepositoryForSA: BlogsRepositoryForSA,

	) {}
 	async execute(command: DeletePostByIdCommand): Promise<any> {
		await this.blogsRepositoryForSA.findBlogByIdBlogger(command.dto.blogId, command.userId);
		const findPost = await this.postsQueryRepository.findPostsById(command.dto.postId)
		if (!findPost) throw new NotFoundException("404")
		return await this.postRepository.deletedPostByIdWithBlogId(command.dto.postId, command.dto.blogId);
	}
}