import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ignoreElements } from "rxjs";
import { UsersQueryRepository } from "../users.queryRepository";
import { NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../users.repository";
import { BanInputModel } from "../user.class";

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
		protected readonly usersRepository: UsersRepository
	) {}
	async execute(command: BanUnbanUserCommand): Promise<void> {
		const findUserById = await this.usersQueryRepository.findUserById(command.id)
		if(!findUserById) {
			throw new NotFoundException([
				{message: 'User not found in banUnbanUser use case'}
			])
		}
		const banUser = await this.usersRepository.banUser(command.id, command.banInputInfo)
		return 
	}
}