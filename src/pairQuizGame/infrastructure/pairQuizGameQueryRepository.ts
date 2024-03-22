import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { Repository } from "typeorm";

@Injectable()
export class PairQuezGameQueryRepository {
	constructor(
		@InjectRepository(PairQuizGame) protected readonly pairQuezGame: Repository<PairQuizGame>
	) {}
	async getCurrentUnFinGame() {
		const getCurrentUnFinGame = await this.pairQuezGame
			.createQueryBuilder()
			.select()
	}
}