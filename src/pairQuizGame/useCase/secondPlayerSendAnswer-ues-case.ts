import { PairQuezGameQueryRepository } from './../infrastructure/pairQuizGameQueryRepository';
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Question } from "../../question/domain/entity.question";
import { AnswerStatusEnum } from "../enum/enumPendingPlayer";
import { QuestionQueryRepository } from "../../question/infrastructury/questionQueryRepository";
import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { PairQuizGameProgressPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer";
import { AnswersPlayer } from "../../pairQuizGameProgress/domain/entity.answersPlayer";
import { ChangeAnswerStatusPlayerCommand } from './changeAnswerStatusFirstPlayer-use-case';
import { ChangeStatusToFinishedCommand } from './changeStatusToFinished-use-case';

export class SecondPlayerSendAnswerCommand {
	constructor(
		public secondPlayer: PairQuizGameProgressPlayer,
		public gameId: string,
		public gameQuestions: Question[],
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
		if(command.secondPlayer.answers.length === command.gameQuestions.length) {
			throw new NotFoundException('You already answered all questions')
		} else {
			const answerLength: number = command.secondPlayer.answers.length
			const gameQuestion: Question = command.gameQuestions[answerLength]
			const question = await this.questionQueryRepository.getQuestionById(gameQuestion.id)

			if(question!.correctAnswers.includes(command.inputAnswer)) {
				const answer = AnswersPlayer.createAnswer(
					question!.id,
					AnswerStatusEnum.Correct,
					command.inputAnswer,
					command.secondPlayer.id,
					command.secondPlayer,
       		 );
				await this.pairQuezGameQueryRepository.createAnswers(answer)
				await this.pairQuizGameRepository.sendAnswerFirstPlayer(
					command.secondPlayer.id,
					command.gameId,
					answer.questionId,
					answer.answerStatus,
					answer.addedAt,
					"+1"
					)
					const changeAnswerStatusCommand = new ChangeAnswerStatusPlayerCommand(command.gameId, command.gameQuestions)
					await this.commandBus.execute<ChangeAnswerStatusPlayerCommand>(changeAnswerStatusCommand)

					const changeStatusToFinishedCommand = new ChangeStatusToFinishedCommand(command.gameId, command.gameQuestions)
					await this.commandBus.execute<ChangeStatusToFinishedCommand>(changeStatusToFinishedCommand)

					return {
						questionId: answer.questionId,
						answerStatus: answer.answerStatus,
						addedAt: answer.addedAt
					}
			} else if(!question!.correctAnswers.includes(command.inputAnswer)) {
				const answer = AnswersPlayer.createAnswer(
					question!.id,
					AnswerStatusEnum.Correct,
					command.inputAnswer,
					command.secondPlayer.id,
					command.secondPlayer,
       		 );
				await this.pairQuezGameQueryRepository.createAnswers(answer)
				await this.pairQuizGameRepository.sendAnswerSecondPlayer(
					command.secondPlayer.id,
					command.gameId,
					answer.questionId,
					answer.answerStatus,
					answer.addedAt,
					"-0"
					)
					const changeAnswerStatusCommand = new ChangeAnswerStatusPlayerCommand(command.gameId, command.gameQuestions)
					await this.commandBus.execute<ChangeAnswerStatusPlayerCommand>(changeAnswerStatusCommand)

					const changeStatusToFinishedCommand = new ChangeStatusToFinishedCommand(command.gameId, command.gameQuestions)
					await this.commandBus.execute<ChangeStatusToFinishedCommand>(changeStatusToFinishedCommand)

					return {
						questionId: answer.questionId,
						answerStatus: answer.answerStatus,
						addedAt: answer.addedAt
					}
			}
		}
	}
}
