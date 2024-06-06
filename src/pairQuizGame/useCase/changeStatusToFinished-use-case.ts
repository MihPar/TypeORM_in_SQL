// import { PairQuizGameRepository } from './../infrastructure/pairQuizGameRepository';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Question } from "../../question/domain/entity.question";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { GameTypeModel } from "../type/typeViewModel";
import { AnswerStatusEnum, GameStatusEnum, StatusGameEnum } from "../enum/enumPendingPlayer";
import { sortAddedAt } from "../../helpers/helpers";
import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";

export class ChangeStatusToFinishedCommand {
	constructor(
		public game: PairQuizGame,
		public gameQuestions: Question[]
	) {}
}

@CommandHandler(ChangeStatusToFinishedCommand)
export class ChangeStatusToFinishedUseCase implements ICommandHandler<ChangeStatusToFinishedCommand> {
	constructor(
		protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
		protected readonly pairQuizGameRepository: PairQuizGameRepository,
	) {}
	async execute(command: ChangeStatusToFinishedCommand): Promise<any> {
		const firstPlayer = await this.pairQuezGameQueryRepository.getGameByUserIdAndStatuses(command.game.id, command.game.firstPlayerProgress.user.id, [GameStatusEnum.Active])
		const secondPlayer = await this.pairQuezGameQueryRepository.getGameByUserIdAndStatuses(command.game.id, command.game.secondPlayerProgress.user.id, [GameStatusEnum.Active])

		if(
			firstPlayer.firstPlayerProgress.answers.length === command.gameQuestions.length &&
			secondPlayer.secondPlayerProgress.answers.length === command.gameQuestions.length
		) {
			const firstPlayerLastAnswer = sortAddedAt(firstPlayer.firstPlayerProgress.answers)[command.gameQuestions.length - 1]
			const secondPlayerLastAnswer = sortAddedAt(secondPlayer.secondPlayerProgress.answers)[command.gameQuestions.length - 1]
			if ((firstPlayerLastAnswer.addedAt.toISOString() < secondPlayerLastAnswer.addedAt.toISOString()) && firstPlayer.firstPlayerProgress.answers.some(item => item.answerStatus === AnswerStatusEnum.Correct)) {
				command.game.firstPlayerProgress.score += 1
				// await this.pairQuezGameQueryRepository.addBonusPalyer(command.game.firstPlayerProgress.id)
			} else if ((firstPlayerLastAnswer.addedAt.toISOString() > secondPlayerLastAnswer.addedAt.toISOString()) && secondPlayer.secondPlayerProgress.answers.some(item => item.answerStatus === AnswerStatusEnum.Correct)) {
				command.game.secondPlayerProgress.score += 1
				// await this.pairQuezGameQueryRepository.addBonusPalyer(command.game.secondPlayerProgress.id)
			}
			const firstPlayerScore = command.game.firstPlayerProgress.score
			const secondPalyerScore = command.game.secondPlayerProgress.score
			if(firstPlayerScore > secondPalyerScore)  {
				command.game.secondPlayerProgress.userStatus = StatusGameEnum.Loser
				command.game.firstPlayerProgress.userStatus = StatusGameEnum.Winner
				// await this.pairQuezGameQueryRepository.makeFirstPlayerWin(command.game)
			}
			if(firstPlayerScore < secondPalyerScore) {
				command.game.secondPlayerProgress.userStatus = StatusGameEnum.Winner
				command.game.firstPlayerProgress.userStatus = StatusGameEnum.Loser
				// await this.pairQuezGameQueryRepository.makeSecondPlayerWin(command.game);
			}
			if(firstPlayerScore === secondPalyerScore) {
				command.game.secondPlayerProgress.userStatus = StatusGameEnum.Draw
				command.game.firstPlayerProgress.userStatus = StatusGameEnum.Draw
				// await this.pairQuezGameQueryRepository.notAWinner(command.game);
			}
			command.game.status = GameStatusEnum.Finished
			 await this.pairQuezGameQueryRepository.saveProgress(command.game.firstPlayerProgress)
			 await this.pairQuezGameQueryRepository.saveProgress(command.game.secondPlayerProgress)
			 

			//  const progressAfterUpdate = await this.pairQuizGameRepository.getProgressById(command.game.secondPlayerProgress.id)
			// console.log(progressAfterUpdate, "++++")
			return await this.pairQuezGameQueryRepository.saveGame(command.game)
			//changeGameStatusToFinished(command.game.id)
		} else if(firstPlayer.firstPlayerProgress.answers.length === 5 && secondPlayer.secondPlayerProgress.answers.length <= 4) {
			setTimeout(async() => {

			}, 10000)
		} else if(secondPlayer.secondPlayerProgress.answers.length === 5 && firstPlayer.firstPlayerProgress.answers.length) {
			setTimeout(async() => {
							
			}, 10000)
		}
	}
}