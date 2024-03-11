import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Posts } from "../../posts/entity/entity.posts";
import { LikeStatusEnum } from "../likes.emun";
import { User } from "../../users/entities/user.entity";

@Entity()
export class LikeForPost {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column()
	myStatus: string

	@CreateDateColumn()
	addedAt: Date

	@ManyToOne(() => User, u => u.likeForPost)
	user: User

	@Column()
	userId: string

	@Column()
	login: string

	@ManyToOne(() => Posts, lfp => lfp.extendedLikesInfo, {onDelete: "CASCADE" })
	post: Posts

	@Column()
	postId: string

}