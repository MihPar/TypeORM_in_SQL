import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserViewType } from "../user.type";
import { Device } from "../../security-devices/entities/security-device.entity";
import { LikeForPost } from "../../likes/entity/likesForPost-entity";
import { Blogs } from "../../blogs/entity/blogs.entity";
import { Posts } from "../../posts/entity/entity-posts";
import { Comments } from "../../comment/entity/comment.entity";

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

	// @Column({nullable: true})
	// postId: number

	@OneToMany(() => Posts, p => p.user)
	post: Posts

	// @Column()
	// commentId: number

	@OneToMany(() => Comments, c => c.user)
	comment: Comments

	@OneToMany(() => LikeForPost, lfp => lfp.user)
	likeForPost: LikeForPost

	@OneToMany(() => Device, d => d.user, { onDelete: "CASCADE" })
	device: Device[]
	
  static getViewUser(user: User): UserViewType {
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
