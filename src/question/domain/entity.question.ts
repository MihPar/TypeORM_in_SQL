import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PairQuizGame } from "../../pairQuizGame/domain/entity.pairQuezGame";

@Entity()
export class Question {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	body: string

	@Column()
	correctAnswers: string[]

	@Column()
	published: boolean

	@Column({nullable: true})
	createdAt: Date

	@Column({nullable: true})
	updatedAt: Date

	@ManyToMany(() => PairQuizGame, g => g.question)
	games: PairQuizGame[]

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