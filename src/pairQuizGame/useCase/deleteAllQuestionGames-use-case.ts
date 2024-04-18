import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Injectable } from "@nestjs/common";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";

export class DelectAllQuestionGamesCommand {
	constructor() {}
}

@Injectable()
@CommandHandler(DelectAllQuestionGamesCommand)
export class DelectAllQuestionGamesUseCase implements ICommandHandler<DelectAllQuestionGamesCommand> {
	constructor(
		protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository
	) {}
 	async execute(command: DelectAllQuestionGamesCommand): Promise<any> {
		return await this.pairQuezGameQueryRepository.deleteAllQuestionGames()
	}
}