import { stringify } from 'querystring';
import { PairQuizGameProgressPlayer } from '../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Question } from "../../question/domain/entity.question";
import { Repository } from "typeorm";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { AnswerStatusEnum, GameStatusEnum, StatusGameEnum } from "../enum/enumPendingPlayer";
import { AnswersPlayer } from '../../pairQuizGameProgress/domain/entity.answersPlayer';
import { QuestionGame } from '../domain/entity.questionGame';
import { PlayerStatisticsView } from '../type/typeViewModel';

@Injectable()
export class PairQuizGameRepository {
  constructor(
    @InjectRepository(Question)
    protected readonly question: Repository<Question>,
    @InjectRepository(PairQuizGame)
    protected readonly pairQuizGame: Repository<PairQuizGame>,
    @InjectRepository(PairQuizGameProgressPlayer)
    protected readonly pairQuizGameProgressPlayer: Repository<PairQuizGameProgressPlayer>,
    @InjectRepository(AnswersPlayer)
    protected readonly answersPlayer: Repository<AnswersPlayer>,
    @InjectRepository(QuestionGame)
    protected readonly questionGame: Repository<QuestionGame>,
  ) {}

  async foundGameByUserId(userId: string): Promise<PairQuizGame | null> {
    const foundGameByUserId = await this.pairQuizGame.findOne({
      relations: {
        firstPlayerProgress: {
          user: true,
        },
        secondPlayerProgress: {
          user: true,
        },
      },
      where: [
        {
          firstPlayerProgress: { user: { id: userId } },
          status: GameStatusEnum.Active,
        },
        // {
        //   firstPlayerProgress: { user: { id: userId } },
        //   status: GameStatusEnum.PendingSecondPlayer,
        // },
        {
          secondPlayerProgress: { user: { id: userId } },
          status: GameStatusEnum.Active,
        },
        // {
        //   secondPlayerProgress: { user: { id: userId } },
        //   status: GameStatusEnum.PendingSecondPlayer,
        // },
      ],
    });
    if (!foundGameByUserId) return null;
    return foundGameByUserId;
  }

  async foundGame(status: GameStatusEnum): Promise<PairQuizGame | null> {
    return await this.pairQuizGame.findOne({
      relations: {
        firstPlayerProgress: {
          user: true,
          answers: { question: true },
        },
        secondPlayerProgress: {
          user: true,
          answers: { question: true },
        },
        questionGames: true,
      },
      where: {
        status,
      },
    });
  }

  async createNewGame(newQuizGame: PairQuizGame): Promise<PairQuizGame> {
    const createNewQuizGame = await this.pairQuizGame.save({ ...newQuizGame });
    return createNewQuizGame;
  }

  async updateExistingGame(game: PairQuizGame): Promise<PairQuizGame> {
    const updateGame = await this.pairQuizGame.save(game);
    return updateGame;
  }

  async getFiveQuestions(boolean: boolean): Promise<Question[] | null> {
    const getQuestionForQuizGame = await this.question
      .createQueryBuilder()
      .select()
      .where(`published = :boolean`, { boolean })
      .orderBy('RANDOM()')
      .take(5)
      .getMany();

    if (!getQuestionForQuizGame) return null;
    return getQuestionForQuizGame;
  }

  async sendAnswerPlayer({
    userId,
    count,
    gameId,
  }: {
    userId: string;
    count: boolean;
    gameId: string;
  }) {
    const answersPlayer = await this.pairQuizGameProgressPlayer
      .createQueryBuilder()
      .update()
      .set({ score: () => (Boolean(count) ? 'score + 1' : 'score + 0') })
      .where({ userId, gameId })
      .execute();

    const result = await this.pairQuizGameProgressPlayer
      .createQueryBuilder()
      .select()
      .where({ userId })
      .getOne();
    //   console.log("result: ", result.score)
  }

  async createQuestions(createQuestions: QuestionGame[]) {
    return await this.questionGame.save(createQuestions);
  }

  async getStatisticOfUser(
    userId: string,
  ): Promise<PlayerStatisticsView | null> {
    const playerSumScores = await this.pairQuizGameProgressPlayer
      .createQueryBuilder()
      .select('SUM(score)', 'sumScore')
      .where(`"userId" = :userId`, { userId })
      .getRawOne()
      .then((result) => parseInt(result.sumScore));

    // console.log(
    //   ' all progresses of user, ',
    //   await this.pairQuizGameProgressPlayer.find({
    //     where: {
    //       userId,
    //     },
    //   }),
    // );

    // console.log(
    //   'result: as first player ',
    //   await this.pairQuizGame
    //     .find({
    //       where: { firstPlayerProgress: { user: { id: userId } } },
    //     })
    //     .then((result) =>
    //       result.map((item) => ({
    //         playerId: item.firstPlayerProgress.id,
    //         answers: item.firstPlayerProgress.answers,
    //       })),
    //     ),
    // );

    // console.log(
    //   'result: as second player ',
    //   await this.pairQuizGame
    //     .find({
    //       where: { secondPlayerProgress: { user: { id: userId } } },
    //     })
    //     .then((result) =>
    //       result.map((item) => ({
    //         playerId: item.secondPlayerProgress.id,
    //         answers: item.secondPlayerProgress.answers,
    //       })),
    //     ),
    // );

    const playerTotalGameCount = await this.pairQuizGameProgressPlayer
      .createQueryBuilder()
      .where(`"userId" = :userId`, { userId })
      .getCount();

    const playerAvgScores =
      Math.ceil((playerSumScores / playerTotalGameCount) * 100) / 100;

    const playerWinCount = await this.pairQuizGameProgressPlayer
      .createQueryBuilder()
      .where(`"userId" = :userId`, { userId })
      .andWhere(`"userStatus" = :status`, { status: StatusGameEnum.Winner })
      .getCount();

    const playerLossCount = await this.pairQuizGameProgressPlayer
      .createQueryBuilder()
      .where(`"userId" = :userId`, { userId })
      .andWhere(`"userStatus" = :status`, { status: StatusGameEnum.Loser })
      .getCount();

    const playerDrawsCount = await this.pairQuizGameProgressPlayer
      .createQueryBuilder()
      .where(`"userId" = :userId`, { userId })
      .andWhere(`"userStatus" = :status`, { status: StatusGameEnum.Draw })
      .getCount();

    return {
      sumScore: playerSumScores,
      avgScores: playerAvgScores,
      gamesCount: playerTotalGameCount,
      winsCount: playerWinCount,
      lossesCount: playerLossCount,
      drawsCount: playerDrawsCount,
    };
  }
}