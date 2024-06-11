import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { PairQuezGameQueryRepository } from '../infrastructure/pairQuizGameQueryRepository';

export class DelectAllQuestionGamesCommand {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
}

@Injectable()
@CommandHandler(DelectAllQuestionGamesCommand)
export class DelectAllQuestionGamesUseCase
  implements ICommandHandler<DelectAllQuestionGamesCommand>
{
  constructor(
    protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(command: DelectAllQuestionGamesCommand): Promise<any> {
    return await this.pairQuezGameQueryRepository.deleteAllQuestionGames();
  }
}
