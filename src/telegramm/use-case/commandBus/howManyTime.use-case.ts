import { TelegramUpdateMessage } from '../../types';
import { TelegramAdapter } from '../../adapter/telegram.adapter';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class HowManyTimeCommand {
	constructor(
		public payload: TelegramUpdateMessage
	) {}
}


@CommandHandler(HowManyTimeCommand)
export class HowManyTimeUseCase implements ICommandHandler<HowManyTimeCommand> {
	constructor(
		protected readonly telegramAdapter: TelegramAdapter
	) {}
	async execute(command: HowManyTimeCommand): Promise<any> {
		if(command.payload.text === "How many time") {
			this.telegramAdapter.sendMessage(`${new Date()}`, command.payload.from.id)
		} else {
			this.telegramAdapter.sendMessage(`I do not undestude your question`, command.payload.from.id)
		}
	}
}