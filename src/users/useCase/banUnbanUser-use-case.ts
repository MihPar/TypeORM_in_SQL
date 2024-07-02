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
		if(banUser.isBanned) {
			await this.deviceRepository.deleteAllSessions(command.id);
			await this.blogsRepository.banUnbanBlogByUserId(command.id, command.banInputInfo.isBanned)
			await this.postsRepository.banUnbanPostByUserId(command.id, command.banInputInfo.isBanned)
			await this.commentRepository.banUnbanComments(command.id, command.banInputInfo.isBanned);
			await this.commentRepository.banCommentLikes(command.id, command.banInputInfo.isBanned);
			await this.postsRepository.banPostLikes(command.id, command.banInputInfo.isBanned);
			return 
		} else {
			await this.blogsRepository.banUnbanBlogByUserId(command.id, command.banInputInfo.isBanned)
			await this.postsRepository.banUnbanPostByUserId(command.id, command.banInputInfo.isBanned)
			await this.commentRepository.banUnbanComments(command.id, command.banInputInfo.isBanned);
			await this.commentRepository.unbanCommentLikes(command.id, command.banInputInfo.isBanned);
			await this.postsRepository.unbanPostLikes(command.id, command.banInputInfo.isBanned);
			return 
		}
	}

}