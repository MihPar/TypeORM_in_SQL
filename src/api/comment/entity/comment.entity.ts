import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { LikeForComment } from "../../likes/entity/likesForComment.entity";
import { Posts } from "../../posts/entity/entity.posts";

@Entity()
export class Comments {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column()
	content: string

	@CreateDateColumn()
	createdAt: Date

	@Column()
	userId: string

	@Column()
	userLogin: string

	@Column()
	likesCount: number

	@Column()
	dislikesCount: number

	@Column()
	postId: string

	@ManyToOne(() => Posts, p => p.comment)
	post: Posts

	@OneToMany(() => LikeForComment, lfc => lfc.comment)
	LikeForComment: LikeForComment
	
	@ManyToOne(() => User, u => u.comment)
	user: User
}