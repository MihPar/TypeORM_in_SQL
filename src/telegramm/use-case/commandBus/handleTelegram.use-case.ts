import { TelegramUpdateMessage } from '../../types';
import { TelegramAdapter } from '../../adapter/telegram.adapter';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from '../../../users/users.repository';
import { TelegrammRepository } from '../../telegramm.repository';
import { UsersQueryRepository } from '../../../users/users.queryRepository';

export class HandleTelegramCommand {
	constructor(
		public payload: TelegramUpdateMessage
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
		// console.log(command.payload, " payload222")
		// const text1 = `I know you ${command.payload.message.from.first_name} why did you write me?`
		const code = command.payload.text
		console.log("code: ", code)
		// получить userId по command.payload.text у Telegramm

		const getTelegramm = await this.telegrammRepository.getTelegy(command.payload.text)

		const createTegIdForUser = await this.usersRepository.updateUser(command.payload.from.id, getTelegramm.userId)
		// const sendMessage = await this.telegramAdapter.sendMessage(text2, command.payload.from.id)
		return 
	}
}