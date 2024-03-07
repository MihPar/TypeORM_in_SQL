import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comments } from "../../comment/entity/comment.entity";

@Entity()
export class LikeForComment {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column()
	myStatus: string

	@Column()
	commentId: string

	@ManyToOne(() => Comments, c => c.LikeForComment)
	comment: Comments
}