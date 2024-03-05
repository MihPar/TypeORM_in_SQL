import { Injectable } from "@nestjs/common";
import { PaginationType } from "../../types/pagination.types";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Posts } from "./entity/entity-posts";
import { LikeForPost } from "../likes/entity/likesForPost-entity";
import { LikeStatusEnum } from "../likes/likes.emun";
import { PostsViewModel } from "./posts.type";

@Injectable()
export class PostsQueryRepository {
  constructor(
	@InjectRepository(Posts) protected readonly postRepositor: Repository<Posts>,
	@InjectRepository(LikeForPost) protected readonly likesInfoRepositor: Repository<LikeForPost>
	) {}

  async findPostsById(
    postId: number,
    userId?: number | null,
  ): Promise<PostsViewModel | null> {

	const findPostByBlogId = await this.postRepositor
		.createQueryBuilder("p")
		.select()
		.where("p.id = :id", {id: postId})
		.getOne()
	
	const newestLikesQuery = await this.likesInfoRepositor
		.createQueryBuilder("lfp")
		.select()
		.where("lfp.postId = :id AND lfp.myStatus = :myStatus", {id: postId, myStatus: "Like"})
		.orderBy("lfp.addedAt", "DESC")
		.limit(3)
		.execute()
	
		let myStatus: LikeStatusEnum = LikeStatusEnum.None;
		if(userId) {
			const likeQuery = await this.likesInfoRepositor
				.createQueryBuilder("lfp")
				.select()
				.where("lfp.postId = :id", {id: postId})
				.getOne()
			myStatus = likeQuery ? (likeQuery.myStatus as LikeStatusEnum) : LikeStatusEnum.None
		}
    return findPostByBlogId ? Posts.getPostsViewModelSAMyOwnStatus(findPostByBlogId, newestLikesQuery, myStatus) : null;
  }

//   async findAllPosts(
//     pageNumber: string,
//     pageSize: string,
//     sortBy: string,
//     sortDirection: string,
//     userId?: string | null
//   ): Promise<PaginationType<Posts>> {
//     const getPostQuery = `
// 			select *
// 				from "Posts"
// 				order by "${sortBy}" ${sortDirection}
// 				limit $1 offset $2
// 		`;
//     const allPosts = await this.dataSource.query(getPostQuery, [
//       +pageSize,
//       (+pageNumber - 1) * +pageSize,
//     ]);

//     const countQuery = `
// 		select count(*)
// 			from "Posts"
// 	`;
//     const totalCount = (await this.dataSource.query(countQuery))[0].count;
//     const pagesCount: number = Math.ceil(+totalCount / +pageSize);

// 	const newestLikesQuery = `
// 			select *
// 				from public."PostLikes" as pl
// 				left join public."Users" as u
// 				on pl."userId" = u."id"
// 					where "postId" = $1 and "myStatus" = 'Like'
// 					order by "addedAt" desc
// 					limit 3 
// 		`;
// 	const LikesQuery = `
// 			select *
// 				from public."PostLikes" 
// 					where "postId" = $1 and "userId" = $2
// 		`;
//     let result: PaginationType<Posts> = {
//       pagesCount: pagesCount,
//       page: +pageNumber,
//       pageSize: +pageSize,
//       totalCount: +totalCount,
//       items: await Promise.all(
//         allPosts.map(async (post) => {
// 		let myStatus: LikeStatusEnum = LikeStatusEnum.None;
// 		if(userId) {
// 			const userLike = (await this.dataSource.query(LikesQuery, [post.id, userId]))[0];
// 			myStatus = userLike ? (userLike.myStatus as LikeStatusEnum) : LikeStatusEnum.None
// 		}
// 		const newestLikes = await this.dataSource.query(newestLikesQuery, [post.id])
//           return PostClass.getPostsViewModelSAMyOwnStatus(post, newestLikes, myStatus);
//         })
//       ),
//     };
//     return result;
//   }

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

	const getJointPostWithLikes = await this.postRepositor
		.createQueryBuilder("p")
		.select("p.*")
		.where("p.blogId = :blogId", {blogId})
		.orderBy(`"p"."${sortBy}"`, `${sortDirection.toUpperCase() === "ASC" ? "ASC" : "DESC"}`)
		.limit(+pageSize)
		.offset((+pageNumber - 1) * +pageSize)
		.getManyAndCount()

	const findPostByBlogId = getJointPostWithLikes[0]
	const totalCount = getJointPostWithLikes[1]

    const pagesCount: number = Math.ceil(totalCount / +pageSize);

    const result: PaginationType<PostsViewModel> = {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: await Promise.all (findPostByBlogId.map(async (post: Posts):Promise<PostsViewModel> => {
		let myStatus: LikeStatusEnum = LikeStatusEnum.None;
		if(userId) {
			const userLike = await this.likesInfoRepositor
				.createQueryBuilder("lfp")
				.where("lfp.userId = :userId", {userId})
				.getOne()

			myStatus = userLike ? (userLike.myStatus as LikeStatusEnum) : LikeStatusEnum.None
		}
		const newestLikes = await this.likesInfoRepositor
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
