import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Posts } from "../../posts/entity/entity.posts";
import { LikeStatusEnum } from "../likes.emun";
import { User } from "../../users/entities/user.entity";

@Entity()
export class LikeForPost {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	myStatus: string

	@Column()
	addedAt: string

	@ManyToOne(() => User, u => u.likeForPost)
	user: User

	@Column()
	userId: number

	@Column()
	login: string

	@ManyToOne(() => Posts, lfp => lfp.extendedLikesInfo, {onDelete: "CASCADE" })
	post: Posts

	@Column()
	postId: number

}