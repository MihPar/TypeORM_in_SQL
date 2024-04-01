import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PairQuizGame } from "../../pairQuizGame/domain/entity.pairQuezGame";
import { PairQuizGameProgressFirstPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressFirstPlayer";
import { PairQuizGameProgressSecondPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressSecondPlayer";
import { AnswersFirstPlayer } from "../../pairQuizGameProgress/domain/entity.answersFirstPlayer";
import { AnswersSecondPlayer } from "../../pairQuizGameProgress/domain/entity.answersSecondPlayer";

@Entity()
export class Question {
	map(arg0: (item: any) => { body: any; id: any; }): import("../../pairQuizGame/type/typeViewModel").QuestionType[] {
		throw new Error("Method not implemented.");
	}
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

	@ManyToOne(() => PairQuizGameProgressFirstPlayer, p => p.question)
	progressFirstPlayer: PairQuizGameProgressFirstPlayer

	@ManyToOne(() => PairQuizGameProgressSecondPlayer, p => p.question)
	progressSecondPlayer: PairQuizGameProgressSecondPlayer

	@OneToMany(() => AnswersFirstPlayer, a => a.question)
	answersFirstPlayer: AnswersFirstPlayer

	@OneToMany(() => AnswersSecondPlayer, a => a.question)
	answersSecondPlayer: AnswersSecondPlayer

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