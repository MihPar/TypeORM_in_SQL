import { Module } from '@nestjs/common';
import { PairQuizGameService } from './application/pair-quiz-game.service';
import { PairQuizGameController } from './api/pair-quiz-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [TypeOrmModule.forFeature([]), CqrsModule],
  controllers: [PairQuizGameController],
  providers: [PairQuizGameService],
})
export class PairQuizGameModule {}
