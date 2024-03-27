import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Question } from "../../question/domain/entity.question";

export class CangeStatusToFinishedCommand {
	constructor(
		gameId: string,
		gameQuestions: Question[]
	) {}
}

@CommandHandler(CangeStatusToFinishedCommand)
export class CangeStatusToFinishedUseCase implements ICommandHandler<CangeStatusToFinishedCommand> {
	constructor() {}
	async execute(command: CangeStatusToFinishedCommand): Promise<any> {
		
	}
}