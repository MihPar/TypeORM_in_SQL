import { Cipher } from "crypto";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

	@Column()
	createdAt: string

	@Column()
	isMembership: boolean

	@ManyToOne(() => User, u => u.blog)
	user: User

	@Column()
	userId: number

	@OneToMany(() => Posts, p => p.blog)
	post: Posts[]

	static createNewBlogForSA(inputBlog: Blogs) {
		return {
			id: inputBlog.id,
			name: inputBlog.name,
			description: inputBlog.description,
			websiteUrl: inputBlog.websiteUrl,
			createdAt: inputBlog.createdAt,
			isMembership: inputBlog.isMembership,
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
			id: inputBlog.id,
			name: inputBlog.name,
			description: inputBlog.description,
			websiteUrl: inputBlog.websiteUrl,
			createdAt: inputBlog.createdAt,
			isMembership: inputBlog.isMembership,
			userId: inputBlog.userId
		}
	}
}