import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PairQuizGameProgressQueryRepository } from "../infrastructure/pairQuizGameProgressQueryRepository";

export class DeleteAllAnswersPlayerCommand {
	constructor() {}
}

@CommandHandler(DeleteAllAnswersPlayerCommand)
export class DeleteAllAnswersPlayerUseCase implements ICommandHandler<DeleteAllAnswersPlayerCommand> {
	constructor(
		protected readonly pairQuizGameProgressQueryRepository: PairQuizGameProgressQueryRepository
	) {}
	async execute(command: DeleteAllAnswersPlayerCommand): Promise<DeleteAllAnswersPlayerCommand> {
		return await this.pairQuizGameProgressQueryRepository.deleteAllAnswersFirstPlayer()
	}
}