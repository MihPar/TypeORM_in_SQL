import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepositoryForSA } from "../blogsForSA.repository";
import { BlogsViewType } from "../../blogs/blogs.type";
import { Blogs } from "../../blogs/entity/blogs.entity";
import { BodyBlogsModel } from "../dto/blogs.class-pipe";

export class CreateNewBlogForSACommand {
	constructor(
		public inputDateModel: BodyBlogsModel,
		public userId: string
	) {}
}

@CommandHandler(CreateNewBlogForSACommand) 
export class CreateNewBlogForSAUseCase
  implements ICommandHandler<CreateNewBlogForSACommand>
{
  constructor(protected readonly blogsRepositoryForSA: BlogsRepositoryForSA) {}
  async execute(
    command: CreateNewBlogForSACommand
  ): Promise<BlogsViewType | null> {
    const newBlog = new Blogs()

      newBlog.name = command.inputDateModel.name,
      newBlog.description = command.inputDateModel.description,
      newBlog.websiteUrl = command.inputDateModel.websiteUrl,
	  newBlog.userId = command.userId;
      newBlog.isMembership = false
	  
	  
    const createBlog: Blogs | null =
      await this.blogsRepositoryForSA.createNewBlogs(newBlog);
	//   console.log("id: ", createBlog.id)
    if (!createBlog) return null;
    return Blogs.createNewBlogForSA(createBlog)
  }
}