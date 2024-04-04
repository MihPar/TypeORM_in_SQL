import { Injectable } from "@nestjs/common";
import { PairQuizGameProgressPlayer } from "../domain/entity.pairQuizGameProgressFirstPlayer";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PairQuizGameProgressRepository {
	constructor(
		@InjectRepository(PairQuizGameProgressPlayer) protected readonly pairQuizGameProgressPlayer: Repository<PairQuizGameProgressPlayer>,
	) {}
	async createProgressFirstPlayer(progressFirstPlayer: PairQuizGameProgressPlayer) {
		const createProgressFirstPlayer = await this.pairQuizGameProgressPlayer.save(progressFirstPlayer)
		return createProgressFirstPlayer
	}

	async updateProgressFirstPlayer(gameId: string) {
		const updateProgress = await this.pairQuizGameProgressPlayer
			.createQueryBuilder()
			.update()
			.set({gameId})
			.execute()
			return updateProgress
	}

	async createProgressForSecondPlayer(progressSecondPlayer: PairQuizGameProgressPlayer) {
		const createProgressSecondPlayer = await this.pairQuizGameProgressPlayer.save(progressSecondPlayer)
		return createProgressSecondPlayer
	}

	
}