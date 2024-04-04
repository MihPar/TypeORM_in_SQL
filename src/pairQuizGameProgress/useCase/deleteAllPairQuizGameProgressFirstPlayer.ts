import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PairQuizGameProgressQueryRepository } from "../infrastructure/pairQuizGameProgressQueryRepository";

export class DeleteAllPairQuizGameProgressPlayerCommand {
	constructor() {}
}

@CommandHandler(DeleteAllPairQuizGameProgressPlayerCommand)
export class DeleteAllPairQuizGameProgressPlayerUseCase implements ICommandHandler<DeleteAllPairQuizGameProgressPlayerCommand> {
	constructor(
		protected readonly pairQuizGameProgressQueryRepository: PairQuizGameProgressQueryRepository
	) {}
	async execute(command: DeleteAllPairQuizGameProgressPlayerCommand): Promise<DeleteAllPairQuizGameProgressPlayerCommand> {
		return await this.pairQuizGameProgressQueryRepository.deleteAllPairQuizGameProgressPlayerPlayer()
	}
}