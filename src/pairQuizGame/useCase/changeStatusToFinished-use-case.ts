import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Question } from "../../question/domain/entity.question";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { GameTypeModel } from "../type/typeViewModel";
import { GameStatusEnum } from "../enum/enumPendingPlayer";
import { sortAddedAt } from "../../helpers/helpers";

export class ChangeStatusToFinishedCommand {
	constructor(
		public game: PairQuizGame,
		public gameQuestions: Question[]
	) {}
}

@CommandHandler(ChangeStatusToFinishedCommand)
export class ChangeStatusToFinishedUseCase implements ICommandHandler<ChangeStatusToFinishedCommand> {
	constructor(
		protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository
	) {}
	async execute(command: ChangeStatusToFinishedCommand): Promise<any> {
		const firstPlayer = await this.pairQuezGameQueryRepository.getGameByUserIdAndStatuses(command.game.id, command.game.firstPlayerProgress.user.id, [GameStatusEnum.Active])
		const secondPlayer = await this.pairQuezGameQueryRepository.getGameByUserIdAndStatuses(command.game.id, command.game.secondPlayerProgress.user.id, [GameStatusEnum.Active])

		if(
			firstPlayer.firstPlayerProgress.answers.length === command.gameQuestions.length &&
			secondPlayer.secondPlayerProgress.answers.length === command.gameQuestions.length
		) {
			const firstPlayerLastAnswer = sortAddedAt(firstPlayer.firstPlayerProgress.answers)[command.gameQuestions.length - 1]
			// console.log('firstPlayerLastAnswer: ', firstPlayerLastAnswer)
			const secondPlayerLastAnswer = sortAddedAt(secondPlayer.secondPlayerProgress.answers)[command.gameQuestions.length - 1]
			if (firstPlayerLastAnswer.addedAt.toISOString() < secondPlayerLastAnswer.addedAt.toISOString()) {
				await this.pairQuezGameQueryRepository.addBonusPalyer(command.game.firstPlayerProgress.id)
			} else if (firstPlayerLastAnswer.addedAt.toISOString() > secondPlayerLastAnswer.addedAt.toISOString()) {
				await this.pairQuezGameQueryRepository.addBonusPalyer(command.game.secondPlayerProgress.id)
			}
			const firstPlayerScore = command.game.firstPlayerProgress.score
			const secondPalyerScore = command.game.secondPlayerProgress.score
			if(firstPlayerScore > secondPalyerScore)  {
				await this.pairQuezGameQueryRepository.makeFirstPlayerWin(command.game)
			}
			if(firstPlayerScore < secondPalyerScore) {
				await this.pairQuezGameQueryRepository.makeSecondPlayerWin(command.game);
			}
			if(firstPlayerScore === secondPalyerScore) {
				await this.pairQuezGameQueryRepository.notAWinner(command.game);
			}
			return await this.pairQuezGameQueryRepository.changeGameStatusToFinished(command.game.id)
		}
	}
}