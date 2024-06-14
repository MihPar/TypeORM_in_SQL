import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairQuizGame } from '../domain/entity.pairQuezGame';
import { Question } from '../../question/domain/entity.question';
import { GameTypeModel } from '../type/typeViewModel';
import { QuestionQueryRepository } from '../../question/infrastructury/questionQueryRepository';
import { PairQuezGameQueryRepository } from '../infrastructure/pairQuizGameQueryRepository';
// import { Cron } from '@nestjs/schedule';
import { PairQuizGameRepository } from '../infrastructure/pairQuizGameRepository';
import { AnswersPlayer } from '../../pairQuizGameProgress/domain/entity.answersPlayer';
import {
  AnswerStatusEnum,
  GameStatusEnum,
  StatusGameEnum,
} from '../enum/enumPendingPlayer';

export class CronFirstCommand {
  constructor(
    public previous_score: number,
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
    // const foundGame =
    //   await this.pairQuezGameQueryRepository.getGameByUserIdAndStatuses(
    //     command.game.id,
    //     command.game.firstPlayerProgress.user.id,
    //     [GameStatusEnum.Active],
    //   );
	//   console.log("command.previous_score: ", command.previous_score)
    if (
      command.previous_score !== command.game?.firstPlayerProgress.answers.length
    ) {
      return null;
    }
    const firstPlayerAnswersAfterTenSeconds =
	command.game.secondPlayerProgress.answers.length;
// console.log("1111111")
    const unAnswersQuestions = 4 - firstPlayerAnswersAfterTenSeconds;
    for (let i = 0; i <= unAnswersQuestions; i++) {
      const noAnswers = AnswersPlayer.createAnswer(
        command.gameQuestions[firstPlayerAnswersAfterTenSeconds + i].id,
        AnswerStatusEnum.InCorrect,
        'answer was not provider',
        command.game.secondPlayerProgress,
      );
      const answerPush = command.game.firstPlayerProgress.answers;
      answerPush.push(noAnswers);
      await this.pairQuezGameQueryRepository.createAnswers(answerPush);
      await this.pairQuizGameRepository.sendAnswerPlayer({
        userId: command.game.firstPlayerProgress.user.id,
        count: false,
        gameId: command.game.id,
      });
    }

    const firstPlayerScore = command.game.firstPlayerProgress.score;
    const secondPalyerScore = command.game.secondPlayerProgress.score;
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
    // command.game.status = GameStatusEnum.Finished;
    // await this.pairQuezGameQueryRepository.saveProgress(
    //   command.game?.firstPlayerProgress,
    // );
    // await this.pairQuezGameQueryRepository.saveProgress(
	// 	command.game?.secondPlayerProgress,
    // );
    return await this.pairQuezGameQueryRepository.saveGame(command.game);
  }
}
