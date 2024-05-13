import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Question } from "../../question/domain/entity.question";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { GameTypeModel } from "../type/typeViewModel";
import { GameStatusEnum } from "../enum/enumPendingPlayer";

export class ChangeStatusToFinishedCommand {
	constructor(
		// public gameId: string,
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
			const firstPlayerLastAnswer = firstPlayer.firstPlayerProgress.answers[command.gameQuestions.length - 1]
			const secondPlayerLastAnswer = secondPlayer.secondPlayerProgress.answers[command.gameQuestions.length - 1]
			if (firstPlayerLastAnswer.addedAt < secondPlayerLastAnswer.addedAt) {
				await this.pairQuezGameQueryRepository.addBonusFirstPalyer(command.game.firstPlayerProgress.id)
			} else if (firstPlayerLastAnswer.addedAt > secondPlayerLastAnswer.addedAt) {
				await this.pairQuezGameQueryRepository.addBonusSecondPalyer(command.game.secondPlayerProgress.id)
			}
			return await this.pairQuezGameQueryRepository.changeGameStatusToFinished(command.game.id)
		}
	}
}