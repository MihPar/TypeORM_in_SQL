import { Module } from '@nestjs/common';
import { PairQuizGameService } from './application/pair-quiz-game.service';
import { PairQuizGameController } from './api/pair-quiz-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { PairQuizGame } from './domain/pairQuezGame';
import { BearerTokenPairQuizGame } from './guards/bearerTokenPairQuizGame';

const guards = [BearerTokenPairQuizGame]
const services = [PairQuizGameService]

@Module({
  imports: [TypeOrmModule.forFeature([PairQuizGame]), CqrsModule],
  controllers: [PairQuizGameController],
  providers: [...services, ...guards],
})
export class PairQuizGameModule {}
