import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PairQuizGameProgressQueryRepository } from "../infrastructure/pairQuizGameProgressQueryRepository";

export class DeleteAllPairQuizGameProgressSecondPlayerCommand {
	constructor() {}
}

@CommandHandler(DeleteAllPairQuizGameProgressSecondPlayerCommand)
export class DeleteAllPairQuizGameProgressSecondPlayerUseCase implements ICommandHandler<DeleteAllPairQuizGameProgressSecondPlayerCommand> {
	constructor(
		protected readonly pairQuizGameProgressQueryRepository: PairQuizGameProgressQueryRepository
	) {}
	async execute(command: DeleteAllPairQuizGameProgressSecondPlayerCommand): Promise<DeleteAllPairQuizGameProgressSecondPlayerCommand> {
		return await this.pairQuizGameProgressQueryRepository.deleteAllPairQuizGameProgressSecondPlayerPlayer()
	}
}