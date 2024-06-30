import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ignoreElements } from "rxjs";
import { UsersQueryRepository } from "../users.queryRepository";
import { NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../users.repository";
import { BanInputModel } from "../user.class";
import { PostsRepository } from "../../posts/posts.repository";
import { CommentRepository } from "../../comment/comment.repository";
import { LikesRepository } from "../../likes/likes.repository";
import { DeviceRepository } from "../../security-devices/security-device.repository";
import { BlogsRepository } from "../../blogs/blogs.repository";

export class BanUnbanUserCommand {
	constructor(
		public id: string,
		public banInputInfo: BanInputModel,
		// public userId: string
	) {}
}

@CommandHandler(BanUnbanUserCommand)
export class BanUnbanUserUseCase implements ICommandHandler<BanUnbanUserCommand> {
	constructor(
		protected readonly usersQueryRepository: UsersQueryRepository,
		protected readonly usersRepository: UsersRepository,
		private readonly postsRepository: PostsRepository,
		private readonly commentRepository: CommentRepository,
		private readonly likesRepository: LikesRepository,
		private readonly deviceRepository: DeviceRepository,
		private readonly blogsRepository: BlogsRepository
	) {}
	async execute(command: BanUnbanUserCommand): Promise<void> {
		const findUserById = await this.usersQueryRepository.findUserById(command.id)
		if(!findUserById) {
			throw new NotFoundException([
				{message: 'User not found in banUnbanUser use case'}
			])
		}
		const banUser = await this.usersRepository.banUser(command.id, command.banInputInfo)
		
		await this.deviceRepository.deleteAllSessions(command.id);
		await this.blogsRepository.banBlogByUserId(command.id, command.banInputInfo.isBanned)
		await this.postsRepository.banPostByUserId(command.id, command.banInputInfo.isBanned)
		await this.commentRepository.banComments(command.id, command.banInputInfo.isBanned);
		await this.likesRepository.banCommentLikes(command.id, command.banInputInfo.isBanned);
		await this.postsRepository.banPostLikes(command.id, command.banInputInfo.isBanned);
		return 
	}
}