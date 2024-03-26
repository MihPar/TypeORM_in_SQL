import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuestionRepository } from "../infrastructury/questionRepository";
import { Question } from "../domain/entity.question";
import { AnswerAndBodyClass } from "../dto/question.dto";

export class UpdateQuestionCommand {
	constructor(
		public id: string,
		public DTO: AnswerAndBodyClass
	) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase implements ICommandHandler<UpdateQuestionCommand> {
	constructor(
		protected readonly questionRepository: QuestionRepository
		) {}
	async execute(command: UpdateQuestionCommand): Promise<boolean | null> {
		const updatedQuestion = await this.questionRepository.udpatedQuestionById(command.DTO, command.id)
		return updatedQuestion
	}
}