import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { Repository } from "typeorm";
import { GameStatusEnum } from "../enum/enumPendingPlayer";
import { GameTypeModel } from "../type/typeViewModel";
import { UsersQueryRepository } from "../../users/users.queryRepository";

@Injectable()
export class PairQuezGameQueryRepository {
	constructor(
		@InjectRepository(PairQuizGame) protected readonly pairQuezGame: Repository<PairQuizGame>,
		protected readonly usersQueryRepository: UsersQueryRepository
	) {}
	// async getCurrentUnFinGame(status: GameStatusEnum, userId: string): Promise<GameTypeModel> {
	// 	const currentUnFinishedGame = await this.pairQuezGame.find({
	// 		relations: {
	// 			firstPlayerProgress: true,
	// 			secondPlayerProgress: true,
	// 			question: true
	// 		},
	// 		where: {
	// 			status,
	// 			id: userId
	// 		}
	// 	})

	// 	const getLoginSecondPlayer = await this.usersQueryRepository.findUserById(currentUnFinishedGame.secondPlayerProgress.userSecondPlyerId)
	// 	const getLoginFirstPlayer = await await this.usersQueryRepository.findUserById(userId)
	// 	const loginFirstPlayer = getLoginFirstPlayer.login
	// 	const loginSecondPlayer = getLoginSecondPlayer.login

	// 	return PairQuizGame.getUnfinishedGame(currentUnFinishedGame, getLoginFirstPlayer, getLoginSecondPlayer)
	// }

	// async getGameById(id: string, userId: string): Promise<GameTypeModel | null> {
	// 	const getGame = await this.pairQuezGame.find({
	// 		relations: {
	// 			firstPlayerProgress: true,
	// 			secondPlayerProgress: true,
	// 			question: true
	// 		},
	// 		where: {
	// 			id
	// 		}
	// 	})
	// 	if(!getGame) return null
	// 	const getLoginSecondPlayer = await this.usersQueryRepository.findUserById(getGame.secondPlayerProgress.userSecondPlyerId)
	// 	const getLoginFirstPlayer = await await this.usersQueryRepository.findUserById(userId)
	// 	const loginFirstPlayer = getLoginFirstPlayer.login
	// 	const loginSecondPlayer = getLoginSecondPlayer.login
	// 	return PairQuizGame.getGameById(getGame, loginFirstPlayer, loginSecondPlayer)
	// }

	// async getUnfinishedGame(userId: string) {}

	// async getFirstPlayerByGameIdAndUserId(gameId: string, userId: string) {}

	// async getSecondPlayerByGameIdAndUserId(gameId: string, userId: string) {}

	// async getFirstPlayerByGameId(gameId: string) {}
}