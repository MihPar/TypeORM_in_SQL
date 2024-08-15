import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Telegramm } from "./entity/telegram.entity";

@Injectable()
export class TelegrammRepository {
	constructor(
		@InjectRepository(Telegramm) protected readonly telegrammRepository: Repository<Telegramm>
	) {}

	async getTelegy(payloadText: string) {
		console.log("text: ", payloadText)
	const code = payloadText.split(' ')
	const getTelegramm = await this.telegrammRepository
		.createQueryBuilder()
		.where(`code = :code`, {code})
		.getOne()

		return getTelegramm
	}
}