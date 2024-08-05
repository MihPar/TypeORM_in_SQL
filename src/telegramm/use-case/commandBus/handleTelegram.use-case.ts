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
		const sendMessage = await this.telegramAdapter.sendMessage(command.payload.message.text, command.payload.message.from.id)
	}
}