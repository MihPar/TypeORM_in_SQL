import { Module } from '@nestjs/common';
import { PairQuizGameProgressService } from './application/pair-quiz-game-progress.service';
import { PairQuizGameProgressController } from './api/pair-quiz-game-progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PairQuizGameProgress } from './domain/entity.pairQuizGameProgress';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [TypeOrmModule.forFeature([PairQuizGameProgress]), CqrsModule],
  controllers: [PairQuizGameProgressController],
  providers: [PairQuizGameProgressService],
})
export class PairQuizGameProgressModule {}
