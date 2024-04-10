import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Question } from "../../question/domain/entity.question";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";

export class CangeStatusToFinishedCommand {
	constructor(
		public gameId: string,
		public gameQuestions: Question[]
	) {}
}

@CommandHandler(CangeStatusToFinishedCommand)
export class CangeStatusToFinishedUseCase implements ICommandHandler<CangeStatusToFinishedCommand> {
	constructor(
		protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository
	) {}
	async execute(command: CangeStatusToFinishedCommand): Promise<any> {
		const firstPlayer = await this.pairQuezGameQueryRepository.getPlayerByGameIdAndUserId(command.gameId)
	}
}