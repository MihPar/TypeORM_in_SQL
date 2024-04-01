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
			.where(`status = :status AND "firstPlayerProgressId" = :userId`, {status, userId})
			.orWhere(`status = :status AND "secondPlayerProgressId" = :userId`, {status, userId})
			.getOne()

			console.log("currentUnFinishedGame: ", currentUnFinishedGame)
		if(!currentUnFinishedGame) return null

		const getLoginFirstPlayer = await await this.usersQueryRepository.findUserById(currentUnFinishedGame.firstPlayerProgressId)
		const getLoginSecondPlayer = await this.usersQueryRepository.findUserById(currentUnFinishedGame.secondPlayerProgressId)
		
		const loginFirstPlayer = getLoginFirstPlayer.login
		const loginSecondPlayer = getLoginSecondPlayer.login

		const getFiveQuestions = await this.pairQuizGameRepository.getFiveQuestions(true)

		return PairQuizGame.getUnfinishedGame(currentUnFinishedGame, loginFirstPlayer, loginSecondPlayer, getFiveQuestions)
	}

	async getGameById(id: string): Promise<GameTypeModel | null> {
		const getGameById: PairQuizGame = await this.pairQuezGame
			.findOneBy({id})

			if(!getGameById) return null

		// console.log("getGameById: ", getGameById)
		
		const getLoginFirstPlayer = await this.usersQueryRepository.findUserById(getGameById.firstPlayerProgressId)

		const getLoginSecondPlayer = await this.usersQueryRepository.findUserById(getGameById.secondPlayerProgressId)

		console.log("getLoginFirstPlayer: ", getLoginFirstPlayer)
		console.log("getLoginSecondPlayer: ", getLoginSecondPlayer)

		const loginFirstPlayer = getLoginFirstPlayer.login
		const loginSecondPlayer = getLoginSecondPlayer?.login

		const getFiveQuestions = await this.pairQuizGameRepository.getFiveQuestions(true)

		// const getQuestionId = await 

		return PairQuizGame.getGameById(getGameById, loginFirstPlayer, loginSecondPlayer, getFiveQuestions)
	}

	// async getUnfinishedGame(userId: string) {}

	// async getFirstPlayerByGameIdAndUserId(gameId: string, userId: string) {}

	// async getSecondPlayerByGameIdAndUserId(gameId: string, userId: string) {}

	// async getFirstPlayerByGameId(gameId: string) {}
}