import { Module } from '@nestjs/common';
import { PairQuizGameProgressService } from './application/pair-quiz-game-progress.service';
import { PairQuizGameProgressController } from './api/pair-quiz-game-progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { PairQuizGameProgressFirstPlayer } from './domain/entity.pairQuizGameProgressFirstPlayer';
import { PairQuizGameProgressSecondPlayer } from './domain/entity.pairQuizGameProgressSecondPlayer';
import { CreateOrConnectGameUseCase } from '../pairQuizGame/useCase/createOrConnection-use-case';
import { PairQuizGame } from '../pairQuizGame/domain/entity.pairQuezGame';

const useCase = [CreateOrConnectGameUseCase]
const serves = [PairQuizGameProgressService]

@Module({
  imports: [TypeOrmModule.forFeature([PairQuizGameProgressFirstPlayer, PairQuizGameProgressSecondPlayer, PairQuizGame]), CqrsModule],
  controllers: [PairQuizGameProgressController],
  providers: [...useCase, ...serves],
})
export class PairQuizGameProgressModule {}
