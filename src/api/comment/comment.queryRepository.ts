import { commentDBToView } from './../../helpers/helpers';
import { Injectable } from '@nestjs/common';
import { CommentViewModel } from './comment.type';
import { PaginationType } from '../../types/pagination.types';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentClass } from './comment.class';
import { LikeStatusEnum } from '../likes/likes.emun';
import { Comments } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { LikeForComment } from '../likes/entity/likesForComment-entity';

@Injectable()
export class CommentQueryRepository {
  constructor(
	@InjectRepository(Comments) protected readonly commentRepository: Repository<Comments>,
	@InjectRepository(LikeForComment) protected readonly likeForCommentRepository: Repository<LikeForComment>
  ) {}

//   async findCommentById(
//     commentId: string,
//     userId: string | null,
//   ): Promise<CommentViewModel | null> {
//     try {
// 		const query = `
// 			select *
// 				from public."Comments"
// 				where "id" = $1
// 		`
//    const findCommentById = (await this.dataSource.query(query, [commentId]))[0]
//    const commentsLikeQuery = `
// 		select *
// 			from public."CommentLikes"
// 			where "commentId" = $1 and "userId" = $2
//    `
//    let myStatus: LikeStatusEnum = LikeStatusEnum.None;
// 		if(userId) {
// 			const commentLikeStatus = (await this.dataSource.query(commentsLikeQuery, [commentId, userId]))[0]
// 			myStatus = commentLikeStatus ? (commentLikeStatus.myStatus as LikeStatusEnum) : LikeStatusEnum.None
// 		}
// 	const viewModelComment = {...findCommentById, commentatorInfo: {userId: findCommentById.userId, userLogin: findCommentById.userLogin}}
//       return commentDBToView(viewModelComment, myStatus);
//     } catch (e) {
//       return null;
//     }
//   }

  async findCommentsByPostId(
    postId: number,
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    userId: number | null,
  ): Promise<PaginationType<CommentViewModel> | null> {
	const queryFindComment = await this.commentRepository
		.createQueryBuilder('c')
		.select()
		.where('c.postId = :postId', {postId})
		.orderBy(`'c'.${sortBy}`, `${sortDirection.toUpperCase()}` === 'DESC' ? 'DESC' : 'ASC')
		.limit(+pageSize)
		.offset((+pageNumber - 1) * +pageSize)
		.getManyAndCount()

	const totalCount = queryFindComment[1]
	const commentsByPostId = queryFindComment[0]
	const commentId = queryFindComment[0][0].id

	// const query = `
	// 	select *
	// 		from "Posts" as p left join "Comments" as c
	// 		on p."id" = c."postId"
	// 		left join "CommentLikes" as cl
	// 		on c."id" = cl."commentId"
	// 		where p."id" = $1
	// `
	// const jointSchets = (await this.dataSource.query(query, [postId]))[0]
	// console.log("jointSchets: ", jointSchets)

  const pagesCount: number = Math.ceil(+totalCount / +pageSize);
  const items: CommentViewModel[] = await Promise.all(
    commentsByPostId.map(async (item) => {
		let myStatus: LikeStatusEnum = LikeStatusEnum.None;
			if (userId) {
				const commentsLikeQuery = await this.likeForCommentRepository
				.createQueryBuilder('lfc')
				.select()
				.where('lfc.id = :id and lfc.userId = :userId', {id: commentId, userId})
				.getMany()
			myStatus = commentsLikeQuery
				? (commentsLikeQuery[0].myStatus as LikeStatusEnum)
				: LikeStatusEnum.None;
			}
    const distracrure = {
      ...item,
      commentatorInfo: { userId: item.userId, userLogin: item.userLogin },
    };
      return commentDBToView(distracrure, myStatus);
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

//   async findCommentByCommentId(commentId: string, userId?: string | null) {
// 	const query = `
// 		SELECT *
// 			FROM public."Comments"
// 			WHERE "id" = $1
// 	`
//     const commentById = (await this.dataSource.query(query, [commentId]))[0]
//     if (!commentById) {
//       return null;
//     }
// 	return {...commentById, commentatorInfo: {userId: commentById.userId, userLogin: commentById.userLogin}}
//   }

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
