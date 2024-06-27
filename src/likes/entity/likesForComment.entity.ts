import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comments } from "../../comment/entity/comment.entity";
import { User } from "../../users/entities/user.entity";
import { LikeStatusEnum } from "../likes.emun";

@Entity()
export class LikeForComment {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column()
	myStatus: LikeStatusEnum

	@Column()
	addedAt: Date

	@Column()
	commentId: string

	@Column({ nullable: true })
	isBanned: boolean;

	@ManyToOne(() => Comments, c => c.LikeForComment)
	comment: Comments

	@ManyToOne(() => User, u => u.likeForComment)
	user: User

	@Column()
	userId: string
}