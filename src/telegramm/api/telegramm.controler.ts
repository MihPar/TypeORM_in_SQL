import { Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

@Controller('integrations/telegram')
export class TelegramController {
	constructor() {}

	@Post()
	@HttpCode(HttpStatus.NO_CONTENT)
	async webHook() {

	}
}
