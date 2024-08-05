import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { TelegramAdapter } from "../adapter/telegram.adapter";
import { TelegramUpdateMessage } from "../types";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { HandleTelegramCommand } from "../use-case/commandBus/handleTelegram.use-case";
import { GetAuthBotLinkQuery } from "../use-case/queryBus/getAuthBotLink-use-case";
import {v4 as uuidv4} from "uuid"



@Controller('integrations/telegram')
export class TelegramController {
	constructor(
		protected readonly telegramAdapter: TelegramAdapter,
		protected readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus
	) {}

	@Post('webhook')
	@HttpCode(HttpStatus.NO_CONTENT)
	async webHook(@Body() payload: TelegramUpdateMessage) {
		console.log("payload: ", payload)
		const command = new HandleTelegramCommand(payload)
		const sendMessage = await this.commandBus.execute<HandleTelegramCommand>(command)
		console.log("entity: ", payload.message)
		return {status: 'success'}
	}

	@Get('auth-bot-link')
	@HttpCode(HttpStatus.OK)
	async getAuthBot(@Body() payload: TelegramUpdateMessage) {
		// const query = new GetAuthBotLinkQuery(payload)
		// const getAuthbotLink = await this.queryBus.execute<GetAuthBotLinkQuery>(query)
		// console.log("getAuthbotLink: ", getAuthbotLink)
		//generate code 
		//set code to user
		// Entity Telegram (@ManyToOne) to User
		const code = uuidv4();
		return {
			link: `t.me/Incubator34Lessonbot?code=${code}`
		}
	}
}



