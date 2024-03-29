import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PairQuizGameProgressSecondPlayer } from "./entity.pairQuizGameProgressSecondPlayer";
import { Question } from "../../question/domain/entity.question";

@Entity()
export class AnswersSecondPlayer {
	@PrimaryGeneratedColumn()
	id: string

	@ManyToOne(() => PairQuizGameProgressSecondPlayer, p => p.answers)
	progress: PairQuizGameProgressSecondPlayer

	@ManyToOne(() => Question, p => p.answersSecondPlayer)
	question: Question

	@Column({nullable: true})
	answers: string
}