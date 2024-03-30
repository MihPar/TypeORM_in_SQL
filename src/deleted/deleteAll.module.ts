import { Module } from '@nestjs/common';
import { TestingController } from './deleteAll.controller';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { DeleteAllDevicesUseCase } from '../security-devices/useCase/deleteAllDevices-use-case';
import { DeleteAllUsersUseCase } from '../users/useCase/deleteAllUsers-use-case';
import { DeviceRepository } from '../security-devices/security-device.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from '../security-devices/entities/security-device.entity';
import { User } from '../users/entities/user.entity';
import { UsersRepository } from '../users/users.repository';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { DeviceQueryRepository } from '../security-devices/security-deviceQuery.repository';
import { DeleteAllPostsUseCase } from '../posts/use-case/deleteAllPosts-use-case';
import { PostsRepository } from '../posts/posts.repository';
import { Posts } from '../posts/entity/entity.posts';
import { DeleteAllBlogsUseCase } from '../blogs/use-case/deletAllBlogs-use-case';
import { DeleteAllBlogsForSAUseCase } from '../blogsForSA/use-case/deletAllBlogs-use-case';
import { DeleteAllCommentLikesUseCase } from '../likes/use-case/deleteAllCommentLikes-use-case copy';
import { LikesRepository } from '../likes/likes.repository';
import { BlogsRepository } from '../blogs/blogs.repository';
import { BlogsRepositoryForSA } from '../blogsForSA/blogsForSA.repository';
import { LikeForPost } from '../likes/entity/likesForPost.entity';
import { LikeForComment } from '../likes/entity/likesForComment.entity';
import { Blogs } from '../blogs/entity/blogs.entity';
import { DeleteAllPairQuizGameUseCase } from '../pairQuizGame/useCase/deleteAllPairQuizGamep-use-case';
import { PairQuizGame } from '../pairQuizGame/domain/entity.pairQuezGame';
import { PairQuezGameQueryRepository } from '../pairQuizGame/infrastructure/pairQuizGameQueryRepository';
import { DeleteAllAnswersFirstPlayerUseCase } from '../pairQuizGameProgress/useCase/deleteAllAnswersFirstPlayer';
import { PairQuizGameProgressQueryRepository } from '../pairQuizGameProgress/infrastructure/pairQuizGameProgressQueryRepository';
import { DeleteAllAnswersSecondPlayerUseCase } from '../pairQuizGameProgress/useCase/deleteAllAnswersSecondPlayer';
import { DeleteAllPairQuizGameProgressFirstPlayerUseCase } from '../pairQuizGameProgress/useCase/deleteAllPairQuizGameProgressFirstPlayer';
import { DeleteAllPairQuizGameProgressSecondPlayerUseCase } from '../pairQuizGameProgress/useCase/deleteAllPairQuizGameProgressSecondPlayer';
import { DeleteAllQuestionUseCase } from '../question/useCases/deleteAllQuestions-use-case';

const useCase = [
  DeleteAllCommentLikesUseCase,
  DeleteAllDevicesUseCase,
  DeleteAllUsersUseCase,
  DeleteAllPostsUseCase,
  DeleteAllBlogsUseCase,
  DeleteAllBlogsForSAUseCase,
  DeleteAllPairQuizGameUseCase,
  DeleteAllAnswersFirstPlayerUseCase,
  DeleteAllAnswersSecondPlayerUseCase,
  DeleteAllPairQuizGameProgressFirstPlayerUseCase,
  DeleteAllPairQuizGameProgressSecondPlayerUseCase,
  DeleteAllQuestionUseCase
];

const repo = [
  DeviceRepository,
  UsersRepository,
  UsersQueryRepository,
  DeviceQueryRepository,
  PostsRepository,
  LikesRepository,
  BlogsRepository,
  BlogsRepositoryForSA,
  PairQuezGameQueryRepository,
  PairQuizGameProgressQueryRepository
];

@Module({
  imports: [TypeOrmModule.forFeature([Device, User, Posts, LikeForPost, LikeForComment, Blogs, PairQuizGame]), CqrsModule],
  controllers: [TestingController],
  providers: [...useCase, ...repo],
  exports: [DeleteAllDevicesUseCase, DeleteAllUsersUseCase]
})
export class DeletedModule {}
