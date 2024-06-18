import { CommandBus } from '@nestjs/cqrs';
import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { BodyBlogsModel, inputModelClass, inputModelUpdataPost } from "./dto/blogs.class-pipe";
import {BlogsRepositoryForSA } from "./blogsForSA.repository";
import { PostsQueryRepository } from "../posts/postQuery.repository";
import { PaginationType } from "../types/pagination.types";
import { UpdateBlogForSACommand } from './use-case/updateBlog-use-case';
import { CreateNewPostForBlogCommand } from './use-case/createNewPostForBlog-use-case';
import { AuthBasic } from '../users/gards/basic.auth';
import { UserDecorator, UserIdDecorator } from '../users/infrastructure/decorators/decorator.user';
import { bodyPostsModelClass } from '../posts/dto/posts.class.pipe';
import { BlogsQueryRepositoryForSA } from './blogsForSA.queryReposity';
import { UpdateExistingPostByIdWithBlogIdCommand } from './use-case/updatePostByIdWithBlogId-use-case';
import { DeletePostByIdCommand } from './use-case/deletPostById-use-case';
import { CreateNewBlogForSACommand } from './use-case/createNewBlog-use-case';
import { CheckRefreshTokenForSA } from './guards/bearer.authGetComment';
import { DeleteBlogByIdForSACommnad } from './use-case/deleteBlogById-use-case';
import { BlogsViewType, BlogsViewTypeWithUserId, BlogsViewWithBanType } from '../blogs/blogs.type';
import { User } from '../users/entities/user.entity';
import { Posts } from '../posts/entity/entity.posts';
import { PostsViewModel } from '../posts/posts.type';
import { PostsRepository } from '../posts/posts.repository';
import { BandBlogCommand } from './use-case/updateBlogByBindWithUser-use-case';

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

  @Put(':id/bind-with-user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlogByIdWithUser(
	@Param('id') id: string,
	@Param('userId') userId: string
  ) {
	const command = new BandBlogCommand(id, userId)
	const bindBlogWithUser = await this.commandBus.execute<BandBlogCommand, boolean | null>(command)
	if(!bindBlogWithUser) throw new Error('blogs not bind')
	return 
  }

	@Get()
	@HttpCode(HttpStatus.OK)
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
		// console.log("try sa blogs")
		const getAllBlogs: PaginationType<BlogsViewWithBanType> =
			await this.blogsQueryRepositoryForSA.getAllBlogsWithInfoBan(
				query.searchNameTerm,
				(query.sortBy || 'createdAt'),
				(query.sortDirection || 'desc'),
				(query.pageNumber || '1'),
				(query.pageSize || '10'),
			);
			// console.log("getAllBlogs: ", getAllBlogs)
		return getAllBlogs;
	}

  
//   @Get()
//   @HttpCode(HttpStatus.OK)
//   async getBlogsWithPagin(
//     @Query()
//     query: {
//       searchNameTerm: string;
//       sortBy: string;
//       sortDirection: string;
//       pageNumber: string;
//       pageSize: string;
//     },
//   ) {
//     const getAllBlogs: PaginationType<BlogsViewType> =
//       await this.blogsQueryRepositoryForSA.findAllBlogs(
//         query.searchNameTerm,
// 		(query.sortBy || 'createdAt'),
// 		(query.sortDirection || 'desc'),
//         (query.pageNumber || '1'),
//         (query.pageSize || '10'),
//       );
//     return getAllBlogs;
//   }

//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   async createBlog(
// 	@Body() inputDateModel: BodyBlogsModel,
// 	@UserIdDecorator() userId: string,
// 	) {
// 	const command = new CreateNewBlogForSACommand(inputDateModel, userId)
// 	const createBlog: BlogsViewType | null = await this.commandBus.execute<CreateNewBlogForSACommand, BlogsViewType | null>(command)
//     return createBlog;
//   }

//   @Put(':blogId')
//   @HttpCode(HttpStatus.CREATED)
//   @UseGuards(CheckRefreshTokenForSA)
//   async updateBlogsById(
//     @Param() dto: inputModelClass,
//     @Body() inputDateMode: BodyBlogsModel,
// 	@UserDecorator() user: User,
// 	@UserIdDecorator() userId: string,
//   ): Promise<boolean> {
// 	const isExistBlog = await this.blogsQueryRepositoryForSA.findBlogById(dto.blogId)
// 	if(!isExistBlog) throw new NotFoundException("404")

// 	if(userId !== isExistBlog.userId) throw new ForbiddenException("This user does not have access in blog, 403")
// 	const command = new UpdateBlogForSACommand(dto.blogId, inputDateMode)
// 	const isUpdateBlog: boolean = await this.commandBus.execute<UpdateBlogForSACommand, boolean>(command)
//     if (!isUpdateBlog) throw new NotFoundException('Blogs by id not found 404');
// 	return true
//   }

