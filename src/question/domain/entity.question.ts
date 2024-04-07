import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PairQuizGame } from "../../pairQuizGame/domain/entity.pairQuezGame";
import { PairQuizGameProgressPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer";
import { AnswersPlayer } from "../../pairQuizGameProgress/domain/entity.answersPlayer";

@Entity()
export class Question {
	// map(arg0: (item: any) => { body: any; id: any; }): import("../../pairQuizGame/type/typeViewModel").QuestionType[] {
	// 	throw new Error("Method not implemented.");
	// }
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

	@ManyToMany(() => PairQuizGame, g => g.question)
	games: PairQuizGame[]

	@ManyToOne(() => PairQuizGameProgressPlayer)
	progressFirstPlayer: PairQuizGameProgressPlayer

	@ManyToOne(() => PairQuizGameProgressPlayer)
	progressSecondPlayer: PairQuizGameProgressPlayer

	@OneToMany(() => AnswersPlayer, a => a.question)
	answersPlayer: AnswersPlayer

	// @OneToMany(() => AnswersPlayer, a => a.question)
	// answersSecondPlayer: AnswersPlayer

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