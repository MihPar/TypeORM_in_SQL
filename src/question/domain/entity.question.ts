import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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