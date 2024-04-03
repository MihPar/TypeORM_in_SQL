import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { AnswerStatusEnum } from "../../pairQuizGame/enum/enumPendingPlayer";
import { AnswersPlayer } from "./entity.answersFirstPlayer";

@Entity()
export class PairQuizGameProgressPlayer {
	@PrimaryGeneratedColumn('uuid')
	id: string

	// @OneToOne(() => PairQuizGame, g => g.firstPlayerProgress)
	// game: PairQuizGame

	@Column()
	gameId: string

	@ManyToOne(() => User, u => u.progressPlayer)
	user: User

	@Column({nullable: true})
	userId: string

	// @OneToMany(() => Question, q => q.progressFirstPlayer)
	// question: Question[]

	// @Column({nullable: true})
	// questionId: string

	@Column()
	addedAt: Date

	@Column({nullable: true})
	answerStatus: AnswerStatusEnum

	@Column({default: 0})
	score: number

	@Column({default: 0})
	bonus_score: number

	@OneToMany(() => AnswersPlayer, a => a.progress)
	answers: AnswersPlayer[]
}
