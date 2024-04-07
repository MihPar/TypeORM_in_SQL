import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { Repository } from "typeorm";
import { GameStatusEnum } from "../enum/enumPendingPlayer";
import { GameTypeModel } from "../type/typeViewModel";
import { UsersQueryRepository } from "../../users/users.queryRepository";
import { PairQuizGameRepository } from "./pairQuizGameRepository";
import { PairQuizGameProgressQueryRepository } from "../../pairQuizGameProgress/infrastructure/pairQuizGameProgressQueryRepository";
import { PairQuizGameProgressPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer";
import { prototype } from "events";

@Injectable()
export class PairQuezGameQueryRepository {
  constructor(
    @InjectRepository(PairQuizGame) protected readonly pairQuezGame: Repository<PairQuizGame>,
	@InjectRepository(PairQuizGameProgressPlayer) protected readonly pairQuizGameProgressPlayer: Repository<PairQuizGameProgressPlayer>,
    protected readonly usersQueryRepository: UsersQueryRepository,
    protected readonly pairQuizGameRepository: PairQuizGameRepository,
    protected readonly pairQuizGameProgressQueryRepository: PairQuizGameProgressQueryRepository,
  ) {}
  async deleteAllPairQuizGame() {
    await this.pairQuezGame.createQueryBuilder().delete().execute();
    return true;
  }
  async getCurrentUnFinGame(
    status: GameStatusEnum,
    userId?: string,
  ): Promise<GameTypeModel | null> {
    const currentUnFinishedGame = await this.pairQuezGame.findOne({
		relations: {
			firstPlayerProgress: {user: true, answers: {question: true}},
			secondPlayerProgress: {user: true, answers: {question: true}}
		},
		where: [
			{firstPlayerProgress: {user: {id: userId}}, status},
			{secondPlayerProgress: {user: {id: userId}}, status}
		]
	})
    if (!currentUnFinishedGame) return null;

    // const getLoginFirstPlayer =
    //   await await this.usersQueryRepository.findUserById(
    //     currentUnFinishedGame.firstPlayerProgressId,
    //   );
    // const getLoginSecondPlayer = await this.usersQueryRepository.findUserById(
    //   currentUnFinishedGame.secondPlayerProgressId,
    // );

    // const loginFirstPlayer = getLoginFirstPlayer.login;
    // const loginSecondPlayer = getLoginSecondPlayer.login;

    // const getFiveQuestions = await this.pairQuizGameRepository.getFiveQuestions(
    //   true,
    // );

    return PairQuizGame.getViewModel(currentUnFinishedGame);
  }

  async getGameById(id: string): Promise<GameTypeModel | null> {
    const getGameById: PairQuizGame = await this.pairQuezGame.findOne({
      relations: {
        firstPlayerProgress: { user: true, answers: { question: true } },
        secondPlayerProgress: { user: true, answers: { question: true } },
        question: true,
      },
      where: { id },
    });
    if (!getGameById) return null;
    return PairQuizGame.getViewModel(getGameById);
  }

  async getUnfinishedGame(status: GameStatusEnum, userId: string): Promise< PairQuizGame | null> {
	const getGame = await this.pairQuezGame.findOne({
		relations: {
			firstPlayerProgress: true,
			secondPlayerProgress: true,
		},
		where: [
			{status, firstPlayerProgress: {userId}},
			{status, secondPlayerProgress: {userId}},
		]
	})
	if(!getGame) return null
	return getGame
  }

  async getPlayerByGameIdAndUserId(gameId: string, userId: string): Promise<PairQuizGameProgressPlayer | null> {
	const getFirstPlayer = await this.pairQuizGameProgressPlayer.findOneBy({gameId, userId})
	if(!getFirstPlayer) return null
	return getFirstPlayer
  }

//   async getSecondPlayerByGameIdAndUserId(gameId: string, userId: string): Promise<PairQuizGameProgressPlayer | null> {
// 	const getSecondPlayer = await this.pairQuizGameProgressPlayer.findOneBy({gameId, userId})
// 	if(!getSecondPlayer) return null
// 	return getSecondPlayer
//   }

  // async getFirstPlayerByGameId(gameId: string) {}
}