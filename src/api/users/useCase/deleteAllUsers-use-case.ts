import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../users.repository";
import { Injectable } from "@nestjs/common";

export class DeleteAllUsersCommnad {
	constructor() {}
}

@Injectable()
@CommandHandler(DeleteAllUsersCommnad)
export class DeleteAllUsersUseCase implements ICommandHandler<DeleteAllUsersCommnad> {
	constructor(
		protected readonly usersRepository: UsersRepository
	) {}
 	async execute(command: DeleteAllUsersCommnad): Promise<any> {
		return await this.usersRepository.deleteAllUsers();
	}
}