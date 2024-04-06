import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePairQuizGameDto } from "../dto/createPairQuizGame.dto";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";
import { ForbiddenException } from "@nestjs/common";
import { FirstPlayerSendAnswerCommand } from "./firstPlayerSendAnswer-ues-case";
import { SecondPlayerSendAnswerCommand } from "./secondPlayerSendAnswer-ues-case";
import { GameStatusEnum } from "../enum/enumPendingPlayer";

export class SendAnswerCommand {
	constructor(
		public DTO: CreatePairQuizGameDto,
		public userId: string
	) {}
}

@CommandHandler(SendAnswerCommand)
export class SendAnswerUseCase implements ICommandHandler<SendAnswerCommand> {
	constructor(
		protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
		protected readonly commandBus: CommandBus
	) {}
	async execute(commandAnswer: SendAnswerCommand) {
		
		const game = await this.pairQuezGameQueryRepository.getUnfinishedGame(GameStatusEnum.Active)
		if(!game || game.status !== 'Active') throw new ForbiddenException('No active pair');

		const firstPlayer = await this.pairQuezGameQueryRepository.getFirstPlayerByGameIdAndUserId(game.id, commandAnswer.userId)

		const secondPlayer = await this.pairQuezGameQueryRepository.getSecondPlayerByGameIdAndUserId(game.id, commandAnswer.userId)

		if(firstPlayer) {
			const command = new FirstPlayerSendAnswerCommand(firstPlayer, game.id, gameQuestions!, commandAnswer.DTO.answer)
			return await this.commandBus.execute(command)
		}

		if(secondPlayer) {
			const command = new SecondPlayerSendAnswerCommand(secondPlayer, game.id, gameQuestions!, inputAnswer)
			return await this.commandBus.execute(command)
		}
	}
}