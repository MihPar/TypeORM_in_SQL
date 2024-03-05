import { PostsRepository } from './../../posts/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsViewModel } from '../../posts/posts.type';
import { bodyPostsModelClass } from '../../posts/dto/posts.class.pipe';
import { inputModelUpdataPost } from '../dto/blogs.class-pipe';
import { Posts } from '../../posts/entity/entity-posts';
import { LikeForPost } from '../../likes/entity/likesInfo-entity';

export class UpdateExistingPostByIdWithBlogIdCommand {
  constructor(
	public dto: inputModelUpdataPost,
	public inputModel: bodyPostsModelClass
  ) {}
}

@CommandHandler(UpdateExistingPostByIdWithBlogIdCommand)
export class updateExistingPostByIdWithBlogIdUseCase
  implements ICommandHandler<UpdateExistingPostByIdWithBlogIdCommand>
{
  constructor(
	protected postsRepository: PostsRepository
  ) {}
  async execute(command: UpdateExistingPostByIdWithBlogIdCommand): Promise<boolean | null> {
	const findPostById: Posts = await this.postsRepository.findPostByIdAndBlogId(command.dto.postId, command.dto.blogId)
	if(!findPostById) return null
	const findNewestLike: LikeForPost = await this.postsRepository.findNewestLike(command.dto.postId)
	const newPost = Posts.updatePresentPost(findPostById, command.inputModel)
    const updateExistingPost: Posts = await this.postsRepository.updatePost(newPost, command.dto.postId)
	if(!updateExistingPost) return null
	return true
	// return Posts.getPostsViewModelForSA(updateExistingPost, findNewestLike);
  }
}
