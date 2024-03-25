import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Question } from "../domain/entity.question";
import { Repository } from "typeorm";
import { QuestionType } from "../question.type";

@Injectable()
export class QuestionQueryRepository {
	constructor(
		@InjectRepository(Question) protected readonly question: Repository<Question>
	) {}
	async findAllQuestions(
		bodySearchTerm: string,
		publishedStatus: string,
		sortBy: string,
		sortDirection: string,
		pageNumber: string,
		pageSize: string,
	) {
		const getAllQuestions = await this.question
			.createQueryBuilder()
			.select()
			.where(`body ILIKE :bodySearchTerm AND published ILIKE :publishedStatus`, {bodySearchTerm: `${bodySearchTerm}`, publishedStatus: `${publishedStatus}`})
			.orderBy(`${sortBy}`, `${sortDirection.toUpperCase() === "ASC" ? "ASC" : "DESC"}`)
			.limit(+pageSize)
			.offset((+pageNumber - 1) * +pageSize)
			.getMany()

		const getTotalCountAllQuestons = await this.question
			.createQueryBuilder()
			.where(`body ILIKE :bodySearchTerm AND published ILIKE :publishedStatus`, {bodySearchTerm: `${bodySearchTerm}`, publishedStatus: `${publishedStatus}`})
			.getCount()

		const pageCount = Math.ceil(getTotalCountAllQuestons/+pageSize)

		return {
			pagesCount: pageCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount: getTotalCountAllQuestons,
			items: getAllQuestions.map((question: Question): QuestionType => ({
				id: question.id,
				body: question.body,
				correctAnswers: [
					question.currentAnswers
				],
				published: question.published,
				createdAt: question.createdAt,
				updatedAt: question.updatedAt,
			}))
		}
	}
}