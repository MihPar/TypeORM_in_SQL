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
		// .update(
		// 	{userId: command.userId},
		// 	{code: command.code}
		// )

		// const teg = await this.telegrammRepositor.createQueryBuilder().where(`code = :code`, {code: command.code}).getOne()
		// console.log("teg: ", teg)

		if(!createTelegramm) throw new NotFoundException([
			{message: 'telegramm of Entity does not update'}
		])

		// const text = `https://t.me/Incubator34Lessonbot?start=${command.code}`
		// const sendMessage = await this.adapter.sendMessage(text, getUserById.tegId)

		// console.log("code: ", typeof +command.code)

		// const updateUser = await this.userRepository
		// 	.createQueryBuilder()
		// 	.update(User)
		// 	.set({telegrammCode: command.code})
		// 	.where(`id = :id`, {id: command.userId})
		// 	.execute()

		// if(!updateUser) {
		// 	console.error("User does not update")
		// }
			// const findTegIdByUserId = await this.userRepository.createQueryBuilder().where(`id = :id`, {id: command.userId}).getOne()
			// console.log("findTegIdByUserId: ", findTegIdByUserId)
		return
	}
}