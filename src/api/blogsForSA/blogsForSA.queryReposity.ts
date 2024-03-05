import { BlogsRepository } from './../blogs/blogs.repository';
import { Injectable } from "@nestjs/common";
import { PaginationType } from "../../types/pagination.types";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
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
		.createQueryBuilder("b")
		.select()
		.where("b.name = :name", {name: `%${searchNameTerm}%`})
		.orderBy(`"b".${sortBy}`, `${sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC"}`)
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
    blogId: number,
    userId?: number
  ): Promise<BlogsViewTypeWithUserId | null> {
	const findBlogId = await this.blogsRepository
		.createQueryBuilder("b")
		.select("b.*")
		.where("b.id = :id", {id: blogId})
		.getOne()

    return findBlogId ? Blogs.getBlogsViewModel(findBlogId) : null;
  }

  async deletedBlog(id: number): Promise<boolean | null> {
	const deleteBlog = await this.blogsRepository
		.createQueryBuilder("b")
		.delete()
		.where("b.id = :id", {id})
		.execute()
		
    if(!deleteBlog) return null
	return true
  }
}