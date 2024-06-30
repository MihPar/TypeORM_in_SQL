import { commentDBToView } from '../helpers/helpers';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentViewModel } from './comment.type';
import { PaginationType } from '../types/pagination.types';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeStatusEnum } from '../likes/likes.emun';
import { Comments } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { LikeForComment } from '../likes/entity/likesForComment.entity';

@Injectable()
export class CommentQueryRepository {
  constructor(
	@InjectRepository(Comments) protected readonly commentRepository: Repository<Comments>,
	@InjectRepository(LikeForComment) protected readonly likeForCommentRepository: Repository<LikeForComment>
  ) {}

  async findCommentById(
    commentId: string,
    userId?: string | null,
  ): Promise<CommentViewModel | null> {
    try {
		const findCommentById = await this.commentRepository
			.createQueryBuilder()
			.select()
			.where(`id = :commentId`, {commentId})
			.getOne()
// console.log("find 28: ", findCommentById)
// console.log("find 29: ",)
			const commentLikeStatus = await this.likeForCommentRepository
			.createQueryBuilder()
			.select()
			.where(`"commentId" = :commentId`, {commentId})
			.andWhere(`"isBanned" = :isBanned`, {isBanned: false})
			.getOne()
	
   let myStatus: LikeStatusEnum = LikeStatusEnum.None;
		if(userId) {
			myStatus = commentLikeStatus ? (commentLikeStatus?.myStatus as LikeStatusEnum) : LikeStatusEnum.None
		}

	if(commentLikeStatus.isBanned) throw new NotFoundException("404")

	return commentDBToView(findCommentById, myStatus);
    } catch (e) {
      return null;
    }
  }

  async findCommentsByPostId(
    postId: string,
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    userId: string | null,
  ): Promise<PaginationType<CommentViewModel> | null> {
	const queryFindComment = await this.commentRepository
		.createQueryBuilder()
		.select()
		.where(`"postId" = :postId`, {postId})
		.orderBy(`"${sortBy}"`, `${sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC"}`)
		.limit(+pageSize)
		.offset((+pageNumber - 1) * +pageSize)
		.getManyAndCount()

	const totalCount = queryFindComment[1]
	const commentsByPostId = queryFindComment[0]
	const commentId = queryFindComment[0][0].id

  const pagesCount: number = Math.ceil(+totalCount / +pageSize);
  const items: CommentViewModel[] = await Promise.all(
    commentsByPostId.map(async (item) => {
		let myStatus: LikeStatusEnum = LikeStatusEnum.None;
			if (userId) {
				const commentsLikeQuery = await this.likeForCommentRepository
				.createQueryBuilder()
				.select()
				.where(`"commentId" = :id and "userId" = :userId`, {id: item.id, userId})
				.getMany()
			myStatus = commentsLikeQuery
				? (commentsLikeQuery[0]?.myStatus as LikeStatusEnum)
				: LikeStatusEnum.None;
			}
      return commentDBToView(item, myStatus);
    })
  );
    return {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items,
    };
  }

  async findCommentByCommentId(commentId: string, userId?: string | null) {
	const findCommentById = await this.commentRepository
		.createQueryBuilder()
		.select()
		.where(`id = :id`, {id: commentId})
		.getOne()

    if (!findCommentById) {
      return null;
    }
	return findCommentById
  }

//   async getCommentsByPostId(postId: string): Promise<CommentClass | null> {
// 	const query = `
// 		select *
// 			from public."Comments"
// 			where "postId" = $1
// 	`
// 	const getCommentsById = (await this.dataSource.query(query, [postId]))[0]
// 	if(!getCommentsById) return null
// 	return getCommentsById
//   }
}
