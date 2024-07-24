import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PaginationType } from "../types/pagination.types";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlogsViewType, BlogsViewTypeWithUserId, BlogsViewWithBanType } from "../blogs/blogs.type";
import { Blogs } from "../blogs/entity/blogs.entity";
import { User } from "../users/entities/user.entity";
import { UsersQueryRepository } from "../users/users.queryRepository";
import { Wallpaper } from "../blogs/entity/wallpaper.entity";
import { Main } from "../blogs/entity/main.entity";

@Injectable()
export class BlogsQueryRepositoryForSA {

	constructor(
		@InjectRepository(Blogs) protected readonly blogsRepository: Repository<Blogs>,
		@InjectRepository(User) protected readonly userQueryRepository: UsersQueryRepository,
		@InjectRepository(User) protected readonly userRepository: Repository<User>,
		@InjectRepository(Wallpaper) protected readonly wallpaperRepository: Repository<Wallpaper>,
		@InjectRepository(Main) protected readonly mainRepository: Repository<Main>,
	) { }

	async findAllBlogs(
		searchNameTerm: string | null,
		sortBy: string,
		sortDirection: string,
		pageNumber: string,
		pageSize: string,
		userId: string
	): Promise<PaginationType<BlogsViewType>> {

		const findBlogs = await this.blogsRepository
			.createQueryBuilder()
			.select()
			// .where("name = :name", { name: `%${searchNameTerm}%` })
			.where(`"userId" = :userId`, { userId})
			.andWhere(
				`${
				  searchNameTerm
					? 'name ilike :searchNameTerm'
					: 'name is not null'
				}`,
				{ searchNameTerm: `%${searchNameTerm}%` },
			  )
			.orderBy(`"${sortBy}"`, `${sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC"}`)
			.limit(+pageSize)
			.offset((+pageNumber - 1) * +pageSize)
			.getManyAndCount()

		const findAllBlogs = findBlogs[0]
		const totalCount = findBlogs[1]

		const pagesCount: number = Math.ceil(totalCount / +pageSize);

		const result: PaginationType<BlogsViewType> = {
			pagesCount: pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount: +totalCount,
			items: await Promise.all(findAllBlogs.map(async(item) => {
				const getWallpaper = await this.wallpaperRepository
					.createQueryBuilder()
					.where(`"blogId" = :id`, {id: item.id})
					.getOne()

				const getMain = await this.mainRepository
					.createQueryBuilder()
					.where(`"blogId" = :id`, {id: item.id})
					.getOne()
				return Blogs.getBlog(item, getWallpaper, getMain)
			})),
		};
		return result;
	}

	async getAllBlogsWithInfoBan(
		searchNameTerm: string | null,
		sortBy: string,
		sortDirection: string,
		pageNumber: string,
		pageSize: string
	): Promise<PaginationType<BlogsViewWithBanType>> {

		const findBlogs = await this.blogsRepository
			.createQueryBuilder()
			.select()
			.where(
				`${
				  searchNameTerm
					? 'name ilike :searchNameTerm'
					: 'name is not null'
				}`,
				{ searchNameTerm: `%${searchNameTerm}%` },
			  )
			// .andWhere("name = :name", { name: `%${searchNameTerm}%` })
			.orderBy(`"${sortBy}"`, `${sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC"}`)
			.limit(+pageSize)
			.offset((+pageNumber - 1) * +pageSize)
			.getManyAndCount()

		const findAllBlogs = findBlogs[0]
		const totalCount = findBlogs[1]

		// console.log("findAllBlogs: ", findAllBlogs)
		// console.log("findAllBlogs: ", findBlogs[0].length)
		// console.log("findAllBlogs: ", findBlogs[0])

		const pagesCount: number = Math.ceil(totalCount / +pageSize);
		const result: PaginationType<BlogsViewWithBanType> = {
			pagesCount: pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount: +totalCount,
			items: await Promise.all(findAllBlogs.map(async (item) => {
				// console.log("Promise: ")
				let user: User | null = await this.userRepository
					.createQueryBuilder()
					.select()
					.where(`id = :id`, { id: item.userId})
					.getOne()
				// const user = await this.userQueryRepository.findUserByIdBlogger(item.userId)
				// console.log("user: ", user)
				return Blogs.findBlogForSAWithInfoBan(item, user)
			}
			))
		};
		// console.log("result: ", result)
		return result;
	}

	async findBlogById(
		blogId: string,
		userId?: string
	): Promise<BlogsViewTypeWithUserId | null> {
		const findBlogId = await this.blogsRepository
			.findOneBy({ id: blogId })
		return findBlogId ? Blogs.getBlogsViewModel(findBlogId) : null;
	}

	
	async deletedBlog(id: string): Promise<boolean | null> {
		const deleteBlog = await this.blogsRepository
			.delete({ id })
		if (!deleteBlog) return null
		return true
	}


}