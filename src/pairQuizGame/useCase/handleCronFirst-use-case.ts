import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairQuizGame } from '../domain/entity.pairQuezGame';
import { Question } from '../../question/domain/entity.question';
import { GameTypeModel } from '../type/typeViewModel';
import { QuestionGame } from '../domain/entity.questionGame';
import { QuestionQueryRepository } from '../../question/infrastructury/questionQueryRepository';
import { AnswersPlayer } from '../../pairQuizGameProgress/domain/entity.answersPlayer';
import {
  AnswerStatusEnum,
  GameStatusEnum,
  StatusGameEnum,
} from '../enum/enumPendingPlayer';
import { PairQuezGameQueryRepository } from '../infrastructure/pairQuizGameQueryRepository';
// import { Cron } from '@nestjs/schedule';
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
    protected readonly pairQuizGameRepository: PairQuizGameRepository,
  ) {}
  // @Cron(new Date(Date.now() + 10 * 600000),
  // {
  // 	name: 'notification',
  // // 	timeZone: 'Russian'

  // }
  // )
  async execute(command: CronFirstCommand): Promise<any> {
    const setTimeFirst = setTimeout(async () => {
      const firstPlayer =
        await this.pairQuezGameQueryRepository.getGameByUserIdAndStatuses(
          command.game.id,
          command.game.firstPlayerProgress.user.id,
          [GameStatusEnum.Active],
        );
      if (firstPlayer.firstPlayerProgress.answers.length === 5) {
        clearTimeout(setTimeFirst);
        return await this.pairQuezGameQueryRepository.saveGame(command.game);
      } else {
        const currentQuestionIndex: number =
          command.activeUserGame.firstPlayerProgress.answers.length;
        const gameQuestion: QuestionGame = command.game.questionGames.find(
          (q) => q.index === currentQuestionIndex,
        );
        const question = await this.questionQueryRepository.getQuestionById(
          gameQuestion.question.id,
        );
        const isIncludes = question!.correctAnswers.includes(
          command.inputAnswer,
        );

        const answer = AnswersPlayer.createAnswer(
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
        command.game.firstPlayerProgress.score += 1;

        const firstPlayerScore = command.game.firstPlayerProgress.score;
        const secondPalyerScore = command.game.secondPlayerProgress.score;
        if (firstPlayerScore > secondPalyerScore) {
          command.game.secondPlayerProgress.userStatus = StatusGameEnum.Loser;
          command.game.firstPlayerProgress.userStatus = StatusGameEnum.Winner;
          // await this.pairQuezGameQueryRepository.makeFirstPlayerWin(command.game)
        }
        if (firstPlayerScore < secondPalyerScore) {
          command.game.secondPlayerProgress.userStatus = StatusGameEnum.Winner;
          command.game.firstPlayerProgress.userStatus = StatusGameEnum.Loser;
          // await this.pairQuezGameQueryRepository.makeSecondPlayerWin(command.game);
        }
        if (firstPlayerScore === secondPalyerScore) {
          command.game.secondPlayerProgress.userStatus = StatusGameEnum.Draw;
          command.game.firstPlayerProgress.userStatus = StatusGameEnum.Draw;
          // await this.pairQuezGameQueryRepository.notAWinner(command.game);
        }
        command.game.status = GameStatusEnum.Finished;
        await this.pairQuezGameQueryRepository.saveProgress(
          command.game.firstPlayerProgress,
        );
        await this.pairQuezGameQueryRepository.saveProgress(
          command.game.secondPlayerProgress,
        );

        return await this.pairQuezGameQueryRepository.saveGame(command.game);
      }
    }, 10000);
    // command.game.firstPlayerProgress.score += 1
    return await this.pairQuezGameQueryRepository.saveGame(command.game);
  }
}
