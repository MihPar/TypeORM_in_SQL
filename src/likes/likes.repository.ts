import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Posts } from "../posts/entity/entity.posts";
import { LikeForPost } from './entity/likesForPost.entity';
import { LikeForComment } from './entity/likesForComment.entity';
import { LikeStatusEnum } from "./likes.emun";
import { Comments } from "../comment/entity/comment.entity";

@Injectable()
export class LikesRepository {
	constructor(
		@InjectRepository(Posts) protected readonly postsRepository: Repository<Posts>,
		@InjectRepository(LikeForPost) protected readonly likeForPostRepository: Repository<LikeForPost>,
		@InjectRepository(LikeForComment) protected readonly likeForCommentRepository: Repository<LikeForComment>,
		@InjectRepository(Comments) protected readonly commentsRepository: Repository<Comments>,
	) {}

	async deletePostLikes() {
	 	await this.likeForPostRepository
			.createQueryBuilder()
			.delete()
			.execute()
    	return true
	}

	async deleteCommentLikes() {
		 await this.likeForCommentRepository
			.createQueryBuilder()
			.delete()
			.execute()
		
    	return true
	}

	async findLikeByPostId(postId: string, userId: string): Promise<LikeForPost | null> {
		const findLikes = await this.likeForPostRepository
			.createQueryBuilder()
			.select()
			.where(`"postId" = :postId AND "userId" = :userId`, {postId, userId})
			.getOne()
			if(!findLikes) return null
		return findLikes
	}

	async saveLikeForPost(postId: string, userId: string, likeStatus: string, login: string): Promise<void> {
		const newLikeForPost = new LikeForPost()
		newLikeForPost.myStatus = likeStatus
		newLikeForPost.postId = postId,
		newLikeForPost.userId = userId,
		newLikeForPost.login = login

		const saveLikeForPost = await this.likeForPostRepository.save(newLikeForPost)
		return
	}

	async updateLikeStatusForPost(postId: string, likeStatus: string, userId: string) {
		const result = await this.likeForPostRepository
			// .update({postId, userId}, {myStatus: likeStatus, addedAt})
			.createQueryBuilder()
			.update()
			.set({myStatus: likeStatus})
			.where(`"postId" = :postId AND "userId" = :userId`, {postId, userId})
			.execute()

		return true
	}

	async findLikeByCommentIdBy(commentId: string, userId: string): Promise<LikeForComment | null>  {
		const findLikeByUserAndByCommentId = await this.likeForCommentRepository
			.createQueryBuilder()
			.select()
			.where(`"commentId" = :commentId AND "userId" = :userId`, {commentId, userId})
			.getOne()

		if(!findLikeByUserAndByCommentId) return null
		return findLikeByUserAndByCommentId
	}

	async saveLikeForComment(commentId: string, userId: string, likeStatus: LikeStatusEnum) {
		const newDate = new Date()

		/** firstCase **/
		const newLikeForComment = new LikeForComment()
		newLikeForComment.commentId = commentId
		newLikeForComment.userId = userId
		newLikeForComment.myStatus = likeStatus
		newLikeForComment.addedAt = new Date()
		const createLikeStatus = await this.likeForCommentRepository.save(newLikeForComment)

		// console.log("newLikeForComment: ", newLikeForComment)

		/** secondCase **/
		// const createLikeStatus = await this.likeForCommentRepository
		// 	.insert({
		// 		commentId: commentId,
		// 		userId: userId,
		// 		myStatus: likeStatus,
		// 		addedAt: newDate
		// 	})

		/** thirdCase **/
		// const createLikeStatus = await this.likeForCommentRepository
		// 	.createQueryBuilder()
		// 	.insert()
		// 	.values([{
		// 		commentId,
		// 		userId,
		// 		myStatus: likeStatus,
		// 		addedAt: newDate
		// 	}])
		// 	.execute()
		return
	}

	async updateLikeStatusForComment(commentId: string, userId: string, likeStatus: LikeStatusEnum){
		const createAddedAt = new Date().toISOString()
		// const updateLikeStatus = await this.likeForCommentRepository
			// .update({commentId, userId}, {myStatus: likeStatus, addedAt: createAddedAt})
		const updateLikeStatus = await this.likeForCommentRepository
			.createQueryBuilder()
			.update()
			.set({myStatus: likeStatus, addedAt: createAddedAt})
			.where(`"commentId" = :commentId AND "userId" = :userId`, {commentId, userId})
			.execute()

		return updateLikeStatus
	}

	

	// async getNewLike(postId: string, blogId: string) {
	// 	const NewestLikesQuery = `
	// 		select *
	// 			from public."PostLikes"	
	// 			where "postId" = $1
	// 			order by "addedAt" = desc
	// 			limit 3 offset 0
	// 	`
	// 	const newestLike = (await this.dataSource.query(NewestLikesQuery, [postId]))[0]
	// 	return newestLike
	// }
}