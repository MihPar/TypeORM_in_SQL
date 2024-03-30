import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Query, NotFoundException, Put } from '@nestjs/common';
import { QuestionService } from '../aplication/question.service';
import { AnswerAndBodyClass, PublishClass } from '../dto/question.dto';
import { AuthBasic } from '../../users/gards/basic.auth';
import { QuestionQueryRepository } from '../infrastructury/questionQueryRepository';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuestionCommand } from '../useCases/createQuestion-use-case';
import { QuestionRepository } from '../infrastructury/questionRepository';
import { DeletedQuestionCommand } from '../useCases/deletedQuestion-use-case';
import { Question } from '../domain/entity.question';
import { UpdateQuestionCommand } from '../useCases/updateQuestion-use-case';
import { updateQuestionPublishCommand } from '../useCases/updateQuestionPublished';

@Controller('sa/quiz/questions')
@UseGuards(AuthBasic)
export class QuestionController {
  constructor(
	private readonly questionQueryRepository: QuestionQueryRepository,
	private readonly questionRepository: QuestionRepository,
	private readonly commandBus: CommandBus
	) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllQuestions(
	@Query()
		query: {
			bodySearchTerm: string
			publishedStatus: string
			sortBy: string
			sortDirection: string
			pageNumber: string
			pageSize: string
		}
  ) {
		query.bodySearchTerm = query.bodySearchTerm || "" 
		query.pageNumber = query.pageNumber || "1"
		query.pageSize = query.pageSize || "10"
		query.publishedStatus = query.publishedStatus || "all"
		query.sortBy = query.sortBy || "createdAt"
		query.sortDirection = query.sortDirection || "desc"
		
	const getAllQuestion = await this.questionQueryRepository.findAllQuestions(
		query.bodySearchTerm,
		query.publishedStatus,
		query.sortBy,
		query.sortDirection,
		query.pageNumber,
		query.pageSize,
		)
	return getAllQuestion
  }


  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(@Body() createQuestBody: AnswerAndBodyClass) {
	const command = new CreateQuestionCommand(createQuestBody.body, createQuestBody.correctAnswers)
	const createQuestion = await this.commandBus.execute<CreateQuestionCommand | Question | null>(command)
	// console.log("createQuestion: ", createQuestion)
    return createQuestion
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remoteQuestion(@Param('id') id: string) {
	const findQuestionById = await this.questionRepository.getQuestion(id)
	if(!findQuestionById) throw new NotFoundException('404')

	const command = new DeletedQuestionCommand(id)
	const deletedQuestion = await this.commandBus.execute<DeletedQuestionCommand | boolean | null>(command)
	return deletedQuestion
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuestion(
	@Body() DTO: AnswerAndBodyClass,
    @Param('id') id: string
	): Promise<boolean> {
	const findQuestionById = await this.questionRepository.getQuestion(id)
	console.log("id: ", id)
// console.log('82: ', findQuestionById)
	if(!findQuestionById) throw new NotFoundException('404')
// console.log('84: ', findQuestionById)
	const command = new UpdateQuestionCommand(id, DTO)
	const updateQuestionById = await this.commandBus.execute<UpdateQuestionCommand | null>(command)
	return updateQuestionById
  }

  @Put(':id/publish')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePublishQuestion(@Body() DTO: PublishClass, @Param('id') id: string): Promise<boolean | null> {
	const findQuestionById = await this.questionRepository.getQuestion(id)
	if(!findQuestionById) throw new NotFoundException('404')

	const command = new updateQuestionPublishCommand(id, DTO)
	const updateQuestionPublished = await this.commandBus.execute<updateQuestionPublishCommand | boolean | null>(command)
	return updateQuestionPublished
  }
}
