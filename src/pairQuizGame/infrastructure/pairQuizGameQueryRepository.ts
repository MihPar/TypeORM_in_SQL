import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GameTypeModel } from '../type/typeViewModel';
import { UsersQueryRepository } from '../../users/users.queryRepository';
import { PairQuizGameRepository } from './pairQuizGameRepository';
import { PairQuizGameProgressQueryRepository } from '../../pairQuizGameProgress/infrastructure/pairQuizGameProgressQueryRepository';
import { PairQuizGameProgressPlayer } from '../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer';
import { AnswersPlayer } from '../../pairQuizGameProgress/domain/entity.answersPlayer';
import { QuestionGame } from '../domain/entity.questionGame';
import { PaginationType } from '../../types/pagination.types';
import { PairQuizGame } from '../domain/entity.pairQuezGame';
import { GameStatusEnum } from '../enum/enumPendingPlayer';

@Injectable()
export class PairQuezGameQueryRepository {
  constructor(
    @InjectRepository(PairQuizGame)
    protected readonly pairQuezGame: Repository<PairQuizGame>,
    @InjectRepository(PairQuizGameProgressPlayer)
    protected readonly pairQuizGameProgressPlayer: Repository<PairQuizGameProgressPlayer>,
    @InjectRepository(AnswersPlayer)
    protected readonly answersPlayer: Repository<AnswersPlayer>,
    @InjectRepository(QuestionGame)
    protected readonly questionGame: Repository<QuestionGame>,
    protected readonly usersQueryRepository: UsersQueryRepository,
    protected readonly pairQuizGameRepository: PairQuizGameRepository,
    protected readonly pairQuizGameProgressQueryRepository: PairQuizGameProgressQueryRepository,
  ) {}
  async deleteAllPairQuizGame() {
    await this.pairQuezGame.createQueryBuilder().delete().execute();
    return true;
  }

  async deleteAllQuestionGames() {
    await this.questionGame.createQueryBuilder().delete().execute();
    return true;
  }

  async getCurrentUnFinGame(
    userId: string,
    statuses?: GameStatusEnum[],
  ): Promise<GameTypeModel | null> {
    const currentUnFinishedGame = await this.pairQuezGame.findOne({
      relations: {
        firstPlayerProgress: { user: true, answers: { question: true } },
        secondPlayerProgress: { user: true, answers: { question: true } },
        questionGames: { question: { questionGame: true } },
      },
      where: [
        { firstPlayerProgress: { user: { id: userId } }, status: In(statuses) },
        {
          secondPlayerProgress: { user: { id: userId } },
          status: In(statuses),
        },
      ],
      order: { questionGames: { index: 'ASC' } },
    });

    if (!currentUnFinishedGame) return null;

    const currentUnFinishedGameFirstPlayer =
      await this.pairQuizGameProgressPlayer.findOne({
        relations: {
          user: { progressPlayer: true },
          answers: { question: true },
        },
        where: {
          gameId: currentUnFinishedGame.id,
          user: { id: currentUnFinishedGame.firstPlayerProgress.user.id },
        },
        order: { answers: { addedAt: 'ASC' } },
      });

    const currentUnFinishedGameSecondPlayer =
      currentUnFinishedGame.secondPlayerProgress
        ? await this.pairQuizGameProgressPlayer.findOne({
            relations: {
              user: { progressPlayer: true },
              answers: { question: true },
            },
            where: {
              gameId: currentUnFinishedGame.id,
              user: { id: currentUnFinishedGame.secondPlayerProgress.user.id },
            },
            order: { answers: { addedAt: 'ASC' } },
          })
        : null;

    return PairQuizGame.getViewModels(
      currentUnFinishedGame,
      currentUnFinishedGameFirstPlayer,
      currentUnFinishedGameSecondPlayer,
    );
  }

  //   async getGameById(id: string): Promise<GameTypeModel | null> {
  //     const getGameById: PairQuizGame = await this.getRawGameById(id)
  //     if (!getGameById) return null;
  //     return PairQuizGame.getViewModel(getGameById);
  //   }

