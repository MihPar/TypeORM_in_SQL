import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Question } from "../../question/domain/entity.question";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";

export class ChangeStatusToFinishedCommand {
	constructor(
		public gameId: string,
		public gameQuestions: Question[]
	) {}
}

@CommandHandler(ChangeStatusToFinishedCommand)
export class ChangeStatusToFinishedUseCase implements ICommandHandler<ChangeStatusToFinishedCommand> {
	constructor(
		protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository
	) {}
	async execute(command: ChangeStatusToFinishedCommand): Promise<any> {
		const firstPlayer = await this.pairQuezGameQueryRepository.getPlayerByGameIdAndUserId(command.gameId)
		const secondPlayer = await this.pairQuezGameQueryRepository.getPlayerByGameIdAndUserId(command.gameId)

		if(
			firstPlayer.answers.length === command.gameQuestions.length &&
			secondPlayer.answers.length === command.gameQuestions.length
		) {
			// await this.pairQuezGameQueryRepository.changeWinRate(command.gameId)
			await this.pairQuezGameQueryRepository.increaseCountFirstPlayer(command.gameId)
			await this.pairQuezGameQueryRepository.increaseCountSecondPlayer(command.gameId)
			if(firstPlayer!.answerFinishDate < secondPlayer!.answerFinishDate) {
				await this.pairQuezGameQueryRepository.addBonusFirstPalyer(command.gameId)
				return await this.pairQuezGameQueryRepository.changeGameStatusToFinished(command.gameId)
			} 
			if(secondPlayer!.answerFinishDate < firstPlayer!.answerFinishDate) {
				await this.pairQuezGameQueryRepository.addBonusSecondPalyer(command.gameId)
				return await this.pairQuezGameQueryRepository.changeGameStatusToFinished(command.gameId)
			}
		}
	}
}