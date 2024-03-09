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

const useCase = [UpdateLikestatusForCommentUseCase]
const guards = [CheckRefreshTokenForComments]
const adapter = []
const repo = [CommentQueryRepository, CommentRepository, LikesRepository]
const manager = []
const service = []
const validator = [];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Posts,
      LikeForComment,
      Comments,
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
  