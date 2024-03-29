import { Injectable } from "@nestjs/common";
import { PairQuizGameProgressFirstPlayer } from "../domain/entity.pairQuizGameProgressFirstPlayer";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PairQuizGameProgressSecondPlayer } from "../domain/entity.pairQuizGameProgressSecondPlayer";

@Injectable()
export class PairQuizGameProgressRepository {
	constructor(
		@InjectRepository(PairQuizGameProgressFirstPlayer) protected readonly pairQuizGameProgressFirstPlayer: Repository<PairQuizGameProgressFirstPlayer>
	) {}
	async createProgress(progressFirstPlayer: PairQuizGameProgressFirstPlayer) {
		const createProgressFirstPlayer = await this.pairQuizGameProgressFirstPlayer.save(progressFirstPlayer)
		return createProgressFirstPlayer
	}

	async createProgressForSecondPlayer(progressSecondPlayer: PairQuizGameProgressSecondPlayer) {
		const createProgressSecondPlayer = await this.pairQuizGameProgressFirstPlayer.save(progressSecondPlayer)
		return createProgressSecondPlayer
	}

	
}