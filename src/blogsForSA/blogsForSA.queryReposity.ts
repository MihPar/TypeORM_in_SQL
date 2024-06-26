import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PaginationType } from "../types/pagination.types";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlogsViewType, BlogsViewTypeWithUserId, BlogsViewWithBanType } from "../blogs/blogs.type";
import { Blogs } from "../blogs/entity/blogs.entity";
import { User } from "../users/entities/user.entity";
import { UsersQueryRepository } from "../users/users.queryRepository";

@Injectable()
export class BlogsQueryRepositoryForSA {

	constructor(
		@InjectRepository(Blogs) protected readonly blogsRepository: Repository<Blogs>,
		@InjectRepository(User) protected readonly userQueryRepository: UsersQueryRepository,
		@InjectRepository(User) protected readonly userRepository: Repository<User>,
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
			items: findAllBlogs.map((item) => Blogs.createNewBlogForSA(item)),
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

	async findBlogByIdBlogger(
		blogId: string,
		userId?: string
	): Promise<BlogsViewTypeWithUserId | null> {
		const findBlogId = await this.blogsRepository
			.findOneBy({ id: blogId })
		if (!findBlogId) throw new NotFoundException([
			{ message: 'Blog not found' }
		])
		if (findBlogId?.userId !== userId) throw new ForbiddenException([
			{ message: 'This user does not have access in blog, 403' }
		])
		return findBlogId ? Blogs.getBlogsViewModel(findBlogId) : null;
	}

	async deletedBlog(id: string): Promise<boolean | null> {
		const deleteBlog = await this.blogsRepository
			.delete({ id })
		if (!deleteBlog) return null
		return true
	}


}