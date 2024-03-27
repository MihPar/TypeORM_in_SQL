import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Question } from "../../question/domain/entity.question";

export class ChangeAnswerStatusFirstPlayerCommand {
	constructor(
		gameId: string,
		gameQuestions: Question[]
	) {}
}

@CommandHandler(ChangeAnswerStatusFirstPlayerCommand)
export class ChangeAnswerStatusFirstPlayerUseCase implements ICommandHandler<ChangeAnswerStatusFirstPlayerCommand> {
	constructor() {}
	async execute(command: ChangeAnswerStatusFirstPlayerCommand): Promise<any> {}
}