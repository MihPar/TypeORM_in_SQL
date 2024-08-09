import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Blogs } from "./blogs.entity";
import { SubscribeEnum } from "../enum/subscribeEnum";

@Entity()
export class Subscribe {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@ManyToOne(() => User, u => u.subscribe)
	user: User

	@Column()
	userId: string

	@ManyToOne(() => Blogs, b => b.subscribe)
	blog: Blogs

	@Column()
	blogId: string

	@Column()
	currentUserSubscriptionStatus: SubscribeEnum

	@Column()
	subscribersCount: number
}