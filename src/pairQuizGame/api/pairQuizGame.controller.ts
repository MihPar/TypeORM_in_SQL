import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseGuards, NotFoundException } from '@nestjs/common';
import { BearerTokenPairQuizGame } from '../guards/bearerTokenPairQuizGame';
import { UserIdDecorator } from '../../users/infrastructure/decorators/decorator.user';
import { PairQuezGameQueryRepository } from '../infrastructure/pairQuizGameQueryRepository';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrConnectGameCommand } from '../useCase/createOrConnection-use-case';
import { CreatePairQuizGameDto } from '../dto/createPairQuizGame.dto';
import { SendAnswerCommand } from '../useCase/createSendAnswer-use-case copy';
import { QuestionTypeModel } from '../type/typeViewModel';

@Controller('pair-quiz-game/pairs')
export class PairQuizGameController {
  constructor(
	protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
	protected readonly commandBus: CommandBus
	) {}
  
  @Get('my-current')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(BearerTokenPairQuizGame)
  async getCurenctUnFinishedGame(
	@UserIdDecorator() userId: string,
  ) {
    const getCurrentUnFindshedGameOfUser = await this.pairQuezGameQueryRepository.getCurrentUnFinGame(userId)
	return getCurrentUnFindshedGameOfUser
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async getGameById(
	@Param('id') id: string,
	@UserIdDecorator() userId: string
	) {
		const getGameById = await this.pairQuezGameQueryRepository.getGameById(id,userId)
		return getGameById
  }

  @Post('connect')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async createOrConnectionGame(
	@UserIdDecorator() userId: string
  ): Promise<QuestionTypeModel> {
	const command = new CreateOrConnectGameCommand(userId)
	const createOrConnection = await this.commandBus.execute(command)
	if(!createOrConnection) throw new NotFoundException('404')
	return createOrConnection
  }

  @Post('my-current/answers')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async sendAnswer(
	@Body() DTO: CreatePairQuizGameDto,
	@UserIdDecorator() userId: string
	) {
	const command = new SendAnswerCommand(DTO,userId)
	const createSendAnswer = await this.commandBus.execute(command)
	return createSendAnswer
  }

}
