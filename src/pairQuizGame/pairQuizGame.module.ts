import { Module } from '@nestjs/common';
import { PairQuizGameController } from './api/pairQuizGame.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { PairQuizGame } from './domain/entity.pairQuezGame';
import { BearerTokenPairQuizGame } from './guards/bearerTokenPairQuizGame';
import { JwtService } from '@nestjs/jwt';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { UsersRepository } from '../users/users.repository';
import { User } from '../users/entities/user.entity';
import { PairQuezGameQueryRepository } from './infrastructure/pairQuizGameQueryRepository';
// import { FirstPlayerSendAnswerUseCase } from './useCase/firstPlayerSendAnswer-ues-case';
import { CreateOrConnectGameUseCase } from './useCase/createOrConnection-use-case';
import { ChangeAnswerStatusFirstPlayerUseCase } from './useCase/changeAnswerStatusFirstPlayer-use-case';
import { CangeStatusToFinishedUseCase } from './useCase/changeStatusToFinished-use-case';
import { PairQuizGameRepository } from './infrastructure/pairQuizGameRepository';
import { PairQuizGameProgressRepository } from '../pairQuizGameProgress/infrastructure/pairQuizGameProgressRepository';
import { QuestionRepository } from '../question/infrastructury/questionRepository';
import { Question } from '../question/domain/entity.question';
import { PairQuizGameProgressQueryRepository } from '../pairQuizGameProgress/infrastructure/pairQuizGameProgressQueryRepository';
import { AnswersPlayer } from '../pairQuizGameProgress/domain/entity.answersPlayer';
import { PairQuizGameProgressPlayer } from '../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer';
// import { SendAnswerUseCase } from './useCase/createSendAnswer-use-case copy';
// import { SecondPlayerSendAnswerUseCase } from './useCase/secondPlayerSendAnswer-ues-case';
// import { ChangeAnswerStatusSecondPlayerUseCase } from './useCase/changeAnswerStatusSecondPlayer-use-case';

const guards = [BearerTokenPairQuizGame];
const services = [JwtService];
const repo = [
  UsersQueryRepository,
  UsersRepository,
  PairQuezGameQueryRepository,
  PairQuizGameRepository,
  PairQuizGameProgressRepository,
  QuestionRepository,
  PairQuizGameProgressQueryRepository
];
const useCase = [
//   FirstPlayerSendAnswerUseCase,
//   SecondPlayerSendAnswerUseCase,
  CreateOrConnectGameUseCase,
  ChangeAnswerStatusFirstPlayerUseCase,
  CangeStatusToFinishedUseCase,
//   SendAnswerUseCase
//   ChangeAnswerStatusSecondPlayerUseCase,
];
@Module({
  imports: [TypeOrmModule.forFeature([PairQuizGame, User, AnswersPlayer, PairQuizGameProgressPlayer, Question]), CqrsModule],
  controllers: [PairQuizGameController],
  providers: [...services, ...guards, ...repo, ...useCase],
})
export class PairQuizGameModule {}
