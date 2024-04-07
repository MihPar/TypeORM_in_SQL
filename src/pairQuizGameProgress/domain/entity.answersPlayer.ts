import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "../../question/domain/entity.question";
import { AnswerStatusEnum } from "../../pairQuizGame/enum/enumPendingPlayer";
import { PairQuizGameProgressPlayer } from "./entity.pairQuizGameProgressPlayer";
import { AnswerType } from "../../pairQuizGame/type/typeViewModel";

@Entity()
export class AnswersPlayer {
	@PrimaryGeneratedColumn()
	id: string

	@ManyToOne(() => PairQuizGameProgressPlayer, p => p.answers)
	progress: PairQuizGameProgressPlayer

	@Column()
	progressId: string

	@ManyToOne(() => Question, p => p.answersPlayer)
	question: Question

	@Column({nullable: true})
	answer: string

	@Column({nullable: false})
	answerStatus : AnswerStatusEnum

	@Column()
	addedAt: Date

	static getViewModelForGame(answer : AnswersPlayer) : AnswerType {
		return {
			questionId: answer.question.id,
			answerStatus: answer.answerStatus,
    		addedAt: answer.addedAt
		}
	}
		
	
}