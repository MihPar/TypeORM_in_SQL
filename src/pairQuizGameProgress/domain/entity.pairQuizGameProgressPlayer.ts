import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { AnswerStatusEnum } from "../../pairQuizGame/enum/enumPendingPlayer";
import { AnswersPlayer } from "./entity.answersPlayer";
import { Question } from "../../question/domain/entity.question";
import { PairQuizGame } from "../../pairQuizGame/domain/entity.pairQuezGame";

@Entity()
export class PairQuizGameProgressPlayer {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@OneToOne(() => PairQuizGame)
	game: PairQuizGame

	@Column({nullable: true})
	gameId: string

	@ManyToOne(() => User, u => u.progressPlayer)
	user: User

	@Column({nullable: true})
	userId: string

	@OneToMany(() => Question, q => q.progressPlayer)
	question: Question

	@Column({nullable: true})
	questionId: string

	// `@Column()
	// questionNumber: number`

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

	// @Column({nullable: true})
	// answerFinishDate: Date

	addAnswer(answer: string) {
		if(this.question.correctAnswers.includes(answer)) {
			this.answerStatus = AnswerStatusEnum.Correct
			this.score = 2
		} else {
			this.answerStatus = AnswerStatusEnum.InCorrect
		}
		this.addedAt = new Date()
	}
}
