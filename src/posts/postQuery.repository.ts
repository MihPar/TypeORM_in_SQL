import { LikeForPost } from '../likes/entity/likesForPost.entity';
import { Injectable } from "@nestjs/common";
import { PaginationType } from "../types/pagination.types";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Posts } from "./entity/entity.posts";
import { LikeStatusEnum } from "../likes/likes.emun";
import { PostsViewModel } from "./posts.type";
import { Comments } from "../comment/entity/comment.entity";
import { Main } from '../blogs/entity/main';

@Injectable()
export class PostsQueryRepository {
	constructor(
		@InjectRepository(Posts) protected readonly postRepository: Repository<Posts>,
		@InjectRepository(LikeForPost) protected readonly LikeForPostRepository: Repository<LikeForPost>,
		@InjectRepository(Comments) protected readonly commentsRepositor: Repository<Comments>,
		@InjectRepository(Main) protected readonly mainRepository: Repository<Main>
	) { }

	async findPostsById(
		postId: string,
		userId?: string | null,
	): Promise<PostsViewModel | null> {
		try {
			const findPostById = await this.postRepository
				.createQueryBuilder()
				.select()
				.where("id = :id", { id: postId })
				.andWhere(`"isBanned" = :isBanned`, {isBanned: false})
				.getOne()

				const newestLikesQuery = await this.LikeForPostRepository
				.find({
					where: {
						postId: postId,
						myStatus: "Like",
						isBanned: false
					},
					order: {
						addedAt: "DESC"
					},
					take: 3
				})

			const likeQuery = await this.LikeForPostRepository
				.createQueryBuilder()
				.select()
				.where(`"postId" = :postId`, { postId })
				.andWhere(`"isBanned" = :isBanned`, {isBanned: false})
				.getOne()

			let myStatus: LikeStatusEnum = LikeStatusEnum.None;
			if (userId) {

				myStatus = likeQuery ? (likeQuery?.myStatus as LikeStatusEnum) : LikeStatusEnum.None
			}
			const getMainByPostId = await this.mainRepository
					.createQueryBuilder()
					.where(`"postId" = :postId`, {postId})
					.getOne()
		
			return findPostById ? Posts.getPostsViewModelSAMyOwnStatus(findPostById, newestLikesQuery, myStatus, getMainByPostId) : null

		} catch (err) {
			console.log({ repo_err: err })
		}
	}

	async findAllPosts(
		pageNumber: string,
		pageSize: string,
		sortBy: string,
		sortDirection: string,
		userId?: string | null
	): Promise<PaginationType<PostsViewModel>> {

		const getPosts = await this.postRepository
			.createQueryBuilder()
			.select()
			.orderBy(`"${sortBy}"`, `${sortDirection.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`)
			.limit(+pageSize)
			.offset((+pageNumber - 1) * +pageSize)
			.getManyAndCount()

		const allPosts = getPosts[0]
		const postId = allPosts[0].id
		const totalCount = getPosts[1]
		const pagesCount: number = Math.ceil(+totalCount / +pageSize);
		let result: PaginationType<PostsViewModel> = {
			pagesCount: pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount: +totalCount,
			items: await Promise.all(
				allPosts.map(async (post) => {
					let myStatus: LikeStatusEnum = LikeStatusEnum.None;
					if (userId) {
						const allLikesUser = await this.LikeForPostRepository
							.createQueryBuilder()
							.select()
							.where(`"postId" = :postId AND "userId" = :userId`, { postId: post.id, userId })
							.getMany()
						myStatus = allLikesUser ? (allLikesUser[0]?.myStatus as LikeStatusEnum) : LikeStatusEnum.None
					}

					const newestLikesQuery = await this.LikeForPostRepository
						.find({
							where: { postId: post.id, myStatus: 'Like' },
							order: { addedAt: 'DESC' },
							take: 3,
						});

						const getMainByPostId = await this.mainRepository
							.createQueryBuilder()
							.where(`"postId" = :postId`, {postId: post.id})
							.getOne()
		
					return Posts.getPostsViewModelSAMyOwnStatus(post, newestLikesQuery, myStatus, getMainByPostId);
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
		blogId: string,
		userId: string | null
	): Promise<PaginationType<PostsViewModel>> {
		const getAllPostWithPagin = await this.postRepository
			.createQueryBuilder()
			.select()
			.where(`"blogId" = :blogId`, { blogId })
			.orderBy(`"${sortBy}"`, `${sortDirection.toUpperCase() === "ASC" ? "ASC" : "DESC"}`)
			.limit(+pageSize)
			.offset((+pageNumber - 1) * +pageSize)
			.getManyAndCount()

		const findPostByBlogId = getAllPostWithPagin[0]
		const totalCount = getAllPostWithPagin[1]
		const pagesCount: number = Math.ceil(totalCount / +pageSize);
		const result: PaginationType<PostsViewModel> = {
			pagesCount: pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount: +totalCount,
			items: await Promise.all(findPostByBlogId.map(async (post: Posts): Promise<PostsViewModel> => {
				let myStatus: LikeStatusEnum = LikeStatusEnum.None;
				if (userId) {
					const userLike = await this.LikeForPostRepository
						.createQueryBuilder()
						.select()
						.where(`"userId" = :userId AND "postId" = :postId`, { userId, postId: post.id })
						.getOne()

					myStatus = userLike ? (userLike?.myStatus as LikeStatusEnum) : LikeStatusEnum.None
				}
				const newestLikes = await this.LikeForPostRepository
					.createQueryBuilder()
					.select()
					.where(`"postId" = :postId AND "myStatus" = :myStatus`, { postId: post.id, myStatus: "Like" })
					.orderBy(`"addedAt"`, "DESC")
					.limit(3)
					.getMany()

				const getMainByBlogIdPostId = await this.mainRepository
					.createQueryBuilder()
					.where(`"blogId" = :blogId AND "postId" = :postId`, {blogId, postId: post.id})
					.getOne()

				return Posts.getPostsViewModelSAMyOwnStatus(post, newestLikes, myStatus, getMainByBlogIdPostId)
			}
			))
		};
		return result;
	}
	// !important rename
	async getPostById(
		postId: string,
	): Promise<PostsViewModel | boolean> {
		const post = await this.postRepository
			.createQueryBuilder()
			.select()
			.where("id = :id", { id: postId })
			.getOne()

		if (!post) return false
		return true
	}

	async findPostById(
		postId: string,
	): Promise<Posts | false> {
		const post = await this.postRepository
			.createQueryBuilder()
			.select()
			.where("id = :id", { id: postId })
			.getOne()

		if (!post) return false
		return post
	}
}
