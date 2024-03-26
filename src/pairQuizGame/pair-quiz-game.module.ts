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

const guards = [BearerTokenPairQuizGame]
const services = [JwtService]
const repo = [UsersQueryRepository, UsersRepository, PairQuezGameQueryRepository]
@Module({
  imports: [TypeOrmModule.forFeature([PairQuizGame, User]), CqrsModule],
  controllers: [PairQuizGameController],
  providers: [...services, ...guards, ...repo],
})
export class PairQuizGameModule {}
