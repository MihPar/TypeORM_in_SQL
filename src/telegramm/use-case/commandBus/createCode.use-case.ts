import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Telegramm } from "../../entity/telegram.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../../users/entities/user.entity";

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
	) {}
	async execute(command: CreateCodeCommand): Promise<void> {
		const updateTelegramm = await this.telegrammRepository.update(
			{userId: command.userId},
			{code: command.code}
		)

		// const teg = await this.telegrammRepositor.createQueryBuilder().where(`code = :code`, {code: command.code}).getOne()
		// console.log("teg: ", teg)

		if(!updateTelegramm) throw new NotFoundException([
			{message: 'telegramm of Entity does not update'}
		])

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