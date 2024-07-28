import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { TelegramAdapter } from "../adapter/telegram.adapter";
import { TelegramUpdateMessage } from "../types";


@Controller('integrations/telegram')
export class TelegramController {
	constructor(
		protected readonly telegramAdapter: TelegramAdapter
	) {}

	@Post('webhook')
	@HttpCode(HttpStatus.NO_CONTENT)
	async webHook(@Body() payload: TelegramUpdateMessage) {
		console.log("payload: ", payload)
		const sendMessage = await this.telegramAdapter.sendMessage(payload.message.text, payload.message.from.id)
		return {status: 'success'}
	}

	@Get('auth-bot-link')
	@HttpCode(HttpStatus.OK)
	async getAuthBot(@Body() payload: any) {
		console.log("payload: ", payload)
	}
}



