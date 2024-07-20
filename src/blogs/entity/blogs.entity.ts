import { MinLength } from 'class-validator';
import { MaxLength } from 'class-validator';
import { FromEnvInit } from './../../../node_modules/@aws-sdk/credential-provider-env/dist-types/fromEnv.d';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Posts } from "../../posts/entity/entity.posts";
import { BlogsViewType, BlogsViewWithBanType } from "../blogs.type";
import { User } from "../../users/entities/user.entity";
import { UserBlogger } from "../../blogger/domain/entity.userBlogger";
import { PaginationType } from "../../types/pagination.types";

@Entity()
export class Blogs {
	@PrimaryGeneratedColumn("uuid")
	id: string
	
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
	userId: string

	// @Column()
	// bloggerId: string

	@Column({ default: false })
	isBanned: boolean

	@Column({default: null})
	banDate: string

	@Column({default: null})
	banReason: string

	@Column({nullable: true})
	url: string

	@Column({nullable: true})
	width: number

	@Column({nullable: true})
	height: number

	@Column({nullable: true})
	fileSize: number

	@OneToMany(() => Posts, p => p.blog)
	post: Posts[]

	@Column({nullable: true})
	postId: string

	@OneToMany(() => UserBlogger, b => b.blog)
	userBlogger: UserBlogger

	static createNewBlogForSA(inputBlog: Blogs) {
		return {
			id: inputBlog.id,
			name: inputBlog.name,
			description: inputBlog.description,
			websiteUrl: inputBlog.websiteUrl,
			createdAt: inputBlog.createdAt,
			isMembership: inputBlog.isMembership,
			images: {
				wallpaper: null,
				main: [
					{
						url: null,
						width: 0,
						height: 0,
						fileSize: 0
					}
				]
			}
		}
	}

	static findBlogForSAWithInfoBan(inputBlog: Blogs, user: User): BlogsViewWithBanType {
		return {
			id: inputBlog.id,
			name: inputBlog.name,
			description: inputBlog.description,
			websiteUrl: inputBlog.websiteUrl,
			createdAt: inputBlog.createdAt,
			isMembership: inputBlog.isMembership,
			blogOwnerInfo: {
				userId: user!.id,
				userLogin: user!.login,
			  },
			  banInfo: {
				isBanned: inputBlog.isBanned,
				banDate: inputBlog.banDate,
			  },
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