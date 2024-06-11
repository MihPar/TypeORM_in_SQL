import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { PairQuezGameQueryRepository } from '../infrastructure/pairQuizGameQueryRepository';

export class DeleteAllPairQuizGameCommnad {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
}

@Injectable()
@CommandHandler(DeleteAllPairQuizGameCommnad)
export class DeleteAllPairQuizGameUseCase
  implements ICommandHandler<DeleteAllPairQuizGameCommnad>
{
  constructor(
    protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(command: DeleteAllPairQuizGameCommnad): Promise<any> {
    return await this.pairQuezGameQueryRepository.deleteAllPairQuizGame();
  }
}
