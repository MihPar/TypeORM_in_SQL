import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { LikeForComment } from "../../likes/entity/likesForComment-entity";

@Entity()
export class Comments {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	content: string

	@CreateDateColumn()
	createdAt: Date

	@Column()
	userId: number

	@Column()
	likesCount: number

	@Column()
	dislikesCount: number

	@OneToMany(() => LikeForComment, lfc => lfc.comment)
	LikeForComment: LikeForComment
	
	@ManyToOne(() => User, u => u.comment)
	user: User
}