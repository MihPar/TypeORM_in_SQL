import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { GameStatus } from "../enum/enumPendingPlayer";

@Entity()
export class PairQuizGame {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	firstPlayerId: string

	@Column()
	secondPlayerId: string

	@Column()
	status: GameStatus

	@CreateDateColumn()
	pairCreatedDate: Date

	@CreateDateColumn()
	startGemeDate: Date

	@CreateDateColumn()
	finishGameDate: Date
}

