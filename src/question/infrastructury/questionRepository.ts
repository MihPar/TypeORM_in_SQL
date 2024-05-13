import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../domain/entity.question';
import { Repository } from 'typeorm';
import { AnswerAndBodyClass } from '../dto/question.dto';

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectRepository(Question) public question: Repository<Question>,
	protected dataSource: DataSource

  ) {}

  async createQuestion(question: Question): Promise<Question | null> {
	try {
		const createQuestion = await this.dataSource.getRepository(Question).save(question);
		return createQuestion;
	} catch(err) {
		console.log(err, 'error in create question')
		return null
	}
  }

  async getQuestion(id: string): Promise<Question | null> {

	const findQuestion = await this.dataSource.getRepository(Question)
	.findOneBy({id})
	// const findQuestion = await this.question
	// 	.createQueryBuilder()
	// 	.select()
	// 	.where(`id = :id`, {id})
	// 	.getOne()
		// console.log("findQuestion: ", findQuestion)

	if(!findQuestion) return null
		return findQuestion
  }

  async deletById(id: string): Promise<boolean | null> {
	const deletedQuestion = await this.dataSource.getRepository(Question)
		.createQueryBuilder()
		.delete()
		.where(`id = :id`, {id})
		.execute()

		if(!deletedQuestion) return null
		return true
  }

  async udpatedQuestionById(DTO: AnswerAndBodyClass, id: string): Promise<boolean | null> {
	const updateQuestionById = await this.dataSource.getRepository(Question)
		.createQueryBuilder()
		.update()
		.set({body: DTO.body, correctAnswers: DTO.correctAnswers, updatedAt: new Date()})
		.where(`id = :id`, {id})
		.execute()

	if(!updateQuestionById) return null
		return true
  }

  async updatePublished(id: string, published: boolean): Promise<boolean> {
	const updatePublished = await this.dataSource.getRepository(Question)
		.createQueryBuilder()
		.update()
		.set({published: published, updatedAt: new Date()})
		.where(`id = :id`, {id})
		.execute()

		if(!updatePublished) return null
		return true
  }
}
