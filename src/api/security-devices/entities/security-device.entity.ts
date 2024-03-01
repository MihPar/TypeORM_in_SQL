import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

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
	userId: number
}

export type DeviceView = {
	ip: string
	title: string
	lastActiveDate: Date
	deviceId: number
}