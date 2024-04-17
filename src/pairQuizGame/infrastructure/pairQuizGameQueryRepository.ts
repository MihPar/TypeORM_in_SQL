import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { In, Not, Repository } from "typeorm";
import { AnswerStatusEnum, GameStatusEnum } from "../enum/enumPendingPlayer";
import { GameTypeModel } from "../type/typeViewModel";
import { UsersQueryRepository } from "../../users/users.queryRepository";
import { PairQuizGameRepository } from "./pairQuizGameRepository";
import { PairQuizGameProgressQueryRepository } from "../../pairQuizGameProgress/infrastructure/pairQuizGameProgressQueryRepository";
import { PairQuizGameProgressPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer";
import { prototype } from "events";
import { AnswersPlayer } from "../../pairQuizGameProgress/domain/entity.answersPlayer";

@Injectable()
export class PairQuezGameQueryRepository {
  constructor(
    @InjectRepository(PairQuizGame) protected readonly pairQuezGame: Repository<PairQuizGame>,
	@InjectRepository(PairQuizGameProgressPlayer) protected readonly pairQuizGameProgressPlayer: Repository<PairQuizGameProgressPlayer>,
	@InjectRepository(AnswersPlayer) protected readonly answersPlayer: Repository<AnswersPlayer>,
    protected readonly usersQueryRepository: UsersQueryRepository,
    protected readonly pairQuizGameRepository: PairQuizGameRepository,
    protected readonly pairQuizGameProgressQueryRepository: PairQuizGameProgressQueryRepository,
  ) {}
  async deleteAllPairQuizGame() {
    await this.pairQuezGame.createQueryBuilder().delete().execute();
    return true;
  }
  async getCurrentUnFinGame(
    userId: string,
    statuses: GameStatusEnum[],
  ): Promise<GameTypeModel | null> {
    const currentUnFinishedGame = await this.pairQuezGame.findOne({
		relations: {
			firstPlayerProgress: {user: true, answers: {question: true}},
			secondPlayerProgress: {user: true, answers: {question: true}},
			question: true
		},
		where: [
			{firstPlayerProgress: {user: {id: userId}}, status: In(statuses)},
			{secondPlayerProgress: {user: {id: userId}}, status: In(statuses)}
		]
	})

    if (!currentUnFinishedGame) return null;
    return PairQuizGame.getViewModel(currentUnFinishedGame);
  }

  async getGameById(id: string): Promise<GameTypeModel | null> {
    const getGameById: PairQuizGame = await this.getRawGameById(id)
    if (!getGameById) return null;
    return PairQuizGame.getViewModel(getGameById);
  }

  async getRawGameById(id: string): Promise<PairQuizGame | null> {
    const getGameById: PairQuizGame = await this.pairQuezGame.findOne({
      relations: {
        firstPlayerProgress: { user: true, answers: { question: true } },
        secondPlayerProgress: { user: true, answers: { question: true } },
        question: true,
      },
      where: { id },
    });
    if (!getGameById) return null;
    return getGameById
  }
  

  async getUnfinishedGame(userId: string): Promise<PairQuizGame | null> {
	// console.log("userId: ", userId)
	// console.log("status: ", status)
	const getGame = await this.pairQuezGame.findOne({
		relations: {
			firstPlayerProgress: {user: true, answers: true},
			secondPlayerProgress: {user: true, answers: true},
			question: true
		},
		where: [
			{status: Not(GameStatusEnum.Finished), firstPlayerProgress: {user: {id: userId}}},
			{status:  Not(GameStatusEnum.Finished), secondPlayerProgress: {user: {id: userId}}},
		]
	})
	if(!getGame) return null

	return getGame
  }

  async getGameByUserIdAndStatuses(userId: string, statuses: GameStatusEnum[]): Promise<PairQuizGame | null> {
	const getGame = await this.pairQuezGame.findOne({
		relations: {
			firstPlayerProgress: {user: true, answers: true},
			secondPlayerProgress: {user: true, answers: true},
			question: true
		},
		where: [
			{status: In(statuses), firstPlayerProgress: {user: {id: userId}}},
			{status: In(statuses), secondPlayerProgress: {user: {id: userId}}},
		]
	})
	if(!getGame) return null

	return getGame
  }

  async getPlayerByGameIdAndUserId(gameId: string, userId?: string): Promise<PairQuizGameProgressPlayer | null> {
	const getFirstPlayer = await this.pairQuizGameProgressPlayer.findOne({
		relations: {
			user: true,
			answers: true
		},
		where: {gameId, userId}
	})
	
	if(!getFirstPlayer) return null
	return getFirstPlayer
  }

  async createAnswers(answer: AnswersPlayer) {
	return await this.answersPlayer.save(answer)
  }

  async setFinishAnswerDateFirstPlayer(gameId: string): Promise<void> {
	const result = await this.pairQuizGameProgressPlayer.update({gameId}, {answerStatus: AnswerStatusEnum.Correct})
  }

  async increaseCountFirstPlayer(gameId: string) {
	return await this.pairQuizGameProgressPlayer.increment({gameId}, "score", 1 )
  }

  async increaseCountSecondPlayer(gameId: string) {
	return await this.pairQuizGameProgressPlayer.increment({gameId}, "score", 1 )
  }

  async addBonusFirstPalyer(gameId: string) {
	return await this.pairQuizGameProgressPlayer.update({gameId}, {bonus_score: 1})
  }

  async addBonusSecondPalyer(gameId: string) {
	return await this.pairQuizGameProgressPlayer.update({gameId}, {bonus_score: 1})
  }

  async changeGameStatusToFinished(gameId: string) {
	return await this.pairQuezGame.update({id: gameId}, {status: GameStatusEnum.Finished})
  }
}