import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GameQuestion } from "../../pairQuizGameProgress/domain/entity.gameQuestion";

@Entity()
export class Question {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	body: string

	@Column({nullable: true})
	correctAnswers: string[]

	@Column()
	published: boolean

	@Column({nullable: true})
	createdAt: Date

	@Column({nullable: true})
	updatedAt: Date

	@OneToOne(() => GameQuestion, q => q.question)
	questionGame: GameQuestion

	static createQuestion(item: Question) {
		return {
			id: item.id,
			body: item.body,
			correctAnswers: item.correctAnswers,
			published: item.published,
			createdAt: item.createdAt,
			updatedAt: item.updatedAt
		}
	}
}