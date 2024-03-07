import { LikeForPost } from '../likes/entity/likesForPost.entity';
import { Injectable } from "@nestjs/common";
import { PaginationType } from "../../types/pagination.types";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Posts } from "./entity/entity.posts";
import { LikeStatusEnum } from "../likes/likes.emun";
import { PostsViewModel } from "./posts.type";
import { Comments } from "../comment/entity/comment.entity";

@Injectable()
export class PostsQueryRepository {
  constructor(
	@InjectRepository(Posts) protected readonly postRepositor: Repository<Posts>,
	@InjectRepository(LikeForPost) protected readonly LikeForPostRepository: Repository<LikeForPost>,
	@InjectRepository(Comments) protected readonly commentsRepositor: Repository<Comments>
	) {}

  async findPostsById(
    postId: number,
    userId?: number | null,
  ): Promise<PostsViewModel | null> {

	const findPostByBlogId = await this.postRepositor
		.createQueryBuilder()
		.select()
		.where("id = :id", {id: postId})
		.getOne()
	
	const newestLikesQuery = await this.LikeForPostRepository
		.createQueryBuilder("lfp")
		.select()
		.where("lfp.postId = :id AND lfp.myStatus = :myStatus", {id: postId, myStatus: "Like"})
		.orderBy("lfp.addedAt", "DESC")
		.limit(3)
		.execute()
	
		let myStatus: LikeStatusEnum = LikeStatusEnum.None;
		if(userId) {
			const likeQuery = await this.LikeForPostRepository
				.createQueryBuilder("lfp")
				.select()
				.where("lfp.postId = :id", {id: postId})
				.getOne()
			myStatus = likeQuery ? (likeQuery.myStatus as LikeStatusEnum) : LikeStatusEnum.None
		}
    return findPostByBlogId ? Posts.getPostsViewModelSAMyOwnStatus(findPostByBlogId, newestLikesQuery, myStatus) : null;
  }

  async findAllPosts(
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    userId?: string | null
  ): Promise<PaginationType<PostsViewModel>> {

	const getPosts = await this.postRepositor
		.createQueryBuilder('p')
		.select()
		.orderBy(`'p'.${sortBy}`, `${sortDirection.toUpperCase()}` === 'DESC' ? 'DESC' : 'ASC')
		.limit(+pageSize)
		.offset((+pageNumber - 1) * +pageSize)
		.getManyAndCount()
	
	const allPosts = getPosts[0]
	const postId = allPosts[0].id
	const totalCount = getPosts[1]
	const pagesCount: number = Math.ceil(+totalCount / +pageSize);

	// const newestLikesQuery = `
	// 		select *
	// 			from public."PostLikes" as pl
	// 			left join public."Users" as u
	// 			on pl."userId" = u."id"
	// 				where "postId" = $1 and "myStatus" = 'Like'
	// 				order by "addedAt" desc
	// 				limit 3 
	// 	`;

	
	// const LikesQuery = `
	// 		select *
	// 			from public."PostLikes" 
	// 				where "postId" = $1 and "userId" = $2
	// 	`;
    let result: PaginationType<PostsViewModel> = {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: await Promise.all(
        allPosts.map(async (post) => {
		let myStatus: LikeStatusEnum = LikeStatusEnum.None;
		if(userId) {
			const allLikesUser = await this.LikeForPostRepository
				.createQueryBuilder('lfp')
				.select()
				.where("lfp.postId = :postId AND lfp.userId = :userId", {postId, userId})
				.getMany()
			myStatus = allLikesUser ? (allLikesUser[0].myStatus as LikeStatusEnum) : LikeStatusEnum.None
		}
		const newestLikesQuery = await this.LikeForPostRepository
			.createQueryBuilder('lfp')
			.select()
			.leftJoinAndSelect('lfp', 'u', "lfp.postId = :postId AND lfp.userId = :userId", {postId, userId})
			.where("lfp.postId = :postId AND lfp.myStatus = :myStatus", {postId, myStatus: "Like"})
			.orderBy("lfp.addedAt", 'DESC')
			.limit(3)
			.getMany()

          return Posts.getPostsViewModelSAMyOwnStatus(post, newestLikesQuery, myStatus);
        })
      ),
    };
    return result;
  }

  async findPostsByBlogsId(
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    blogId: number,
	userId: number | null
  )
  : Promise<PaginationType<PostsViewModel>> 
  {
// console.log("blogId: ", blogId)
	const getAllPostWithPagin = await this.postRepositor
		.createQueryBuilder()
		.select()
		.where("id = :blogId", {blogId})
		.orderBy(`"${sortBy}"`, `${sortDirection.toUpperCase() === "ASC" ? "ASC" : "DESC"}`)
		.limit(+pageSize)
		.offset((+pageNumber - 1) * +pageSize)
		.getManyAndCount()
		// .getMany()

		console.log("getAllPostWithPagin: ", getAllPostWithPagin)

	const findPostByBlogId = getAllPostWithPagin[0]
	console.log("findPostByBlogId: ", findPostByBlogId)
	const totalCount = getAllPostWithPagin[1]
	const postId = findPostByBlogId[0].id

    const pagesCount: number = Math.ceil(totalCount / +pageSize);

    const result: PaginationType<PostsViewModel> = {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: await Promise.all (findPostByBlogId.map(async (post: Posts):Promise<PostsViewModel> => {
		let myStatus: LikeStatusEnum = LikeStatusEnum.None;
		if(userId) {
			const userLike = await this.LikeForPostRepository
				.createQueryBuilder()
				.where("userId = :userId AND postId = :postId", {userId, postId})
				.getOne()

			myStatus = userLike ? (userLike.myStatus as LikeStatusEnum) : LikeStatusEnum.None
		}
		const newestLikes = await this.LikeForPostRepository
			.createQueryBuilder("lfp")
			.where("lfp.userId = :userId AND lfp.myStatus = myStatus", {userId, myStaus: "Like"})
			.orderBy("lfp.addedAt", "DESC")
			.limit(3)
			.getMany()
		
         return Posts.getPostsViewModelSAMyOwnStatus(post, newestLikes, myStatus)
		}
      ))
    };
	console.log("result: ", result)
    return result;
  }

  async getPostById(
    postId: number,
  ): Promise<PostsViewModel | boolean> {
	const post = await this.postRepositor
		.createQueryBuilder("p")
		.select()
		.where("p.id = :id", {id: postId})
		.getOne()
		
	if(!post) return false
	return true
  }
}
