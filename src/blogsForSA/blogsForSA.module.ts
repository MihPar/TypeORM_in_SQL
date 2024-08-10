import { Module, UseGuards } from '@nestjs/common';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { JwtService } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { Device } from '../security-devices/entities/security-device.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CustomLoginvalidation } from '../auth/adapter/customLoginValidator';
import { CustomEmailvalidation } from '../auth/adapter/customEmailValidatro';
import { BlogsControllerForSA } from './blogsForSA.controller';
import { BlogsQueryRepositoryForSA } from './blogsForSA.queryReposity';
import { PostsQueryRepository } from '../posts/postQuery.repository';
import { BlogsRepositoryForSA } from './blogsForSA.repository';
import { PostsRepository } from '../posts/posts.repository';
import { CheckRefreshTokenForSA } from './guards/bearer.authGetComment';
import { UpdateBlogForSAUseCase } from './use-case/updateBlog-use-case';
import { DeleteBlogByIdForSAUseCase } from './use-case/deleteBlogById-use-case';
import { CreateNewBlogForSAUseCase } from './use-case/createNewBlog-use-case';
import { CreateNewPostForBlogUseCase } from './use-case/createNewPostForBlog-use-case';
import { LikesRepository } from '../likes/likes.repository';
import { UpdateExistingPostByIdWithBlogIdUseCase } from './use-case/updatePostByIdWithBlogId-use-case';
import { DeletePostByIdCommandUseCase } from './use-case/deletPostById-use-case';
import { Posts } from '../posts/entity/entity.posts';
import { LikeForComment } from '../likes/entity/likesForComment.entity';
import { LikeForPost } from '../likes/entity/likesForPost.entity';
import { BlogsRepository } from '../blogs/blogs.repository';
import { Blogs } from '../blogs/entity/blogs.entity';
import { Comments } from '../comment/entity/comment.entity';
import { BandBlogUseCase } from './use-case/updateBlogByBindWithUser-use-case';
import { UsersRepository } from '../users/users.repository';
import { UserBlogger } from '../blogger/entity/entity.userBlogger';
import { BanUnbanBlogUseCase } from './use-case/banUnbanSpecifyBlog-use-case';
import { Wallpaper } from '../blogs/entity/wallpaper.entity';
import { Main } from '../blogs/entity/main.entity';
import { Subscribe } from '../blogs/entity/subscribe.entity';

const guards = [
	CheckRefreshTokenForSA
];

const useCase = [
	UpdateBlogForSAUseCase,
	DeleteBlogByIdForSAUseCase,
	CreateNewBlogForSAUseCase,
	CreateNewPostForBlogUseCase,
	UpdateExistingPostByIdWithBlogIdUseCase,
	DeletePostByIdCommandUseCase,
	BandBlogUseCase,
	BanUnbanBlogUseCase
];

const adapter = [];

const repo = [
	LikesRepository,
	BlogsRepositoryForSA,
	BlogsQueryRepositoryForSA,
	PostsRepository,
	UsersQueryRepository,
	BlogsRepository,
	PostsQueryRepository,
	UsersRepository
];

const manager = [];

const service = [JwtService];
const validator = [CustomLoginvalidation, CustomEmailvalidation]

@Module({
  imports: [TypeOrmModule.forFeature([Device, User, Posts, LikeForComment, LikeForPost, Blogs, Comments, UserBlogger, Wallpaper, Main, Subscribe]), CqrsModule],
  controllers: [BlogsControllerForSA],
  providers: [
    ...useCase,
    ...guards,
    ...adapter,
    ...repo,
    ...manager,
    ...service,
	...validator
  ],
})
export class BlogsForSAModule {}
