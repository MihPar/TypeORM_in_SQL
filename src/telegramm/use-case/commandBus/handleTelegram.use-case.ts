import { TelegramUpdateMessage } from '../../types';
import { TelegramAdapter } from '../../adapter/telegram.adapter';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from '@nestjs/typeorm';
import { Telegram } from 'telegraf';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { UsersRepository } from '../../../users/users.repository';
import { Telegramm } from '../../entity/telegram.entity';

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
		@InjectRepository(Telegramm) protected readonly telegramm: Repository<Telegramm>,
	) {}
	async execute(command: HandleTelegramCommand): Promise<any> {
		// console.log(command.payload, " payload222")
		// const text1 = `I know you ${command.payload.message.from.first_name} why did you write me?`
		const text2 = `New post published for blog "It-inc news`
		console.log("text: ", command.payload.text)
		// получить userId по command.payload.text у Telegramm

		const createTegIdForUser = await this.usersRepository.updateUser(command.payload.from.id, userId)
		// const sendMessage = await this.telegramAdapter.sendMessage(text2, command.payload.from.id)
		return 
	}
}