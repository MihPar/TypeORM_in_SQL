import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Telegramm } from "../../entity/telegram.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class CreateCodeCommand {
	constructor(
		public code: string,
		public userId: string
	) {}
}

@CommandHandler(CreateCodeCommand)
export class CreateCodeUseCase implements ICommandHandler<CreateCodeCommand> {
	constructor(
		@InjectRepository(Telegramm) protected readonly telegrammRepositor: Repository<Telegramm>,
	) {}
	async execute(command: CreateCodeCommand): Promise<void> {
		const update = await this.telegrammRepositor.update(
			{userId: command.userId},
			{code: command.code}
		)

		// const teg = await this.telegrammRepositor.createQueryBuilder().where(`code = :code`, {code: command.code}).getOne()
		// console.log("teg: ", teg)

		if(!update) throw new NotFoundException([
			{message: 'telegramm of Entity does not update'}
		])
		return
	}
}