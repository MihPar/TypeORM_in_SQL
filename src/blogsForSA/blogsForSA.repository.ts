import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Blogs } from "../blogs/entity/blogs.entity";
import { BlogsViewTypeWithUserId } from "../blogs/blogs.type";


@Injectable()
export class BlogsRepositoryForSA {
	constructor(
		@InjectRepository(Blogs) protected readonly blogsRepository: Repository<Blogs>
	) {}

  async createNewBlogs(newBlog: Blogs): Promise<Blogs | null> {
	try {
		const createNewBlog = await this.blogsRepository.save(newBlog)
		return createNewBlog
	} catch(error) {
		console.log(error, 'error in create post');
      return null;
	}
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


  async updateBlogById(
    blogId: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<Blogs | any> {

	const updateBlogById = await this.blogsRepository
		.createQueryBuilder()
		.update()
		.set({name, description, websiteUrl})
		.where('id = :id', {id: blogId})
		.execute()

		if(!updateBlogById) return false
    return true
  }

  async deleteRepoBlogsFroSA() {
	await this.blogsRepository
		.createQueryBuilder()
		.delete()
		.execute()
		
	return true
  }
}