import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../../blogs/blogs.repository";
import { UsersRepository } from "../../users/users.repository";
import { UserBanBloggerViewType } from "../../users/user.type";
import { PaginationType } from "../../types/pagination.types";

export class FindBannedUserSpecifyBloggerCommand {
	constructor(
		public searchLoginTerm: string,
		public sortBy: string,
		public sortDirection: string,
		public pageSize: number,
		public pageNumber: number,
		public blogId: string,
		public userId: string
	) {}
}

@CommandHandler(FindBannedUserSpecifyBloggerCommand)
export class FindBannedUserSpecifyBloggerUserCase implements ICommandHandler<FindBannedUserSpecifyBloggerCommand> {
	constructor(
		private readonly blogsRepository: BlogsRepository,
		private readonly usersRepository: UsersRepository
	) {}
	async execute(command: FindBannedUserSpecifyBloggerCommand): Promise<PaginationType<UserBanBloggerViewType | null>> {

		await this.blogsRepository.findBlogByUserIdBlogId(command.userId, command.blogId)

		const findAllBannedUserForSpecifyBlogger: PaginationType<UserBanBloggerViewType | null> = await this.usersRepository.findAllBannedUserSpecifyBlogger(
			command.searchLoginTerm,
			command.sortBy,
			command.sortDirection,
			command.pageSize,
			command.pageNumber,
			command.blogId
		)
		return findAllBannedUserForSpecifyBlogger
	}
}