import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnswerStatusEnum } from '../enum/enumPendingPlayer';
import { ForbiddenException } from '@nestjs/common';
import { QuestionQueryRepository } from '../../question/infrastructury/questionQueryRepository';
import { PairQuizGameRepository } from '../infrastructure/pairQuizGameRepository';
import { AnswersPlayer } from '../../pairQuizGameProgress/domain/entity.answersPlayer';
import { PairQuezGameQueryRepository } from '../infrastructure/pairQuizGameQueryRepository';
import { ChangeStatusToFinishedCommand } from './changeStatusToFinished-use-case';
import { PairQuizGame } from '../domain/entity.pairQuezGame';
import { QuestionGame } from '../domain/entity.questionGame';
import { GameTypeModel } from '../type/typeViewModel';

export class FirstPlayerSendAnswerCommand {
  constructor(
    public game: PairQuizGame,
    public activeUserGame: GameTypeModel,
    public inputAnswer: string,
  ) {}
}

@CommandHandler(FirstPlayerSendAnswerCommand)
export class FirstPlayerSendAnswerUseCase
  implements ICommandHandler<FirstPlayerSendAnswerCommand>
{
  constructor(
    protected readonly questionQueryRepository: QuestionQueryRepository,
    protected readonly pairQuizGameRepository: PairQuizGameRepository,
    protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
    protected readonly commandBus: CommandBus,
  ) {}
  async execute(command: FirstPlayerSendAnswerCommand): Promise<any> {
    if (command.activeUserGame.firstPlayerProgress.answers.length > 4) {
      throw new ForbiddenException('You already answered all questions');
    } else {
      const currentQuestionIndex: number =
        command.activeUserGame.firstPlayerProgress.answers.length;
      const gameQuestion: QuestionGame = command.game.questionGames.find(
        (q) => q.index === currentQuestionIndex,
      );

      if (!gameQuestion) return null;
      const question = await this.questionQueryRepository.getQuestionById(
        gameQuestion.question.id,
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const isIncludes = question!.correctAnswers.includes(command.inputAnswer);

      const answer = AnswersPlayer.createAnswer(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        question!.id,
        isIncludes ? AnswerStatusEnum.Correct : AnswerStatusEnum.InCorrect,
        command.inputAnswer,
        command.game.firstPlayerProgress,
      );

      const answerPush = command.game.firstPlayerProgress.answers;
      answerPush.push(answer);
      await this.pairQuezGameQueryRepository.createAnswers(answerPush);
      await this.pairQuizGameRepository.sendAnswerPlayer({
        userId: command.game.firstPlayerProgress.user.id,
        count: isIncludes ? true : false,
        gameId: command.game.id,
      });
      command.game = await this.pairQuezGameQueryRepository.getUnfinishedGame(
        command.game.firstPlayerProgress.user.id,
      );

      const changeStatusToFinishedCommand = new ChangeStatusToFinishedCommand(
        command.game,
        command.game.questionGames.map((item) => item.question),
        command.inputAnswer,
        command.activeUserGame,
      );
      await this.commandBus.execute<ChangeStatusToFinishedCommand>(
        changeStatusToFinishedCommand,
      );

      return {
        questionId: answer.questionId,
        answerStatus: answer.answerStatus,
        addedAt: answer.addedAt,
      };
    }
  }
}
