import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PendingSecondPlayer } from "../../pairQuizGame/infrastructure/enum/enumPendingPlayer";

@Entity()
export class PairQuizGameProgress {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	gameId: string

	@Column()
	userId: string

	@Column()
	questionId: string

	@Column()
	questionNumber: string

	@CreateDateColumn()
	addedAt: Date

	@Column()
	answerStatus: PendingSecondPlayer

	@Column({default: 0})
	score: number

	@Column({default: 0})
	bonus_score: number
}
