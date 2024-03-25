import { Injectable } from "@nestjs/common";

@Injectable()
export class QuestionQueryRepository {
	async findAllQuestions(
		bodySearchTerm: string,
		publishedStatus: string,
		sortBy: string,
		sortDirection: string,
		pageNumber: string,
		pageSize: string,
	) {

	}
}