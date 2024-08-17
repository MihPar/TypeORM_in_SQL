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
		console.log("payload: ", command.payload)
		// const text1 = `I know you ${command.payload.message.from.first_name} why did you write me?`
		// console.log("payload: ", command.payload)
		// console.log("payloadText: ", command.payload.message.text)
		// console.log("id: ", command.payload.message.from.id)
		const code = command.payload.message?.text.split(" ")[1]
		console.log("code: ", code)
		// получить userId по command.payload.text у Telegramm

		// const allTelegramm = await this.telegrammRepository.getAllTelegramm()
		// console.log("allTelegramm: ", allTelegramm)

		const getTelegramm = await this.telegrammRepository.getTelegy(code)
		console.log("telegrammByCode: ", getTelegramm)

		const createTegIdForUser = await this.usersRepository.updateUser(command.payload.message?.from.id, getTelegramm?.userId)
		// const sendMessage = await this.telegramAdapter.sendMessage(text2, command.payload.from.id)
		return 
	}
}