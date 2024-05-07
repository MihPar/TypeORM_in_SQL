import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePairQuizGameDto } from "../dto/createPairQuizGame.dto";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";
import { NotFoundException } from "@nestjs/common";
import { GameStatusEnum } from "../enum/enumPendingPlayer";
import { AnswerType, GameTypeModel } from "../type/typeViewModel";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";
import { FirstPlayerSendAnswerCommand } from "./firstPlayerSendAnswer-ues-case";
import { SecondPlayerSendAnswerCommand } from "./secondPlayerSendAnswer-ues-case";

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
		commandAnswer.userId
      );
	//   console.log('answers: ', game.firstPlayerProgress.answers)
    if (!game || game.status !== 'Active')
      throw new NotFoundException('No active pair');

	if (game.firstPlayerProgress.user.id === commandAnswer.userId) {
      const command = new FirstPlayerSendAnswerCommand(
        game,
		commandAnswer.DTO.answer,
      );
	const result = await this.commandBus.execute<FirstPlayerSendAnswerCommand | AnswerType>(command);
	// console.log("firstPlayer: ", result)

      return result
    } else if (game.secondPlayerProgress.user.id === commandAnswer.userId) {
      const command = new SecondPlayerSendAnswerCommand(
		game,
        commandAnswer.DTO.answer,)
		const result = await this.commandBus.execute<SecondPlayerSendAnswerCommand | AnswerType>(command)
		// console.log("secondPlayer: ", result)

		return result

    }
  }
}