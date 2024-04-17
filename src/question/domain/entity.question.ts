import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PairQuizGame } from "../../pairQuizGame/domain/entity.pairQuezGame";
import { PairQuizGameProgressPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer";
import { AnswersPlayer } from "../../pairQuizGameProgress/domain/entity.answersPlayer";
import { QuestionGame } from "../../pairQuizGame/domain/entity.questionGame";

@Entity()
export class Question {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	body: string

	@Column("varchar", {array: true, nullable: false, default : []})
	correctAnswers: string[]

	@Column()
	published: boolean

	@Column()
	createdAt: Date

	@Column({nullable: true})
	updatedAt: Date

	@ManyToMany(() => QuestionGame, questionGame => questionGame.question)
	questionGame: QuestionGame

	@ManyToOne(() => PairQuizGameProgressPlayer)
	progressFirstPlayer: PairQuizGameProgressPlayer

	@ManyToOne(() => PairQuizGameProgressPlayer)
	progressSecondPlayer: PairQuizGameProgressPlayer

	@OneToMany(() => AnswersPlayer, a => a.question)
	answersPlayer: AnswersPlayer

	@OneToMany(() => PairQuizGameProgressPlayer, a => a.question)
	progressPlayer: PairQuizGameProgressPlayer

	static createQuestion(item: Question) {
		return {
			id: item.id,
			body: item.body,
			correctAnswers: item.correctAnswers,
			published: item.published,
			createdAt: item.createdAt,
			updatedAt: item.updatedAt
		}
	}
}