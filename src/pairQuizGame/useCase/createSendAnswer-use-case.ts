import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";
import { NotFoundException } from "@nestjs/common";
import { GameStatusEnum } from "../enum/enumPendingPlayer";
import { AnswerType, GameTypeModel } from "../type/typeViewModel";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";
import { FirstPlayerSendAnswerCommand } from "./firstPlayerSendAnswer-ues-case";
import { SecondPlayerSendAnswerCommand } from "./secondPlayerSendAnswer-ues-case";
import { GameAnswerDto } from "../dto/createPairQuizGame.dto";

export class SendAnswerCommand {
	constructor(
		public DTO: GameAnswerDto,
		public userId: string,
		public activeUserGame: GameTypeModel
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
		commandAnswer.userId
      );
	if (commandAnswer.activeUserGame.firstPlayerProgress.player.id === commandAnswer.userId) {
      const command = new FirstPlayerSendAnswerCommand(
		game,
        commandAnswer.activeUserGame,
		commandAnswer.DTO.answer,
      );
	const result = await this.commandBus.execute<FirstPlayerSendAnswerCommand | AnswerType>(command);
      return result
    } else if (commandAnswer.activeUserGame.secondPlayerProgress.player.id === commandAnswer.userId) {
      const command = new SecondPlayerSendAnswerCommand(
		game,
		commandAnswer.activeUserGame,
        commandAnswer.DTO.answer,)
		const result = await this.commandBus.execute<SecondPlayerSendAnswerCommand | AnswerType>(command)
		return result
    }
  }
}