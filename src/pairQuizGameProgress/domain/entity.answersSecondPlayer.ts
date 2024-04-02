import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PairQuizGameProgressSecondPlayer } from "./entity.pairQuizGameProgressSecondPlayer";
import { Question } from "../../question/domain/entity.question";
import { AnswerStatusEnum } from "../../pairQuizGame/enum/enumPendingPlayer";

@Entity()
export class AnswersSecondPlayer {
	@PrimaryGeneratedColumn()
	id: string

	@ManyToOne(() => PairQuizGameProgressSecondPlayer, p => p.answers)
	progress: PairQuizGameProgressSecondPlayer

	@Column()
	progressId: string

	@ManyToOne(() => Question, p => p.answersSecondPlayer)
	question: Question

	@Column({nullable: true})
	answers: string

	@Column({nullable: false})
	answerStatus : AnswerStatusEnum

	@Column()
	addedAt: Date
}