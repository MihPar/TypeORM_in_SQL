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
import { AnswersFirstPlayer } from '../pairQuizGameProgress/domain/entity.answersFirstPlayer';
import { AnswersSecondPlayer } from '../pairQuizGameProgress/domain/entity.answersSecondPlayer';
import { PairQuizGameProgressFirstPlayer } from '../pairQuizGameProgress/domain/entity.pairQuizGameProgressFirstPlayer';
import { PairQuizGameProgressSecondPlayer } from '../pairQuizGameProgress/domain/entity.pairQuizGameProgressSecondPlayer';
import { PairQuizGameProgressRepository } from '../pairQuizGameProgress/infrastructure/pairQuizGameProgressRepository';
import { QuestionRepository } from '../question/infrastructury/questionRepository';
import { Question } from '../question/domain/entity.question';
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
  QuestionRepository
];
const useCase = [
//   FirstPlayerSendAnswerUseCase,
//   SecondPlayerSendAnswerUseCase,
  CreateOrConnectGameUseCase,
  ChangeAnswerStatusFirstPlayerUseCase,
  CangeStatusToFinishedUseCase,
//   ChangeAnswerStatusSecondPlayerUseCase,
];
@Module({
  imports: [TypeOrmModule.forFeature([PairQuizGame, User, AnswersFirstPlayer, AnswersSecondPlayer, PairQuizGameProgressFirstPlayer, PairQuizGameProgressSecondPlayer, Question]), CqrsModule],
  controllers: [PairQuizGameController],
  providers: [...services, ...guards, ...repo, ...useCase],
})
export class PairQuizGameModule {}
