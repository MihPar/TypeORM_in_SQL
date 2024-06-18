import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsQueryRepositoryForSA } from '../../blogsForSA/blogsForSA.queryReposity';
import { NotFoundException } from '@nestjs/common';

export class DeleteBlogByIdBloggerForSACommnad {
  constructor(
	public id: string,
	public userId: string
) {}
}
@CommandHandler(DeleteBlogByIdBloggerForSACommnad)
export class DeleteBlogByIdBloggerForSAUseCase implements ICommandHandler<DeleteBlogByIdBloggerForSACommnad> {
  constructor(
	protected readonly blogsQueryRepositoryForSA: BlogsQueryRepositoryForSA
) {}
  async execute(command: DeleteBlogByIdBloggerForSACommnad): Promise<boolean | null> {
	await this.blogsQueryRepositoryForSA.findBlogByIdBlogger(command.id, command.userId)

    const deleteId: boolean | null = await this.blogsQueryRepositoryForSA.deletedBlog(
      command.id,
    );
	if(!deleteId) throw new NotFoundException([
		{message: 'Blog not found'}
	])
    return deleteId
  }
}
