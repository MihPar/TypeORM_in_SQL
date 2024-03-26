import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PublishClass } from "../dto/question.dto";
import { QuestionRepository } from "../infrastructury/questionRepository";

export class updateQuestionPublishCommand {
	constructor(
		public id: string,
		public DTO: PublishClass
	) {}
}

@CommandHandler(updateQuestionPublishCommand)
export class updateQuestionPublishUseCase implements ICommandHandler<updateQuestionPublishCommand> {
	constructor(
		protected readonly questionRepository: QuestionRepository
	) {}
	async execute(command: updateQuestionPublishCommand): Promise<boolean | null> {
		const updateQuestionPublidhed = await this.questionRepository.updatePublished(command.id, command.DTO.published)
		return true
	}
}