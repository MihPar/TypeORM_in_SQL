import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePairQuizGameDto } from "../dto/createPairQuizGame.dto";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";
import { NotFoundException } from "@nestjs/common";
import { GameStatusEnum } from "../enum/enumPendingPlayer";
import { AnswerType } from "../type/typeViewModel";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";
import { FirstPlayerSendAnswerCommand } from "./firstPlayerSendAnswer-ues-case";
import { SecondPlayerSendAnswerCommand } from "./secondPlayerSendAnswer-ues-case";
// import { FirstPlayerSendAnswerCommand } from "./firstPlayerSendAnswer-ues-case";

export class SendAnswerCommand {
	constructor(
		public DTO: CreatePairQuizGameDto,
		public userId: string
	) {}
}

@CommandHandler(SendAnswerCommand)
export class SendAnswerUseCase implements ICommandHandler<SendAnswerCommand> {
  constructor(
    protected readonly pairQuizGameRepository: PairQuizGameRepository,
    protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
    protected readonly commandBus: CommandBus,
  ) {}
  async execute(commandAnswer: SendAnswerCommand): Promise<AnswerType> {
    const game: PairQuizGame =
      await this.pairQuezGameQueryRepository.getUnfinishedGame(
		commandAnswer.userId,
        GameStatusEnum.Active
      );
    if (!game || game.status !== 'Active')
      throw new NotFoundException('No active pair');
    // const firstPlayer: PairQuizGameProgressPlayer =
    //   await this.pairQuezGameQueryRepository.getPlayerByGameIdAndUserId(
    //     game.id,
    //     game.firstPlayerProgress.id,
    //   );

    // const secondPlayer: PairQuizGameProgressPlayer =
    //   await this.pairQuezGameQueryRepository.getPlayerByGameIdAndUserId(
    //     game.id,
    //     game.secondPlayerProgress.id,
    //   );

	  if (game.firstPlayerProgress.user.id === commandAnswer.userId) {
      const command = new FirstPlayerSendAnswerCommand(
        game.firstPlayerProgress,
        game.id,
        game.question!,
        commandAnswer.DTO.answer,
      );
      return await this.commandBus.execute<FirstPlayerSendAnswerCommand | AnswerType>(command);
    } else if (game.secondPlayerProgress.user.id === commandAnswer.userId) {
      const command = new SecondPlayerSendAnswerCommand(
		game.firstPlayerProgress,
        game.id,
        game.question!,
        commandAnswer.DTO.answer,)
      return await this.commandBus.execute<SecondPlayerSendAnswerCommand | AnswerType>(command)
    }
  }
}