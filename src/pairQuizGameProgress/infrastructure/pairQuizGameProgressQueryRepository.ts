import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AnswersFirstPlayer } from "../domain/entity.answersFirstPlayer";
import { Repository } from "typeorm";
import { AnswersSecondPlayer } from "../domain/entity.answersSecondPlayer";
import { PairQuizGameProgressFirstPlayer } from "../domain/entity.pairQuizGameProgressFirstPlayer";
import { PairQuizGameProgressSecondPlayer } from "../domain/entity.pairQuizGameProgressSecondPlayer";

@Injectable()
export class PairQuizGameProgressQueryRepository {
	constructor(
		@InjectRepository(AnswersFirstPlayer) protected readonly answersFirstPlayer: Repository<AnswersFirstPlayer>,
		@InjectRepository(AnswersSecondPlayer) protected readonly answersSecondPlayer: Repository<AnswersSecondPlayer>,

		@InjectRepository(PairQuizGameProgressFirstPlayer) protected readonly pairQuizGameProgressFirstPlayer: Repository<PairQuizGameProgressFirstPlayer>,

		@InjectRepository(PairQuizGameProgressSecondPlayer) protected readonly pairQuizGameProgressSecondPlayer: Repository<PairQuizGameProgressSecondPlayer>
	) {}
	async deleteAllAnswersFirstPlayer() {
		await this.answersFirstPlayer
			.createQueryBuilder()
			.delete()
			.execute()
			return true
	}

	async deleteAllAnswersSecondPlayer() {
		await this.answersSecondPlayer
			.createQueryBuilder()
			.delete()
			.execute()
			return true
	}

	async deleteAllPairQuizGameProgressFirstPlayerPlayer() {
		await this.pairQuizGameProgressFirstPlayer
			.createQueryBuilder()
			.delete()
			.execute()
			return true
	}

	async deleteAllPairQuizGameProgressSecondPlayerPlayer() {
		await this.pairQuizGameProgressSecondPlayer
			.createQueryBuilder()
			.delete()
			.execute()
			return true
	}

}