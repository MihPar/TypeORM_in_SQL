import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "./entity/entity-posts";
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

const userCase = [
	DeleteAllPostsUseCase,
	UpdateLikeStatusForPostUseCase
];

const repo = [
	PostsRepository,
	PostsQueryRepository,
	BlogsQueryRepository,
	CommentQueryRepository
];
const userGuard = [CheckRefreshTokenForPost]
const adapter = [];
const manager = [];
const service = [];

@Module({
  imports: [TypeOrmModule.forFeature([Posts, User, Device]), CqrsModule],
  controllers: [],
  providers: [...userCase, ...repo, ...adapter, ...manager, ...service, ...userGuard],
})
export class PostsModule {}
