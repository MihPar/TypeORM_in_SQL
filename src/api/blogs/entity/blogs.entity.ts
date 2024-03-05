import { Cipher } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}