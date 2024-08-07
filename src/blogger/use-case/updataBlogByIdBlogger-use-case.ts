import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "../../users/entities/user.entity";
import { NotFoundException } from "@nestjs/common";
import { BodyBlogsModel } from "../../blogsForSA/dto/blogs.class-pipe";
import { BlogsRepositoryForSA } from "../../blogsForSA/blogsForSA.repository";

export class UpdateBlogBloggerForSACommand {
	constructor(
		public blogId: string,
		public inputDateMode: BodyBlogsModel,
		public user: User
	) {}
}

@CommandHandler(UpdateBlogBloggerForSACommand)
export class UpdateBlogBloggerForSAUseCase implements ICommandHandler<UpdateBlogBloggerForSACommand> {
  constructor(
	private readonly blogsRepositoryForSA: BlogsRepositoryForSA,
) {}
  async execute(command: UpdateBlogBloggerForSACommand): Promise<boolean> {
	await this.blogsRepositoryForSA.findBlogByIdBlogger(command.blogId, command.user.id)

    const updateBlog = await this.blogsRepositoryForSA.updateBlogById(
      command.blogId,
      command.inputDateMode.name,
      command.inputDateMode.description,
      command.inputDateMode.websiteUrl,
    )
	if(!updateBlog) throw new NotFoundException([
		{message: 'Blog not found'}
	])
	return true
  }
}