import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PairQuizGameProgressFirstPlayer } from "./entity.pairQuizGameProgressFirstPlayer";
import { Question } from "../../question/domain/entity.question";
import { AnswerStatusEnum } from "../../pairQuizGame/enum/enumPendingPlayer";

@Entity()
export class AnswersFirstPlayer {
	@PrimaryGeneratedColumn()
	id: string

	@ManyToOne(() => PairQuizGameProgressFirstPlayer, p => p.answers)
	progress: PairQuizGameProgressFirstPlayer

	@Column()
	progressId: string

	@ManyToOne(() => Question, p => p.answersFirstPlayer)
	question: Question

	@Column({nullable: true})
	answers: string

	@Column({nullable: false})
	answerStatus : AnswerStatusEnum

	@Column()
	addedAt: Date
}