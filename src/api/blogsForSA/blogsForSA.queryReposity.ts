import { Injectable } from "@nestjs/common";
import { PaginationType } from "../../types/pagination.types";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlogsViewType, BlogsViewTypeWithUserId } from "../blogs/blogs.type";
import { Blogs } from "../blogs/entity/blogs.entity";

@Injectable()
export class BlogsQueryRepositoryForSA {
  constructor(
	@InjectRepository(Blogs) protected readonly blogsRepository: Repository<Blogs>
  ) {}

  async findAllBlogs(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string
  ): Promise<PaginationType<BlogsViewType>> {

	const findBlogs = await this.blogsRepository
		.createQueryBuilder()
		.select()
		.where("name = :name", {name: `%${searchNameTerm}%`})
		.orderBy(`${sortBy}`, `${sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC"}`)
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

  async findBlogById(
    blogId: string,
  ): Promise<BlogsViewTypeWithUserId | null> {
	const findBlogId = await this.blogsRepository
		.createQueryBuilder()
		.select()
		.where("id = :id", {id: blogId})
		.getOne()
	// console.log("findBlogId: ", findBlogId)
    return findBlogId ? Blogs.getBlogsViewModel(findBlogId) : null;
  }

  async deletedBlog(id: string): Promise<boolean | null> {
	const deleteBlog = await this.blogsRepository
		.createQueryBuilder()
		.delete()
		.where("id = :id", {id})
		.execute()
		
    if(!deleteBlog) return null
	return true
  }
}