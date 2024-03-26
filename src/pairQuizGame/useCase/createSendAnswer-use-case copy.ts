import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePairQuizGameDto } from "../dto/createPairQuizGame.dto";

export class SendAnswerCommand {
	constructor(
		DTO: CreatePairQuizGameDto,
		public userId: string
	) {}
}

@CommandHandler(SendAnswerCommand)
export class CreateOrConnectGameUseCase implements ICommandHandler<SendAnswerCommand> {
	constructor() {}
	async execute(command: SendAnswerCommand) {}
}