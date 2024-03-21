import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PendingSecondPlayer } from "../infrastructure/enum/enumPendingPlayer";

@Entity()
export class PairQuizGame {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	firstPlayerId: string

	@Column()
	secondPlayerId: string

	@Column()
	status: PendingSecondPlayer

	@CreateDateColumn()
	pairCreatedDate: Date

	@CreateDateColumn()
	startGemeDate: Date

	@CreateDateColumn()
	finishGameDate: Date
}

