import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Question } from "../domain/entity.question";
import { Repository } from "typeorm";
import { QuestionType } from "../question.type";
import { PaginationType } from "../../types/pagination.types";

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
	): Promise<PaginationType<QuestionType>> {

		const getAllQuestionsQuery =  this.question
			.createQueryBuilder()
			.select()
			.where(`body ILIKE :bodySearchTerm`, {bodySearchTerm: `%${bodySearchTerm}%`})
			.orderBy(`"${sortBy}"`, `${sortDirection.toUpperCase() === "ASC" ? "ASC" : "DESC"}`)
			.limit(+pageSize)
			.offset((+pageNumber - 1) * +pageSize)

if (publishedStatus !== 'all') {
  getAllQuestionsQuery.andWhere(`published = :publishedStatus`, {
    publishedStatus: publishedStatus === 'published' ? true : false,
  });
}
const getAllQuestions = await getAllQuestionsQuery.getMany();

const getTotalCountAllQuestonsQuery = this.question
  .createQueryBuilder()
  .where(`body ILIKE :bodySearchTerm`, { bodySearchTerm: `${bodySearchTerm}` });

if (publishedStatus !== 'all') {
	getTotalCountAllQuestonsQuery.andWhere(`published = :publishedStatus`, {
    publishedStatus: publishedStatus === 'published' ? true : false,
  });
}
const getTotalCountAllQuestons = await getTotalCountAllQuestonsQuery.getCount();

const pageCount = Math.ceil(getTotalCountAllQuestons / +pageSize);

		return {
			pagesCount: pageCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount: getTotalCountAllQuestons,
			items: getAllQuestions.map((question: Question): QuestionType => ({
				id: question.id,
				body: question.body,
				correctAnswers: question.correctAnswers,
				published: question.published,
				createdAt: question.createdAt,
				updatedAt: question.updatedAt,
			}))
		}
	}

	async getQuestionById(gameQuestionId) {}
}