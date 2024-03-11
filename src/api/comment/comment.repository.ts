import { Post } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CommentClass } from "./comment.class";
import { LikeStatusEnum } from "../likes/likes.emun";
import { Comments } from "./entity/comment.entity";
import { LikeForComment } from "../likes/entity/likesForComment.entity";

export class CommentRepository {
	constructor(
		@InjectRepository(Comments) protected readonly commentsRepository: Repository<Comments>,
	) {}

	async deleteAllComments() {
		const deleteAllComments = await this.commentsRepository
			.createQueryBuilder()
			.delete()
			.execute()
		    return true;
	}


	async increase(commentId: string, likeStatus: string) {
		if(likeStatus === LikeStatusEnum.None) {
			return true
		} else if (likeStatus === LikeStatusEnum.Dislike) {
			const incDislike = await this.commentsRepository
				.increment({id: commentId}, "dislikesCount", 1)
		} else {
			const incLike = await this.commentsRepository
				.increment({id: commentId}, "likesCount", 1)
		}
	}

 	// async increase(commentId: string, likeStatus: string){
	// 	let dislikesCount = 0
	// 	let likesCount = 0
	// 	if(likeStatus === LikeStatusEnum.None) {
	// 		return true
	// 	} else if(likeStatus === "Dislike") {
	// 		const updateLikecount = await this.commentsRepository
	// 			.createQueryBuilder()
	// 			.update()
	// 			.set({
	// 				dislikesCount: dislikesCount++
	// 			})
	// 			.where('id = :commentId', {commentId})
	// 			.execute()

	// 	if(!updateLikecount) return false
	// 	return true
	// 	} else {
	// 		const updatelikeCount = await this.commentsRepository
	// 			.createQueryBuilder()
	// 			.update()
	// 			.set({
	// 				likesCount: likesCount++
	// 			})
	// 			.where("id = :commentId", {commentId})
	// 			.execute()

	// 	if(!updatelikeCount) return false
	// 		return true
	// 	} 
	// }

	async decrease(commentId: string, likeStatus: string){
		if(likeStatus === LikeStatusEnum.None) {
			return true
		} else if(likeStatus === LikeStatusEnum.Dislike) {
			const updateLikeCount = await this.commentsRepository
				.decrement({id: commentId}, "dislikesCount", 0)
				// .createQueryBuilder()
				// .update()
				// .set({dislikesCount: new Comments().dislikesCount - 1})
				// .where("id = :commentId", {commentId})
				// .execute()

				if(!updateLikeCount) return false
				return true
		} else {
			const updateLikeCount = await this.commentsRepository
				.decrement({id: commentId}, "likesCount", 0)
				// .createQueryBuilder()
				// .update()
				// .set({dislikesCount: new Comments().likesCount - 1})
				// .where("id = :commentId", {commentId})
				// .execute()

			if(!updateLikeCount) return false
				return true
		} 
	}

	async updateComment(commentId: string, content: string): Promise<boolean> {
		const updateOne = await this.commentsRepository
			.createQueryBuilder()
			.update()
			.set({content})
			.where(`id = :commentId`, {commentId})
			.execute()

			if(!updateOne) return false
		return true
	  }

	  async deleteCommentByCommentId(commentId: string): Promise<boolean> {
		try {
			await this.commentsRepository
				.createQueryBuilder()
				.delete()
				.where("id = :commentId", {commentId})
				.execute()

				return true
		} catch (err) {
		  return false; 
		}
	  }

	  async createNewCommentPostId(newComment: Comments): Promise<Comments | null> {
		try {
			const newCom = await this.commentsRepository.save(newComment)
      if (!newCom) return null;
			// return {...createComments, commentatorInfo: {userId: createComments.userId, userLogin: createComments.userLogin}}
			return newCom
		} catch (error) {
			console.log(error, 'error in create post');
			return null;
		  }
	  }
}