import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Question } from "../../question/domain/entity.question";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";
import { compareAsc } from "date-fns";

export class ChangeAnswerStatusFirstPlayerCommand {
	constructor(
		public gameId: string,
		public gameQuestions: Question[]
	) {}
}

@CommandHandler(ChangeAnswerStatusFirstPlayerCommand)
export class ChangeAnswerStatusFirstPlayerUseCase implements ICommandHandler<ChangeAnswerStatusFirstPlayerCommand> {
	constructor(
		protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository
	) {}
	async execute(command: ChangeAnswerStatusFirstPlayerCommand): Promise<any> {
		const firstPlayer = await this.pairQuezGameQueryRepository.getPlayerByGameIdAndUserId(command.gameId)
		if(firstPlayer.answers.length === command.gameQuestions.length) {
			return  await this.pairQuezGameQueryRepository.setFinishAnswerDateFirstPlayer(command.gameId)
		} else {
			return
		}
	}
}