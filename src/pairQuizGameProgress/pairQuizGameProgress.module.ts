import { Module } from '@nestjs/common';
import { PairQuizGameProgressService } from './application/pair-quiz-game-progress.service';
import { PairQuizGameProgressController } from './api/pair-quiz-game-progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateOrConnectGameUseCase } from '../pairQuizGame/useCase/createOrConnection-use-case';
import { PairQuizGame } from '../pairQuizGame/domain/entity.pairQuezGame';
import { PairQuizGameRepository } from '../pairQuizGame/infrastructure/pairQuizGameRepository';
import { PairQuizGameProgressRepository } from './infrastructure/pairQuizGameProgressRepository';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { QuestionRepository } from '../question/infrastructury/questionRepository';
import { Question } from '../question/domain/entity.question';
import { User } from '../users/entities/user.entity';
import { PairQuizGameProgressPlayer } from './domain/entity.pairQuizGameProgressFirstPlayer';

const useCase = [CreateOrConnectGameUseCase]
const serves = [PairQuizGameProgressService]
const repo = [PairQuizGameRepository, PairQuizGameProgressRepository, UsersQueryRepository, QuestionRepository]

@Module({
  imports: [TypeOrmModule.forFeature([PairQuizGameProgressPlayer, PairQuizGameProgressPlayer, PairQuizGame, Question, User]), CqrsModule],
  controllers: [PairQuizGameProgressController],
  providers: [...useCase, ...serves, ...repo],
})
export class PairQuizGameProgressModule {}
