import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Blogs } from "./blogs.entity";
import { Posts } from "../../posts/entity/entity.posts";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Wallpaper {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({nullable: true})
	url: string

	@Column({nullable: true})
	width: number

	@Column({nullable: true})
	height: number

	@Column({nullable: true})
	fileSize: number
	
	@ManyToOne(() => Blogs, b => b.wallpaper)
	blog: Blogs

	@Column({nullable: true})
	blogId: string

	@ManyToOne(() => Posts, p => p.wallpaper)
	post: Posts

	@Column({nullable: true})
	postId: string

	@ManyToOne(() => User, u => u.wallpaper)
	user: User
}