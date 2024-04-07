import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Question } from "../../question/domain/entity.question";
import { AnswerStatusEnum, GameStatusEnum } from "../enum/enumPendingPlayer";
import { QuestionQueryRepository } from "../../question/infrastructury/questionQueryRepository";
import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";
import { ForbiddenException } from "@nestjs/common";
import { CangeStatusToFinishedCommand } from "./changeStatusToFinished-use-case";
import { PairQuizGameProgressPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer";

export class SecondPlayerSendAnswerCommand {
	constructor(
		secondPlayer: PairQuizGameProgressPlayer,
		gameId: string,
		gameQuestions: Question[],
		inputAnswer: string
	) {}
}

@CommandHandler(SecondPlayerSendAnswerCommand)
export class SecondPlayerSendAnswerUseCase implements ICommandHandler<SecondPlayerSendAnswerCommand> {
	constructor(
		protected readonly questionQueryRepository: QuestionQueryRepository,
		protected readonly pairQuizGameRepository: PairQuizGameRepository,
		protected readonly commandBus: CommandBus
	) {}
	async execute(command: SecondPlayerSendAnswerCommand): Promise<any> {
		if(command.secondPlayer.answer.length === gameQuestion.length) {
			throw new ForbiddenException('You already answered all questions')
		} else {
			const questionNumber: number = secondPlayer.answer.length
			const gameQuestion: Question = gameQuestions[questionNumber]
			const question = await this.questionQueryRepository.getQuestionById(gameQuestion.id)

			if(question!.correctAnswers.includes(inputAnswer)) {
				const answer = Answer.createAnswer(question!.id, AnswerStatusEnum.Correct)
				await this.pairQuizGameRepository.createAnswer(answer)
				await this.pairQuizGameRepository.sendAnswerSecondPlayer(
					command.gameId,
					{
						questionId: answer.questionId,
						answerStatus: answer.answerStatus,
						addedAt: answer.addedAt
					},
					"+1"
					)
					const ChangeAnswerStatusCommand = new ChangeAnswerStatusSecondPlayerCommand(gameId, gameQuestions)
					await this.commandBus.execute(commandChangeAnswerStatus)

					const changeStatusToFinishedCommand = new CangeStatusToFinishedCommand(gameId, gameQuestions)
					await this.commandBus.execute(changeStatusToFinishedCommand)

					return {
						questionId: answer.questionId,
						answerStatus: answer.answerStatus,
						addedAt: answer.addedAt
					}
			} else if(!question!.correctAnswers.includes(inputAnswer)) {
				const answer = Answer.createAnswer(question!.id, AnswerStatusEnum.InCorrect)
				await this.pairQuizGameRepository.createAnswer(answer)
				await this.pairQuizGameRepository.sendAnswerSecondPlayer(
					command.gameId,
					{
						questionId: answer.questionId,
						answerStatus: answer.answerStatus,
						addedAt: answer.addedAt
					},
					"-0"
					)
			}
		}
	}
}
