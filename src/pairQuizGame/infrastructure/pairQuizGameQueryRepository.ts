import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { Repository } from "typeorm";
import { GameStatusEnum } from "../enum/enumPendingPlayer";
import { GameTypeModel } from "../type/typeViewModel";
import { UsersQueryRepository } from "../../users/users.queryRepository";
import { PairQuizGameRepository } from "./pairQuizGameRepository";

@Injectable()
export class PairQuezGameQueryRepository {
	constructor(
		@InjectRepository(PairQuizGame) protected readonly pairQuezGame: Repository<PairQuizGame>,
		protected readonly usersQueryRepository: UsersQueryRepository,
		protected readonly pairQuizGameRepository: PairQuizGameRepository
	) {}
	async deleteAllPairQuizGame() {
		await this.pairQuezGame
			.createQueryBuilder()
			.delete()
			.execute()
			return true
	} 
	async getCurrentUnFinGame(status: GameStatusEnum, userId?: string): Promise<GameTypeModel | null> {
		const currentUnFinishedGame = await this.pairQuezGame
			.createQueryBuilder()
			.select()
			.where(`status = :status`, {status})
			.getOne()

		if(!currentUnFinishedGame) return null

		const getLoginFirstPlayer = await await this.usersQueryRepository.findUserById(currentUnFinishedGame.firstPlayerProgressId)
		const getLoginSecondPlayer = await this.usersQueryRepository.findUserById(currentUnFinishedGame.secondPlayerProgressId)
		
		const loginFirstPlayer = getLoginFirstPlayer.login
		const loginSecondPlayer = getLoginSecondPlayer.login

		const getFiveQuestions = await this.pairQuizGameRepository.getFiveQuestions(true)

		return PairQuizGame.getUnfinishedGame(currentUnFinishedGame, loginFirstPlayer, loginSecondPlayer, getFiveQuestions)
	}

	async getGameById(id: string): Promise<GameTypeModel | null> {
		const getGameById = await this.pairQuezGame.findOneBy({id, status: GameStatusEnum.Active})
		if(!getGameById) return null
		
		const getLoginFirstPlayer = await this.usersQueryRepository.findUserById(getGameById.firstPlayerProgress.userFirstPlyerId)

		const getLoginSecondPlayer = await this.usersQueryRepository.findUserById(getGameById.secondPlayerProgress.userSecondPlyerId)

		const loginFirstPlayer = getLoginFirstPlayer.login
		const loginSecondPlayer = getLoginSecondPlayer.login

		const getFiveQuestions = await this.pairQuizGameRepository.getFiveQuestions(true)

		return PairQuizGame.getGameById(getGameById, loginFirstPlayer, loginSecondPlayer, getFiveQuestions)
	}

	// async getUnfinishedGame(userId: string) {}

	// async getFirstPlayerByGameIdAndUserId(gameId: string, userId: string) {}

	// async getSecondPlayerByGameIdAndUserId(gameId: string, userId: string) {}

	// async getFirstPlayerByGameId(gameId: string) {}
}