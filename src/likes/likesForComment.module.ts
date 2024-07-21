import { LikeForComment } from './entity/likesForComment.entity';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Device } from "../security-devices/entities/security-device.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { LikesRepository } from './likes.repository';
import { CheckRefreshTokenForComments } from '../comment/guards/bearer.authForComments';
import { UpdateLikestatusForCommentUseCase } from '../comment/use-case/updateLikeStatus-use-case';
import { CommentRepository } from '../comment/comment.repository';
import { CommentQueryRepository } from '../comment/comment.queryRepository';
import { Comments } from '../comment/entity/comment.entity';
import { Posts } from '../posts/entity/entity.posts';
import { LikeForPost } from './entity/likesForPost.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { BlogsRepository } from '../blogs/blogs.repository';
import { Blogs } from '../blogs/entity/blogs.entity';
import { UserBlogger } from '../blogger/domain/entity.userBlogger';
import { Images } from '../blogs/entity/images.entity';

const userCase = [
	UpdateLikestatusForCommentUseCase
];

const repo = [
	LikesRepository,
	CommentRepository,
	CommentQueryRepository,
	UsersQueryRepository,
	BlogsRepository
];

const useGuard = [CheckRefreshTokenForComments]

const adapter = [];
const manager = [];
const service = [JwtService];

@Module({
  imports: [TypeOrmModule.forFeature([User, Device, LikeForComment, Comments, Posts, LikeForPost, Blogs, UserBlogger, Images]), CqrsModule],
  controllers: [],
  providers: [...userCase, ...repo, ...adapter, ...manager, ...service, ...useGuard],
})
export class 	LikeForCommentModue{}
