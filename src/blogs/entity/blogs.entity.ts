import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Posts } from "../../posts/entity/entity.posts";
import { BlogsViewType, BlogsViewWithBanType } from "../blogs.type";
import { User } from "../../users/entities/user.entity";
import { UserBlogger } from "../../blogger/entity/entity.userBlogger";
import { Wallpaper } from './wallpaper.entity';
import { Main } from "./main.entity";

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

	@OneToMany(() => Posts, p => p.blog)
	post: Posts[]

	@Column({nullable: true})
	postId: string

	@OneToMany(() => UserBlogger, b => b.blog)
	userBlogger: UserBlogger

	@OneToMany(() => Wallpaper, i => i.blog)
	wallpaper: Wallpaper[]

	@Column({nullable: true})
	wallpaperId: string

	@OneToMany(() => Main, i => i.blog)
	main: Main[]

	@Column({nullable: true})
	mainId: string


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

	static getBlog(blog: Blogs, wallpaper: Wallpaper, main: Main) {
		return {
			id: blog.id,
			name: blog.name,
			description: blog.description,
			websiteUrl: blog.websiteUrl,
			createdAt: blog.createdAt,
			isMembership: blog.isMembership,
			images: {
				wallpaper: {
						url: wallpaper.url,
						width: wallpaper.width,
						height: wallpaper.height,
						fileSize: wallpaper.fileSize
				},
				main: [
					{
						url: main.url,
						width: main.width,
						height: main.height,
						fileSize: main.fileSize
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