import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LikeForPost } from "../../likes/entity/likesForPost-entity";
import { Blogs } from "../../blogs/entity/blogs.entity";
import { LikeStatusEnum } from "../../likes/likes.emun";
import { PostsViewModel } from "../posts.type";
import { LikesType, NewestLikesType } from "../../likes/likes.type";
import { bodyPostsModelClass } from "../dto/posts.class.pipe";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Posts {
	@PrimaryGeneratedColumn()
	id: number

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

	@Column()
	likesCount: number

	@Column()
	dislikesCount: number

	@Column()
	blogId: number

	@ManyToOne(() => Blogs, b => b.post)
	@JoinColumn({
		name: "blogId"
	})
	blog: Blogs

	@Column()
	userId: number

	@ManyToOne(() => User, u => u.post)
	user: User

	@OneToMany(() => LikeForPost, lp => lp.post, {onDelete: "CASCADE"})
	extendedLikesInfo: LikeForPost[]

	static getPostsViewModelSAMyOwnStatus(post: Posts,
		newestLikes: any[], myOwnStatus: LikeStatusEnum): PostsViewModel {
		return {
		  id: post.id,
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
				  login: l.userName,
			  })) : []},
		  };
	  }

	  static getPostsViewModelForSA(post: Posts,
				newestLikes?: LikesType[]): PostsViewModel {
				return {
				  id: post.id,
				  title: post.title,
				  shortDescription: post.shortDescription,
				  content: post.content,
				  blogId: post.blogId,
				  blogName: post.blogName,
				  createdAt: post.createdAt,
				  extendedLikesInfo: {
					  dislikesCount: post.dislikesCount, 
					  likesCount: post.likesCount, 
					  myStatus: newestLikes[newestLikes.length - 1] || LikeStatusEnum.None,
					  newestLikes: newestLikes ? newestLikes.map(l => ({
						  addedAt: l.addedAt,
						  login: l.login,
						  userId: l.userId
					  })) : []},
				  };
			  }

	static updatePresentPost(post: Posts, newData: bodyPostsModelClass): Posts {
		post.title = newData.title,
		post.shortDescription = newData.shortDescription,
		post.content = newData.content
		return post
	}
}