import { Injectable } from "@nestjs/common";
import { PaginationType } from "../types/pagination.types";
import { BlogsViewType } from "./blogs.type";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Blogs } from "./entity/blogs.entity";
import { CommentForCurrentBloggerResponse } from "../blogger/typtBlogger";
import { Comments } from "../comment/entity/comment.entity";
import { LikeForComment } from "../likes/entity/likesForComment.entity";
import { LikeStatusEnum } from "../likes/likes.emun";
import { Posts } from "../posts/entity/entity.posts";

@Injectable()
export class BlogsQueryRepository {
	constructor(
		@InjectRepository(Blogs) protected readonly blogsRepository: Repository<Blogs>,
		@InjectRepository(Comments) protected readonly commentsRepository: Repository<Comments>,
		@InjectRepository(LikeForComment) protected readonly commentLikesRepository: Repository<LikeForComment>,
		@InjectRepository(Posts) protected readonly postsRepository: Repository<Posts>
	) { }

	async findAllBlogs(
		searchNameTerm: string | null,
		sortBy: string,
		sortDirection: string,
		pageNumber: string,
		pageSize: string
	): Promise<PaginationType<BlogsViewType>> {

		const findAllBlogs = await this.blogsRepository
			.createQueryBuilder()
			.select()
			.where("name ILIKE :name", { name: `%${searchNameTerm}%` })
			.andWhere(`"isBanned" = :isBanned`, {isBanned: false})
			.orderBy(`"${sortBy}"`, `${sortDirection.toUpperCase() === "ASC" ? "ASC" : "DESC"}`)
			.limit(+pageSize)
			.offset((+pageNumber - 1) * +pageSize)
			.getMany()


		const totalCount = await this.blogsRepository
			.createQueryBuilder()
			.where("name ILIKE :name", { name: `%${searchNameTerm}%` })
			.getCount()

		const pagesCount: number = Math.ceil(totalCount / +pageSize);

		const result: PaginationType<BlogsViewType> = {
			pagesCount: pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount: +totalCount,
			items: findAllBlogs.map((item) => Blogs.createNewBlogForSA(item)),
		};
		return result;
	}

	// async findRawBlogById(blogId: string, userId?: string): Promise<BlogClass | null> {
	// 	const blog: BlogClass | null =  await this.blogModel.findOne({ _id: new ObjectId(blogId) }, {__v: 0}).lean();
	// 	return blog
	//   }

	async findBlogById(blogId: string): Promise<BlogsViewType | null> {
		const findBlogById = await this.blogsRepository
			.createQueryBuilder()
			.select()
			.where("id = :id", { id: blogId })
			.getOne()
		return findBlogById ? Blogs.createNewBlogForSA(findBlogById) : null;
	}

	async findAllCommentsForCurrentBlogger(
		sortBy: string,
		sortDirection: 'asc' | 'desc',
		pageSize: number,
		pageNumber: number,
		userId: string
	): Promise<CommentForCurrentBloggerResponse> {
		const queryBuilder = await this.commentsRepository
		.findAndCount({
			relations: {post: {user: true}},
			where: {post: {user: {id: userId}}},
			order: {
				[sortBy]: `${sortDirection.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`,
			  },
			  take: pageSize,
			  skip: (pageNumber - 1) * pageSize,
		})
			// .createQueryBuilder("c")
			// .innerJoinAndSelect("c.post", 'post')
			// .where(`"c"."userId" = :userId`, { userId })
			// .orderBy(
			//     "c." + sortBy,
			//     // `"${sortBy}"`,
			// 	sortDirection.toUpperCase() as 'ASC' | 'DESC',
			// )
			// .take(pageSize)
			// .skip((pageNumber - 1) * pageSize);

		const [comments, totalCountQuery] = queryBuilder
		// const [comments, totalCountQuery] = await queryBuilder.getManyAndCount();

		const items = await Promise.all(
			comments.map(async (c) => {
				const likesBuilder = await this.commentLikesRepository.findAndCountBy(
					 {myStatus: LikeStatusEnum.Like, commentId: c.id, isBanned: false}
				)
				const likeCount = await likesBuilder[1];

				const dislikesBuilder = await this.commentLikesRepository.findAndCountBy(
					{myStatus: LikeStatusEnum.Dislike, commentId: c.id, isBanned: false}
			   )
			   const dislikeCount = await likesBuilder[1];

			   const userStatusQuery = await this.commentLikesRepository.findOneBy(
					{
					userId, commentId: c.id
					}
				)
				const userStatus = userStatusQuery ? userStatusQuery.myStatus : 'None';

				const post: Posts | null = await this.postsRepository.findOneBy({id: c.postId})

				return {
					id: c.id,
					content: c.content,
					commentatorInfo: {
						userId: c.userId,
						userLogin: c.userLogin,
					},
					createdAt: c.createdAt,
					likesInfo: {
						likesCount: likeCount,
						dislikesCount: dislikeCount,
						myStatus: userStatus,
					},
					postInfo: {
						id: post!.id,
						title: post!.title,
						blogId: post!.blogId,
						blogName: post!.blogName,
					},
				};
			}),
		);

		return {
			pagesCount: Math.ceil(totalCountQuery / pageSize),
			page: pageNumber,
			pageSize,
			totalCount: totalCountQuery,
			items,
		};
	}
}