  async getRawGameById(id: string): Promise<GameTypeModel | null> {
    const getGameById: PairQuizGame = await this.pairQuezGame.findOne({
      relations: {
        firstPlayerProgress: { user: true, answers: { question: true } },
        secondPlayerProgress: { user: true, answers: { question: true } },
        questionGames: { question: { questionGame: true } },
      },
      where: { id },
      order: { questionGames: { index: 'ASC' } },
    });

    if (!getGameById) return null;

    const currentUnFinishedGameFirstPlayer =
      await this.pairQuizGameProgressPlayer.findOne({
        relations: {
          user: { progressPlayer: true },
          answers: { progress: true },
        },
        where: {
          gameId: id,
          user: { id: getGameById.firstPlayerProgress.user.id },
        },
        order: { answers: { addedAt: 'ASC' } },
      });

    const currentUnFinishedGameSecondPlayer = getGameById.secondPlayerProgress
      ? await this.pairQuizGameProgressPlayer.findOne({
          relations: {
            user: { progressPlayer: true },
            answers: { progress: true },
          },
          where: {
            gameId: id,
            user: { id: getGameById.secondPlayerProgress.user.id },
          },
          order: { answers: { addedAt: 'ASC' } },
        })
      : null;

    return PairQuizGame.getViewModels(
      getGameById,
      currentUnFinishedGameFirstPlayer,
      currentUnFinishedGameSecondPlayer,
    );
  }

  async getUnfinishedGame(userId: string): Promise<PairQuizGame | null> {
    const getGame = await this.pairQuezGame.findOne({
      relations: {
        firstPlayerProgress: { user: true, answers: true },
        secondPlayerProgress: { user: true, answers: true },
        questionGames: { question: { questionGame: true } },
      },
      where: [
        {
          status: GameStatusEnum.Active,
          firstPlayerProgress: { user: { id: userId } },
        },
        {
          status: GameStatusEnum.Active,
          secondPlayerProgress: { user: { id: userId } },
        },
      ],
      order: { questionGames: { index: 'ASC' } },
    });
    if (!getGame) return null;
    return getGame;
  }

  async getGameByUserIdAndStatuses(
    gameId: string,
    userId: string,
    statuses: GameStatusEnum[],
  ): Promise<PairQuizGame | null> {
    const getGame = await this.pairQuezGame.findOne({
      relations: {
        firstPlayerProgress: { user: true, answers: true },
        secondPlayerProgress: { user: true, answers: true },
        questionGames: { question: true },
      },
      where: [
        {
          id: gameId,
          status: In(statuses),
          firstPlayerProgress: { user: { id: userId } },
        },
        {
          id: gameId,
          status: In(statuses),
          secondPlayerProgress: { user: { id: userId } },
        },
      ],
    });
    if (!getGame) return null;

    return getGame;
  }

  async createAnswers(answer: AnswersPlayer[]) {
    return await this.answersPlayer.save(answer);
  }

  async increaseCountFirstPlayer(gameId: string) {
    return await this.pairQuizGameProgressPlayer.increment(
      { gameId },
      'score',
      1,
    );
  }

  async increaseCountSecondPlayer(gameId: string) {
    return await this.pairQuizGameProgressPlayer.increment(
      { gameId },
      'score',
      1,
    );
  }

  async addBonusPalyer(id: string) {
    return await this.pairQuizGameProgressPlayer.update(
      { id },
      { score: () => 'score + 1' },
    );
  }

  //   async addBonusSecondPalyer(id: string) {
  // 	return await this.pairQuizGameProgressPlayer.update({id}, {score: () => "score + 1", bonus_score: () => "score + 1"})
  //   }

  async changeGameStatusToFinished(gameId: string) {
    return await this.pairQuezGame.update(
      { id: gameId },
      {
        status: GameStatusEnum.Finished,
        finishGameDate: new Date().toISOString(),
      },
    );
  }

