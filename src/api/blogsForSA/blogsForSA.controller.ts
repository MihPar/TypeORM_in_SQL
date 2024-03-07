import { CommandBus } from '@nestjs/cqrs';
import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { bodyBlogsModel, inputModelClass, inputModelUpdataPost } from "./dto/blogs.class-pipe";
import {BlogsRepositoryForSA } from "./blogsForSA.repository";
import { PostsQueryRepository } from "../posts/postQuery.repository";
import { PaginationType } from "../../types/pagination.types";
import { UpdateBlogForSACommand } from './use-case/updateBlog-use-case';
import { CreateNewPostForBlogCommand } from './use-case/createNewPostForBlog-use-case';
import { AuthBasic } from '../users/gards/basic.auth';
import { UserDecorator, UserIdDecorator } from '../../infrastructura/decorators/decorator.user';
import { bodyPostsModelClass } from '../posts/dto/posts.class.pipe';
import { BlogsQueryRepositoryForSA } from './blogsForSA.queryReposity';
import { UpdateExistingPostByIdWithBlogIdCommand } from './use-case/updatePostByIdWithBlogId-use-case';
import { DeletePostByIdCommand } from './use-case/deletPostById-use-case';
import { CreateNewBlogForSACommand } from './use-case/createNewBlog-use-case';
import { CheckRefreshTokenForSA } from './guards/bearer.authGetComment';
import { DeleteBlogByIdForSACommnad } from './use-case/deleteBlogById-use-case';
import { BlogsViewType, BlogsViewTypeWithUserId } from '../blogs/blogs.type';
import { User } from '../users/entities/user.entity';
import { Posts } from '../posts/entity/entity.posts';
import { PostsViewModel } from '../posts/posts.type';
import { PostsRepository } from '../posts/posts.repository';

// @SkipThrottle()
@UseGuards(AuthBasic)
@Controller('sa/blogs')
export class BlogsControllerForSA {
  constructor(
    protected blogsQueryRepositoryForSA: BlogsQueryRepositoryForSA,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsRepositoryForSA: BlogsRepositoryForSA,
	protected postsRepository: PostsRepository,
	protected commandBus: CommandBus
  ) {}

