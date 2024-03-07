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

	// async findLikeByCommentIdBy(commentId: string, userId: string): Promise<LikeComment | null>  {
	// 	const commentLikesQuery = `
	// 		SELECT *
	// 			FROM public."CommentLikes"
	// 				WHERE "commentId" = $1 AND "userId" = $2
	// 	`
	// 	const findLike = (await this.dataSource.query(commentLikesQuery, [commentId, userId]))[0]
	// 	if(!findLike) return null
	// 	return findLike
	// }

	// async saveLikeForComment(commentId: string, userId: string, likeStatus: string) {
	// 	const createAddedAt = new Date().toISOString()
	// 	const query = `
	// 		INSERT INTO public."CommentLikes"("myStatus", "addedAt", "commentId", "userId")
	// 			VALUES ($1, $2, $3, $4)
	// 			RETURNING *
	// 	`;
	// 	const createLikeStatus = (await this.dataSource.query(query, [likeStatus, createAddedAt, commentId, userId]))[0]
	// 	return createLikeStatus.id
	// }

	// async updateLikeStatusForComment(commentId: string, userId: string, likeStatus: string){
	// 	const createAddedAt = new Date().toISOString()
	// 	const query = `
	// 		UPDATE public."CommentLikes"
	// 			SET "myStatus"=$1, "addedAt"=$2
	// 			WHERE "commentId" = $3 AND "userId" = $4
	// 	`;
	// 	const updateLikeStatus = (await this.dataSource.query(query, [likeStatus, createAddedAt, commentId, userId]))[0]
	// 	return updateLikeStatus
	// }

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