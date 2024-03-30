import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PairQuizGameProgressQueryRepository } from "../infrastructure/pairQuizGameProgressQueryRepository";

export class DeleteAllPairQuizGameProgressFirstPlayerCommand {
	constructor() {}
}

@CommandHandler(DeleteAllPairQuizGameProgressFirstPlayerCommand)
export class DeleteAllPairQuizGameProgressFirstPlayerUseCase implements ICommandHandler<DeleteAllPairQuizGameProgressFirstPlayerCommand> {
	constructor(
		protected readonly pairQuizGameProgressQueryRepository: PairQuizGameProgressQueryRepository
	) {}
	async execute(command: DeleteAllPairQuizGameProgressFirstPlayerCommand): Promise<DeleteAllPairQuizGameProgressFirstPlayerCommand> {
		return await this.pairQuizGameProgressQueryRepository.deleteAllPairQuizGameProgressFirstPlayerPlayer()
	}
}