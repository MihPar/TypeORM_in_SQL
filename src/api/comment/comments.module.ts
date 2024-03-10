import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Device } from "../security-devices/entities/security-device.entity";
import { User } from "../users/entities/user.entity";
import { Posts } from "../posts/entity/entity.posts";
import { LikeForComment } from "../likes/entity/likesForComment.entity";
import { LikeForPost } from "../likes/entity/likesForPost.entity";
import { Blogs } from "../blogs/entity/blogs.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { Comments } from "./entity/comment.entity";
import { CommentsController } from "./comments.controller";
import { CommentQueryRepository } from "./comment.queryRepository";
import { CommentRepository } from "./comment.repository";
import { CheckRefreshTokenForComments } from "./use-case/bearer.authForComments";
import { UpdateLikestatusForCommentUseCase } from "./use-case/updateLikeStatus-use-case";
import { LikesRepository } from "../likes/likes.repository";
import { CheckRefreshTokenForGet } from "../posts/guards/bearer.authGetComment";
import { JwtService } from "@nestjs/jwt";
import { UsersQueryRepository } from "../users/users.queryRepository";

const useCase = [UpdateLikestatusForCommentUseCase]
const guards = [CheckRefreshTokenForComments, CheckRefreshTokenForGet]
const adapter = []
const repo = [CommentQueryRepository, CommentRepository, LikesRepository, UsersQueryRepository]
const manager = []
const service = [JwtService]
const validator = [];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Posts,
      LikeForComment,
	  LikeForPost,
      Comments,
	  User
    ]),
    CqrsModule,
  ],
  controllers: [CommentsController],
  providers: [
    ...useCase,
    ...guards,
    ...adapter,
    ...repo,
    ...manager,
    ...service,
    ...validator,
  ],
})
export class CommentsModule {}
  