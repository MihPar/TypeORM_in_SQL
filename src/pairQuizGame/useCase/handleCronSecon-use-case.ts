import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { Question } from "../../question/domain/entity.question";
import { GameTypeModel } from "../type/typeViewModel";
import { ChangeStatusToFinishedCommand } from "./changeStatusToFinished-use-case";
import { QuestionGame } from "../domain/entity.questionGame";
import { QuestionQueryRepository } from "../../question/infrastructury/questionQueryRepository";
import { AnswersPlayer } from "../../pairQuizGameProgress/domain/entity.answersPlayer";
import { AnswerStatusEnum } from "../enum/enumPendingPlayer";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";
import { Cron } from '@nestjs/schedule';
import { sortAddedAt } from '../../helpers/helpers';
import { PairQuizGameRepository } from '../infrastructure/pairQuizGameRepository';

export class CronSecondCommand {
	constructor(
		public game: PairQuizGame,
		public gameQuestions: Question[],
		public inputAnswer: string,
		public activeUserGame: GameTypeModel,
	) {}
}

@CommandHandler(CronSecondCommand)
export class CronSecondUseCase implements ICommandHandler<CronSecondCommand> {
	constructor(
		protected readonly questionQueryRepository: QuestionQueryRepository,
		protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
		protected readonly pairQuizGameRepository: PairQuizGameRepository
	) {}
	// @Cron('10 * * * * *', {
	// 		name: 'notificationSecond',
	// 	// 	timeZone: 'Russian'
			
	// })
	async execute(command: CronSecondCommand): Promise<any> {
		setTimeout(async() => {
			const currentQuestionIndex: number = command.activeUserGame.secondPlayerProgress.answers.length
			const gameQuestion: QuestionGame = command.game.questionGames.find((q) => q.index === (currentQuestionIndex))
			const question = await this.questionQueryRepository.getQuestionById(gameQuestion.question.id)
			const isIncludes = question!.correctAnswers.includes(command.inputAnswer)

			const answer = AnswersPlayer.createAnswer(
						question!.id,
						isIncludes ? AnswerStatusEnum.Correct : AnswerStatusEnum.InCorrect,
						command.inputAnswer,
						command.game.secondPlayerProgress,
					);
			const answerPush = command.game.secondPlayerProgress.answers
			answerPush.push(answer)
			await this.pairQuezGameQueryRepository.createAnswers(answerPush)

			await this.pairQuizGameRepository.sendAnswerPlayer(
				{
					userId: command.game.secondPlayerProgress.user.id,
					count: (isIncludes ? true : false),
					gameId: command.game.id
				}
			)
			command.game =  await this.pairQuezGameQueryRepository.getUnfinishedGame(command.game.secondPlayerProgress.user.id)
			return await this.pairQuezGameQueryRepository.saveGame(command.game)
		}, 10000)
		command.game.secondPlayerProgress.score += 1
		return await this.pairQuezGameQueryRepository.saveGame(command.game)
	}
}