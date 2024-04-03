import { LikeForComment } from './../../likes/entity/likesForComment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserViewType } from "../user.type";
import { Device } from "../../security-devices/entities/security-device.entity";
import { LikeForPost } from "../../likes/entity/likesForPost.entity";
import { Blogs } from "../../blogs/entity/blogs.entity";
import { Posts } from "../../posts/entity/entity.posts";
import { Comments } from "../../comment/entity/comment.entity";
import { PairQuizGameProgressPlayer } from '../../pairQuizGameProgress/domain/entity.pairQuizGameProgressFirstPlayer';

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column()
	login: string

	@Column()
	email: string

	@Column()
	createdAt: Date

	@Column()
	passwordHash: string

	@Column()
	expirationDate: Date

	@Column()
	confirmationCode: string

	@Column()
	isConfirmed: boolean = false

	@OneToMany(() => Blogs, b => b.user)
	blog: Blogs

	@OneToMany(() => Posts, p => p.user)
	post: Posts

	@OneToMany(() => Comments, c => c.user)
	comment: Comments

	@OneToMany(() => LikeForPost, lfp => lfp.user)
	likeForPost: LikeForPost

	@OneToMany(() => Device, d => d.user, { onDelete: "CASCADE" })
	device: Device[]

	@OneToMany(() => LikeForComment, c => c.user)
	likeForComment: LikeForComment
	
	@Column({nullable: true, default: "None"})
	LikeForComment: string

	@OneToMany(() => PairQuizGameProgressPlayer, pqg => pqg.user)
	progressPlayer: PairQuizGameProgressPlayer[]

	// @OneToMany(() => PairQuizGameProgressSecondPlayer, pqg => pqg.userSecondPlyer)
	// progressSecondPlayer: PairQuizGameProgressSecondPlayer[]

  static getViewUser(user: User): UserViewType {
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
