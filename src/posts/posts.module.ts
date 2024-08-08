import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "./entity/entity.posts";
import { User } from "../users/entities/user.entity";
import { Device } from "../security-devices/entities/security-device.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { DeleteAllPostsUseCase } from "./use-case/deleteAllPosts-use-case";
import { PostsRepository } from "./posts.repository";
import { CheckRefreshTokenForPost } from "./guards/bearer.authForPost";
import { UpdateLikeStatusForPostUseCase } from "./use-case/updateLikeStatus-use-case";
import { PostsQueryRepository } from "./postQuery.repository";
import { BlogsQueryRepository } from "../blogs/blogs.queryReposity";
import { CommentQueryRepository } from "../comment/comment.queryRepository";
import { LikesRepository } from "../likes/likes.repository";
import { LikeForPost } from "../likes/entity/likesForPost.entity";
import { LikeForComment } from "../likes/entity/likesForComment.entity";
import { Comments } from "../comment/entity/comment.entity";
import { BlogsRepository } from "../blogs/blogs.repository";
import { Blogs } from "../blogs/entity/blogs.entity";
import { JwtService } from "@nestjs/jwt";
import { UsersQueryRepository } from "../users/users.queryRepository";
import { PostController } from "./post.controller";
import { CheckRefreshTokenForGet } from "./guards/bearer.authGetComment";
import { UserBlogger } from "../blogger/entity/entity.userBlogger";
import { UsersRepository } from "../users/users.repository";
import { Wallpaper } from "../blogs/entity/wallpaper.entity";
import { Main } from "../blogs/entity/main.entity";

const userCase = [
	DeleteAllPostsUseCase,
	UpdateLikeStatusForPostUseCase
];

const repo = [
	PostsRepository,
	PostsQueryRepository,
	BlogsQueryRepository,
	CommentQueryRepository,
	LikesRepository,
	BlogsRepository,
	UsersQueryRepository,
	UsersRepository
];
const userGuard = [CheckRefreshTokenForPost, CheckRefreshTokenForGet]
const adapter = [];
const manager = [];
const service = [JwtService];

@Module({
  imports: [TypeOrmModule.forFeature([Posts, User, Device, LikeForPost, LikeForComment, Comments, Blogs, UserBlogger, Wallpaper, Main]), CqrsModule],
  controllers: [PostController],
  providers: [...userCase, ...repo, ...adapter, ...manager, ...service, ...userGuard],
})
export class PostsModule {}
