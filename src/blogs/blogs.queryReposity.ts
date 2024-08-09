import { Injectable, NotFoundException } from "@nestjs/common";
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
import { Wallpaper } from "./entity/wallpaper.entity";
import { Main } from "./entity/main.entity";
import { Subscribe } from "./entity/subscribe.entity";
import { prototype } from "events";

@Injectable()
export class BlogsQueryRepository {
	
	
	constructor(
		@InjectRepository(Blogs) protected readonly blogsRepository: Repository<Blogs>,
		@InjectRepository(Comments) protected readonly commentsRepository: Repository<Comments>,
		@InjectRepository(LikeForComment) protected readonly commentLikesRepository: Repository<LikeForComment>,
		@InjectRepository(Posts) protected readonly postsRepository: Repository<Posts>,
		@InjectRepository(Wallpaper) protected readonly wallpaperRepositry: Repository<Wallpaper>,
		@InjectRepository(Main) protected readonly mainRepositry: Repository<Main>,
		@InjectRepository(Subscribe) protected readonly subscribeRepository: Repository<Subscribe>
	) {}

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
			items: await Promise.all(findAllBlogs.map(async(item) => {
				const getWallpaper: Wallpaper = await this.wallpaperRepositry
					.createQueryBuilder()
					.where(`"blogId" = :blogId`, {blogId: item.id})
					.getOne()
					
				const getMain: Wallpaper = await this.mainRepositry
					.createQueryBuilder()
					.where(`"blogId" = :blogId`, {blogId: item.id})
					.getOne()
					
				return Blogs.getBlog(item, getWallpaper, getMain)
			})),
		};
		return result;
	}

	// async findRawBlogById(blogId: string, userId?: string): Promise<BlogClass | null> {
	// 	const blog: BlogClass | null =  await this.blogModel.findOne({ _id: new ObjectId(blogId) }, {__v: 0}).lean();
	// 	return blog
	//   }

	// async findBlogById(blogId: string): Promise<BlogsViewType | null> {
	// 	const findBlogById = await this.blogsRepository
	// 		.createQueryBuilder()
	// 		.select()
	// 		.where("id = :id", { id: blogId })
	// 		.getOne()
	// 	return findBlogById ? Blogs.createNewBlogForSA(findBlogById) : null;
	// }
	async getBlogByBlogId(id: string) {
		const findBlogById = await this.blogsRepository
			.createQueryBuilder()
			.select()
			.where("id = :id", { id })
			.getOne()
			if(!findBlogById) throw new NotFoundException([{message: "This blog do not found"}])
			
			return findBlogById
	}

	async getBlogById(blog: Blogs) {
		const findWallpaperByBlogId = await this.wallpaperRepositry
			.createQueryBuilder()
			.select()
			.where(`"blogId" = :id`, {id: blog.id})
			.getOne()
			if(!findWallpaperByBlogId) throw new NotFoundException([{message: "This wallpaper does not found"}])

		const findMainByBlogId = await this.mainRepositry
			.createQueryBuilder()
			.select()
			.where(`"blogId" = :id`, {id: blog.id})
			.getOne()
			if(!findWallpaperByBlogId) throw new NotFoundException([{message: "This main does not found"}])

		return blog ? Blogs.getBlog(blog, findWallpaperByBlogId, findMainByBlogId) : null;
	}

	async findBlog(id: string): Promise<Blogs> {
		const findBlogById = await this.blogsRepository
			.createQueryBuilder()
			.select()
			.where(`id = :id`, {id})
			.getOne()

			if(!findBlogById) throw new NotFoundException([{message: "This blog do not found"}])
			return findBlogById
	}

	async findBlogByIdAndPostId(blogId: string, postId?: string) {
		const blog = await this.blogsRepository
			.createQueryBuilder()
			.where(`id = :blogId`, {blogId})
			.getOne()
			if(!blog) throw new NotFoundException([{message: "This blog do not found"}])
			return blog
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

	async deleteSubscribeForPost(blogId: string): Promise<boolean> {
		const deleteSubscribe = await this.subscribeRepository
			.createQueryBuilder()
			.delete()
			.from(Subscribe)
			.where(`"blogId" = :blogId`, {blogId})

			if(!deleteSubscribe) throw new NotFoundException([{message: 'Blog have not deleted'}])
			return true
	}

	async deleteAllSubscribe() {
		await this.subscribeRepository.createQueryBuilder().delete().execute()
		return 
	}
}