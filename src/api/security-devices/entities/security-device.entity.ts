import { User } from "src/api/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Device {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	ip: string

	@Column()
	title: string

	@Column()
	lastActiveDate: string

	@Column()
	deviceId: string

	@ManyToOne(() => User, u => u.device)
	user: User

	@Column()
	userId: string
}
