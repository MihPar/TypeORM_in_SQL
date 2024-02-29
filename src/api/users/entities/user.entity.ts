import { Device } from "src/api/security-devices/entities/security-device.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserViewType } from "../user.type";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	login: string

	@Column()
	email: string

	@Column()
	createdAt: Date

	@Column({nullable: false})
	passwordHash: string

	@Column()
	expirationDate: Date

	@Column()
	confirmationCode: string

	@Column()
	isConfirmed: boolean = false

	@OneToMany(() => Device, d => d.user)
	device: Device[]
	
  getViewUser(): UserViewType {
    return {
      id: this.id.toString(),
      login: this.login,
      email: this.email,
      createdAt: this.createdAt,
    };
  }
}
