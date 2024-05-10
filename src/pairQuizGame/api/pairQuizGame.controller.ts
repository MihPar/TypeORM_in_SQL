import { Controller, Get, Post, Body, Param, HttpStatus, HttpCode, UseGuards, NotFoundException, ForbiddenException, ParseUUIDPipe } from '@nestjs/common';
import { BearerTokenPairQuizGame } from '../guards/bearerTokenPairQuizGame';
import { UserDecorator, UserIdDecorator } from '../../users/infrastructure/decorators/decorator.user';
import { PairQuezGameQueryRepository } from '../infrastructure/pairQuizGameQueryRepository';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrConnectGameCommand } from '../useCase/createOrConnection-use-case';
import { GameAnswerDto } from '../dto/createPairQuizGame.dto';
import { AnswerType, GameTypeModel } from '../type/typeViewModel';
import { GameStatusEnum } from '../enum/enumPendingPlayer';
import { User } from '../../users/entities/user.entity';
import { SendAnswerCommand } from '../useCase/createSendAnswer-use-case';
import { PairQuizGame } from '../domain/entity.pairQuezGame';
import { GAME_QUESTION_COUNT } from '../domain/constants';

@Controller('pair-game-quiz/pairs')
export class PairQuizGameController {
  constructor(
	protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
	protected readonly commandBus: CommandBus
	) {}
  
  @Get('my-current')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async getCurenctUnFinishedGame(
	@UserIdDecorator() userId: string,
  ) {
	const findUnfinishedUserGame = await this.pairQuezGameQueryRepository.getCurrentUnFinGame(
		userId, [GameStatusEnum.Active, GameStatusEnum.PendingSecondPlayer]
	)
	// [GameStatusEnum.Active, GameStatusEnum.PendingSecondPlayer]
	// console.log("findUnfinishedUserGame: ", findUnfinishedUserGame)
	if(!findUnfinishedUserGame) throw new NotFoundException('404')
	return findUnfinishedUserGame
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async getGameById(
	@Param('id', ParseUUIDPipe) id: string,
	@UserIdDecorator() userId: string
	): Promise<GameTypeModel | null> {
		const getActivePair: GameTypeModel | null = await this.pairQuezGameQueryRepository.getRawGameById(id)
		// console.log("getActivePair: ", getActivePair)
		if(!getActivePair) throw new NotFoundException('404')
		if(getActivePair.firstPlayerProgress.player.id !== userId 
			&& getActivePair.secondPlayerProgress?.player?.id !== userId) throw new ForbiddenException('403')
			// console.log("PairQuizGame.getViewModel(getActivePair): ", PairQuizGame.getViewModel(getActivePair))
		// return PairQuizGame.getViewModels(getActivePair.game, getActivePair.firstPlayer, getActivePair.secondPlayer)
		return getActivePair
  }

  @Post('connection')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async createOrConnectionGame(
	@UserIdDecorator() userId: string,
	@UserDecorator() user: User
  ): Promise<GameTypeModel> {
	// console.log("start")
	const getGameById: PairQuizGame | null = await this.pairQuezGameQueryRepository.getUnfinishedGame(userId)
		if(getGameById) throw new ForbiddenException('403')
	const command = new CreateOrConnectGameCommand(userId, user)
	const createOrConnection = await this.commandBus.execute<CreateOrConnectGameCommand | GameTypeModel>(command)
	// if(!createOrConnection) throw new ForbiddenException('403')
	// const updatedGame = await this.pairQuezGameQueryRepository.getRawGameById(createOrConnection.id)
	// return PairQuizGame.getViewModel(updatedGame)
		// console.log("createOrConnection: ", createOrConnection)
	return createOrConnection
  }

  @Post('my-current/answers')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async sendAnswer(
	@Body() DTO: GameAnswerDto,
	@UserIdDecorator() userId: string
	) {
		// console.error(DTO, " dto in controller")
	const activeUserGame: GameTypeModel | null = await this.pairQuezGameQueryRepository.getCurrentUnFinGame(userId, [GameStatusEnum.Active])
	// console.log("activeUserGame: ", activeUserGame.firstPlayerProgress.answers)
		if(!activeUserGame) throw new ForbiddenException('the game is not exist by userId and status')

		const isFirstPlayer = activeUserGame.firstPlayerProgress.player.id === userId
		// isFirstPlayer && console.error("firstplayer")
		const isSecondPlayer = activeUserGame.secondPlayerProgress?.player?.id === userId
		// isSecondPlayer && console.error("secondplayer")
		const firstPlayerAswersCount = activeUserGame.firstPlayerProgress.answers.length
		const secondPlayerAswersCount = activeUserGame.secondPlayerProgress?.answers?.length
		if(isFirstPlayer && firstPlayerAswersCount === GAME_QUESTION_COUNT) {throw new ForbiddenException('first player is not answer by all questions')}

		if(isSecondPlayer && secondPlayerAswersCount === GAME_QUESTION_COUNT) {throw new ForbiddenException('second player is not answer by all questions')}

	const command = new SendAnswerCommand(DTO, userId, activeUserGame)
	const createSendAnswer = await this.commandBus.execute<SendAnswerCommand | AnswerType>(command)
	// if(!createSendAnswer) throw new ForbiddenException('the answer is not created')
		// console.log("createSendAnswer: ", createSendAnswer)
	return createSendAnswer
  }
}
