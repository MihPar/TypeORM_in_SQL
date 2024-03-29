import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PairQuizGameProgressFirstPlayer } from "./entity.pairQuizGameProgressFirstPlayer";
import { Question } from "../../question/domain/entity.question";

@Entity()
export class AnswersFirstPlayer {
	@PrimaryGeneratedColumn()
	id: string

	@ManyToOne(() => PairQuizGameProgressFirstPlayer, p => p.answers)
	progress: PairQuizGameProgressFirstPlayer

	@ManyToOne(() => Question, p => p.answersFirstPlayer)
	question: Question

	@Column({nullable: true})
	answers: string

	@Column({nullable: false})
	answerStatus : string

	@Column()
	addedAt: Date
}