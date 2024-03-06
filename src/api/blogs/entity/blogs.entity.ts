import { Cipher } from "crypto";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Posts } from "../../posts/entity/entity-posts";
import { BlogsViewType } from "../blogs.type";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Blogs {
	@PrimaryGeneratedColumn()
	id: number
	
	@Column()
	name: string

	@Column()
	description: string

	@Column()
	websiteUrl: string

	@CreateDateColumn()
	createdAt: Date

	@Column()
	isMembership: boolean

	@ManyToOne(() => User, u => u.blog)
	user: User

	@Column({nullable: true})
	userId: number

	@OneToMany(() => Posts, p => p.blog)
	post: Posts[]

	static createNewBlogForSA(inputBlog: Blogs) {
		return {
			id: inputBlog.id.toString(),
			name: inputBlog.name,
			description: inputBlog.description,
			websiteUrl: inputBlog.websiteUrl,
			createdAt: inputBlog.createdAt,
			isMembership: false
		}
	}

	static getBlogViewModel(item ): BlogsViewType {
			return {
			id: item.id,
			name: item.name,
			description: item.description,
			websiteUrl: item.websiteUrl,
			createdAt: item.createdAt,
			isMembership: item.isMembership
			}
	}

	static getBlogsViewModel(inputBlog: Blogs) {
		return {
			id: inputBlog.id.toString(),
			name: inputBlog.name,
			description: inputBlog.description,
			websiteUrl: inputBlog.websiteUrl,
			createdAt: inputBlog.createdAt,
			isMembership: inputBlog.isMembership,
			userId: inputBlog.userId
		}
	}
}