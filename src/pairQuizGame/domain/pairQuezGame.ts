import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PairQuizGame {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	firstPlayerId: string

	@Column()
	secondPlayerId: string

	@Column()
	status: 
}

export enum PendingSecondPlayer {
	PendingSecondPlayer = "PendingSecondPlayer"
}