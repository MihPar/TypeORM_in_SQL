import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus, UseGuards, NotFoundException, Query, ParseUUIDPipe } from '@nestjs/common';
import { BodyBlogsModel, inputModelBlogIdClass, inputModelClass, inputModelUpdataPost } from '../../blogsForSA/dto/blogs.class-pipe';
import { User } from '../../users/entities/user.entity';
import { UserDecorator, UserIdDecorator } from '../../users/infrastructure/decorators/decorator.user';
import { BlogsQueryRepositoryForSA } from '../../blogsForSA/blogsForSA.queryReposity';
import { UpdateBlogForSACommand } from '../../blogsForSA/use-case/updateBlog-use-case';
import { CommandBus } from '@nestjs/cqrs';
import { DeletePostByIdCommand } from '../../blogsForSA/use-case/deletPostById-use-case';
import { UpdateBlogBloggerForSACommand } from '../use-case/updataBlogByIdBlogger-use-case';
import { PostsQueryRepository } from '../../posts/postQuery.repository';
import { bodyPostsModelClass } from '../../posts/dto/posts.class.pipe';
import { Posts } from '../../posts/entity/entity.posts';
import { DeleteBlogByIdBloggerForSACommnad } from '../use-case/deleteBlogBlogger-use-case';
import { BlogsViewType } from '../../blogs/blogs.type';
import { CreateNewPostForBlogBloggerCommand } from '../use-case/createNewPostByBlogIdBlogger-use-case';
import { PaginationType } from '../../types/pagination.types';
import { PostsViewModel } from '../../posts/posts.type';
import { UpdateExistingPostByIdWithBlogIdBloggerCommand } from '../use-case/updatePostByBlogIdBlogger-use-case';
import { CreateNewBlogForSACommand } from '../../blogsForSA/use-case/createNewBlog-use-case';
import { BearerTokenPairQuizGame } from '../../pairQuizGame/guards/bearerTokenPairQuizGame';
import { BanUserForBlogInputModel } from '../dto-class';
import { UpdateUserDataCommand } from '../use-case/updateUserDate-use-case';
import { BlogsRepositoryForSA } from '../../blogsForSA/blogsForSA.repository';
import { FindBannedUserSpecifyBloggerCommand } from '../use-case/getBannedUserSpecifyBlogger-use-case';
import { UserBanBloggerViewType } from '../../users/user.type';
import { CommentForCurrentBloggerResponse } from '../typtBlogger';
import { BlogsRepository } from '../../blogs/blogs.repository';
import { BlogsQueryRepository } from '../../blogs/blogs.queryReposity';

@UseGuards(BearerTokenPairQuizGame)
@Controller('blogger')
export class BloggerController {
	constructor(
		private readonly blogsQueryRepositoryForSA: BlogsQueryRepositoryForSA,
		private readonly blogsRepositoryForSA: BlogsRepositoryForSA,
		private readonly postsQueryRepository: PostsQueryRepository,
		private readonly blogsQueryRepository: BlogsQueryRepository,
		protected commandBus: CommandBus
	) {}

	@Get('blogs/comments')
	@HttpCode(HttpStatus.OK)
	async getAllCommentsByPostCurrentBlogOfUser(
		@Query('pageNumber') pageNumber: number,
		@Query('pageSize') pageSize: number,
		@Query('sortBy') sortBy: string,
		@Query('sortDirection') sortDirection: 'asc' | 'desc',
		@UserIdDecorator() userId: string
 	): Promise<CommentForCurrentBloggerResponse> {
		if(!sortBy) {
			sortBy = 'createdAt'
		}
		if(!sortDirection || sortDirection.toLocaleUpperCase() !== 'ASC') {
			sortDirection = 'desc'
		}
		if(!pageSize || !Number.isInteger(pageSize) || pageSize <=0) {
			pageSize = 10
		}
		if(!pageNumber || !Number.isInteger(pageNumber) || pageNumber <=0) {
			pageNumber = 1
		}
		return await this.blogsQueryRepository.findAllCommentsForCurrentBlogger(
			sortBy,
			sortDirection,
			pageSize,
			pageNumber,
			userId,
		)
	}
	

	@Put('blogs/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async updateBlogsById(
		@Param() dto: inputModelBlogIdClass,
		@Body() inputDateMode: BodyBlogsModel,
		@UserDecorator() user: User,
	): Promise<boolean> {

		const command = new UpdateBlogBloggerForSACommand(dto.id, inputDateMode, user)
		const isUpdateBlog: boolean = await this.commandBus.execute<UpdateBlogForSACommand, boolean>(command)
		if (!isUpdateBlog) throw new NotFoundException('Blogs by id not found 404');
		return true
	}

	@Delete('blogs/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteBlogsById(
		@Param('id') id: string,
		@UserDecorator() user: User,
	) {
		const command = new DeleteBlogByIdBloggerForSACommnad(id, user.id)
		const isDeleted: boolean | null = await this.commandBus.execute<DeleteBlogByIdBloggerForSACommnad, boolean | null>(command);
		return isDeleted;
	}

