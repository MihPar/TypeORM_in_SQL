import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserViewType } from "../user.type";
import { Device } from "../../security-devices/entities/security-device.entity";

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column()
	login: string

	@Column()
	email: string

	@Column()
	createdAt: Date

	@Column()
	passwordHash: string

	@Column()
	expirationDate: Date

	@Column()
	confirmationCode: string

	@Column()
	isConfirmed: boolean = false

	@OneToMany(() => Device, d => d.user, { onDelete: "CASCADE" })
	device: Device[]
	
  static getViewUser(user: User): UserViewType {
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
