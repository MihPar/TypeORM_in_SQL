import { PairQuezGameQueryRepository } from './../infrastructure/pairQuizGameQueryRepository';
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Question } from "../../question/domain/entity.question";
import { AnswerStatusEnum } from "../enum/enumPendingPlayer";
import { QuestionQueryRepository } from "../../question/infrastructury/questionQueryRepository";
import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";
import { ForbiddenException } from "@nestjs/common";
import { AnswersPlayer } from "../../pairQuizGameProgress/domain/entity.answersPlayer";
import { ChangeStatusToFinishedCommand } from './changeStatusToFinished-use-case';
import { PairQuizGame } from '../domain/entity.pairQuezGame';
import { QuestionGame } from '../domain/entity.questionGame';
import { GameTypeModel } from '../type/typeViewModel';

export class SecondPlayerSendAnswerCommand {
	constructor(
		public game: PairQuizGame,
		public activeUserGame: GameTypeModel,
		public inputAnswer: string
	) {}
}

@CommandHandler(SecondPlayerSendAnswerCommand)
export class SecondPlayerSendAnswerUseCase implements ICommandHandler<SecondPlayerSendAnswerCommand> {
	constructor(
		protected readonly questionQueryRepository: QuestionQueryRepository,
		protected readonly pairQuizGameRepository: PairQuizGameRepository,
		protected readonly pairQuezGameQueryRepository: 
		PairQuezGameQueryRepository,
		protected readonly commandBus: CommandBus
	) {}
	async execute(command: SecondPlayerSendAnswerCommand): Promise<any> {
		if(command.activeUserGame.secondPlayerProgress.answers.length > 4) {
			throw new ForbiddenException('You already answered all questions')
		} else {
			// console.log("start answering question")
			const currentQuestionIndex: number = command.activeUserGame.secondPlayerProgress.answers.length
			const gameQuestion: QuestionGame = command.game.questionGames.find((q) => q.index == currentQuestionIndex)
			if(!gameQuestion) return null
			const question = await this.questionQueryRepository.getQuestionById(gameQuestion.question.id)

			const isIncludes = question?.correctAnswers.includes(command.inputAnswer)
			const answer = AnswersPlayer.createAnswer(
					question?.id,
					isIncludes ? AnswerStatusEnum.Correct : AnswerStatusEnum.InCorrect,
					command.inputAnswer,
					command.game.secondPlayerProgress,
       		 	);
			// console.log("answer POJO", answer)

			const answerPush = command.game.secondPlayerProgress.answers
			answerPush.push(answer)
			await this.pairQuezGameQueryRepository.createAnswers(answerPush)
			// console.log("answer POJO after saving", answer.progress)
			await this.pairQuizGameRepository.sendAnswerPlayer(
				{
					userId: command.game.secondPlayerProgress.user.id,
					count: isIncludes ,
					gameId: command.game.id
			}
					)
			const progressAfterUpdate = await this.pairQuizGameRepository.getProgressById(answer.progress.id)
			// console.log(progressAfterUpdate, "++++")

			command.game =  await this.pairQuezGameQueryRepository.getUnfinishedGame(command.game.secondPlayerProgress.user.id)//.secondPlayerProgress = progressAfterUpdate
			
			const changeStatusToFinishedCommand = new ChangeStatusToFinishedCommand(command.game, command.game.questionGames.map((item) => {return item.question}), command.inputAnswer, command.activeUserGame)
			await this.commandBus.execute<ChangeStatusToFinishedCommand>(changeStatusToFinishedCommand)

				return {
						questionId: answer.questionId,
						answerStatus: answer.answerStatus,
						addedAt: answer.addedAt
					}
		}
	}
}
