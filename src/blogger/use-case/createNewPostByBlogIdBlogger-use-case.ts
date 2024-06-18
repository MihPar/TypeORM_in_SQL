import { PostsRepository } from './../../posts/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsViewModel } from '../../posts/posts.type';
import { LikesRepository } from '../../likes/likes.repository';
import { bodyPostsModelClass } from '../../posts/dto/posts.class.pipe';
import { LikeStatusEnum } from '../../likes/likes.emun';
import { NewestLikesClass } from '../../likes/likes.class';
import { Posts } from '../../posts/entity/entity.posts';
import { BlogsViewTypeWithUserId } from '../../blogs/blogs.type';
import { BlogsQueryRepositoryForSA } from '../../blogsForSA/blogsForSA.queryReposity';

export class CreateNewPostForBlogBloggerCommand {
  constructor(
	public blogId: string,
    public inputDataModel: bodyPostsModelClass,
	public userId: string
  ) {}
}

@CommandHandler(CreateNewPostForBlogBloggerCommand)
export class CreateNewPostForBlogBloggerUseCase
  implements ICommandHandler<CreateNewPostForBlogBloggerCommand>
{
  constructor(
	protected readonly postsRepository: PostsRepository,
	protected readonly likesRepository: LikesRepository,
	protected readonly blogsQueryRepositoryForSA: BlogsQueryRepositoryForSA
  ) {}
  async execute(command: CreateNewPostForBlogBloggerCommand): Promise<PostsViewModel | null> {
	const findBlog = await this.blogsQueryRepositoryForSA.findBlogByIdBlogger(command.blogId, command.userId)

    const newPost: Posts = new Posts()
      newPost.title = command.inputDataModel.title,
      newPost.shortDescription = command.inputDataModel.shortDescription,
      newPost.content = command.inputDataModel.content,
      newPost.blogId = command.blogId,
      newPost.blogName = findBlog.name,
      0, 0

	  const createPost: any = await this.postsRepository.createNewPosts(newPost)
	if (!createPost) return null;
	return Posts.getPostsViewModelForSA(createPost)
  }
}
