import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Device {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column()
	ip: string

	@Column()
	title: string

	@Column()
	lastActiveDate: Date

	@ManyToOne(() => User, u => u.device, { onDelete: "CASCADE" })
	user: User

	@Column()
	userId: string
}

export type DeviceView = {
	ip: string
	title: string
	lastActiveDate: Date
	deviceId: string
}