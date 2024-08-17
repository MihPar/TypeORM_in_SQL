import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Telegramm } from "../../entity/telegram.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../../users/entities/user.entity";
import { TelegrammRepository } from "../../telegramm.repository";
import { TelegramAdapter } from "../../adapter/telegram.adapter";

export class CreateCodeCommand {
	constructor(
		public code: string,
		public userId: string
	) {}
}

@CommandHandler(CreateCodeCommand)
export class CreateCodeUseCase implements ICommandHandler<CreateCodeCommand> {
	constructor(
		@InjectRepository(Telegramm) protected readonly telegrammRepository: Repository<Telegramm>,
		@InjectRepository(User) protected readonly userRepository: Repository<User>,
		protected readonly adapter: TelegramAdapter
	) {}
	async execute(command: CreateCodeCommand): Promise<void> {
		const createTelegramm = await this.telegrammRepository
			.createQueryBuilder()
			.insert()
			.into(Telegramm)
			.values({code: command.code, userId: command.userId})
			.execute()

		if(!createTelegramm) throw new NotFoundException([
			{message: 'telegramm of Entity does not update'}
		])

		return
	}
}