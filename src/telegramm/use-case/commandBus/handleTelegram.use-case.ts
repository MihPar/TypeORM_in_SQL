import { TelegramUpdateMessage } from '../../types';
import { TelegramAdapter } from '../../adapter/telegram.adapter';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from '../../../users/users.repository';
import { TelegrammRepository } from '../../telegramm.repository';
import { UsersQueryRepository } from '../../../users/users.queryRepository';

export class HandleTelegramCommand {
	constructor(
		public payload: any
	) {}
}


@CommandHandler(HandleTelegramCommand)
export class HandleTelegramUseCase implements ICommandHandler<HandleTelegramCommand> {
	constructor(
		protected readonly telegramAdapter: TelegramAdapter,
		protected readonly usersRepository: UsersRepository,
		protected readonly telegrammRepository: TelegrammRepository,
		protected readonly usersQueryRepository: UsersQueryRepository
	) {}
	async execute(command: HandleTelegramCommand): Promise<any> {
		const code = command.payload.message?.text.split(" ")[1]
		const getTelegramm = await this.telegrammRepository.getTelegy(code)
		const createTegIdForUser = await this.usersRepository.updateUser(command.payload.message?.from.id, getTelegramm?.userId)
		const findUser = await this.usersQueryRepository.findUserById(getTelegramm?.userId)
		return 
	}
}