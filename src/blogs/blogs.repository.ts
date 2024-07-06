import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Blogs } from "./entity/blogs.entity";
import { BanInputModel } from "../users/user.class";
import { UserBlogger } from "../blogger/domain/entity.userBlogger";

@Injectable()
export class BlogsRepository {
	
	constructor(
		@InjectRepository(Blogs) protected readonly blogsRepository: Repository<Blogs>,
		@InjectRepository(UserBlogger) protected readonly userBloggerRepository: Repository<UserBlogger>
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

		if(!getBlog) throw new NotFoundException([
			{message: 'Blog not found'}
		])

		return getBlog
}

async banUnbanBlogByUserId(id: string, ban: boolean) {
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

async findBlogByUserIdBlogId(userId: string, blogId: string) {
	const findBlog = await this.blogsRepository
		.createQueryBuilder()
		.select()
		.where(`id = :blogId`, {blogId})
		.getOne()

		// console.log("findBlog: ", findBlog)

	if(!findBlog) {
		throw new NotFoundException([
		{message: 'Blog not found'}
	])
}
	if(findBlog.userId !== userId) {
		throw new ForbiddenException([
			{message: 'You are not allowed'}
		])
	}
}

async deleteUserBanBlogger() {
	await this.userBloggerRepository
		.createQueryBuilder()
		.delete()
		.execute()
		
    return true;
}

async banBlog(id: string, isBanned: boolean, date: string) {
	const blogBanned = await this.blogsRepository.update(
		{ id },
		{ isBanned, banDate: date },
	  );
  console.log('banBlog: ', await this.blogsRepository.createQueryBuilder().where({id}).getOne())
	  return (
		blogBanned.affected !== null &&
		blogBanned.affected !== undefined &&
		blogBanned.affected > 0
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