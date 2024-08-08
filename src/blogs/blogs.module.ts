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
import { UpdateExistingPostByIdWithBlogIdUseCase } from '../blogsForSA/use-case/updatePostByIdWithBlogId-use-case';
import { DeletePostByIdCommandUseCase } from '../blogsForSA/use-case/deletPostById-use-case';
import { LikeForPost } from '../likes/entity/likesForPost.entity';
import { DeleteAllBlogsUseCase } from './use-case/deletAllBlogs-use-case';
import { DeleteAllBlogsForSAUseCase } from '../blogsForSA/use-case/deletAllBlogs-use-case';
import { LikesRepository } from '../likes/likes.repository';
import { BlogsRepository } from './blogs.repository';
import { Posts } from '../posts/entity/entity.posts';
import { Comments } from '../comment/entity/comment.entity';
import { LikeForComment } from '../likes/entity/likesForComment.entity';
import { BlogsController } from './api/blogs.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { UserBlogger } from '../blogger/entity/entity.userBlogger';
import { S3StorageAdapter } from '../blogger/adapter/s3StorageAdapter';
import { Wallpaper } from './entity/wallpaper.entity';
import { DeleteAllWallpaperUseCase } from './use-case/deleteAllWallpaper-use-case';
import { Main } from './entity/main.entity';
import { DeleteAllMainUseCase } from './use-case/deleteAllMain-use-case copy';
import { SubscribeForPostUseCase } from './use-case/subscribeForPost.use-case';
import { Subscribe } from './entity/subscribe.entity';

const userCase = [
  UpdateBlogForSAUseCase,
  DeleteBlogByIdForSAUseCase,
  CreateNewBlogForSAUseCase,
  CreateNewPostForBlogUseCase,
  UpdateExistingPostByIdWithBlogIdUseCase,
  DeletePostByIdCommandUseCase,
  DeleteAllBlogsUseCase,
  DeleteAllBlogsForSAUseCase,
  DeleteAllWallpaperUseCase,
  DeleteAllMainUseCase,
  SubscribeForPostUseCase
];

const repo = [
  BlogsQueryRepository,
  PostsQueryRepository,
  BlogsQueryRepositoryForSA,
  BlogsRepositoryForSA,
  PostsRepository,
  LikesRepository,
  BlogsRepository,
  UsersQueryRepository
];

const useGuard = [CheckRefreshTokenForGet, CheckRefreshTokenForSA];

const adapter = [S3StorageAdapter];
const manager = [];
const service = [JwtService];

@Module({
  imports: [TypeOrmModule.forFeature([Blogs, User, Device, LikeForPost, Posts, Comments, LikeForComment, Blogs, UserBlogger, Main, Wallpaper, Subscribe]), CqrsModule],
  controllers: [BlogsController],
  providers: [...userCase, ...repo, ...adapter, ...manager, ...service, ...useGuard],
})
export class BlogsModule {}