  async findAllGames(
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    userId: string,
  ): Promise<PaginationType<GameTypeModel>> {
    const findGameByUser = await this.pairQuezGame.findAndCount({
      relations: {
        firstPlayerProgress: { user: true, answers: true },
        secondPlayerProgress: { user: true, answers: true },
        questionGames: { question: { questionGame: true } },
      },
      where: [
        { firstPlayerProgress: { user: { id: userId } } },
        { secondPlayerProgress: { user: { id: userId } } },
      ],
      order: {
        questionGames: { index: 'ASC' },
        [sortBy]: `${sortDirection.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`,
        pairCreatedDate: 'DESC',
      },
      take: +pageSize,
      skip: (+pageNumber - 1) * +pageSize,
    });

    const [allGames, totalCount] = findGameByUser;
    const pagesCount: number = Math.ceil(totalCount / +pageSize);

    const result: PaginationType<GameTypeModel> = {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: await Promise.all(
        allGames.map(async (item: PairQuizGame) => {
          return PairQuizGame.getViewModel(item);
        }),
      ),
    };
    return result;
  }

  async saveGame(game: PairQuizGame): Promise<any> {
    const finishedGame = await this.pairQuezGame.save(game);
    return await this.pairQuezGame.update(
      { id: finishedGame.id },
      {
        status: GameStatusEnum.Finished,
        finishGameDate: new Date().toISOString(),
      },
    );
  }

  async saveProgress(
    playerProgress: PairQuizGameProgressPlayer,
  ): Promise<void> {
    await this.pairQuizGameProgressPlayer.save(playerProgress);
  }

  //   async makeFirstPlayerWin(game: PairQuizGame): Promise<void> {
  //     const firstPalyer = await this.pairQuizGameProgressPlayer.findOne({
  //       where: { id: game.firstPlayerProgress.id, gameId: game.id },
  //     });
  //     await this.pairQuizGameProgressPlayer.update(
  //       { id: firstPalyer!.id },
  //       { userStatus: StatusGameEnum.Winner },
  //     );

  //     const secondtPalyer = await this.pairQuizGameProgressPlayer.findOne({
  //       where: { id: game.secondPlayerProgress.id, gameId: game.id },
  //     });
  //     await this.pairQuizGameProgressPlayer.update(
  //       { id: secondtPalyer!.id },
  //       { userStatus: StatusGameEnum.Loser },
  //     );
  //   }

  //   async makeSecondPlayerWin(game: PairQuizGame) {
  //     const firstPalyer = await this.pairQuizGameProgressPlayer.findOne({
  //       where: { id: game.firstPlayerProgress.id, gameId: game.id },
  //     });
  //     await this.pairQuizGameProgressPlayer.update(
  //       { id: firstPalyer!.id },
  //       { userStatus: StatusGameEnum.Loser },
  //     );

  //     const secondtPalyer = await this.pairQuizGameProgressPlayer.findOne({
  //       where: { id: game.secondPlayerProgress.id, gameId: game.id },
  //     });
  //     await this.pairQuizGameProgressPlayer.update(
  //       { id: secondtPalyer!.id },
  //       { userStatus: StatusGameEnum.Winner },
  //     );
  //   }

  // async notAWinner(game: PairQuizGame) {
  // 	const firstPlayer = await this.pairQuizGameProgressPlayer.findOne({
  // 		where: {id: game.firstPlayerProgress.id, gameId: game.id },
  // 	  });
  // 	  await this.pairQuizGameProgressPlayer.update(
  // 		{ id: firstPlayer!.id },
  // 		{ userStatus: 'Draw' },
  // 	  );

  // 	  const secondPlayer = await this.pairQuizGameProgressPlayer.findOne({
  // 		where: {id: game.secondPlayerProgress.id, gameId: game.id},
  // 	  });

  // 	  await this.pairQuizGameProgressPlayer.update(
  // 		{ id: secondPlayer!.id },
  // 		{ userStatus: 'Draw' },
  // 	  );
  // }
}
