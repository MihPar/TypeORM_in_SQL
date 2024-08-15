import { NotFoundException, Post } from '@nestjs/common';
import { PostsRepository } from './../../posts/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsViewModel } from '../../posts/posts.type';
import { LikesRepository } from '../../likes/likes.repository';
import { bodyPostsModelClass } from '../../posts/dto/posts.class.pipe';
import { Posts } from '../../posts/entity/entity.posts';
import { BlogsQueryRepositoryForSA } from '../../blogsForSA/blogsForSA.queryReposity';
import { BlogsRepositoryForSA } from '../../blogsForSA/blogsForSA.repository';
import { BlogsRepository } from '../../blogs/blogs.repository';
import { TelegramAdapter } from '../../telegramm/adapter/telegram.adapter';
import { UsersQueryRepository } from '../../users/users.queryRepository';

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
	protected readonly blogsQueryRepositoryForSA: BlogsQueryRepositoryForSA,
	protected readonly blogsRepositoryForSA: BlogsRepositoryForSA,
	protected readonly blogsRepository: BlogsRepository,
	protected readonly telegramAdapter: TelegramAdapter,
	protected readonly usersQueryRepository: UsersQueryRepository
  ) {}
  async execute(command: CreateNewPostForBlogBloggerCommand): Promise<PostsViewModel | null> {
	const findBlog = await this.blogsRepositoryForSA.findBlogByIdBlogger(command.blogId, command.userId)

    const newPost: Posts = new Posts()
      newPost.title = command.inputDataModel.title,
      newPost.shortDescription = command.inputDataModel.shortDescription,
      newPost.content = command.inputDataModel.content,
      newPost.blogId = command.blogId,
      newPost.blogName = findBlog.name,
	  newPost.userId = command.userId,
      0, 0

	const createPost: Posts = await this.postsRepository.createNewPosts(newPost)
	if (!createPost) return null;
	const findNewestLike: any = await this.postsRepository.findNewestLike(createPost.id)
	// const getMainByPostId = await this.blogsRepository.getImageMainByPostId(createPost.id)

	const isSubscribe = this.blogsRepository.findIsSubscibe(command.userId, createPost.blogId)
	if(!isSubscribe) throw new NotFoundException([
		{message: "Subscribe do not found"}
	])
	const findTegIdByUserId = await this.usersQueryRepository.findUserById(command.userId)
	//отправить ссообщение в телеграм юзерам которые подписаны на этот блог "sendMessage"
	const text = `'New post published for blog ${createPost.blogName}'`
	const sendMessage = await this.telegramAdapter.sendMessage(text, findTegIdByUserId.tegId)
	return Posts.getPostsViewModelForSA(createPost, findNewestLike)
  }
}
