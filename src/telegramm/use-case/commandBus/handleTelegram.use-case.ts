import { TelegramUpdateMessage } from '../../types';
import { TelegramAdapter } from '../../adapter/telegram.adapter';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class HandleTelegramCommand {
	constructor(
		public payload: TelegramUpdateMessage
	) {}
}


@CommandHandler(HandleTelegramCommand)
export class HandleTelegramUseCase implements ICommandHandler<HandleTelegramCommand> {
	constructor(
		protected readonly telegramAdapter: TelegramAdapter
	) {}
	async execute(command: HandleTelegramCommand): Promise<any> {
		// console.log(command.payload, " payload222")
		// const text1 = `I know you ${command.payload.message.from.first_name} why did you write me?`
		const text2 = `New post published for blog "It-inc news`
		const sendMessage = await this.telegramAdapter.sendMessage(text2, command.payload.message.from.id)
		return sendMessage
	}
}