import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { TelegramAdapter } from "../adapter/telegram.adapter";
import { TelegramUpdateMessage } from "../types";
import { CommandBus } from "@nestjs/cqrs";
import { HandleTelegramCommand } from "../use-case/handleTelegram.use-case";


@Controller('integrations/telegram')
export class TelegramController {
	constructor(
		protected readonly telegramAdapter: TelegramAdapter,
		protected readonly commandBus: CommandBus
	) {}

	@Post('webhook')
	@HttpCode(HttpStatus.NO_CONTENT)
	async webHook(@Body() payload: TelegramUpdateMessage) {
		console.log("payload: ", payload)
		const command = new HandleTelegramCommand(payload)
		const sendMessage = await this.commandBus.execute<HandleTelegramCommand>(command)
		
		return {status: 'success'}
	}

	@Get('auth-bot-link')
	@HttpCode(HttpStatus.OK)
	async getAuthBot(@Body() payload: any) {
		console.log("payload: ", payload)
	}
}



