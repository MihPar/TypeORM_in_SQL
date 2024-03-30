import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PairQuizGameProgressQueryRepository } from "../infrastructure/pairQuizGameProgressQueryRepository";

export class DeleteAllAnswersFirstPlayerCommand {
	constructor() {}
}

@CommandHandler(DeleteAllAnswersFirstPlayerCommand)
export class DeleteAllAnswersFirstPlayerUseCase implements ICommandHandler<DeleteAllAnswersFirstPlayerCommand> {
	constructor(
		protected readonly pairQuizGameProgressQueryRepository: PairQuizGameProgressQueryRepository
	) {}
	async execute(command: DeleteAllAnswersFirstPlayerCommand): Promise<DeleteAllAnswersFirstPlayerCommand> {
		return await this.pairQuizGameProgressQueryRepository.deleteAllAnswersFirstPlayer()
	}
}