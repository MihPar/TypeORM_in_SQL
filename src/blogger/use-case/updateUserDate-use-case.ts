import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BanUserForBlogInputModel } from "../dto-class";
import { BlogsRepositoryForSA } from "../../blogsForSA/blogsForSA.repository";
import { UsersQueryRepository } from "../../users/users.queryRepository";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { User } from "../../users/entities/user.entity";
import { UsersRepository } from "../../users/users.repository";
import { UserBlogger } from "../domain/entity.userBlogger";

export class UpdateUserDataCommand {
	constructor(
		public id: string,
		public banUserForBlogDto: BanUserForBlogInputModel,
	) {}
}

@CommandHandler(UpdateUserDataCommand)
export class UpdateUserDataUseCase implements ICommandHandler<UpdateUserDataCommand> {
	constructor(
		protected readonly blogsRepositoryForSA: BlogsRepositoryForSA,
		protected readonly usersQueryRepository: UsersQueryRepository,
		protected readonly usersRepository: UsersRepository
	) { }
	async execute(command: UpdateUserDataCommand): Promise<void> {
		await this.blogsRepositoryForSA.findBlogByIdBanUser(command.banUserForBlogDto.blogId, command.id)

		const findUserById = await this.usersQueryRepository.findUserById(command.id)

		if(!findUserById) throw new NotFoundException([
			{message: "user does not exist"}
		])

		if(command.banUserForBlogDto.isBanned) {
			const banUser = new UserBlogger()
			banUser.userId = command.id
			banUser.blogId = command.banUserForBlogDto.blogId
			banUser.banReason = command.banUserForBlogDto.banReason
			banUser.isBanned = command.banUserForBlogDto.isBanned
			banUser.banDate = new Date().toISOString()

			await this.usersRepository.createBanUser(banUser)
		} else if(!command.banUserForBlogDto.isBanned) {
			await this.usersRepository.unbannedUser(command.id, command.banUserForBlogDto.blogId)
		}
	}
}