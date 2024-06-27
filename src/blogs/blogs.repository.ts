import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Blogs } from "./entity/blogs.entity";
import { BanInputModel } from "../users/user.class";

@Injectable()
export class BlogsRepository {
	
	
	constructor(
		@InjectRepository(Blogs) protected readonly blogsRepository: Repository<Blogs>
	) {}
  async deleteRepoBlogs() {
    await this.blogsRepository
		.createQueryBuilder()
		.delete()
		.execute()
		
    return true;
  }

  async bindBlogByIdUserId(id: string, userId: string): Promise<Blogs> {
	const updateBlogByBind = await this.blogsRepository
		.createQueryBuilder()
		.update(Blogs)
		.set({
			isBanned: false,
			banDate: new Date().toISOString()	
		})
		.where("id = :id", {id})
		.andWhere("userId = :useId", {userId})
		.execute()

	const getBinBlog = await this.blogsRepository
		.createQueryBuilder()
		.where("id = :id", {id})
		.getOne()
	
	if(!getBinBlog) throw new Error('does not update blogs by bind')
	return getBinBlog
}

async findBlogById(id: any): Promise<Blogs | null> {
	const getBlog = await this.blogsRepository
		.createQueryBuilder()
		.where("id = :id", {id})
		.getOne()
		return getBlog
}

async banBlogByUserId(id: string, ban: boolean) {
	const postBanned = await this.blogsRepository.update(
		{ userId: id },
		{
		  isBanned: ban,
		},
	  );
  
	  return (
		postBanned.affected !== null &&
		postBanned.affected !== undefined &&
		postBanned.affected > 0
	  );
}

//   async createNewBlogs(newBlog: BlogClass): Promise<BlogClass | null> {
// 	try {
// 		const result = await this.blogModel.create(newBlog);
// 		await result.save()
// 		return newBlog
// 	} catch(error) {
// 		console.log(error, 'error in create post');
//       return null;
// 	}
    
//   }

//   async updateBlogById(
//     id: string,
//     name: string,
//     description: string,
//     websiteUrl: string,
//   ): Promise<BlogClass | any> {
//     const result = await this.blogModel.updateOne(
//       { _id: id },
//       {
//         $set: { name: name, description: description, websiteUrl: websiteUrl },
//       },
//     );
//     return result.matchedCount === 1
//   }

//   async deletedBlog(id: string) {
//     const result = await this.blogModel.deleteOne({ _id: new ObjectId(id) });
//     return result.deletedCount === 1;
//   }
}