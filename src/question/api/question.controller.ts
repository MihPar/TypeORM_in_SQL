import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { QuestionService } from '../aplication/question.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { AuthBasic } from '../../users/gards/basic.auth';
import { QuestionQueryRepository } from '../infrastructury/questionQueryRepository';

@Controller('sa/quiz/questions')
@UseGuards(AuthBasic)
export class QuestionController {
  constructor(
	private readonly questionService: QuestionService,
	private readonly questionQueryRepository: QuestionQueryRepository 
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
		query.bodySearchTerm = query.bodySearchTerm || "bodySearchTerm" 
		query.pageNumber = query.pageNumber || "1"
		query.pageSize = query.pageSize || "10"
		query.publishedStatus = query.publishedStatus || "all"
		query.sortBy = query.sortBy || "createdAt"
		query.sortDirection = query.sortDirection || "desc"
		
	const getAllQuestion = await this.questionQueryRepository.findAllQuestions(
		query.bodySearchTerm,
		query.pageNumber,
		query.pageSize,
		query.publishedStatus,
		query.sortBy,
		query.sortDirection
		)
		return getAllQuestion
    // return this.questionService.findAll();
  }


  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}
