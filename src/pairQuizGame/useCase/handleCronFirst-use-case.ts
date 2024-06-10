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
import { PairQuizGameRepository } from '../infrastructure/pairQuizGameRepository';

export class CronFirstCommand {
	constructor(
		public game: PairQuizGame,
		public gameQuestions: Question[],
		public inputAnswer: string,
		public activeUserGame: GameTypeModel,
	) {}
}

@CommandHandler(CronFirstCommand)
export class CronFirstdUseCase implements ICommandHandler<CronFirstCommand> {
	constructor(
		protected readonly questionQueryRepository: QuestionQueryRepository,
		protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
		protected readonly pairQuizGameRepository: PairQuizGameRepository
	) {}
	// @Cron(new Date(Date.now() + 10 * 600000), 
	// {
	// 	name: 'notification',
	// // 	timeZone: 'Russian'
		
	// }
// )
	async execute(command: CronFirstCommand): Promise<any> {
		setTimeout(async() => {
			const currentQuestionIndex: number = command.activeUserGame.firstPlayerProgress.answers.length
			const gameQuestion: QuestionGame = command.game.questionGames.find((q) => q.index === (currentQuestionIndex))
			const question = await this.questionQueryRepository.getQuestionById(gameQuestion.question.id)
					const isIncludes = question!.correctAnswers.includes(command.inputAnswer)

					const answer = AnswersPlayer.createAnswer(
						question!.id,
						isIncludes ? AnswerStatusEnum.Correct : AnswerStatusEnum.InCorrect,
						command.inputAnswer,
						command.game.firstPlayerProgress,
					);
					const answerPush = command.game.firstPlayerProgress.answers
					answerPush.push(answer)
				await this.pairQuezGameQueryRepository.createAnswers(answerPush)
				await this.pairQuizGameRepository.sendAnswerPlayer(
					{
						userId: command.game.firstPlayerProgress.user.id,
						count: (isIncludes ? true : false),
						gameId: command.game.id
					}
				)
				command.game =  await this.pairQuezGameQueryRepository.getUnfinishedGame(command.game.firstPlayerProgress.user.id)
				return await this.pairQuezGameQueryRepository.saveGame(command.game)
		}, 600000)
		command.game.firstPlayerProgress.score += 1
		return await this.pairQuezGameQueryRepository.saveGame(command.game)
	}
}