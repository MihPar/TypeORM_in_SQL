import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { TelegramAdapter } from "../adapter/telegram.adapter";
import { TelegramUpdateMessage } from "../types";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { HandleTelegramCommand } from "../use-case/commandBus/handleTelegram.use-case";
import { GetAuthBotLinkQuery } from "../use-case/queryBus/getAuthBotLink-use-case";
import {v4 as uuidv4} from "uuid"
import { CreateCodeCommand } from "../use-case/commandBus/createCode.use-case";
import { BearerTokenPairQuizGame } from "../../pairQuizGame/guards/bearerTokenPairQuizGame";
import { UserIdDecorator } from "../../users/infrastructure/decorators/decorator.user";



@Controller('integrations/telegram')
export class TelegramController {
	constructor(
		protected readonly telegramAdapter: TelegramAdapter,
		protected readonly commandBus: CommandBus,
	) {}

	@Post('webhook')
	@HttpCode(HttpStatus.NO_CONTENT)
	async webHook(@Body() payload: TelegramUpdateMessage) {
		console.log("payload: ", payload)
		const command = new HandleTelegramCommand(payload)
		//достать из пейлоада телеграм ид пользователя и привязаьт к пользователю
		const saveTegIdForUser = await this.commandBus.execute<HandleTelegramCommand>(command) 
		// const sendMessage = await this.commandBus.execute<HandleTelegramCommand>(command)
		// console.log("entity: ", payload.message)
		return {status: "success"}
	}

	@Get('auth-bot-link')
	@HttpCode(HttpStatus.OK)
	@UseGuards(BearerTokenPairQuizGame)
	async getAuthBot(
		@Body() payload: TelegramUpdateMessage,
		@UserIdDecorator() userId: string
	): Promise<{link: string}> {
		// const query = new GetAuthBotLinkQuery(payload)
		// const getAuthbotLink = await this.queryBus.execute<GetAuthBotLinkQuery>(query)
		// console.log("getAuthbotLink: ", getAuthbotLink)
		//generate code 
		//set code to user
		// Entity Telegram (@ManyToOne) to User
		const code = uuidv4();
		const command = new CreateCodeCommand(code, userId)
		await this.commandBus.execute<CreateCodeCommand, void>(command)
		return {
			link: `https://t.me/Incubator34Lessonbot?start=${code}`
		}
	}
}



