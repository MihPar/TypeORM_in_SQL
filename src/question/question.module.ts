import { Module } from '@nestjs/common';
import { QuestionService } from './aplication/question.service';
import { QuestionController } from './api/question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './domain/entity.question';
import { CqrsModule } from '@nestjs/cqrs';
import { QuestionQueryRepository } from './infrastructury/questionQueryRepository';
import { JwtService } from '@nestjs/jwt';
import { classCreateQuestionUseCase } from './useCases/createQuestion-use-case';
import { QuestionRepository } from './infrastructury/questionRepository';
import { DeletedQuestionUseCase } from './useCases/deletedQuestion-use-case';
import { UpdateQuestionUseCase } from './useCases/updateQuestion-use-case';
import { updateQuestionPublishUseCase } from './useCases/updateQuestionPublished';
import { QuestionGame } from '../pairQuizGame/domain/entity.questionGame';

const repo = [QuestionQueryRepository, QuestionRepository]
const service = [QuestionService, JwtService]
const useCase = [classCreateQuestionUseCase, DeletedQuestionUseCase, UpdateQuestionUseCase, updateQuestionPublishUseCase]

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionGame]), CqrsModule],
  controllers: [QuestionController],
  providers: [...repo, ...service, ...useCase],
})
export class QuestionModule {}
