import { Controller, Get, Post, Body, Param, HttpStatus, HttpCode, UseGuards, NotFoundException, ForbiddenException, ParseUUIDPipe } from '@nestjs/common';
import { BearerTokenPairQuizGame } from '../guards/bearerTokenPairQuizGame';
import { UserDecorator, UserIdDecorator } from '../../users/infrastructure/decorators/decorator.user';
import { PairQuezGameQueryRepository } from '../infrastructure/pairQuizGameQueryRepository';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrConnectGameCommand } from '../useCase/createOrConnection-use-case';
import { CreatePairQuizGameDto } from '../dto/createPairQuizGame.dto';
import { AnswerType, GameTypeModel } from '../type/typeViewModel';
import { GameStatusEnum } from '../enum/enumPendingPlayer';
import { User } from '../../users/entities/user.entity';
import { SendAnswerCommand } from '../useCase/createSendAnswer-use-case copy';
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
		userId, GameStatusEnum.Active
	)
	// [GameStatusEnum.Active, GameStatusEnum.PendingSecondPlayer]
	// console.log("findUnfinishedUserGame: ", findUnfinishedUserGame)
	if(!findUnfinishedUserGame) throw new NotFoundException('404')
		// console.log("findUnfinishedUserGame: ", findUnfinishedUserGame)
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
	if(!createOrConnection) throw new ForbiddenException('403')
	// const updatedGame = await this.pairQuezGameQueryRepository.getRawGameById(createOrConnection.id)
	// return PairQuizGame.getViewModel(updatedGame)
		// console.log("createOrConnection: ", createOrConnection)
	return createOrConnection
  }

  @Post('my-current/answers')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async sendAnswer(
	@Body() DTO: CreatePairQuizGameDto,
	@UserIdDecorator() userId: string
	) {
	const activeUserGame: PairQuizGame | null = await this.pairQuezGameQueryRepository.getGameByUserIdAndStatuses(userId, [GameStatusEnum.Active])
		if(!activeUserGame) throw new ForbiddenException('the game is not exist by userId and status')

		const isFirstPlayer = activeUserGame.firstPlayerProgress.user.id === userId
		const isSecondPlayer = activeUserGame.secondPlayerProgress?.user?.id === userId
		const firstPlayerAswersCount = activeUserGame.firstPlayerProgress.answers.length
		const secondPlayerAswersCount = activeUserGame.secondPlayerProgress?.answers?.length
		if(isFirstPlayer && firstPlayerAswersCount === GAME_QUESTION_COUNT) {throw new ForbiddenException('first player is not answer by all questions')}

		if(isSecondPlayer && secondPlayerAswersCount === GAME_QUESTION_COUNT) {throw new ForbiddenException('second player is not answer by all questions')}

	const command = new SendAnswerCommand(DTO, userId)
	const createSendAnswer = await this.commandBus.execute<SendAnswerCommand | AnswerType>(command)
	if(!createSendAnswer) throw new ForbiddenException('the answer is not created')
	return createSendAnswer
  }
}
