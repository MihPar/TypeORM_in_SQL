import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PairQuizGame } from "./entity.pairQuezGame";
import { Question } from "../../question/domain/entity.question";

@Entity()
export class QuestionGame {
	@PrimaryGeneratedColumn()
	id: string

	@ManyToOne(() => PairQuizGame, g => g.questionGames)
	pairQuizGame: PairQuizGame

	@Column()
	pairQuizGameId: string

	@ManyToOne(() => Question, q => q.questionGame)
	question: Question

	@Column()
	index: number
}