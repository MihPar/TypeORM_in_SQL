import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PairQuizGameProgressQueryRepository } from "../infrastructure/pairQuizGameProgressQueryRepository";

export class DeleteAllAnswersSecondPlayerCommand {
	constructor() {}
}

@CommandHandler(DeleteAllAnswersSecondPlayerCommand)
export class DeleteAllAnswersSecondPlayerUseCase implements ICommandHandler<DeleteAllAnswersSecondPlayerCommand> {
	constructor(
		protected readonly pairQuizGameProgressQueryRepository: PairQuizGameProgressQueryRepository
	) {}
	async execute(command: DeleteAllAnswersSecondPlayerCommand): Promise<DeleteAllAnswersSecondPlayerCommand> {
		return await this.pairQuizGameProgressQueryRepository.deleteAllAnswersSecondPlayer()
	}
}