import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Blogs } from "../blogs/entity/blogs.entity";


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

  async updateBlogById(
    blogId: number,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<Blogs | any> {

	const updateBlogById = await this.blogsRepository
		.createQueryBuilder("b")
		.update()
		.set({name, description, websiteUrl})
		.where('b.id = :id', {id: blogId})
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