import { Injectable } from "@nestjs/common";
import { PaginationType } from "../../types/pagination.types";
import { BlogsViewType } from "./blogs.type";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Blogs } from "./entity/blogs.entity";

@Injectable()
export class BlogsQueryRepository {
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

	const findAllBlogs = await this.blogsRepository
		.createQueryBuilder("b")
		.select('blogs')
		.where("b.name ILIKE :name", {name: `%${searchNameTerm}%`})
		.orderBy(`"user"."${sortBy}"`, `${sortDirection.toUpperCase() === "ASC" ? "ASC" : "DESC"}`)
		.limit(+pageSize)
		.offset((+pageNumber - 1) * +pageSize)
		.getMany()

	
const totalCount = await this.blogsRepository
	.createQueryBuilder("b")
	.where("b.name ILIKE :name", {name: `%${searchNameTerm}%`})
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
		.createQueryBuilder("b")
		.select("blogs")
		.where("b.id = :id", {id: blogId})
		.getOne()
  	return findBlogById ? Blogs.createNewBlogForSA(findBlogById) : null;
    }
}