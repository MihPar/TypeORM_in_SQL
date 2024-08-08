import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Telegramm {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@ManyToOne(() => User, u => u.telegram)
	user: User

	@Column()
	userId: string

	@Column()
	code: string
}