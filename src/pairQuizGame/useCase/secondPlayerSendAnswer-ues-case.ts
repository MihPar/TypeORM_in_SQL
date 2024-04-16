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

export class SecondPlayerSendAnswerCommand {
	constructor(
		public game: PairQuizGame,
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
		if(command.game.secondPlayerProgress.answers.length > 4) {
			throw new ForbiddenException('You already answered all questions')
		} else {
			const answerLength: number = command.game.secondPlayerProgress.answers.length
			const gameQuestion: Question = command.game.question[answerLength]
			const question = await this.questionQueryRepository.getQuestionById(gameQuestion.id)

			const isIncludes = question!.correctAnswers.includes(command.inputAnswer)
				const answer = AnswersPlayer.createAnswer(
					question!.id,
					isIncludes ? AnswerStatusEnum.Correct : AnswerStatusEnum.InCorrect,
					command.inputAnswer,
					command.game.secondPlayerProgress,
       		 );
				await this.pairQuezGameQueryRepository.createAnswers(answer)
				await this.pairQuizGameRepository.sendAnswerFirstPlayer(
					command.game.secondPlayerProgress.id,
					command.game.id,
					answer.questionId,
					answer.answerStatus,
					answer.addedAt,
					isIncludes ? "+1" : "+0",
					)
					const changeStatusToFinishedCommand = new ChangeStatusToFinishedCommand(command.game.id, command.game.question)
					await this.commandBus.execute<ChangeStatusToFinishedCommand>(changeStatusToFinishedCommand)

					return {
						questionId: answer.questionId,
						answerStatus: answer.answerStatus,
						addedAt: answer.addedAt
					}
		}
	}
}
