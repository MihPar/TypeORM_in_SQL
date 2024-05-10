import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AnswerStatusEnum } from "../enum/enumPendingPlayer";
import { ForbiddenException } from "@nestjs/common";
import { QuestionQueryRepository } from "../../question/infrastructury/questionQueryRepository";
import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";
import { PairQuizGameProgressQueryRepository } from "../../pairQuizGameProgress/infrastructure/pairQuizGameProgressQueryRepository";
import { AnswersPlayer } from "../../pairQuizGameProgress/domain/entity.answersPlayer";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";
import { ChangeStatusToFinishedCommand } from "./changeStatusToFinished-use-case";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { QuestionGame } from "../domain/entity.questionGame";
import { GameTypeModel } from "../type/typeViewModel";
import { log } from "console";

export class FirstPlayerSendAnswerCommand {
	constructor(
		public game: PairQuizGame,
		public activeUserGame: GameTypeModel,
		public inputAnswer: string
	) {}
}

@CommandHandler(FirstPlayerSendAnswerCommand)
export class FirstPlayerSendAnswerUseCase implements ICommandHandler<FirstPlayerSendAnswerCommand> {
	constructor(
		protected readonly questionQueryRepository: QuestionQueryRepository,
		protected readonly pairQuizGameRepository: PairQuizGameRepository,
		protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
		protected readonly pairQuizGameProgressQueryRepository: PairQuizGameProgressQueryRepository,
		protected readonly commandBus: CommandBus
	) {}
	async execute(command: FirstPlayerSendAnswerCommand): Promise<any> {
		// console.log("inputAnswer: ", command.inputAnswer)
		if(command.activeUserGame.firstPlayerProgress.answers.length > 4) {
			throw new ForbiddenException('You already answered all questions')
		} else {
			const currentQuestionIndex: number = command.activeUserGame.firstPlayerProgress.answers.length
			// console.log("command.game.questionGames: ", command.game.questionGames)
			// console.log(currentQuestionIndex)
			// console.error(command.activeUserGame.questions, "questions of game to answer by first player")
			const gameQuestion: QuestionGame = command.game.questionGames.find((q) => q.index === (currentQuestionIndex))
			// console.error(gameQuestion, " found question of the game to answer")
			// console.log(typeof currentQuestionIndex)
			// console.log(typeof command.game.questionGames[0].index)
			// console.log("gameQuestion: ", gameQuestion)
			if(!gameQuestion) return null
			const question = await this.questionQueryRepository.getQuestionById(gameQuestion.question.id)
			// console.log(question, " found question in db by id of gameQuestion")
			const isIncludes = question!.correctAnswers.includes(command.inputAnswer)
			// console.error(isIncludes, question!.correctAnswers.includes(command.inputAnswer), command.inputAnswer)
			const answer = AnswersPlayer.createAnswer(
					question!.id,
					isIncludes ? AnswerStatusEnum.Correct : AnswerStatusEnum.InCorrect,
					command.inputAnswer,
					command.game.firstPlayerProgress,
       		 );

			//  console.log("answer: ", answer.answer)
			const answerPush = command.game.firstPlayerProgress.answers
			answerPush.push(answer)
				await this.pairQuezGameQueryRepository.createAnswers(answerPush)
				await this.pairQuizGameRepository.sendAnswerPlayer(
					command.game.firstPlayerProgress.id,
					command.game,
					isIncludes ? "+1" : "+0",
					)
				const changeStatusToFinishedCommand = new ChangeStatusToFinishedCommand(command.game.id, command.game, command.game.questionGames.map((item) => {return item.question}))
				await this.commandBus.execute<ChangeStatusToFinishedCommand>(changeStatusToFinishedCommand)

					return {
						questionId: answer.questionId,
						answerStatus: answer.answerStatus,
						addedAt: answer.addedAt
					}
		}
	}
}