  @Put(':blogId')
  @HttpCode(204)
  @UseGuards(CheckRefreshTokenForSA)
  async updateBlogsById(
    @Param() dto: inputModelClass,
    @Body() inputDateMode: bodyBlogsModel,
	@UserDecorator() user: User,
	@UserIdDecorator() userId: string,
  ): Promise<boolean> {
	const isExistBlog = await this.blogsQueryRepositoryForSA.findBlogById(dto.blogId)
	if(!isExistBlog) throw new NotFoundException("404")

	if(userId !== isExistBlog.userId) throw new ForbiddenException("This user does not have access in blog, 403")
	const command = new UpdateBlogForSACommand(dto.blogId, inputDateMode)
	const isUpdateBlog: boolean = await this.commandBus.execute(command)
    if (!isUpdateBlog) throw new NotFoundException('Blogs by id not found 404');
	return true
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(CheckRefreshTokenForSA)
  async deleteBlogsById(
	@Param('id') id: string,
	@UserDecorator() user: User,
	@UserIdDecorator() userId: string,
	) {
	const isExistBlog = await this.blogsQueryRepositoryForSA.findBlogById(id)
	if(!isExistBlog) throw new NotFoundException("404")
	if(userId !== isExistBlog.userId) throw new ForbiddenException("This user does not have access in blog, 403")
	const command = new DeleteBlogByIdForSACommnad(id)
    const isDeleted: boolean | null = await this.commandBus.execute(command);
    if (!isDeleted) throw new NotFoundException('Blogs by id not found 404');
    return isDeleted;
  }

  @Post()
  @HttpCode(201)
  async createBlog(
	@Body() inputDateModel: bodyBlogsModel,
	@UserIdDecorator() userId: string,
	) {
	const command = new CreateNewBlogForSACommand(inputDateModel, userId)
	const createBlog: BlogsViewType = await this.commandBus.execute(command)
	// console.log("createBlog: ", createBlog)
    return createBlog;
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
      await this.blogsQueryRepositoryForSA.findAllBlogs(
        query.searchNameTerm,
		(query.sortBy || 'createdAt'),
		(query.sortDirection || 'desc'),
        (query.pageNumber || '1'),
        (query.pageSize || '10'),
      );
    return getAllBlogs;
  }

  @HttpCode(201)
  @Post(':blogId/posts')
  @UseGuards(CheckRefreshTokenForSA)
  async createPostByBlogId(
    @Param() dto: inputModelClass,
    @Body() inputDataModel: bodyPostsModelClass,
	@UserIdDecorator() userId: string,
  ) {
    const findBlog: BlogsViewTypeWithUserId | null = await this.blogsQueryRepositoryForSA.findBlogById(dto.blogId)
    if(!findBlog) throw new NotFoundException("404")
	if(userId !== findBlog.userId) throw new ForbiddenException("This user does not have access in blog, 403")
	const command = new CreateNewPostForBlogCommand(dto.blogId, inputDataModel, findBlog.name, userId)
	const createNewPost: Posts | null = await this.commandBus.execute(command)
	// console.log("createNewPost: ", createNewPost)
    if (!createNewPost) throw new NotFoundException('Blogs by id not found 404');
    return createNewPost;
  }
  
  @Get(':blogId/posts')
  @HttpCode(200)
  @UseGuards(CheckRefreshTokenForSA)
  async getPostsByBlogId(
    @Param() dto: inputModelClass,
	@UserIdDecorator() userId: string | null,
    @Query()
    query: {
      pageNumber: string;
      pageSize: string;
      sortBy: string;
      sortDirection: string;
    },
  ) {
    const blog = await this.blogsQueryRepositoryForSA.findBlogById(dto.blogId);
    if(!blog) throw new NotFoundException("404")
	if(userId !== blog.userId) throw new ForbiddenException("This user does not have access in blog, 403")
    const getPosts: PaginationType<PostsViewModel> =
      await this.postsQueryRepository.findPostsByBlogsId(
        query.pageNumber || '1',
        query.pageSize || '10',
        query.sortBy || 'createdAt',
        query.sortDirection || 'desc',
        dto.blogId,
		userId
      );
    if (!getPosts) throw new NotFoundException('Blogs by id not found');
    return getPosts;
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  @UseGuards(CheckRefreshTokenForSA)
  async updatePostByIdWithModel(
	@Param() dto: inputModelUpdataPost, 
	@Body() inputModel: bodyPostsModelClass,
	@UserIdDecorator() userId: string | null) {

	const blog = await this.blogsQueryRepositoryForSA.findBlogById(dto.blogId);
	if(!blog) throw new NotFoundException("404")
	const findPost = await this.postsQueryRepository.findPostsById(dto.postId)
	if(!findPost) throw new NotFoundException("404")
	if(userId !== blog.userId) throw new ForbiddenException("This user does not have access in blog, 403")

    const command = new UpdateExistingPostByIdWithBlogIdCommand(dto, inputModel)
	const updateExistingPost = await this.commandBus.execute(command)
	if(!updateExistingPost) throw new NotFoundException("Post not find")
	return 
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  @UseGuards(CheckRefreshTokenForSA)
  async deletePostByIdWithBlogId(
	@Param() dto: inputModelUpdataPost, 
	@UserIdDecorator() userId: string | null
	) {
	const blog = await this.blogsQueryRepositoryForSA.findBlogById(dto.blogId);
	if(!blog) throw new NotFoundException("404")
	const findPost = await this.postsQueryRepository.findPostsById(dto.postId)
	if(!findPost) throw new NotFoundException("404")
	if(userId !== blog.userId) throw new ForbiddenException("This user does not have access in blog, 403")
	const command = new DeletePostByIdCommand(dto)
	const deletePostById = await this.commandBus.execute(command)
	if(!deletePostById) throw new NotFoundException("Post not find")
  }
}