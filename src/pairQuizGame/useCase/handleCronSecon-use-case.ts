import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairQuizGame } from '../domain/entity.pairQuezGame';
import { Question } from '../../question/domain/entity.question';
import { GameTypeModel } from '../type/typeViewModel';
import { QuestionQueryRepository } from '../../question/infrastructury/questionQueryRepository';
import { GameStatusEnum } from '../enum/enumPendingPlayer';
import { PairQuezGameQueryRepository } from '../infrastructure/pairQuizGameQueryRepository';
import { PairQuizGameRepository } from '../infrastructure/pairQuizGameRepository';

export class CronSecondCommand {
  constructor(
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
    const secondPlayer =
      await this.pairQuezGameQueryRepository.getGameByUserIdAndStatuses(
        command.game.id,
        command.game.secondPlayerProgress.user.id,
        [GameStatusEnum.Active],
      );
    if (secondPlayer.status === GameStatusEnum.Finished) {
      return;
    } else if (secondPlayer.status === GameStatusEnum.Active) {
      setTimeout(async () => {
        return await this.pairQuezGameQueryRepository.saveGame(command.game);
      }, 10000);
    }
  }
}
