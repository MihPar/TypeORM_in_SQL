import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { Repository } from "typeorm";

@Injectable()
export class PairQuezGameQueryRepository {
	constructor(
		@InjectRepository(PairQuizGame) protected readonly pairQuezGame: Repository<PairQuizGame>
	) {}
	async getCurrentUnFinGame(userId) {
		const getCurrentUnFinGame = await this.pairQuezGame
			.createQueryBuilder()
			.select()
			.where(`userId = :userId`, {userId})
	}

	async getGameById(id: string, userId: string) {}

	async getUnfinishedGame(userId: string) {}

	async getFirstPlayerByGameIdAndUserId(gameId: string, userId: string) {}

	async getSecondPlayerByGameIdAndUserId(gameId: string, userId: string) {}

	async getFirstPlayerByGameId(gameId: string) {}
}