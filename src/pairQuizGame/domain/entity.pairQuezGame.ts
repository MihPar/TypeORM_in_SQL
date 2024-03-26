import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { GameStatus } from "../enum/enumPendingPlayer";
import { PairQuizGameProgressFirstPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressFirstPlayer";
import { PairQuizGameProgressSecondPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressSecondPlayer";
import { Question } from "../../question/domain/entity.question";

@Entity()
export class PairQuizGame {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@OneToOne(() => PairQuizGameProgressFirstPlayer, fpp => fpp.game)
	firstPlayerProgress: PairQuizGameProgressFirstPlayer

	@Column()
	firstPlayerId: string

	@OneToOne(() => PairQuizGameProgressSecondPlayer, spp => spp.game)
	secondPlayerProgress: PairQuizGameProgressSecondPlayer

	@Column()
	secondPlayerId: string

	@Column()
	status: GameStatus

	@CreateDateColumn()
	pairCreatedDate: Date

	@CreateDateColumn()
	startGameDate: Date

	@CreateDateColumn()
	finishGameDate: Date

	@ManyToMany(() => Question, q => q.games)
	@JoinTable()
	question: Question[]
}

