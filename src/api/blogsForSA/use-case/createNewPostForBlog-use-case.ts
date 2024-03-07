import { PostsRepository } from './../../posts/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsViewModel } from '../../posts/posts.type';
import { LikesRepository } from '../../likes/likes.repository';
import { bodyPostsModelClass } from '../../posts/dto/posts.class.pipe';
import { LikeStatusEnum } from '../../likes/likes.emun';
import { NewestLikesClass } from '../../likes/likes.class';
import { Posts } from '../../posts/entity/entity.posts';

export class CreateNewPostForBlogCommand {
  constructor(
	public blogId: number,
    public inputDataModel: bodyPostsModelClass,
	public blogName: string,
	public userId: number
  ) {}
}

@CommandHandler(CreateNewPostForBlogCommand)
export class CreateNewPostForBlogUseCase
  implements ICommandHandler<CreateNewPostForBlogCommand>
{
  constructor(
	protected readonly postsRepository: PostsRepository,
	protected readonly likesRepository: LikesRepository
  ) {}
  async execute(command: CreateNewPostForBlogCommand): Promise<PostsViewModel | null> {
    const newPost: Posts = new Posts()
      newPost.title = command.inputDataModel.title,
      newPost.shortDescription = command.inputDataModel.shortDescription,
      newPost.content = command.inputDataModel.content,
      newPost.blogId = command.blogId,
      newPost.blogName = command.blogName,
      0, 0

	  const createPost: any = await this.postsRepository.createNewPosts(newPost)
	  console.log("createPost: ", createPost)
	if (!createPost) return null;
	return Posts.getPostsViewModelForSA(createPost)
  }
}
