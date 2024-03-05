import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comments } from "../../comment/entity/comment.entity";

@Entity()
export class LikeForComment {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	myStatus: string

	@Column()
	commentId: number

	@ManyToOne(() => Comments, c => c.LikeForComment)
	comment: Comments
}