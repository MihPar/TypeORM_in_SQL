import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpCode, HttpStatus, UseGuards, NotFoundException, ForbiddenException, Query } from '@nestjs/common';
import { BloggerService } from '../blogger.service';
import { CreateBloggerDto } from '../dto/create-blogger.dto';
import { UpdateBloggerDto } from '../dto/update-blogger.dto';
import { bodyBlogsModel } from '../../blogs/dto/blogs.class.pipe';
import { CheckRefreshTokenForSA } from '../../blogsForSA/guards/bearer.authGetComment';
import { BodyBlogsModel, inputModelBlogIdClass, inputModelClass, inputModelUpdataPost } from '../../blogsForSA/dto/blogs.class-pipe';
import { User } from '../../users/entities/user.entity';
import { UserDecorator, UserIdDecorator } from '../../users/infrastructure/decorators/decorator.user';
import { BlogsQueryRepositoryForSA } from '../../blogsForSA/blogsForSA.queryReposity';
import { UpdateBlogForSACommand } from '../../blogsForSA/use-case/updateBlog-use-case';
import { CommandBus } from '@nestjs/cqrs';
import { DeletePostByIdCommand } from '../../blogsForSA/use-case/deletPostById-use-case';
import { UpdateBlogBloggerForSACommand } from '../use-case/updataBlogByIdBlogger-use-case';
import { PostsQueryRepository } from '../../posts/postQuery.repository';
import { DeleteBlogByIdForSACommnad } from '../../blogsForSA/use-case/deleteBlogById-use-case';
import { bodyPostsModelClass } from '../../posts/dto/posts.class.pipe';
import { Posts } from '../../posts/entity/entity.posts';
import { DeleteBlogByIdBloggerForSACommnad } from '../use-case/deleteBlogBlogger-use-case';
import { BlogsViewType, BlogsViewTypeWithUserId } from '../../blogs/blogs.type';
import { CreateNewPostForBlogCommand } from '../../blogsForSA/use-case/createNewPostForBlog-use-case';
import { CreateNewPostForBlogBloggerCommand } from '../use-case/createNewPostByBlogIdBlogger-use-case';
import { PaginationType } from '../../types/pagination.types';
import { PostsViewModel } from '../../posts/posts.type';
import { UpdateExistingPostByIdWithBlogIdCommand } from '../../blogsForSA/use-case/updatePostByIdWithBlogId-use-case';
import { UpdateExistingPostByIdWithBlogIdBloggerCommand } from '../use-case/updatePostByBlogIdBlogger-use-case';
import { CreateNewBlogForSACommand } from '../../blogsForSA/use-case/createNewBlog-use-case';
import { BearerTokenPairQuizGame } from '../../pairQuizGame/guards/bearerTokenPairQuizGame';

@UseGuards(BearerTokenPairQuizGame)
@Controller('blogger/blogs')
export class BloggerController {
	constructor(
		private readonly blogsQueryRepositoryForSA: BlogsQueryRepositoryForSA,
		private readonly postsQueryRepository: PostsQueryRepository,
		protected commandBus: CommandBus
	) { }

	@Put(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@HttpCode(HttpStatus.CREATED)
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

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteBlogsById(
		@Param('id') id: string,
		@UserDecorator() user: User,
	) {
		const command = new DeleteBlogByIdBloggerForSACommnad(id, user.id)
		const isDeleted: boolean | null = await this.commandBus.execute<DeleteBlogByIdBloggerForSACommnad, boolean | null>(command);
		return isDeleted;
	}

	@Post(':blogId/posts')
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

	@Get(':blogId/posts')
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
		const blog = await this.blogsQueryRepositoryForSA.findBlogByIdBlogger(dto.blogId);

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

	@Delete(':blogId/posts/:postId')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deletePostByIdWithBlogId(
		@Param() dto: inputModelUpdataPost,
		@UserIdDecorator() userId: string | null
	) {
		const command = new DeletePostByIdCommand(dto, userId)
		const deletePostById: Promise<any> = await this.commandBus.execute<DeletePostByIdCommand, any>(command)
		if (!deletePostById) throw new NotFoundException("Post not find")
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

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async createBlog(
		@Body() inputDateModel: BodyBlogsModel,
		@UserIdDecorator() userId: string,
	) {
		const command = new CreateNewBlogForSACommand(inputDateModel, userId)
		const createBlog: BlogsViewType | null = await this.commandBus.execute<CreateNewBlogForSACommand, BlogsViewType | null>(command)
		return createBlog;
	}

}
