import { Device } from "src/api/security-devices/entities/security-device.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserViewType } from "../user.type";

@Entity()
export class User {
	constructor(
		public passwortdHash: string,
		public confirmationCode: string,
		public expirationDate: string,
		public isConfirmed: boolean = false
	){}

	@PrimaryGeneratedColumn()
	id: number

	@Column()
	login: string

	@Column()
	email: string

	@Column()
	createdAt: Date

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
