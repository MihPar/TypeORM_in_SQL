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
		const  {id, banInputInfo: {isBanned}}  = command
		const findUserById = await this.usersQueryRepository.findUserById(command.id)
		if(!findUserById) {
			throw new NotFoundException([
				{message: 'User not found in banUnbanUser use case'}
			])
		}
		const banUser = await this.usersRepository.banUser(id, command.banInputInfo)
		if(banUser.isBanned) {
			await this.deviceRepository.deleteAllSessions(id);
			await this.blogsRepository.banUnbanBlogByUserId(id, isBanned)
			await this.postsRepository.banUnbanPostByUserId(id, isBanned)
			await this.commentRepository.banUnbanComments(id, isBanned);
			await this.commentRepository.banCommentLikes(id, isBanned);
			await this.postsRepository.banPostLikes(id, isBanned);
			return 
		} else {
			await this.blogsRepository.banUnbanBlogByUserId(id, isBanned)
			await this.postsRepository.banUnbanPostByUserId(id, isBanned)
			await this.commentRepository.banUnbanComments(id, isBanned);
			await this.commentRepository.unbanCommentLikes(id, isBanned);
			await this.postsRepository.unbanPostLikes(id, isBanned);
			return 
		}
	}

}