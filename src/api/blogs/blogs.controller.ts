import { Controller, Get, HttpCode, NotFoundException, Param, Query, UseGuards } from "@nestjs/common";
import { BlogsQueryRepository } from "./blogs.queryReposity";
import { inputModelClass } from "./dto/blogs.class.pipe";
import { BlogsViewType } from "./blogs.type";
import { PaginationType } from "../../types/pagination.types";
import { CheckRefreshTokenForGet } from './use-case/bearer.authGetComment';
import { UserDecorator, UserIdDecorator } from '../../infrastructura/decorators/decorator.user';
import { PostsQueryRepository } from "../posts/postQuery.repository";
import { User } from "../users/entities/user.entity";
import { Posts } from "../posts/post.class";

// @SkipThrottle()
@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}

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
    @Param() dto: inputModelClass,
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

    const blog = await this.blogsQueryRepository.findBlogById(dto.blogId);
    if (!blog) throw new NotFoundException('Blogs by id not found');
    const getPosts: PaginationType<Posts> =
      await this.postsQueryRepository.findPostsByBlogsId(
        query.pageNumber,
        query.pageSize,
        query.sortBy,
        query.sortDirection,
        dto.blogId,
		userId
      );
    if (!getPosts) throw new NotFoundException('Blogs by id not found');
    return getPosts;
  }

//   @HttpCode(201)
//   @Post(':blogId/posts')
//   @UseGuards(AuthBasic)
//   async createPostByBlogId(
//     @Param() dto: inputModelClass,
//     @Body(new ValidationPipe({ validateCustomDecorators: true })) inputDataModel: bodyPostsModelClass,
//   ) {
//     const findBlog: BlogsViewType | null = await this.blogsQueryRepository.findBlogById(dto.blogId);
//     if (!findBlog) throw new NotFoundException('Blogs by id not found 404');
// 	const command = new CreateNewPostForBlogCommand( dto.blogId, inputDataModel, findBlog.name)
// 	const createNewPost: Posts | null = await this.commandBus.execute(command)
//     if (!createNewPost) throw new NotFoundException('Blogs by id not found 404');
//     return createNewPost;
//   }

  @Get(':blogId')
  @HttpCode(200)
  async getBlogsById(
    @Param() dto: inputModelClass,
  ): Promise<BlogsViewType | null> {
    const blogById: BlogsViewType | null =
      await this.blogsQueryRepository.findBlogById(dto.blogId);
    if (!blogById) throw new NotFoundException('Blogs by id not found 404');
    return blogById;
  }

//   @Put(':blogId')
//   @HttpCode(204)
//   @UseGuards(AuthBasic)
//   @UseFilters(new HttpExceptionFilter())
//   async updateBlogsById(
//     @Param() dto: inputModelClass,
//     @Body(new ValidationPipe({ validateCustomDecorators: true })) inputDateMode: bodyBlogsModel,
//   ) {
// 	const command = new UpdateBlogCommand(dto.blogId, inputDateMode)
// 	const isUpdateBlog = await this.commandBus.execute(command)
//     if (!isUpdateBlog) throw new NotFoundException('Blogs by id not found 404');
// 	return isUpdateBlog
//   }

//   @Delete(':id')
//   @HttpCode(204)
//   @UseGuards(AuthBasic)
//   async deleteBlogsById(@Param('id') id: string) {
//     const isDeleted: boolean = await this.blogsRepository.deletedBlog(id);
//     if (!isDeleted) throw new NotFoundException('Blogs by id not found 404');
//     return isDeleted;
//   }
}