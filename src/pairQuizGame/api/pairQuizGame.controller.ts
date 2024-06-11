import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { BearerTokenPairQuizGame } from '../guards/bearerTokenPairQuizGame';
import {
  UserDecorator,
  UserIdDecorator,
} from '../../users/infrastructure/decorators/decorator.user';
import { PairQuezGameQueryRepository } from '../infrastructure/pairQuizGameQueryRepository';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrConnectGameCommand } from '../useCase/createOrConnection-use-case';
import { GameAnswerDto } from '../dto/createPairQuizGame.dto';
import {
  AnswerType,
  GameTypeModel,
  PlayerStatisticsView,
  TopUserView,
} from '../type/typeViewModel';
import { GameStatusEnum } from '../enum/enumPendingPlayer';
import { User } from '../../users/entities/user.entity';
import { SendAnswerCommand } from '../useCase/createSendAnswer-use-case';
import { GAME_QUESTION_COUNT } from '../domain/constants';
import { PairQuizGameRepository } from '../infrastructure/pairQuizGameRepository';
import { GetCurrectUserStatisticCommand } from '../useCase/changeAnswerStatusFirstPlayer-use-case';
import { PairQuizGame } from '../domain/entity.pairQuezGame';
import { PaginationType } from '../../types/pagination.types';
import { PairQuizGameProgressQueryRepository } from '../../pairQuizGameProgress/infrastructure/pairQuizGameProgressQueryRepository';

@Controller('pair-game-quiz')
export class PairQuizGameController {
  constructor(
    protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
    protected readonly pairQuizGameRepository: PairQuizGameRepository,
    protected readonly commandBus: CommandBus,
    protected readonly pairQuizGameProgressQueryRepository: PairQuizGameProgressQueryRepository,
  ) {}

  //   @Get('pairs/all')
  //   @HttpCode(HttpStatus.OK)
  //   async geAllGames(
  //   ): Promise<GameTypeModel[]> {
  // 	console.log(1)
  //     const getAllPairs: GameTypeModel[] =
  //       await this.pairQuezGameQueryRepository.getAllGames();

  // 	  return getAllPairs;
  //   }

  @Get('users/top')
  @HttpCode(HttpStatus.OK)
  async getTopUsers(
    @Query('sort') sort: string[],
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ): Promise<PaginationType<TopUserView>> {
    if (!sort || sort.length === 0) {
      sort = ['avgScores desc', 'sumScore desc'];
    } else if (typeof sort === 'string') {
      sort = [sort];
    } else if (
      typeof sort === 'object' &&
      sort.length === 1 &&
      typeof sort[0] === 'string'
    ) {
      sort = [sort[0]];
    }
    const checkPageSize = +pageSize;
    if (!pageSize || !Number.isInteger(checkPageSize) || checkPageSize <= 0) {
      pageSize = 10;
    }

    const checkPageNumber = +pageNumber;
    if (
      !pageNumber ||
      !Number.isInteger(checkPageNumber) ||
      checkPageNumber <= 0
    ) {
      pageNumber = 1;
    }
    const getUsersOfTop =
      await this.pairQuizGameProgressQueryRepository.getTopUsers(
        sort,
        pageNumber,
        pageSize,
      );
    return getUsersOfTop;
  }

  @Get('pairs/my')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async getAllGameByUserId(
    @UserIdDecorator() userId: string,
    @Query()
    query: {
      sortBy: string;
      sortDirection: string;
      pageNumber: string;
      pageSize: string;
    },
  ) {
    const findGameByUser = await this.pairQuezGameQueryRepository.findAllGames(
      query.pageNumber || '1',
      query.pageSize || '10',
      query.sortBy || 'pairCreatedDate',
      query.sortDirection || 'desc',
      userId,
    );
    return findGameByUser;
  }

  @Get('users/my-statistic')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async getCurrectUserStatistic(
    @UserIdDecorator() userId: string,
  ): Promise<PlayerStatisticsView | null> {
    const command = new GetCurrectUserStatisticCommand(userId);
    const getStatisticOfCurrectUser = await this.commandBus.execute<
      GetCurrectUserStatisticCommand | PlayerStatisticsView | null
    >(command);
    if (!getStatisticOfCurrectUser) return null;
    return getStatisticOfCurrectUser;
  }

  @Get('pairs/my-current')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async getCurenctUnFinishedGame(@UserIdDecorator() userId: string) {
    const findUnfinishedUserGame =
      await this.pairQuezGameQueryRepository.getCurrentUnFinGame(userId, [
        GameStatusEnum.Active,
        GameStatusEnum.PendingSecondPlayer,
      ]);
    if (!findUnfinishedUserGame) throw new NotFoundException('404');
    return findUnfinishedUserGame;
  }

  @Get('pairs/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async getGameById(
    @Param('id', ParseUUIDPipe) id: string,
    @UserIdDecorator() userId: string,
  ): Promise<GameTypeModel | null> {
    const getActivePair: GameTypeModel | null =
      await this.pairQuezGameQueryRepository.getRawGameById(id);
    if (!getActivePair) throw new NotFoundException('404');
    if (
      getActivePair.firstPlayerProgress.player.id !== userId &&
      getActivePair.secondPlayerProgress?.player?.id !== userId
    )
      throw new ForbiddenException('403');
    return getActivePair;
  }

  @Post('pairs/connection')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async createOrConnectionGame(
    @UserIdDecorator() userId: string,
    @UserDecorator() user: User,
  ): Promise<GameTypeModel> {
    const foundGameByUserId: PairQuizGame =
      await this.pairQuizGameRepository.foundGameByUserId(userId);
    if (foundGameByUserId) throw new ForbiddenException('403');
    const command = new CreateOrConnectGameCommand(userId, user);
    const createOrConnection = await this.commandBus.execute<
      CreateOrConnectGameCommand | GameTypeModel
    >(command);

    return createOrConnection;
  }

  @Post('pairs/my-current/answers')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenPairQuizGame)
  async sendAnswer(
    @Body() DTO: GameAnswerDto,
    @UserIdDecorator() userId: string,
  ) {
    const activeUserGame: GameTypeModel | null =
      await this.pairQuezGameQueryRepository.getCurrentUnFinGame(userId, [
        GameStatusEnum.Active,
      ]);
    //   console.log("activeUserGame: ", activeUserGame)
    if (!activeUserGame)
      throw new ForbiddenException(
        'the game is not exist by userId and status',
      );

    const isFirstPlayer =
      activeUserGame.firstPlayerProgress.player.id === userId;
    const isSecondPlayer =
      activeUserGame.secondPlayerProgress?.player?.id === userId;
    const firstPlayerAswersCount =
      activeUserGame.firstPlayerProgress.answers.length;
    const secondPlayerAswersCount =
      activeUserGame.secondPlayerProgress?.answers?.length;
    if (isFirstPlayer && firstPlayerAswersCount === GAME_QUESTION_COUNT) {
      throw new ForbiddenException(
        'first player is not answer by all questions',
      );
    }

    if (isSecondPlayer && secondPlayerAswersCount === GAME_QUESTION_COUNT) {
      throw new ForbiddenException(
        'second player is not answer by all questions',
      );
    }

    const command = new SendAnswerCommand(DTO, userId, activeUserGame);
    const createSendAnswer = await this.commandBus.execute<
      SendAnswerCommand | AnswerType
    >(command);
    if (!createSendAnswer)
      throw new ForbiddenException('the answer is not created');
    return createSendAnswer;
  }
}
