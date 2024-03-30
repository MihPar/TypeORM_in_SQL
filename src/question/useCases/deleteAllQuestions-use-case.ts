import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuestionQueryRepository } from "../infrastructury/questionQueryRepository";

export class DeleteAllQuestionCommand {
	constructor() {}
}

@CommandHandler(DeleteAllQuestionCommand)
export class DeleteAllQuestionUseCase implements ICommandHandler<DeleteAllQuestionCommand> {
	constructor(
		protected readonly questionQueryRepository: QuestionQueryRepository
	) {}
	async execute(command: DeleteAllQuestionCommand): Promise<DeleteAllQuestionCommand> {
		return await this.questionQueryRepository.deleteAllQuestions()
	}
}