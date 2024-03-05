import { PostsRepository } from './../posts.repository';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class DeleteAllPostsComand {
	constructor() {}
}

@CommandHandler(DeleteAllPostsComand)
export class DeleteAllPostsUseCase implements ICommandHandler<DeleteAllPostsComand> {
	constructor(
		protected readonly postsRepository: PostsRepository
	) {}
 	async execute(command: DeleteAllPostsComand): Promise<any> {
			return await this.postsRepository.deleteRepoPosts();
	}
}