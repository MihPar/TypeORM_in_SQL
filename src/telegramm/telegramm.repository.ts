import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Telegramm } from "./entity/telegram.entity";

@Injectable()
export class TelegrammRepository {
	constructor(
		@InjectRepository(Telegramm) protected readonly telegrammRepository: Repository<Telegramm>
	) {}

	async getTelegy(code: string) {
	const getTelegramm = await this.telegrammRepository
		.createQueryBuilder()
		.where(`code = :code`, {code})
		.getOne()

		return getTelegramm
	}

	async getAllTelegramm() {
		const teg = await this.telegrammRepository.createQueryBuilder().getMany()
		return teg
	}

	async deleteAllTelegramm() {
		await this.telegrammRepository.createQueryBuilder().delete().execute()
		return true
	}
}