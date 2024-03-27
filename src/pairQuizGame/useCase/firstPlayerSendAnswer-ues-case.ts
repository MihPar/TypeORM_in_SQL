import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Question } from "../../question/domain/entity.question";
import { AnswerStatusEnum, GameStatusEnum } from "../enum/enumPendingPlayer";
import { ForbiddenException } from "@nestjs/common";
import { QuestionQueryRepository } from "../../question/infrastructury/questionQueryRepository";
import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";

export class FirstPlayerSendAnswerCommand {
	constructor(
		firstPlayer: GameStatusEnum,
		gameId: string,
		gameQuestions: Question[],
		inputAnswer: string
	) {}
}

@CommandHandler(FirstPlayerSendAnswerCommand)
export class FirstPlayerSendAnswerUseCase implements ICommandHandler<FirstPlayerSendAnswerCommand> {
	constructor(
		protected readonly questionQueryRepository: QuestionQueryRepository,
		protected readonly pairQuizGameRepository: PairQuizGameRepository,
		protected readonly commandBus: CommandBus
	) {}
	async execute(command: FirstPlayerSendAnswerCommand): Promise<any> {
		if(firstPlayer.answer.length === gameQuestion.length) {
			throw new ForbiddenException('You already answered all questions')
		} else {
			const questionNumber: number = firstPlayer.answer.length
			const gameQuestion: Question = gameQuestions[questionNumber]
			const question = await this.questionQueryRepository.getQuestionById(gameQuestion.id)

			if(!question.correctAnswers.includes(inputAnswer)) {
				const answer = Answer.createAnswer(question!.id, AnswerStatusEnum.Correct)
				await this.pairQuizGameRepository.createAnswer(answer)
				await this.pairQuizGameRepository.sendAnswerFirstPlayer(
					command.gameId,
					{
						questionId: answer.questionId,
						answerStatus: answer.answerStatus,
						addedAt: answer.addedAt
					},
					"+1"
					)
					const command = new ChangeAnswerStatusFirstPlayerCommand(gameId, gameQuestions)
					await this.commandBus.execute(command)
			}
		}
	}
}