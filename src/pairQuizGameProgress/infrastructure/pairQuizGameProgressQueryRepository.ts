import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AnswersPlayer } from "../domain/entity.answersFirstPlayer";
import { PairQuizGameProgressPlayer } from "../domain/entity.pairQuizGameProgressFirstPlayer";

@Injectable()
export class PairQuizGameProgressQueryRepository {
	constructor(
		@InjectRepository(AnswersPlayer) protected readonly answersPlayer: Repository<AnswersPlayer>,
		
		@InjectRepository(PairQuizGameProgressPlayer) protected readonly pairQuizGameProgressPlayer: Repository<PairQuizGameProgressPlayer>,

	) {}
	async deleteAllAnswersFirstPlayer() {
		await this.answersPlayer
			.createQueryBuilder()
			.delete()
			.execute()
			return true
	}

	async deleteAllAnswersSecondPlayer() {
		await this.answersPlayer
			.createQueryBuilder()
			.delete()
			.execute()
			return true
	}

	async deleteAllPairQuizGameProgressFirstPlayerPlayer() {
		await this.pairQuizGameProgressPlayer
			.createQueryBuilder()
			.delete()
			.execute()
			return true
	}

	async deleteAllPairQuizGameProgressSecondPlayerPlayer() {
		await this.pairQuizGameProgressPlayer
			.createQueryBuilder()
			.delete()
			.execute()
			return true
	}

	async getQuestionByIdForFirstPlayer(userId: string): Promise<PairQuizGameProgressPlayer | null> {
		const getQuestion = await this.pairQuizGameProgressPlayer
			.createQueryBuilder()
			.select()
			.where(`"userFirstPlyerId" = :userId`, {userId})
			.getOne()

			if(!getQuestion) return null
			return getQuestion
	}

	async getQuestionByIdForSecondPlayer(userId: string): Promise<PairQuizGameProgressPlayer | null> {
		const getQuestion = await this.pairQuizGameProgressPlayer
			.createQueryBuilder()
			.select()
			.where(`"userSecondPlyerId" = :userId`, {userId})
			.getOne()

			if(!getQuestion) return null
			return getQuestion
	}

	async findAnswerFirstPlayer(progressId: string): Promise<AnswersPlayer | null> {
		const getAnswer = await this.answersPlayer
			.createQueryBuilder()
			.select()
			.where(`"progressId" = :progressId`, {progressId})
			.getOne()
			// .getOne()

			// console.log("getAnswer: ", getAnswer)

			if(!getAnswer) return null
			return getAnswer
	}

	async findAnswerSecondPlayer(progressId: string): Promise<AnswersPlayer | null> {
		const getAnswer = await this.answersPlayer
			.createQueryBuilder()
			.select()
			.where(`"progressId" = :progressId`, {progressId})
			.getOne()

			if(!getAnswer) return null
			return getAnswer
	}
}