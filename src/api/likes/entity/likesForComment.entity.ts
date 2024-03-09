import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comments } from "../../comment/entity/comment.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class LikeForComment {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column()
	myStatus: string

	@Column()
	addedAt: Date

	@Column()
	commentId: string

	@ManyToOne(() => Comments, c => c.LikeForComment)
	comment: Comments

	@ManyToOne(() => User, u => u.likeForComment)
	user: User

	@Column()
	userId: string
}