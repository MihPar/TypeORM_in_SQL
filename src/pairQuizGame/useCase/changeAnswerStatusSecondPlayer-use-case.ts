import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Question } from "../../question/domain/entity.question";

export class ChangeAnswerStatusSecondPlayerCommand {
	constructor(
		gameId: string,
		gameQuestions: Question[]
	) {}
}

@CommandHandler(ChangeAnswerStatusSecondPlayerCommand)
export class ChangeAnswerStatusSecondPlayerUseCase implements ICommandHandler<ChangeAnswerStatusSecondPlayerCommand> {
	constructor() {}
	async execute(command: ChangeAnswerStatusSecondPlayerCommand): Promise<any> {}
}