import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AnswerStatus } from "../../pairQuizGame/enum/enumPendingPlayer";
import { Question } from "../../question/domain/entity.question";
import { User } from "../../users/entities/user.entity";
import { PairQuizGame } from "../../pairQuizGame/domain/entity.pairQuezGame";

@Entity()
export class PairQuizGameProgressSecondPlayer {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@OneToOne(() => PairQuizGame, g => g.secondPlayerProgress)
	game: PairQuizGame

	@Column()
	gameId: string

	@ManyToOne(() => User, u => u.progressSecondPlayer)
	userSecondPlyer: User

	@Column()
	userSecondPlyerId: string

	@Column()
	answerStatus: AnswerStatus

	@Column({default: 0})
	score: number

	@Column({default: 0})
	bonus_score: number
}
