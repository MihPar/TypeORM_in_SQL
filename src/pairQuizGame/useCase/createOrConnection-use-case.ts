import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuestionTypeModel } from "../type/typeViewModel";
import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";

export class CreateOrConnectGameCommand {
	constructor(
		public userId: string
	) {}
}

@CommandHandler(CreateOrConnectGameCommand)
export class CreateOrConnectGameUseCase implements ICommandHandler<CreateOrConnectGameCommand> {
	constructor(
		protected readonly pairQuizGameRepository: PairQuizGameRepository
	) {}
	async execute(command: CreateOrConnectGameCommand): Promise<QuestionTypeModel> {
		const createPairQuizGame = await this.pairQuizGameRepository.connectionOrCreatePairQuizGame(command.userId)
		return 
	}
}