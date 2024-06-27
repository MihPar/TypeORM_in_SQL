import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LikeStatusEnum } from "../likes/likes.emun";
import { Comments } from "./entity/comment.entity";
import { CommentViewModel } from "./comment.type";
import { LikeForComment } from "../likes/entity/likesForComment.entity";

export class CommentRepository {
	constructor(
		@InjectRepository(Comments) protected readonly commentsRepository: Repository<Comments>,
		// @InjectRepository(LikeForComment) protected readonly likeForCommentRepository: Repository<LikeForComment>
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

	async decrease(commentId: string, likeStatus: string){
		if(likeStatus === LikeStatusEnum.None) {
			return true
		} else if(likeStatus === LikeStatusEnum.Dislike) {
			const updateLikeCount = await this.commentsRepository
				.decrement({id: commentId}, "dislikesCount", 1)

				if(!updateLikeCount) return false
				return true
		} else {
			const updateLikeCount = await this.commentsRepository
				.decrement({id: commentId}, "likesCount", 1)
				
			if(!updateLikeCount) return false
				return true
		} 
	}

	async decreaseDislike(commentId: string, likeStatus: string) {
    	await this.commentsRepository.decrement({id: commentId}, "dislikesCount", 1)
	}

	async decreaseLike(commentId: string, likeStatus: string) {
    	await this.commentsRepository.decrement({id: commentId}, "likesCount", 1)
	}
	async increaseLike(commentId: string, likeStatus: string) {
    	await this.commentsRepository.increment({id: commentId}, "likesCount", 1)
	}

	async increaseDislike(commentId: string, likeStatus: string) {
    	await this.commentsRepository.increment({id: commentId}, "dislikesCount", 1)
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
			return newCom
		} catch (error) {
			console.log(error, 'error in create post');
			return null;
		  }
	  }
	  async banComments(id: string, ban: boolean) {
		const commentBanned = await this.commentsRepository.update(
			{ userId: id },
			{
			  isBanned: ban,
			},
		  );
	  
		  return (
			commentBanned.affected !== null &&
			commentBanned.affected !== undefined &&
			commentBanned.affected > 0
		  );
	  }
}