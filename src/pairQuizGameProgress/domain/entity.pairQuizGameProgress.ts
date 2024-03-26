import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AnswerStatus } from "../../pairQuizGame/enum/enumPendingPlayer";
import { Question } from "../../question/domain/entity.question";

@Entity()
export class PairQuizGameProgress {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	gameId: string

	@Column()
	userId: string

	@OneToMany(() => Question, q => q.id)
	question: Question

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
