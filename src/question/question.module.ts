import { Module } from '@nestjs/common';
import { QuestionService } from './aplication/question.service';
import { QuestionController } from './api/question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './domain/entity.question';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), CqrsModule],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
