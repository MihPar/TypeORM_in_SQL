import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginationType } from '../types/pagination.types';
import { InputModelClassId, InputModelClassPostId, InputModelContentePostClass } from './dto/posts.class.pipe';
import { PostsQueryRepository } from './postQuery.repository';
import { BlogsQueryRepository } from '../blogs/blogs.queryReposity';
import { CommandBus } from '@nestjs/cqrs';
import { UserDecorator, UserIdDecorator } from '../users/infrastructure/decorators/decorator.user';
import { CheckRefreshTokenForPost } from './guards/bearer.authForPost';
import { CheckRefreshTokenForGet } from './guards/bearer.authGetComment';
import { PostsViewModel } from './posts.type';
import { CommentQueryRepository } from '../comment/comment.queryRepository';
import { InputModelLikeStatusClass } from '../comment/dto/comment.class-pipe';
import { User } from '../users/entities/user.entity';
import { UpdateLikeStatusCommand } from './use-case/updateLikeStatus-use-case';
import { CommentViewModel } from '../comment/comment.type';
import { CreateNewCommentByPostIdCommnad } from '../comment/use-case/createNewCommentByPotsId-use-case';
import { PostsRepository } from './posts.repository';

// @SkipThrottle()
@Controller('posts')
export class PostController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
	protected commentQueryRepository: CommentQueryRepository,
	protected postsRepository: PostsRepository,
	protected commandBus: CommandBus
  ) {}

  @Put(':postId/like-status')
  @HttpCode(204)
  @UseGuards(CheckRefreshTokenForPost)
  async updateLikeStatus(
	@Param() Dto: InputModelClassPostId, 
	@Body() status: InputModelLikeStatusClass,
	@UserDecorator() user: User,
    @UserIdDecorator() userId: string | null,
	) {
	const commnad = new UpdateLikeStatusCommand(status, Dto.postId, userId, user)
	const result = await this.commandBus.execute(commnad)
    if (!result) throw new NotFoundException('404')
	return
  }

  @Get(':postId/comments')
  @HttpCode(200)
  @UseGuards(CheckRefreshTokenForGet)
  async getCommentByPostId(
    @Param() Dto: InputModelClassPostId, 
    @UserIdDecorator() userId: string | null,
    @UserDecorator() user: User,
    @Query()
    query: {
      pageNumber: string;
      pageSize: string;
      sortBy: string;
      sortDirection: string;
    }
  ) {
    const isExistPots: PostsViewModel | boolean= await this.postsQueryRepository.getPostById(Dto.postId);
    if (!isExistPots) throw new NotFoundException('Blogs by id not found');
    const commentByPostsId: PaginationType<CommentViewModel> | null =
      await this.commentQueryRepository.findCommentsByPostId(
        Dto.postId,
        (query.pageNumber || '1'),
        (query.pageSize || '10'),
        (query.sortBy || 'createdAt'),
        (query.sortDirection || 'desc'),
        userId,
      );
    if (!commentByPostsId) throw new NotFoundException('Blogs by id not found 404');
    return commentByPostsId;
  }

  @Post(':postId/comments')
  @HttpCode(201)
  @UseGuards(CheckRefreshTokenForPost)
  async createNewCommentByPostId(
	@Param('postId', ParseUUIDPipe) postId: string, 
	@Body() inputModelContent: InputModelContentePostClass,
  	@UserDecorator() user: User,
	@UserIdDecorator() userId: string | null
	) {
    const post: PostsViewModel | boolean = await this.postsQueryRepository.getPostById(postId)
    if (!post) throw new NotFoundException('Blogs by id not found 404')
	const command = new CreateNewCommentByPostIdCommnad(postId, inputModelContent, user)
	const createNewCommentByPostId: CommentViewModel | null = await this.commandBus.execute(command)
	return createNewCommentByPostId
  }

  @Get()
  @HttpCode(200)
  @UseGuards(CheckRefreshTokenForGet)
  async getPosts(
    @UserIdDecorator() userId: string | null,
    @Query()
    query: {
      pageNumber: string;
      pageSize: string;
      sortBy: string;
      sortDirection: string;
    },
  ) {
    const getAllPosts: PaginationType<PostsViewModel> =
      await this.postsQueryRepository.findAllPosts(
        (query.pageNumber || '1'),
        (query.pageSize || '10'),
        (query.sortBy || 'createdAt'),
        (query.sortDirection || 'desc'),
        userId,
      );
    return getAllPosts;
  }


  @Get(':id')
  @HttpCode(200)
  @UseGuards(CheckRefreshTokenForGet)
  async getPostById(
    @Param('id', ParseUUIDPipe) id: string, 
	@UserIdDecorator() userId: string | null,
  ) {
	const findPostByBan = await this.postsRepository.findPostByIdUserId(id)

	if(findPostByBan.isBanned) throw new NotFoundException('Post id ban');

    const getPostById: PostsViewModel | null =
      await this.postsQueryRepository.findPostsById(id, userId);
    if (!getPostById) {
      throw new NotFoundException('Post by id not found');
    }
    return getPostById;
  }
}
