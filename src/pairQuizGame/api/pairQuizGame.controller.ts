import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseGuards, NotFoundException } from '@nestjs/common';
import { BearerTokenPairQuizGame } from '../guards/bearerTokenPairQuizGame';
import { UserIdDecorator } from '../../users/infrastructure/decorators/decorator.user';
import { PairQuezGameQueryRepository } from '../infrastructure/pairQuizGameQueryRepository';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrConnectGameCommand } from '../useCase/createOrConnection-use-case';
import { CreatePairQuizGameDto } from '../dto/createPairQuizGame.dto';
// import { SendAnswerCommand } from '../useCase/createSendAnswer-use-case copy';
import { GameTypeModel } from '../type/typeViewModel';
import { PairQuizGameRepository } from '../infrastructure/pairQuizGameRepository';
import { GameStatusEnum } from '../enum/enumPendingPlayer';

@Controller('pair-quiz-game/pairs')
export class PairQuizGameController {
  constructor(
	protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
	protected readonly pairQuizGameRepository: PairQuizGameRepository,
	protected readonly commandBus: CommandBus
	) {}
  
  @Get('my-current')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(BearerTokenPairQuizGame)
  async getCurenctUnFinishedGame(
	@UserIdDecorator() userId: string,
  ) {
	const foundGameByUserId = await this.pairQuezGameQueryRepository.getCurrentUnFinGame(GameStatusEnum.Active, userId)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async getGameById(
	@Param('id') id: string,
	@UserIdDecorator() userId: string
	): Promise<GameTypeModel | null> {
		const getGameById = await this.pairQuezGameQueryRepository.getGameById(id, userId)
		if(!getGameById) throw new NotFoundException('404')
		return getGameById
  }

  @Post('connect')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async createOrConnectionGame(
	@UserIdDecorator() userId: string
  ): Promise<GameTypeModel> {
	const command = new CreateOrConnectGameCommand(userId)
	const createOrConnection = await this.commandBus.execute(command)
	if(!createOrConnection) throw new NotFoundException('404')
	return createOrConnection
  }

//   @Post('my-current/answers')
//   @HttpCode(HttpStatus.OK)
//   @UseGuards(BearerTokenPairQuizGame)
//   async sendAnswer(
// 	@Body() DTO: CreatePairQuizGameDto,
// 	@UserIdDecorator() userId: string
// 	) {
// 	const command = new SendAnswerCommand(DTO,userId)
// 	const createSendAnswer = await this.commandBus.execute(command)
// 	return createSendAnswer
//   }

}
