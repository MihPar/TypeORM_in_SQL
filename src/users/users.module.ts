import { Module, Post } from '@nestjs/common';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateNewUserUseCase } from './useCase/createNewUser-use-case';
import { DeleteAllUsersUseCase } from './useCase/deleteAllUsers-use-case';
import { DeleteUserByIdUseCase } from './useCase/deleteUserById-use-case';
import { RegistrationConfirmationUseCase } from './useCase/registratinConfirmation-use-case';
import { RegistrationUseCase } from './useCase/registration-use-case';
import { RegistrationEmailResendingUseCase } from './useCase/registrationEmailResending-use-case';
import { Device } from '../security-devices/entities/security-device.entity';
import { UsersRepository } from './users.repository';
import { UsersQueryRepository } from './users.queryRepository';
import { CqrsModule } from '@nestjs/cqrs';
import { PayloadAdapter } from '../auth/adapter/payload.adapter';
import { GenerateHashAdapter } from '../auth/adapter/generateHashAdapter';
import { JwtService } from '@nestjs/jwt';
import { EmailAdapter } from '../auth/adapter/email.adapter';
import { EmailManager } from '../auth/adapter/email.manager';
import { Blogs } from '../blogs/entity/blogs.entity';
import { BanUnbanUserUseCase } from './useCase/banUnbanUser-use-case';
import { PostsRepository } from '../posts/posts.repository';
import { Posts } from '../posts/entity/entity.posts';
import { CommentRepository } from '../comment/comment.repository';
import { Comments } from '../comment/entity/comment.entity';
import { LikesRepository } from '../likes/likes.repository';
import { LikeForComment } from '../likes/entity/likesForComment.entity';
import { LikeForPost } from '../likes/entity/likesForPost.entity';
import { DeviceRepository } from '../security-devices/security-device.repository';
import { BlogsRepository } from '../blogs/blogs.repository';
import { GetAllUsersUseCase } from './useCase/getAllUsers-use-case';
import { GetBannedUsersUseCase } from './useCase/getBannedUsers-use-case';
import { UserBlogger } from '../blogger/domain/entity.userBlogger';

const userCase = [
  CreateNewUserUseCase,
  DeleteAllUsersUseCase,
  DeleteUserByIdUseCase,
  RegistrationConfirmationUseCase,
  RegistrationUseCase,
  RegistrationEmailResendingUseCase,
  BanUnbanUserUseCase,
  GetAllUsersUseCase,
  GetBannedUsersUseCase
];

const repo = [
  UsersRepository,
  UsersQueryRepository,
  PayloadAdapter,
  PostsRepository,
  CommentRepository,
  LikesRepository,
  DeviceRepository,
  BlogsRepository,
];

const adapter = [GenerateHashAdapter, EmailAdapter];
const manager = [EmailManager];
const service = [JwtService];

@Module({
  imports: [TypeOrmModule.forFeature([User, Device, Blogs, Posts, Comments, LikeForComment, LikeForPost, UserBlogger]), CqrsModule],
  controllers: [UsersController],
  providers: [...userCase, ...repo, ...adapter, ...manager, ...service],
})
export class UsersModule {}
