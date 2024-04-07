import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePairQuizGameDto } from "../dto/createPairQuizGame.dto";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";
import { ForbiddenException } from "@nestjs/common";
import { FirstPlayerSendAnswerCommand } from "./firstPlayerSendAnswer-ues-case";
import { SecondPlayerSendAnswerCommand } from "./secondPlayerSendAnswer-ues-case";
import { GameStatusEnum } from "../enum/enumPendingPlayer";
import { AnswerType } from "../type/typeViewModel";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { PairQuizGameProgressPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer";

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
	async execute(commandAnswer: SendAnswerCommand): Promise<AnswerType> {
		
		const game: PairQuizGame = await this.pairQuezGameQueryRepository.getUnfinishedGame(GameStatusEnum.Active)
		if(!game || game.status !== 'Active') throw new ForbiddenException('No active pair');

		const firstPlayer: PairQuizGameProgressPlayer = await this.pairQuezGameQueryRepository.getFirstPlayerByGameIdAndUserId(game.id, commandAnswer.userId)

		const secondPlayer: PairQuizGameProgressPlayer = await this.pairQuezGameQueryRepository.getSecondPlayerByGameIdAndUserId(game.id, commandAnswer.userId)

		if(firstPlayer) {
			const command = new FirstPlayerSendAnswerCommand(firstPlayer, game.id, game.question!, commandAnswer.DTO.answer)
			return await this.commandBus.execute<FirstPlayerSendAnswerCommand>(command)
		}

		if(secondPlayer) {
			const command = new SecondPlayerSendAnswerCommand(secondPlayer, game.id, game.question!, commandAnswer.DTO.answer)
			return await this.commandBus.execute(command)
		}
	}
}