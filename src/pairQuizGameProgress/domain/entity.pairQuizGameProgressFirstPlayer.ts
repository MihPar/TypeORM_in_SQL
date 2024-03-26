import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AnswerStatus } from "../../pairQuizGame/enum/enumPendingPlayer";
import { Question } from "../../question/domain/entity.question";
import { User } from "../../users/entities/user.entity";
import { PairQuizGame } from "../../pairQuizGame/domain/entity.pairQuezGame";

@Entity()
export class PairQuizGameProgressFirstPlayer {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@OneToOne(() => PairQuizGame, g => g.firstPlayerProgress)
	game: PairQuizGame

	@Column()
	gameId: string

	@ManyToOne(() => User, u => u.progressFirstPlayer)
	userFirstPlyer: User

	@Column()
	userFirstPlyerId: string

	@Column()
	userId: string

	// @OneToMany(() => GameQuestion, q => q.progress)
	// gameQuestion: GameQuestion

	// @Column()
	// questionId: string

	// @Column()
	// questionNumber: string

	// @CreateDateColumn()
	// addedAt: Date

	@Column()
	answerStatus: AnswerStatus

	@Column({default: 0})
	score: number

	@Column({default: 0})
	bonus_score: number
}
