import { PostsRepository } from './../posts/posts.repository';
import { Injectable } from "@nestjs/common";
import { LikeComment, LikePost } from "./likes.class";
import { LikeStatusEnum } from "./likes.emun";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Posts } from "../posts/entity/entity-posts";
import { LikeForPost } from './entity/likesForPost-entity';

@Injectable()
export class LikesRepository {
	constructor(
		@InjectRepository(Posts) protected readonly postsRepository: Repository<Posts>
		@InjectRepository(LikeForPost) protected readonly likeForPostRepository: Repository<LikeForPost>
	) {}

	async deletePostLikes() {
		const deleteAllLikes = await this.dataSource.query(`
			DELETE FROM public."PostLikes"
		`);
    	return true
	}

	async deleteCommentLikes() {
		const deleteAllLikes = await this.dataSource.query(`
			DELETE FROM public."CommentLikes"
		`);
    	return true
	}

	async findLikeByPostId(postId: number, userId: number): Promise<LikeForPost | null> {
		const findLikes = await this.likeForPostRepository
			.createQueryBuilder('lp')
			.select()
			.where('lp.id = :id AND lp.userId = :userId', {id: postId, userId})
			.getOne()

		if(!findLikes) return null
		return findLikes
	}

	async saveLikeForPost(postId: number, userId: number, likeStatus: string, login: string): Promise<void> {
		
		const saveLikeForPost = await this.likeForPostRepository
			.createQueryBuilder("lp")
			.insert()
			.into(LikeForPost)
			.values([{userId, postId, myStatus: likeStatus}])
		return
	}

	async updateLikeStatusForPost(postId: number, likeStatus: string, userId: number) {
		const addedAt = new Date().toISOString()
		const query1 = `
			UPDATE public."PostLikes"
				SET "myStatus"=$1, "addedAt"=$2
				WHERE "postId" = $3 AND "userId" = $4
		`
		const updateLikeStatus = (await this.dataSource.query(query1, [likeStatus, addedAt, postId, userId]))[0]
		return updateLikeStatus
	}

	async findLikeByCommentIdBy(commentId: string, userId: string): Promise<LikeComment | null>  {
		const commentLikesQuery = `
			SELECT *
				FROM public."CommentLikes"
					WHERE "commentId" = $1 AND "userId" = $2
		`
		const findLike = (await this.dataSource.query(commentLikesQuery, [commentId, userId]))[0]
		if(!findLike) return null
		return findLike
	}

	async saveLikeForComment(commentId: string, userId: string, likeStatus: string) {
		const createAddedAt = new Date().toISOString()
		const query = `
			INSERT INTO public."CommentLikes"("myStatus", "addedAt", "commentId", "userId")
				VALUES ($1, $2, $3, $4)
				RETURNING *
		`;
		const createLikeStatus = (await this.dataSource.query(query, [likeStatus, createAddedAt, commentId, userId]))[0]
		return createLikeStatus.id
	}

	async updateLikeStatusForComment(commentId: string, userId: string, likeStatus: string){
		const createAddedAt = new Date().toISOString()
		const query = `
			UPDATE public."CommentLikes"
				SET "myStatus"=$1, "addedAt"=$2
				WHERE "commentId" = $3 AND "userId" = $4
		`;
		const updateLikeStatus = (await this.dataSource.query(query, [likeStatus, createAddedAt, commentId, userId]))[0]
		return updateLikeStatus
	}

	async getNewLike(postId: string, blogId: string) {
		const NewestLikesQuery = `
			select *
				from public."PostLikes"	
				where "postId" = $1
				order by "addedAt" = desc
				limit 3 offset 0
		`
		const newestLike = (await this.dataSource.query(NewestLikesQuery, [postId]))[0]
		return newestLike
	}
}