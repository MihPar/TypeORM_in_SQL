import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { TelegrammRepository } from "../../telegramm.repository";

export class DeleteAllTelegrammCommnad {
	constructor() {}
}

@CommandHandler(DeleteAllTelegrammCommnad)
export class DeleteAllTelegrammUseCase implements ICommandHandler<DeleteAllTelegrammCommnad> {
	constructor(
		protected readonly telegrammRepository: TelegrammRepository
	){}
	async execute(command: DeleteAllTelegrammCommnad): Promise<any> {
		await this.telegrammRepository.deleteAllTelegramm()
	}
}