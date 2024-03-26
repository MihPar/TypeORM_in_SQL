import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuestionRepository } from "../infrastructury/questionRepository";

export class DeletedQuestionCommand {
	constructor(
		public id: string
	) {}
}

@CommandHandler(DeletedQuestionCommand)
export class DeletedQuestionUseCase implements ICommandHandler<DeletedQuestionCommand> {
	constructor(
		protected readonly questionRepository: QuestionRepository
	) {}
	async execute(command: DeletedQuestionCommand): Promise<boolean | null> {
		const deleteQuestion = await this.questionRepository.deletById(command.id)
		return deleteQuestion
	}
}