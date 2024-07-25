import { PostsRepository } from './../../posts/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsViewModel } from '../../posts/posts.type';
import { bodyPostsModelClass } from '../../posts/dto/posts.class.pipe';
import { Posts } from '../../posts/entity/entity.posts';
import { inputModelUpdataPost } from '../../blogsForSA/dto/blogs.class-pipe';
import { BlogsRepositoryForSA } from '../../blogsForSA/blogsForSA.repository';

export class UpdateExistingPostByIdWithBlogIdBloggerCommand {
	constructor(
		public dto: inputModelUpdataPost,
		public inputModel: bodyPostsModelClass,
		public userId: string
	) { }
}

@CommandHandler(UpdateExistingPostByIdWithBlogIdBloggerCommand)
export class UpdateExistingPostByIdWithBlogIdBloggerUseCase
	implements ICommandHandler<UpdateExistingPostByIdWithBlogIdBloggerCommand> {
	constructor(
		protected postsRepository: PostsRepository,
		private readonly blogsRepositoryForSA: BlogsRepositoryForSA,

		
	) { }
	async execute(command: UpdateExistingPostByIdWithBlogIdBloggerCommand): Promise<PostsViewModel | null> {
		const blog = await this.blogsRepositoryForSA.findBlogByIdBlogger(command.dto.blogId, command.userId);
		const findPostById: Posts = await this.postsRepository.findPostByIdAndBlogId(command.dto.postId, command.dto.blogId)
		if (!findPostById) return null
		const findNewestLike: any = await this.postsRepository.findNewestLike(command.dto.postId)
		const newPost = Posts.updatePresentPost(findPostById, command.inputModel)
		const updateExistingPost: Posts = await this.postsRepository.updatePost(newPost, command.dto.postId)
		if (!updateExistingPost) return null

		return Posts.getPostsViewModelForSA(updateExistingPost, findNewestLike);
	}
}
