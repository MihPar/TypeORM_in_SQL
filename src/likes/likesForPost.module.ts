import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Device } from "../security-devices/entities/security-device.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { LikeForPost } from "./entity/likesForPost.entity";
import { LikesRepository } from "./likes.repository";
import { PostsRepository } from "../posts/posts.repository";
import { PostsQueryRepository } from "../posts/postQuery.repository";
import { BlogsQueryRepository } from "../blogs/blogs.queryReposity";
import { CommentQueryRepository } from "../comment/comment.queryRepository";
import { UpdateLikeStatusForPostUseCase } from "../posts/use-case/updateLikeStatus-use-case";
import { Posts } from "../posts/entity/entity.posts";
import { LikeForComment } from "./entity/likesForComment.entity";
import { Comments } from "../comment/entity/comment.entity";
import { Blogs } from "../blogs/entity/blogs.entity";
import { DeleteAllPostLikesUseCase } from "./use-case/deleteAllPostLikes-use-case";
import { BlogsRepository } from "../blogs/blogs.repository";
import { UserBlogger } from "../blogger/entity/entity.userBlogger";
import { Wallpaper } from "../blogs/entity/wallpaper.entity";
import { Main } from "../blogs/entity/main.entity";
import { Subscribe } from "../blogs/entity/subscribe.entity";

const userCase = [
	UpdateLikeStatusForPostUseCase,
	DeleteAllPostLikesUseCase
];

const repo = [
	PostsRepository,
	PostsQueryRepository,
	BlogsQueryRepository,
	CommentQueryRepository,
	LikesRepository,
	BlogsRepository
];

const adapter = [];
const manager = [];
const service = [];

@Module({
  imports: [TypeOrmModule.forFeature([LikeForPost, User, Device, Posts, LikeForComment, Comments, Blogs, UserBlogger, Wallpaper, Main, Subscribe]), CqrsModule],
  controllers: [],
  providers: [...userCase, ...repo, ...adapter, ...manager, ...service],
})
export class LikeForPostModule {}
