import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Posts } from "../posts/entity/entity.posts";
import { LikeForPost } from './entity/likesForPost.entity';
import { LikeForComment } from './entity/likesForComment.entity';

@Injectable()
export class LikesRepository {
	constructor(
		@InjectRepository(Posts) protected readonly postsRepository: Repository<Posts>,
		@InjectRepository(LikeForPost) protected readonly likeForPostRepository: Repository<LikeForPost>,
		@InjectRepository(LikeForComment) protected readonly likeForCommentRepository: Repository<LikeForComment>
	) {}

	async deletePostLikes() {
		const deleteAllLikes = await this.likeForPostRepository
			.createQueryBuilder('lfp')
			.delete()
			.execute()
    	return true
	}

	async deleteCommentLikes() {
		const deleteAllLikes = await this.likeForCommentRepository
			.createQueryBuilder('lfc')
			.delete()
			.execute()
		
    	return true
	}

	async findLikeByPostId(postId: string, userId: string): Promise<LikeForPost | null> {
		const findLikes = await this.likeForPostRepository
			.createQueryBuilder('lp')
			.select()
			.where('lp.id = :id AND lp.userId = :userId', {id: postId, userId})
			.getOne()

		if(!findLikes) return null
		return findLikes
	}

	async saveLikeForPost(postId: string, userId: string, likeStatus: string, login: string): Promise<void> {
		
		const saveLikeForPost = await this.likeForPostRepository
			.createQueryBuilder("lp")
			.insert()
			.into(LikeForPost)
			.values([{userId, postId, myStatus: likeStatus}])
		return
	}

	async updateLikeStatusForPost(postId: string, likeStatus: string, userId: string) {
		const addedAt = new Date().toISOString()
		const updatelikeStatus = await this.likeForPostRepository
			.createQueryBuilder('lfp')
			.update()
			.set({myStatus: likeStatus, addedAt})
			.where('lfp.postId = :postId AND lfp.userId = :userId', {postId, userId})
			.execute()
		
		return updatelikeStatus
	}

	async findLikeByCommentIdBy(commentId: string, userId: string): Promise<LikeForComment | null>  {
		// const findLikeByUserAndByCommentId = await this.likeForCommentRepository
		// 	.createQueryBuilder()
		// 	.select()
		// 	.where(`"id" = :id AND "userId": userId`, {id: commentId, userId})
		// 	.getOne()

		const findLikeByUserAndByCommentId = await this.likeForCommentRepository
			.findOne({where: {
				id: commentId,
				userId
			}})

		if(!findLikeByUserAndByCommentId) return null
		return findLikeByUserAndByCommentId
	}

	async saveLikeForComment(commentId: string, userId: string, likeStatus: string) {
		const newDate = new Date()

		/** firstCase **/
		// const newLikeForComment = new LikeForComment()
		// newLikeForComment.commentId = commentId
		// newLikeForComment.userId = userId
		// newLikeForComment.myStatus = likeStatus
		// newLikeForComment.addedAt = new Date()
		// const createLikeStatus = await this.likeForCommentRepository.save(newLikeForComment)

		/** secondCase **/
		// const createLikeStatus = await this.likeForCommentRepository
		// 	.insert({
		// 		commentId: commentId,
		// 		userId: userId,
		// 		myStatus: likeStatus,
		// 		addedAt: newDate
		// 	})

		/** thirdCase **/
		const createLikeStatus = await this.likeForCommentRepository
			.createQueryBuilder()
			.insert()
			.values([{
				commentId,
				userId,
				myStatus: likeStatus,
				addedAt: newDate
			}])
			.execute()
		// return createLikeStatus
		return true
	}

	async updateLikeStatusForComment(commentId: string, userId: string, likeStatus: string){
		const createAddedAt = new Date().toISOString()
		const updateLikeStatus = await this.likeForCommentRepository
			.update({commentId, userId}, {myStatus: likeStatus, addedAt: createAddedAt})
		// const updateLikeStatus = await this.likeForCommentRepository
		// 	.createQueryBuilder()
		// 	.update()
		// 	.set({myStatus: likeStatus, addedAt: createAddedAt})
		// 	.where(`"commentId" = :commentId AND "userId" = :userId`, {commentId, userId})
		// 	.execute()

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