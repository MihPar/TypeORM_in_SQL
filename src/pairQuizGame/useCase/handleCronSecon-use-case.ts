import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairQuizGame } from '../domain/entity.pairQuezGame';
import { Question } from '../../question/domain/entity.question';
import { GameTypeModel } from '../type/typeViewModel';
import { QuestionQueryRepository } from '../../question/infrastructury/questionQueryRepository';
import {
  AnswerStatusEnum,
  GameStatusEnum,
  StatusGameEnum,
} from '../enum/enumPendingPlayer';
import { PairQuezGameQueryRepository } from '../infrastructure/pairQuizGameQueryRepository';
import { PairQuizGameRepository } from '../infrastructure/pairQuizGameRepository';
import { AnswersPlayer } from '../../pairQuizGameProgress/domain/entity.answersPlayer';

export class CronSecondCommand {
  constructor(
    public previous_score: number,
    public game: PairQuizGame,
    public gameQuestions: Question[],
    public inputAnswer: string,
    public activeUserGame: GameTypeModel,
  ) {}
}

@CommandHandler(CronSecondCommand)
export class CronSecondUseCase implements ICommandHandler<CronSecondCommand> {
  constructor(
    protected readonly questionQueryRepository: QuestionQueryRepository,
    protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
    protected readonly pairQuizGameRepository: PairQuizGameRepository,
  ) {}
  // @Cron('10 * * * * *', {
  // 		name: 'notificationSecond',
  // 	// 	timeZone: 'Russian'

  // })
  async execute(command: CronSecondCommand): Promise<any> {
    // const foundGame =
    //   await this.pairQuezGameQueryRepository.getGameByUserIdAndStatuses(
    //     command.game.id,
    //     command.game.secondPlayerProgress.user.id,
    //     [GameStatusEnum.Active],
    //   );
	//   console.log("command.previous_score: ", command.previous_score)
	//   console.log("length: ", command.game.secondPlayerProgress.answers.length)
	//   console.log("compare: ", command.previous_score !== foundGame?.secondPlayerProgress.answers.length)

    if (
      command.previous_score !== command.game?.secondPlayerProgress.answers.length
    ) {
      return null;
    }
    const secondPlayerAnswersAfterTenSeconds =
	command.game?.secondPlayerProgress.answers.length;

    const unAnswersQuestions = 4 - secondPlayerAnswersAfterTenSeconds;
    for (let i = 0; i <= unAnswersQuestions; i++) {
      const noAnswers = AnswersPlayer.createAnswer(
        command.gameQuestions[secondPlayerAnswersAfterTenSeconds + i].id,
        AnswerStatusEnum.InCorrect,
        'answer was not provider',
        command.game.secondPlayerProgress,
      );
      const answerPush = command.game.firstPlayerProgress.answers;
      answerPush.push(noAnswers);
      await this.pairQuezGameQueryRepository.createAnswers(answerPush);
      await this.pairQuizGameRepository.sendAnswerPlayer({
        userId: command.game.secondPlayerProgress.user.id,
        count: false,
        gameId: command.game.id,
      });
    }
	// console.log("73")
    const firstPlayerScore = command.game?.firstPlayerProgress.score;
    const secondPalyerScore = command.game?.secondPlayerProgress.score;
    if (firstPlayerScore > secondPalyerScore) {
      command.game.secondPlayerProgress.userStatus = StatusGameEnum.Loser;
      command.game.firstPlayerProgress.userStatus = StatusGameEnum.Winner;
    }
    if (firstPlayerScore < secondPalyerScore) {
      command.game.secondPlayerProgress.userStatus = StatusGameEnum.Winner;
      command.game.firstPlayerProgress.userStatus = StatusGameEnum.Loser;
    }
    if (firstPlayerScore === secondPalyerScore) {
      command.game.secondPlayerProgress.userStatus = StatusGameEnum.Draw;
      command.game.firstPlayerProgress.userStatus = StatusGameEnum.Draw;
    }
	// console.log("88")

    // await this.pairQuezGameQueryRepository.saveProgress(
    //   command.game?.secondPlayerProgress,
    // );
    // await this.pairQuezGameQueryRepository.saveProgress(
    //   command.game?.firstPlayerProgress,
    // );
	// console.log("try end two")
    return await this.pairQuezGameQueryRepository.saveGame(command.game);
    //}
  }
}
