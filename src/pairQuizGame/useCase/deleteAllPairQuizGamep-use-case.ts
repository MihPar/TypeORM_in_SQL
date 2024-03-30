import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Injectable } from "@nestjs/common";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";

export class DeleteAllPairQuizGameCommnad {
	constructor() {}
}

@Injectable()
@CommandHandler(DeleteAllPairQuizGameCommnad)
export class DeleteAllPairQuizGameUseCase implements ICommandHandler<DeleteAllPairQuizGameCommnad> {
	constructor(
		protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository
	) {}
 	async execute(command: DeleteAllPairQuizGameCommnad): Promise<any> {
		return await this.pairQuezGameQueryRepository.deleteAllPairQuizGame()
	}
}