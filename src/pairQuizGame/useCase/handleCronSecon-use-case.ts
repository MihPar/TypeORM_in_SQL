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
	// console.log("previous_score: ", command.previous_score)
    // // console.error("Handle cron second command invocation")
    // const foundGame =
    //   await this.pairQuezGameQueryRepository.getGameByUserIdAndStatuses(
    //     command.game.id,
    //     command.game.secondPlayerProgress.user.id,
    //     [GameStatusEnum.Active],
    //   );
    // // const firstPlayer =
    // //   await this.pairQuezGameQueryRepository.getGameByUserIdAndStatuses(
    // //     command.game.id,
    // //     command.game.firstPlayerProgress.user.id,
    // //     [GameStatusEnum.Active],
    // //   );
    // if (
    //   command.previous_score !== foundGame?.secondPlayerProgress.answers.length
    // ) {
    //   return null;
    // }
    // //if (secondPlayer.status === GameStatusEnum.Active) {
    // const secondPlayerAnswersAfterTenSeconds =
	// foundGame.secondPlayerProgress.answers.length;

    // const unAnswersQuestions = 5 - secondPlayerAnswersAfterTenSeconds;
    // for (let i = 0; i < unAnswersQuestions; i++) {
    //   const noAnswers = AnswersPlayer.createAnswer(
    //     command.gameQuestions[secondPlayerAnswersAfterTenSeconds + i].id,
    //     AnswerStatusEnum.InCorrect,
    //     // eslint-disable-next-line prettier/prettier
    //     'answer was not provider',
    //     foundGame.secondPlayerProgress,
    //   );
    //   const answerPush = foundGame.firstPlayerProgress.answers;
    //   answerPush.push(noAnswers);
    //   await this.pairQuezGameQueryRepository.createAnswers(answerPush);
    //   await this.pairQuizGameRepository.sendAnswerPlayer({
    //     userId: foundGame.secondPlayerProgress.user.id,
    //     count: false,
    //     gameId: foundGame.id,
    //   });
    //   //   command.game = await this.pairQuezGameQueryRepository.getUnfinishedGame(
    //   //     command.game.secondPlayerProgress.user.id,
    //   //   );
    // }
    // const firstPlayerScore = foundGame.firstPlayerProgress.score;
    // const secondPalyerScore = foundGame.secondPlayerProgress.score;
    // if (firstPlayerScore > secondPalyerScore) {
    //   foundGame.secondPlayerProgress.userStatus = StatusGameEnum.Loser;
    //   foundGame.firstPlayerProgress.userStatus = StatusGameEnum.Winner;
    //   // await this.pairQuezGameQueryRepository.makeFirstPlayerWin(secondPlayer)
    // }
    // if (firstPlayerScore < secondPalyerScore) {
    //   foundGame.secondPlayerProgress.userStatus = StatusGameEnum.Winner;
    //   foundGame.firstPlayerProgress.userStatus = StatusGameEnum.Loser;
    //   // await this.pairQuezGameQueryRepository.makeSecondPlayerWin(secondPlayer);
    // }
    // if (firstPlayerScore === secondPalyerScore) {
    //   foundGame.secondPlayerProgress.userStatus = StatusGameEnum.Draw;
    //   foundGame.firstPlayerProgress.userStatus = StatusGameEnum.Draw;
    //   // await this.pairQuezGameQueryRepository.notAWinner(secondPlayer);
    // }
    // // secondPlayer.status = GameStatusEnum.Finished;
    // // await this.pairQuezGameQueryRepository.saveProgress(
    // //   firstPlayer.firstPlayerProgress,
    // // );
    // await this.pairQuezGameQueryRepository.saveProgress(
    //   foundGame?.secondPlayerProgress,
    // );
    // await this.pairQuezGameQueryRepository.saveProgress(
    //   foundGame?.firstPlayerProgress,
    // );
    // return await this.pairQuezGameQueryRepository.saveGame(foundGame);
    // //}


	const secondPlayer =
	await this.pairQuezGameQueryRepository.getGameByUserIdAndStatuses(
	  command.game.id,
	  command.game.secondPlayerProgress.user.id,
	  [GameStatusEnum.Active],
	);
  const firstPlayer =
	await this.pairQuezGameQueryRepository.getGameByUserIdAndStatuses(
	  command.game.id,
	  command.game.firstPlayerProgress.user.id,
	  [GameStatusEnum.Active],
	);
  if (
	command.previous_score !==
	secondPlayer?.secondPlayerProgress.answers.length
  ) {
	return null;
  }
  //if (secondPlayer.status === GameStatusEnum.Active) {
  const secondPlayerAnswersAfterTenSeconds =
	secondPlayer?.secondPlayerProgress.answers.length;

  const unAnswersQuestions = 5 - secondPlayerAnswersAfterTenSeconds;
  for (let i = 0; i < unAnswersQuestions; i++) {
	const noAnswers = AnswersPlayer.createAnswer(
	  command.gameQuestions[secondPlayerAnswersAfterTenSeconds + i].id,
	  AnswerStatusEnum.InCorrect,
	  // eslint-disable-next-line prettier/prettier
	  'answer was not provider',
	  secondPlayer.secondPlayerProgress,
	);
	const answerPush = command.game.firstPlayerProgress.answers;
	answerPush.push(noAnswers);
	await this.pairQuezGameQueryRepository.createAnswers(answerPush);
	await this.pairQuizGameRepository.sendAnswerPlayer({
	  userId: command.game.secondPlayerProgress.user.id,
	  count: false,
	  gameId: command.game.id,
	});
	command.game = await this.pairQuezGameQueryRepository.getUnfinishedGame(
	  command.game.secondPlayerProgress.user.id,
	);
  }
  const firstPlayerScore = firstPlayer.firstPlayerProgress.score;
  const secondPalyerScore = secondPlayer.secondPlayerProgress.score;
  if (firstPlayerScore > secondPalyerScore) {
	secondPlayer.secondPlayerProgress.userStatus = StatusGameEnum.Loser;
	firstPlayer.firstPlayerProgress.userStatus = StatusGameEnum.Winner;
	// await this.pairQuezGameQueryRepository.makeFirstPlayerWin(secondPlayer)
  }
  if (firstPlayerScore < secondPalyerScore) {
	secondPlayer.secondPlayerProgress.userStatus = StatusGameEnum.Winner;
	firstPlayer.firstPlayerProgress.userStatus = StatusGameEnum.Loser;
	// await this.pairQuezGameQueryRepository.makeSecondPlayerWin(secondPlayer);
  }
  if (firstPlayerScore === secondPalyerScore) {
	secondPlayer.secondPlayerProgress.userStatus = StatusGameEnum.Draw;
	firstPlayer.firstPlayerProgress.userStatus = StatusGameEnum.Draw;
	// await this.pairQuezGameQueryRepository.notAWinner(secondPlayer);
  }
  command.game.status = GameStatusEnum.Finished;
  // await this.pairQuezGameQueryRepository.saveProgress(
  //   firstPlayer.firstPlayerProgress,
  // );
  await this.pairQuezGameQueryRepository.saveProgress(
	command.game.secondPlayerProgress,
  );
  return await this.pairQuezGameQueryRepository.saveGame(command.game);

  }
}
