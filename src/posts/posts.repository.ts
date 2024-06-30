import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { NewestLikesClass } from '../likes/likes.class';
import { Posts } from './entity/entity.posts';
import { PostsViewModel } from './posts.type';
import { LikeForPost } from '../likes/entity/likesForPost.entity';
import { LikeStatusEnum } from '../likes/likes.emun';

@Injectable()
export class PostsRepository {
	
	
  constructor(
	@InjectRepository(Posts) protected readonly postsRepository: Repository<Posts>,
	@InjectRepository(LikeForPost) protected readonly likeForPostRepository: Repository<LikeForPost>,
	) {}

  async createNewPosts(newPost: Posts) {
    try {
		const createNewPost = await this.postsRepository.save(newPost)
      return createNewPost;
    } catch (error) {
      console.log(error, "error in create post");
      return null;
    }
  }

  async updatePost(newPost: Posts, id: string): Promise<Posts> {
	const updatePost = await this.postsRepository
		.createQueryBuilder()
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
		.where("id = :id", {id})
		.execute()

		const getUpdatedPost = await this.postsRepository
			.createQueryBuilder()
			.select()
			.where("id = :id", {id})
			.getOne()

    return getUpdatedPost
  }

  async deletedPostByIdWithBlogId(
    id: string,
    blogId: string
  ): Promise<boolean> {
	const deleted = await this.postsRepository
		.createQueryBuilder()
		.delete()
		.where(`"id" = :id and "blogId" = :blogId`, {id, blogId})
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

  async increase(postId: string, likeStatus: string, userId: string): Promise<boolean> {
    if (likeStatus === LikeStatusEnum.None) {
		return true
    } else if (likeStatus === LikeStatusEnum.Dislike) {
		const updateLikesCountQuery = await this.postsRepository
			.increment({id: postId}, "dislikesCount", 1)

	  if(!updateLikesCountQuery) return false
	  return  true
    } else if(likeStatus === LikeStatusEnum.Like) {
		const updateLikesCountQuery = await this.postsRepository
			.increment({id: postId}, "likesCount", 1)

	if(!updateLikesCountQuery) return false
		return  true
	}
}
  async decrease(postId: string, likeStatus: string, userId: string) {
    if (likeStatus === LikeStatusEnum.None) {
      return true
    } else if (likeStatus === LikeStatusEnum.Dislike) {
		const updateLikesCountQuery = await this.postsRepository
		.decrement({id: postId}, "likesCount", 1)
  if(!updateLikesCountQuery) return false
  return  true
    } else if(likeStatus === LikeStatusEnum.Like) {
		const updateLikesCountQuery = await this.postsRepository
		.decrement({id: postId}, "dislikesCount", 1)

  if(!updateLikesCountQuery) return false
  return  true
	}
  }

async decreaseDislike(postId: string, likeStatus: string, userId: string) {
    	await this.postsRepository.decrement({id: postId}, "dislikesCount", 1)
	}

async decreaseLike(postId: string, likeStatus: string, userId: string) {
    	await this.postsRepository.decrement({id: postId}, "likesCount", 1)
	}


async increaseLike(postId: string, likeStatus: string, userId: string) {
    	await this.postsRepository.increment({id: postId}, "likesCount", 1)
	}

async increaseDislike(postId: string, likeStatus: string, userId: string) {
    	await this.postsRepository.increment({id: postId}, "dislikesCount", 1)
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

  async findNewestLike(postId: string) {
    try {
		const findLikes = await this.likeForPostRepository
			.createQueryBuilder()
			.select()
			.where(`"postId" = :id`, {id: postId})
			.getMany()

      return findLikes;
    } catch (erro) {
      return null;
    }
  }

  async findPostByIdAndBlogId(id: string, blogId: string) {
	const findPostById = await this.postsRepository
		.createQueryBuilder()
		.select()
		.where(`id = :id and "blogId" = :blogId`, {id, blogId})
		.getOne()

    return findPostById;
  }

  async bindPostByUserId(userId: string): Promise<void> {
	const updatePostByBind = await this.postsRepository
		.createQueryBuilder()
		.update(Posts)
		.set({
			isBanned: false,
			banDate: new Date().toISOString()	
		})
		// .where("id = :id", {id})
		.where("userId = :useId", {userId})
		.execute()

	if(!updatePostByBind) throw new Error('Post does not exist')
		return
}

async banPostByUserId(id: string, ban: boolean): Promise<boolean> {
	const postBanned = await this.postsRepository.update(
		{ userId: id },
		{
		  isBanned: ban,
		  banDate: new Date().toISOString()
		},
	  );
  
	  return (
		postBanned.affected !== null &&
		postBanned.affected !== undefined &&
		postBanned.affected > 0
	  );
}

async banPostLikes(id: string, ban: boolean) {
	const postLikeBanned = await this.likeForPostRepository.update(
		{ userId: id },
		{
		  isBanned: ban,
		},
	  );
  
	  return (
		postLikeBanned.affected !== null &&
		postLikeBanned.affected !== undefined &&
		postLikeBanned.affected > 0
	  );
}

async findPostByIdUserId(id: string, userId?: string) {
	const getPost = await this.postsRepository
		.createQueryBuilder()
		.select()
		.where(`"id" = :id AND "userId" = :userId`, {id, userId})
		.getOne()
	return getPost
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
