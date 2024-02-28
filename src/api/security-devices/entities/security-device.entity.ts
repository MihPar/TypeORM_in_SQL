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
	lastActiveDate: Date

	@ManyToOne(() => User, u => u.device)
	user: User

	@Column()
	userId: string
}

export type DeviceView = {
	ip: string
	title: string
	lastActiveDate: Date
	deviceId: number
}