import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePairQuizGameDto } from "../dto/createPairQuizGame.dto";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";
import { ForbiddenException } from "@nestjs/common";

export class SendAnswerCommand {
	constructor(
		DTO: CreatePairQuizGameDto,
		public userId: string
	) {}
}

@CommandHandler(SendAnswerCommand)
export class SendAnswerUseCase implements ICommandHandler<SendAnswerCommand> {
	constructor(
		protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
		protected readonly commandBus: CommandBus
	) {}
	async execute(command: SendAnswerCommand) {
		
		// const game = await this.pairQuezGameQueryRepository.getUnfinishedGame(command.userId)
		// if(!game || game.status !== 'Active') throw new ForbiddenException('No active pair');

		// const firstPlayer = await this.pairQuezGameQueryRepository.getFirstPlayerByGameIdAndUserId(game.id, userId)

		// const secondPlayer = await this.pairQuezGameQueryRepository.getSecondPlayerByGameIdAndUserId(game.id, userId)

		// if(firstPlayer) {
		// 	const command = new FirstPlayerSendAnswerCommand(firstPlayer, game.id, gameQuestions!, inputAnswer)
		// 	return await this.commandBus.execute(command)
		// }

		// if(secondPlayer) {
		// 	const command = new SecondPlayerSendAnswerCommand(secondPlayer, game.id, gameQuestions!, inputAnswer)
		// 	return await this.commandBus.execute(command)
		// }
	}
}