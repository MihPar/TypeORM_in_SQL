import { Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common";
import { BlogsQueryRepository } from "../blogs.queryReposity";
import { inputModelClass } from "../dto/blogs.class.pipe";
import { BlogsViewType } from "../blogs.type";
import { PaginationType } from "../../types/pagination.types";
import { CheckRefreshTokenForGet } from '../use-case/bearer.authGetComment';
import { UserDecorator, UserIdDecorator } from '../../users/infrastructure/decorators/decorator.user';
import { PostsQueryRepository } from "../../posts/postQuery.repository";
import { User } from "../../users/entities/user.entity";
import { BlogsRepository } from "../blogs.repository";
import { AuthBasic } from "../../users/gards/basic.auth";
import { CommandBus } from "@nestjs/cqrs";
import { SubscribeForPostCommand } from "../use-case/subscribeForPost.use-case";
import { DeleteSubscribeForPostCommand } from "../use-case/deleteSubscribe.use-case";

// @SkipThrottle()
@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
	protected readonly blogsRepository: BlogsRepository,
	protected readonly commandBus: CommandBus
  ) {}

  @Post(':blogId/subscription')
  @UseGuards(AuthBasic)
  @HttpCode(HttpStatus.NO_CONTENT)
  async subscribeToBlog(
	@Param('blogId', ParseUUIDPipe) blogId: string
  ): Promise<void> {
	const command = new SubscribeForPostCommand(blogId)
	const createSubscribeForPost = await this.commandBus.execute<SubscribeForPostCommand, void>(command)
	return
  }

  @Delete(':blogId/subscription')
  @UseGuards(AuthBasic)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSubscribeToBlog(
	@Param('blogId', ParseUUIDPipe) blogId: string
) {
	const command = new DeleteSubscribeForPostCommand(blogId)
	await this.commandBus.execute<DeleteSubscribeForPostCommand, void>(command)
	return
}

  @Get()
  @HttpCode(200)
  async getBlogsWithPagin(
    @Query()
    query: {
      searchNameTerm: string;
      sortBy: string;
      sortDirection: string;
      pageNumber: string;
      pageSize: string;
    },
  ) {
    const getAllBlogs: PaginationType<BlogsViewType> =
      await this.blogsQueryRepository.findAllBlogs(
        query.searchNameTerm ?? '',
		(query.sortBy || 'createdAt'),
		(query.sortDirection || 'desc'),
        (query.pageNumber || '1'),
        (query.pageSize || '10'),
      );
    return getAllBlogs;
  }
  
  @Get(':blogId/posts')
  @HttpCode(200)
  @UseGuards(CheckRefreshTokenForGet)
  async getPostsByBlogId(
    @Param() Dto: inputModelClass,
	@UserDecorator() user: User,
	@UserIdDecorator() userId: string | null,
    @Query()
		query: {
		pageNumber: string;
		pageSize: string;
		sortBy: string;
		sortDirection: string;
		},
  ) {
	query.pageNumber = query.pageNumber || '1'
	query.pageSize = query.pageSize || '10'
	query.sortBy = query.sortBy || 'createdAt'
	query.sortDirection = query.sortDirection || "desc"

    const blog = await this.blogsQueryRepository.getBlogByBlogId(Dto.blogId);
    if (!blog) throw new NotFoundException('Blogs by id not found');
    const getPosts =
      await this.postsQueryRepository.findPostsByBlogsId(
        query.pageNumber,
        query.pageSize,
        query.sortBy,
        query.sortDirection,
        Dto.blogId,
		userId
      );
    if (!getPosts) throw new NotFoundException('Blogs by id not found');
    return getPosts;
  }

  @Get(':blogId')
  @HttpCode(200)
  async getBlogsById(
    @Param() Dto: inputModelClass,
  ): Promise<BlogsViewType | null> {
	const findBlog = await this.blogsRepository.findBlogById(Dto.blogId)

	if(findBlog.isBanned) throw new NotFoundException([{message: "This blog does not found"}])

    const blogById: BlogsViewType | null =
      await this.blogsQueryRepository.getBlogById(findBlog);
    if (!blogById) throw new NotFoundException('Blogs by id not found 404');
    return blogById;
  }
}