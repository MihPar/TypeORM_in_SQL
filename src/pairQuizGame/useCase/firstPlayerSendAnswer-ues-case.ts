import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Question } from "../../question/domain/entity.question";
import { AnswerStatusEnum, GameStatusEnum } from "../enum/enumPendingPlayer";
import { ForbiddenException } from "@nestjs/common";
import { QuestionQueryRepository } from "../../question/infrastructury/questionQueryRepository";
import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";
import { ChangeAnswerStatusFirstPlayerCommand } from "./changeAnswerStatusFirstPlayer-use-case";
import { CangeStatusToFinishedCommand } from "./changeStatusToFinished-use-case";
import { PairQuizGameProgressPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PairQuizGameProgressQueryRepository } from "../../pairQuizGameProgress/infrastructure/pairQuizGameProgressQueryRepository";
import { AnswersPlayer } from "../../pairQuizGameProgress/domain/entity.answersPlayer";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";

export class FirstPlayerSendAnswerCommand {
	constructor(
		public firstPlayer: PairQuizGameProgressPlayer,
		public gameId: string,
		public gameQuestions: Question[],
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
		if(command.firstPlayer.answers.length === command.gameQuestions.length) {
			console.log("answer: ", command.firstPlayer.answers.length === command.gameQuestions.length)
			throw new ForbiddenException('You already answered all questions')
		} else {
			const answerLength: number = command.firstPlayer.answers.length
			const gameQuestion: Question = command.gameQuestions[answerLength]
			const question = await this.questionQueryRepository.getQuestionById(gameQuestion.id)

			if(question!.correctAnswers.includes(command.inputAnswer)) {
				const answer = AnswersPlayer.createAnswer(
					question!.id,
					AnswerStatusEnum.Correct,
					command.inputAnswer,
					command.firstPlayer.id,
					command.firstPlayer,
       		 );
				await this.pairQuezGameQueryRepository.createAnswers(answer)
				await this.pairQuizGameRepository.sendAnswerFirstPlayer(
					command.firstPlayer.id,
					command.gameId,
					answer.questionId,
					answer.answerStatus,
					answer.addedAt,
					"+1"
					)
					const changeAnswerStatusCommand = new ChangeAnswerStatusFirstPlayerCommand(command.gameId, command.gameQuestions)
					await this.commandBus.execute<ChangeAnswerStatusFirstPlayerCommand>(changeAnswerStatusCommand)

					const changeStatusToFinishedCommand = new CangeStatusToFinishedCommand(command.gameId, command.gameQuestions)
					await this.commandBus.execute<CangeStatusToFinishedCommand>(changeStatusToFinishedCommand)

					return {
						questionId: answer.questionId,
						answerStatus: answer.answerStatus,
						addedAt: answer.addedAt
					}
			// } else if(!question!.correctAnswers.includes(inputAnswer)) {
				// const answer = Answer.createAnswer(question!.id, AnswerStatusEnum.InCorrect)
				// await this.pairQuizGameRepository.createAnswer(answer)
				// await this.pairQuizGameRepository.sendAnswerFirstPlayer(
				// 	command.gameId,
				// 	{
				// 		questionId: answer.questionId,
				// 		answerStatus: answer.answerStatus,
				// 		addedAt: answer.addedAt
				// 	},
				// 	"-0"
				// 	)
			}
		}
	}
}