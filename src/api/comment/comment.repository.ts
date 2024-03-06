import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CommentClass } from "./comment.class";
import { LikeStatusEnum } from "../likes/likes.emun";
import { Comments } from "./entity/comment.entity";

export class CommentRepository {
	constructor(
		@InjectRepository(Comments) protected readonly commentsRepository: Repository<Comments>
	) {}

	// async deleteAllComments() {
	// 	const deletedAll = await this.dataSource.query(`delete from public."Comments"`);
	// 	return true
	// }


	// async increase(commentId: string, likeStatus: string, userId: string){
	// 	if(likeStatus === LikeStatusEnum.None) {
	// 		return true
	// 	} else if(likeStatus === "Dislike") {
	// 		const updateLikeCountQuery = `
	// 			UPDATE public."Comments"
	// 				SET "dislikesCount"="dislikesCount" + 1
	// 				WHERE "id" = $1
	// 		`
	// 	const updateLikecount = (await this.dataSource.query(updateLikeCountQuery, [commentId]))[0]
	// 	if(!updateLikecount) return false
	// 	return true
	// 	} else {
	// 		const updatelikeCountQuery = `
	// 			UPDATE public."Comments"
	// 				SET "likesCount"="likesCount" + 1
	// 				WHERE "id" = $1
	// 		`
	// 		const updatelikeCount = (await this.dataSource.query(updatelikeCountQuery, [commentId]))[0]
	// 	if(!updatelikeCount) return false
	// 		return true
	// 	} 
	// }

	// async decrease(commentId: string, likeStatus: string, userId: string){
	// 	if(likeStatus === LikeStatusEnum.None) {
	// 		return true
	// 	} else if(likeStatus === 'Dislike') {
	// 		const updateLikeCountQuery = `
	// 			UPDATE public."Comments"
	// 				SET "dislikesCount"="dislikesCount" - 1
	// 				WHERE "id" = $1
	// 		`
	// 		const updateLikeCount = (await this.dataSource.query(updateLikeCountQuery, [commentId]))[0]
	// 		if(!updateLikeCount) return false
	// 			return true
	// 	} else {
	// 		const updateLikeCountQuery = `
	// 			UPDATE public."Comments"
	// 				SET "likesCount"="likesCount" - 1
	// 				WHERE "id" = $1
	// 		`
	// 		const updateLikeCount = (await this.dataSource.query(updateLikeCountQuery, [commentId]))[0]
	// 		if(!updateLikeCount) return false
	// 			return true
	// 	} 
		
	// }

	// async updateComment(commentId: string, content: string): Promise<boolean> {
	// 	const query = `
	// 		UPDATE public."Comments"
	// 			SET "content" = $1
	// 			WHERE "id" = $2
	// 	`
	// 	const updateOne = (await this.dataSource.query(query, [content, commentId]))[0]
	// 	if(!updateOne) return false
	// 	return true
	//   }

	//   async deleteCommentByCommentId(commentId: string): Promise<boolean> {
	// 	try {
	// 		const query = `
	// 			DELETE FROM public."Comments"
	// 				WHERE "id" = $1
	// 		`
	// 	  const deleteComment = await this.dataSource.query(query, [commentId])
	// 	  return true
	// 	} catch (err) {
	// 	  return false; 
	// 	}
	//   }

	  async createNewCommentPostId(newComment: Comments): Promise<Comments | null> {
		try {

			const createComments = await this.commentsRepository
        .createQueryBuilder('c')
        .insert()
        .values([
          {
            content: newComment.content,
            userId: newComment.userId,
            userLogin: newComment.userLogin,
            postId: newComment.postId,
			likesCount: newComment.likesCount,
			dislikesCount: newComment.dislikesCount
          },
        ]);
      if (!createComments) return null;
			// return {...createComments, commentatorInfo: {userId: createComments.userId, userLogin: createComments.userLogin}}
			return createComments[0]
		} catch (error) {
			console.log(error, 'error in create post');
			return null;
		  }
	  }
}