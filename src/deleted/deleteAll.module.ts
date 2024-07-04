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
import { DeleteAllAnswersPlayerUseCase } from '../pairQuizGameProgress/useCase/deleteAllAnswersFirstPlayer';
import { PairQuizGameProgressQueryRepository } from '../pairQuizGameProgress/infrastructure/pairQuizGameProgressQueryRepository';
import { DeleteAllAnswersSecondPlayerUseCase } from '../pairQuizGameProgress/useCase/deleteAllAnswersSecondPlayer';
import { DeleteAllPairQuizGameProgressSecondPlayerUseCase } from '../pairQuizGameProgress/useCase/deleteAllPairQuizGameProgressSecondPlayer';
import { DeleteAllQuestionUseCase } from '../question/useCases/deleteAllQuestions-use-case';
import { QuestionQueryRepository } from '../question/infrastructury/questionQueryRepository';
import { QuestionRepository } from '../question/infrastructury/questionRepository';
import { Question } from '../question/domain/entity.question';
import { PairQuizGameRepository } from '../pairQuizGame/infrastructure/pairQuizGameRepository';
import { AnswersPlayer } from '../pairQuizGameProgress/domain/entity.answersPlayer';
import { PairQuizGameProgressPlayer } from '../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer';
import { DeleteAllPairQuizGameProgressPlayerUseCase } from '../pairQuizGameProgress/useCase/deleteAllPairQuizGameProgressFirstPlayer';
import { DelectAllQuestionGamesUseCase } from '../pairQuizGame/useCase/deleteAllQuestionGames-use-case';
import { QuestionGame } from '../pairQuizGame/domain/entity.questionGame';
import { Comments } from '../comment/entity/comment.entity';
import { UserBlogger } from '../blogger/domain/entity.userBlogger';
import { DeleteUserBloggerUseCase } from '../blogger/use-case/deleteUserBlogger-use-case';

const useCase = [
  DeleteAllCommentLikesUseCase,
  DeleteAllDevicesUseCase,
  DeleteAllUsersUseCase,
  DeleteAllPostsUseCase,
  DeleteAllBlogsUseCase,
  DeleteAllBlogsForSAUseCase,
  DeleteAllPairQuizGameUseCase,
  DeleteAllAnswersPlayerUseCase,
  DeleteAllAnswersSecondPlayerUseCase,
  DeleteAllPairQuizGameProgressPlayerUseCase,
  DeleteAllPairQuizGameProgressSecondPlayerUseCase,
  DeleteAllQuestionUseCase,
  QuestionQueryRepository,
  QuestionRepository,
  DelectAllQuestionGamesUseCase,
  DeleteUserBloggerUseCase
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
  PairQuizGameProgressQueryRepository,
  PairQuizGameRepository,
];

@Module({
  imports: [TypeOrmModule.forFeature([Device, User, Posts, LikeForPost, LikeForComment, Blogs, PairQuizGame, Question, AnswersPlayer, AnswersPlayer, PairQuizGameProgressPlayer, PairQuizGameProgressPlayer, QuestionGame, Comments, UserBlogger
  ]), CqrsModule],
  controllers: [TestingController],
  providers: [...useCase, ...repo],
  exports: [DeleteAllDevicesUseCase, DeleteAllUsersUseCase]
})
export class DeletedModule {}
