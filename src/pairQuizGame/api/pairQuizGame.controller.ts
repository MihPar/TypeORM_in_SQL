import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BearerTokenPairQuizGame } from '../guards/bearerTokenPairQuizGame';
import { UserDecorator, UserIdDecorator } from '../../users/infrastructure/decorators/decorator.user';
import { PairQuezGameQueryRepository } from '../infrastructure/pairQuizGameQueryRepository';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrConnectGameCommand } from '../useCase/createOrConnection-use-case';
import { CreatePairQuizGameDto } from '../dto/createPairQuizGame.dto';
// import { SendAnswerCommand } from '../useCase/createSendAnswer-use-case copy';
import { GameTypeModel } from '../type/typeViewModel';
import { PairQuizGameRepository } from '../infrastructure/pairQuizGameRepository';
import { GameStatusEnum } from '../enum/enumPendingPlayer';
import { PairQuizGame } from '../domain/entity.pairQuezGame';
import { User } from '../../users/entities/user.entity';

@Controller('pair-game-quiz/pairs')
export class PairQuizGameController {
  constructor(
	protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
	// protected readonly pairQuizGameRepository: PairQuizGameRepository,
	protected readonly commandBus: CommandBus
	) {}
  
  @Get('my-current')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(BearerTokenPairQuizGame)
  async getCurenctUnFinishedGame(
	@UserIdDecorator() userId: string,
  ) {
	const findUnfinishedUserGame = await this.pairQuezGameQueryRepository.getCurrentUnFinGame(GameStatusEnum.Active, userId)
	if(!findUnfinishedUserGame) throw new NotFoundException('404')
	return findUnfinishedUserGame
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async getGameById(
	@Param('id') id: string,
	@UserIdDecorator() userId: string
	): Promise<GameTypeModel | null> {
		const getGameById: GameTypeModel | null = await this.pairQuezGameQueryRepository.getGameById(id)
		console.log(userId, " userId from accessToken")
		console.log(getGameById.firstPlayerProgress.player.id, " id of first player participating in game")
		console.log(getGameById.secondPlayerProgress.player.id, " id of second player participating in game")
		// console.log("getGameById: ", getGameById)
		if(getGameById.firstPlayerProgress.player.id !== userId && getGameById.secondPlayerProgress.player.id !== userId) throw new ForbiddenException('403')
		if(!getGameById) throw new NotFoundException('404')
		return getGameById
  }

  @Post('connection')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async createOrConnectionGame(
	@UserIdDecorator() userId: string,
	@UserDecorator() user: User
  ): Promise<GameTypeModel> {
	const command = new CreateOrConnectGameCommand(userId, user)
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
