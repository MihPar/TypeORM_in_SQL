import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Telegramm {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@OneToOne(() => User, u => u.telegramm)
	@JoinColumn()
	user: User

	@Column()
	userId: string

	@Column()
	code: string
}