//   @Delete(':id')
//   @HttpCode(HttpStatus.CREATED)
//   @UseGuards(CheckRefreshTokenForSA)
//   async deleteBlogsById(
// 	@Param('id') id: string,
// 	@UserDecorator() user: User,
// 	@UserIdDecorator() userId: string,
// 	) {
// 	const isExistBlog = await this.blogsQueryRepositoryForSA.findBlogById(id)
// 	if(!isExistBlog) throw new NotFoundException("404")
// 	if(userId !== isExistBlog.userId) throw new ForbiddenException("This user does not have access in blog, 403")
// 	const command = new DeleteBlogByIdForSACommnad(id)
//     const isDeleted: boolean | null = await this.commandBus.execute<DeleteBlogByIdForSACommnad, boolean | null>(command);
//     if (!isDeleted) throw new NotFoundException('Blogs by id not found 404');
//     return isDeleted;
//   }

//   @HttpCode(HttpStatus.CREATED)
//   @Post(':blogId/posts')
//   @UseGuards(CheckRefreshTokenForSA)
//   async createPostByBlogId(
//     @Param() dto: inputModelClass,
//     @Body() inputDataModel: bodyPostsModelClass,
// 	@UserIdDecorator() userId: string,
//   ): Promise<Posts | null> {
//     const findBlog: BlogsViewTypeWithUserId | null = await this.blogsQueryRepositoryForSA.findBlogById(dto.blogId)
//     if(!findBlog) throw new NotFoundException("404")
// 	if(userId !== findBlog.userId) throw new ForbiddenException("This user does not have access in blog, 403")
// 	const command = new CreateNewPostForBlogCommand(dto.blogId, inputDataModel, findBlog.name, userId)
// 	const createNewPost: Posts | null = await this.commandBus.execute<CreateNewPostForBlogCommand, Posts | null>(command)
//     if (!createNewPost) throw new NotFoundException('Blogs by id not found 404');
//     return createNewPost;
//   }
  
//   @Get(':blogId/posts')
//   @HttpCode(HttpStatus.OK)
//   @UseGuards(CheckRefreshTokenForSA)
//   async getPostsByBlogId(
//     @Param() dto: inputModelClass,
// 	@UserIdDecorator() userId: string | null,
//     @Query()
//     query: {
//       pageNumber: string;
//       pageSize: string;
//       sortBy: string;
//       sortDirection: string;
//     },
//   ) {
//     const blog = await this.blogsQueryRepositoryForSA.findBlogById(dto.blogId);
//     if(!blog) throw new NotFoundException("404")
// 	if(userId !== blog.userId) throw new ForbiddenException("This user does not have access in blog, 403")
//     const getPosts: PaginationType<PostsViewModel> =
//       await this.postsQueryRepository.findPostsByBlogsId(
//         query.pageNumber || '1',
//         query.pageSize || '10',
//         query.sortBy || 'createdAt',
//         query.sortDirection || 'desc',
//         dto.blogId,
// 		userId
//       );
//     if (!getPosts) throw new NotFoundException('Blogs by id not found');
//     return getPosts;
//   }

//   @Put(':blogId/posts/:postId')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   @UseGuards(CheckRefreshTokenForSA)
//   async updatePostByIdWithModel(
// 	@Param() dto: inputModelUpdataPost, 
// 	@Body() inputModel: bodyPostsModelClass,
// 	@UserIdDecorator() userId: string | null) {

// 	const blog = await this.blogsQueryRepositoryForSA.findBlogById(dto.blogId);
// 	if(!blog) throw new NotFoundException("404")
// 	const findPost = await this.postsQueryRepository.findPostsById(dto.postId)
// 	if(!findPost) throw new NotFoundException("404")
// 	if(userId !== blog.userId) throw new ForbiddenException("This user does not have access in blog, 403")

//     const command = new UpdateExistingPostByIdWithBlogIdCommand(dto, inputModel)
// 	const updateExistingPost: PostsViewModel | null = await this.commandBus.execute<UpdateExistingPostByIdWithBlogIdCommand, PostsViewModel | null>(command)
// 	if(!updateExistingPost) throw new NotFoundException("Post not find")
// 	return 
//   }

//   @Delete(':blogId/posts/:postId')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   @UseGuards(CheckRefreshTokenForSA)
//   async deletePostByIdWithBlogId(
// 	@Param() dto: inputModelUpdataPost, 
// 	@UserIdDecorator() userId: string | null
// 	) {
// 	const blog = await this.blogsQueryRepositoryForSA.findBlogById(dto.blogId);
// 	if(!blog) throw new NotFoundException("404")
// 	const findPost = await this.postsQueryRepository.findPostsById(dto.postId)
// 	if(!findPost) throw new NotFoundException("404")
// 	if(userId !== blog.userId) throw new ForbiddenException("This user does not have access in blog, 403")
// 	const command = new DeletePostByIdCommand(dto)
// 	const deletePostById: Promise<any> = await this.commandBus.execute<DeletePostByIdCommand, any>(command)
// 	if(!deletePostById) throw new NotFoundException("Post not find")
//   }
}