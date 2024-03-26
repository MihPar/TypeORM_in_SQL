import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AnswerStatus } from "../../pairQuizGame/enum/enumPendingPlayer";
import { Question } from "../../question/domain/entity.question";
import { User } from "../../users/entities/user.entity";
import { GameQuestion } from "./entity.gameQuestion";

@Entity()
export class PairQuizGameProgress {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	gameId: string

	@ManyToOne(() => User, u => u.progress)
	user: User

	@Column()
	userId: string

	@OneToMany(() => GameQuestion, q => q.progress)
	gameQuestion: GameQuestion

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
