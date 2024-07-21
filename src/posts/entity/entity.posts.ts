import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LikeForPost } from "../../likes/entity/likesForPost.entity";
import { Blogs } from "../../blogs/entity/blogs.entity";
import { LikeStatusEnum } from "../../likes/likes.emun";
import { PostsViewModel } from "../posts.type";
import { LikesType, NewestLikesType } from "../../likes/likes.type";
import { bodyPostsModelClass } from "../dto/posts.class.pipe";
import { User } from "../../users/entities/user.entity";
import { Comments } from "../../comment/entity/comment.entity";
import { Images } from "../../blogs/entity/images.entity";

@Entity()
export class Posts {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column()
	title: string

	@Column()
	shortDescription: string

	@Column()
	content: string

	@Column()
	blogName: string

	@CreateDateColumn()
	createdAt: Date

	@Column({nullable: true, default: 0})
	likesCount: number

	@Column({nullable: true, default: 0})
	dislikesCount: number

	@Column()
	blogId: string

	@ManyToOne(() => Blogs, b => b.post)
	blog: Blogs

	// @Column()
	// userId: number

	@ManyToOne(() => User, u => u.post)
	user: User

	@Column({nullable: true})
	userId: string

	@Column({ default: false })
	isBanned: boolean

	@Column({default: null})
	banDate: string

	@Column({nullable: true})
	url: string

	@Column({nullable: true})
	width: number

	@Column({nullable: true})
	height: number

	@Column({nullable: true})
	fileSize: number

	@OneToMany(() => Images, i => i.post)
	image: Images[]

	@Column({nullable: true})
	imageId: string

	@OneToMany(() => LikeForPost, lp => lp.post, {onDelete: "CASCADE"})
	extendedLikesInfo: LikeForPost[]

	@OneToMany(() => Comments, c => c.post)
	comment: Comments[]

	static getPostsViewModelSAMyOwnStatus(post: Posts,
		newestLikes: any[], myOwnStatus: LikeStatusEnum, images: Images): PostsViewModel {
		return {
		  id: post.id.toString(),
		  title: post.title,
		  shortDescription: post.shortDescription,
		  content: post.content,
		  blogId: post.blogId,
		  blogName: post.blogName,
		  createdAt: post.createdAt,
		  extendedLikesInfo: {
			  dislikesCount: post.dislikesCount, 
			  likesCount: post.likesCount, 
			  myStatus: myOwnStatus || LikeStatusEnum.None,
			  newestLikes: newestLikes ? newestLikes.map(l => ({
				  addedAt: l.addedAt,
				  userId: l.userId, 
				  login: l.login,
			  })) : []
			},
			images: {
				main: [
				  {
					url: images.url,
					width: images.width,
					height: images.height,
					fileSize: images.fileSize
				  }
				]
			  }
		  };
	  }

	 static getPostsViewModelForSA(
		post: Posts,
		newestLikes?: NewestLikesType[],
		): PostsViewModel {
			return {
			  id: post.id.toString(),
			  title: post.title,
			  shortDescription: post.shortDescription,
			  content: post.content,
			  blogId: post.blogId,
			  blogName: post.blogName,
			  createdAt: post.createdAt,
			  extendedLikesInfo: {
				  dislikesCount: post.dislikesCount, 
				  likesCount: post.likesCount, 
				  myStatus:LikeStatusEnum.None,
				  newestLikes: newestLikes ? newestLikes.map(l => ({
					  addedAt: l.addedAt,
					  login: l.login,
					  userId: l.userId
				  })) : []
				},
				  images: {
					main: [
					  {
						url: post.url,
						width: post.width,
						height: post.height,
						fileSize: post.fileSize
					  }
					]
				  }
			  };
		  }


	static getPostsWithImages(
			post: Posts,
			image: Images
			): PostsViewModel {
				return {
				  id: post.id.toString(),
				  title: post.title,
				  shortDescription: post.shortDescription,
				  content: post.content,
				  blogId: post.blogId,
				  blogName: post.blogName,
				  createdAt: post.createdAt,
				  extendedLikesInfo: {
					  dislikesCount: 0, 
					  likesCount: 0, 
					  myStatus:LikeStatusEnum.None,
					  newestLikes: [
						{
							addedAt: new Date().toISOString(),
							userId: "",
							login: ""
						}
					  ]
					},
					  images: {
						main: [
						  {
							url: image.url,
							width: image.width,
							height: image.height,
							fileSize: image.fileSize
						  }
						]
					  }
				  };
			  }
	

	static updatePresentPost(post: Posts, newData: bodyPostsModelClass): Posts {
		post.title = newData.title,
		post.shortDescription = newData.shortDescription,
		post.content = newData.content
		return post
	}
}