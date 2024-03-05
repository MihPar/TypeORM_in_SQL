import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Device } from '../security-devices/entities/security-device.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { Blogs } from './entity/blogs.entity';
import { CheckRefreshTokenForGet } from './use-case/bearer.authGetComment';
import { BlogsQueryRepository } from './blogs.queryReposity';
import { PostsQueryRepository } from '../posts/postQuery.repository';
import { UpdateBlogForSAUseCase } from '../blogsForSA/use-case/updateBlog-use-case';
import { BlogsQueryRepositoryForSA } from '../blogsForSA/blogsForSA.queryReposity';
import { BlogsRepositoryForSA } from '../blogsForSA/blogsForSA.repository';
import { PostsRepository } from '../posts/posts.repository';
import { CheckRefreshTokenForSA } from '../blogsForSA/guards/bearer.authGetComment';
import { DeleteBlogByIdForSAUseCase } from '../blogsForSA/use-case/deleteBlogById-use-case';
import { CreateNewBlogForSAUseCase } from '../blogsForSA/use-case/createNewBlog-use-case';
import { CreateNewPostForBlogUseCase } from '../blogsForSA/use-case/createNewPostForBlog-use-case';
import { updateExistingPostByIdWithBlogIdUseCase } from '../blogsForSA/use-case/updatePostByIdWithBlogId-use-case';
import { DeletePostByIdCommandUseCase } from '../blogsForSA/use-case/deletPostById-use-case';
import { LikeForPost } from '../likes/entity/likesInfo-entity';
import { DeleteAllBlogsUseCase } from './use-case/deletAllBlogs-use-case';
import { DeleteAllBlogsForSAUseCase } from '../blogsForSA/use-case/deletAllBlogs-use-case';

const userCase = [
  UpdateBlogForSAUseCase,
  DeleteBlogByIdForSAUseCase,
  CreateNewBlogForSAUseCase,
  CreateNewPostForBlogUseCase,
  updateExistingPostByIdWithBlogIdUseCase,
  DeletePostByIdCommandUseCase,
  DeleteAllBlogsUseCase,
  DeleteAllBlogsForSAUseCase
];

const repo = [
  BlogsQueryRepository,
  PostsQueryRepository,
  BlogsQueryRepositoryForSA,
  BlogsRepositoryForSA,
  PostsRepository,
];

const useGuard = [CheckRefreshTokenForGet, CheckRefreshTokenForSA];

const adapter = [];
const manager = [];
const service = [];

@Module({
  imports: [TypeOrmModule.forFeature([Blogs, User, Device, LikeForPost]), CqrsModule],
  controllers: [],
  providers: [...userCase, ...repo, ...adapter, ...manager, ...service],
})
export class BlogsModule {}