	@Post('blogs/:blogId/posts')
	@HttpCode(HttpStatus.CREATED)
	async createPostByBlogId(
		@Param() dto: inputModelClass,
		@Body() inputDataModel: bodyPostsModelClass,
		@UserIdDecorator() userId: string,
	): Promise<Posts | null> {

		const command = new CreateNewPostForBlogBloggerCommand(dto.blogId, inputDataModel, userId)
		const createNewPost: Posts | null = await this.commandBus.execute<CreateNewPostForBlogBloggerCommand, Posts | null>(command)
		if (!createNewPost) throw new NotFoundException('Blogs by id not found 404');
		return createNewPost;
	}

	@Get('blogs/:blogId/posts')
	@HttpCode(HttpStatus.OK)
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
		const blog = await this.blogsRepositoryForSA.findBlogByIdBlogger(dto.blogId);

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

	@Put('blogs/:blogId/posts/:postId')
	@HttpCode(HttpStatus.NO_CONTENT)
	async updatePostByIdWithModel(
		@Param() dto: inputModelUpdataPost,
		@Body() inputModel: bodyPostsModelClass,
		@UserIdDecorator() userId: string | null) {
		const command = new UpdateExistingPostByIdWithBlogIdBloggerCommand(dto, inputModel, userId)
		const updateExistingPost: PostsViewModel | null = await this.commandBus.execute<UpdateExistingPostByIdWithBlogIdBloggerCommand, PostsViewModel | null>(command)
		if (!updateExistingPost) throw new NotFoundException("Post not find")
		return
	}

	@Delete('blogs/:blogId/posts/:postId')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deletePostByIdWithBlogId(
		@Param() dto: inputModelUpdataPost,
		@UserIdDecorator() userId: string | null
	) {
		const command = new DeletePostByIdCommand(dto, userId)
		const deletePostById: Promise<any> = await this.commandBus.execute<DeletePostByIdCommand, any>(command)
		if (!deletePostById) throw new NotFoundException("Post not find")
	}

	@Get('blogs')
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
		@UserIdDecorator() userId: string | null
	) {
		const getAllBlogs: PaginationType<BlogsViewType> =
			await this.blogsQueryRepositoryForSA.findAllBlogs(
				query.searchNameTerm,
				(query.sortBy || 'createdAt'),
				(query.sortDirection || 'desc'),
				(query.pageNumber || '1'),
				(query.pageSize || '10'),
				userId
			);
			// console.log("getAllBlogs: ", getAllBlogs)
		return getAllBlogs;
	}

	@Post('blogs')
	@HttpCode(HttpStatus.CREATED)
	async createBlog(
		@Body() inputDateModel: BodyBlogsModel,
		@UserIdDecorator() userId: string,
	): Promise<BlogsViewType | null> {
		const command = new CreateNewBlogForSACommand(inputDateModel, userId)
		const createBlog: BlogsViewType | null = await this.commandBus.execute<CreateNewBlogForSACommand, BlogsViewType | null>(command)
		return createBlog;
	}

	@Put('users/:id/ban')
	@HttpCode(HttpStatus.NO_CONTENT)
	async updateUserData(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() banUserForBlogDto: BanUserForBlogInputModel,
		@UserIdDecorator() userId: string,
	) {
		const command = new UpdateUserDataCommand(id, banUserForBlogDto, userId)
		return await this.commandBus.execute<UpdateUserDataCommand, void>(command)
	}

	@Get('users/blog/:id')
	@HttpCode(HttpStatus.OK)
	async getBannedUserByBlog(
		@Query('searchLoginTerm') searchLoginTerm: string | null,
		@Query('sortBy') sortBy: string,
		@Query('sortDirection') sortDirection: 'desc' | 'asc',
		@Query('pageNumber') pageNumber: number,
		@Query('pageSize') pageSize: number,
		@Param('id', ParseUUIDPipe) id: string,
		@UserIdDecorator() userId: string,
	): Promise<PaginationType<UserBanBloggerViewType | null>>{
		if(!searchLoginTerm) {
			searchLoginTerm = null
		}
		if(!sortBy) {
			sortBy = 'createdAt'
		}
		// if(sortBy === 'login') {
		// 	sortBy = 'login'
		// }
		// if(sortBy === 'email') {
		// 	sortBy = 'email'
		// }
		
		if(!sortDirection || sortDirection.toUpperCase() !== 'ASC') {
			sortDirection = 'desc'
		}
		if(!+pageSize || !Number.isInteger(+pageSize) || +pageSize <= 0) {
			pageSize = 10
		}
		if(!+pageNumber || !Number.isInteger(+pageNumber) || +pageNumber <= 0) {
			pageNumber = 1
		}
		const command = new FindBannedUserSpecifyBloggerCommand(
			searchLoginTerm,
			sortBy,
			sortDirection,
			pageSize,
			pageNumber,
			id,
			userId
		)

		const getBannedUser = await this.commandBus.execute<FindBannedUserSpecifyBloggerCommand, PaginationType<UserBanBloggerViewType | null>>(command)
		return getBannedUser
	}
}
