import { Injectable } from '@nestjs/common';
import { LikeStatusEnum } from '../../api/likes/likes.emun';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { NewestLikesClass } from '../likes/likes.class';
import { Posts } from './entity/entity-posts';
import { PostsViewModel } from './posts.type';
import { LikeForPost } from '../likes/entity/likesForPost-entity';

@Injectable()
export class PostsRepository {
  constructor(
	@InjectRepository(Posts) protected readonly postsRepository: Repository<Posts>,
	@InjectRepository(LikeForPost) protected readonly likeForPostRepository: Repository<LikeForPost>
	) {}

  async createNewPosts(newPost: Posts) {
    try {
		const createNewPost = await this.postsRepository
			.createQueryBuilder()
			.insert()
			.into(Posts)
			.values([
				{
				blogId: newPost.blogId,
				title: newPost.title,
				shortDescription: newPost.shortDescription,
				content: newPost.content,
				blogName: newPost.blogName,
				likesCount: newPost.likesCount,
				dislikesCount: newPost.dislikesCount
			}
		])
			.execute()
      return createNewPost;
    } catch (error) {
      console.log(error, "error in create post");
      return null;
    }
  }

  async updatePost(newPost: Posts, id: number): Promise<Posts> {
	const updatePost = await this.postsRepository
		.createQueryBuilder("p")
		.update()
		.set({
			blogId: newPost.blogId,
			title: newPost.title,
			shortDescription: newPost.shortDescription,
			content: newPost.content,
			blogName: newPost.blogName,
			likesCount: newPost.likesCount,
			dislikesCount: newPost.dislikesCount,
		})
		.where("p.id = :id", {id})
		.execute()

    return updatePost.raw[0]
  }

  async deletedPostByIdWithBlogId(
    id: number,
    blogId: number
  ): Promise<boolean> {
	const deleted = await this.postsRepository
		.createQueryBuilder("p")
		.delete()
		.where("p.id = :id and p.blogId = :blogId", {id, blogId})
		.execute()
		
    if (!deleted) return false;
    return true;
  }

  async deleteRepoPosts() {
    await this.postsRepository
		.createQueryBuilder()
		.delete()
		.execute()
		
    return true;
  }

  async increase(postId: number, likeStatus: string): Promise<boolean> {
    if (likeStatus === LikeStatusEnum.None) {
		return true
    } else if (likeStatus === "Dislike") {
		const updateLikesCountQuery = await this.postsRepository
			.createQueryBuilder('p')
			.update()
			.set({dislikesCount: Number("dislikeCount" + 1)})
			.where('p.id = :id', {id: postId})

	  if(!updateLikesCountQuery) return false
	  return  true
    } else {
		const updateLikesCountQuery = await this.postsRepository
		.createQueryBuilder('p')
		.update()
		.set({likesCount: Number("likeCount") + 1})
		.where('p.id = :id', {id: postId})

  if(!updateLikesCountQuery) return false
  return  true
  	}
}
  async decrease(postId: number, likeStatus: string) {
    if (likeStatus === LikeStatusEnum.None) {
      return true
    } else if (likeStatus === "Dislike") {
		const updateLikesCountQuery = await this.postsRepository
		.createQueryBuilder('p')
		.update()
		.set({dislikesCount: Number("dislikeCount") - 1})
		.where('p.id = :id', {id: postId})

  if(!updateLikesCountQuery) return false
  return  true
    } else {
		const updateLikesCountQuery = await this.postsRepository
		.createQueryBuilder('p')
		.update()
		.set({likesCount: Number("likeCount") - 1})
		.where('p.id = :id', {id: postId})

  if(!updateLikesCountQuery) return false
  return  true
    }
  }

//   async findPostByBlogId(blogId: string) {
//     try {
//       const query = `
// 			select * 
// 				from "Posts"
// 				where "blogId" = $1
// 		`;
//       const post = (await this.dataSource.query(query, [blogId]))[0];
//       return post;
//     } catch (error) {
//       return null;
//     }
//   }

  async findNewestLike(id: number): Promise<LikeForPost> {
    try {
		const findLike = await this.likeForPostRepository
			.createQueryBuilder("lfp")
			.select()
			.where("lfp.id = :id and lfp.myStatus = :myStatus", {id, myStatus: 'Like'})
			.limit(3)
			.getOne()

      return findLike;
    } catch (erro) {
      return null;
    }
  }

  async findPostByIdAndBlogId(id: number, blogId: number) {
	const findPostById = await this.postsRepository
		.createQueryBuilder("p")
		.select()
		.where("p.id = :id and p.blogId = :blogId", {id, blogId})
		.getOne()

    return findPostById;
  }

//   async findPostById(id: string) {
//     const query = `
// 		select *
// 			from "Posts"
// 			where "id" = $1
// 	`;
//     const findPostById = (await this.dataSource.query(query, [id]))[0];
//     return findPostById;
//   }

//   async createNewestLikes(newest: NewestLikesClass) {
//     const query = `
// 		INSERT INTO public."Likes"(
// 			"addedAt", "userId", "login", "postId", "myStatus")
// 			VALUES ($1, $2, $3, $4)
// 			returning *
// 	`;
//     const createNewest = (
//       await this.dataSource.query(query, [
//         newest.addedAT,
//         newest.userId,
//         newest.login,
//         newest.postId,
// 		newest.myStatus
//       ])
//     )[0];
// 	return createNewest
//   }
}
