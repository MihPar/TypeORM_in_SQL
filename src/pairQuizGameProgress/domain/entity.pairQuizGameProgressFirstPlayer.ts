import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "../../question/domain/entity.question";
import { User } from "../../users/entities/user.entity";
import { PairQuizGame } from "../../pairQuizGame/domain/entity.pairQuezGame";
import { AnswerStatusEnum } from "../../pairQuizGame/enum/enumPendingPlayer";

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

	@Column()
	answerStatus: AnswerStatusEnum

	@Column({default: 0})
	score: number

	@Column({default: 0})
	bonus_score: number
}
