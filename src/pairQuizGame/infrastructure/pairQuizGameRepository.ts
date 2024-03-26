import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Question } from "../../question/domain/entity.question";
import { Repository } from "typeorm";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { PairQuizGameProgressFirstPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressFirstPlayer";
import { PairQuizGameProgressSecondPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressSecondPlayer";

@Injectable()
export class PairQuizGameRepository {
	constructor(
		@InjectRepository(Question) protected readonly question: Repository<Question>,
		@InjectRepository(PairQuizGame) protected readonly pairQuizGame: Repository<PairQuizGame>,
		@InjectRepository(PairQuizGameProgressFirstPlayer) protected readonly pairQuizGameProgressFirstPlayer: Repository<PairQuizGameProgressFirstPlayer>,
		@InjectRepository(PairQuizGameProgressSecondPlayer) protected readonly pairQuizGameProgressSecondPlayer: Repository<PairQuizGameProgressFirstPlayer>
	) {}
	async connectionOrCreatePairQuizGame(userId: string) {
		const createOrConnect = await this.pairQuizGame
			.createQueryBuilder()
			.leftJoinAndSelect()
	}
}