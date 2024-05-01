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

export class FirstPlayerSendAnswerCommand {
	constructor(
		public game: PairQuizGame,
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
		if(command.game.firstPlayerProgress.answers.length > 4) {
			throw new ForbiddenException('You already answered all questions')
		} else {
			const currentQuestionIndex: number = command.game.firstPlayerProgress.answers.length
			const gameQuestion: QuestionGame = command.game.questionGames.find((q) => q.index === (currentQuestionIndex - 1))
			const question = await this.questionQueryRepository.getQuestionById(gameQuestion.question.id)

			const isIncludes = question!.correctAnswers.includes(command.inputAnswer)
				const answer = AnswersPlayer.createAnswer(
					question!.id,
					isIncludes ? AnswerStatusEnum.Correct : AnswerStatusEnum.InCorrect,
					command.inputAnswer,
					command.game.firstPlayerProgress,
       		 );
				await this.pairQuezGameQueryRepository.createAnswers(answer)
				await this.pairQuizGameRepository.sendAnswerPlayer(
					command.game.firstPlayerProgress.id,
					command.game.id,
					answer.questionId,
					answer.answerStatus,
					answer.addedAt,
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