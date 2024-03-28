import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PairQuizGameProgressFirstPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressFirstPlayer";
import { PairQuizGameProgressSecondPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressSecondPlayer";
import { Question } from "../../question/domain/entity.question";
import { GameStatusEnum } from "../enum/enumPendingPlayer";

@Entity()
export class PairQuizGame {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@OneToOne(() => PairQuizGameProgressFirstPlayer, fpp => fpp.game)
	firstPlayerProgress: PairQuizGameProgressFirstPlayer

	@Column()
	firstPlayerId: string

	@OneToOne(() => PairQuizGameProgressSecondPlayer, spp => spp.game, {nullable: true})
	secondPlayerProgress: PairQuizGameProgressSecondPlayer

	@Column({nullable: true})
	secondPlayerId: string

	@Column()
	status: GameStatusEnum

	@CreateDateColumn({nullable: true})
	pairCreatedDate: Date

	@CreateDateColumn({nullable: true})
	startGameDate: Date

	@CreateDateColumn({nullable: true})
	finishGameDate: Date

	@ManyToMany(() => Question, q => q.games, {nullable: true})
	@JoinTable()
	question: Question[]
}

