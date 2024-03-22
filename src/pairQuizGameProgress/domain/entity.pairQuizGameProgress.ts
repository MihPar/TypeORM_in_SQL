import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AnswerStatus } from "../../pairQuizGame/infrastructure/enum/enumPendingPlayer";

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
	answerStatus: AnswerStatus

	@Column({default: 0})
	score: number

	@Column({default: 0})
	bonus_score: number
}
