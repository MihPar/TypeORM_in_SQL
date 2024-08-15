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
import { CheckRefreshTokenForComments } from "./guards/bearer.authForComments";
import { UpdateLikestatusForCommentUseCase } from "./use-case/updateLikeStatus-use-case";
import { LikesRepository } from "../likes/likes.repository";
import { JwtService } from "@nestjs/jwt";
import { UsersQueryRepository } from "../users/users.queryRepository";
import { CreateNewCommentByPostIdUseCase } from "./use-case/createNewCommentByPotsId-use-case";
import { DeleteAllCommentsUseCase } from "./use-case/deleteAllComments-use-case";
import { UpdateCommentByCommentIdUseCase } from "./use-case/updateCommentByCommentId-use-case";
import { BlogsRepository } from "../blogs/blogs.repository";
import { UserBlogger } from "../blogger/entity/entity.userBlogger";
import { Wallpaper } from "../blogs/entity/wallpaper.entity";
import { Main } from "../blogs/entity/main.entity";
import { CheckRefreshTokenForGetLike } from "../posts/guards/bearer.authGetComment";
import { Subscribe } from "../blogs/entity/subscribe.entity";

const useCase = [UpdateLikestatusForCommentUseCase, CreateNewCommentByPostIdUseCase, DeleteAllCommentsUseCase, UpdateCommentByCommentIdUseCase]
const guards = [CheckRefreshTokenForComments, CheckRefreshTokenForGetLike
]
const adapter = []
const repo = [CommentQueryRepository, CommentRepository, LikesRepository, UsersQueryRepository, BlogsRepository]
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
	  User,
	  Blogs,
	  UserBlogger,
	  Wallpaper,
	  Main,
	  Subscribe
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
  