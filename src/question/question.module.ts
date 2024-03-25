import { Module } from '@nestjs/common';
import { QuestionService } from './aplication/question.service';
import { QuestionController } from './api/question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './domain/entity.question';
import { CqrsModule } from '@nestjs/cqrs';
import { QuestionQueryRepository } from './infrastructury/questionQueryRepository';
import { JwtService } from '@nestjs/jwt';

const repo = [QuestionQueryRepository]
const service = [QuestionService, JwtService]

@Module({
  imports: [TypeOrmModule.forFeature([Question]), CqrsModule],
  controllers: [QuestionController],
  providers: [...repo, ...service],
})
export class QuestionModule {}
