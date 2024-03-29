// import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
// import { Question } from "../../question/domain/entity.question";
// import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";
// import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";

// export class ChangeAnswerStatusSecondPlayerCommand {
// 	constructor(
// 		gameId: string,
// 		gameQuestions: Question[]
// 	) {}
// }

// @CommandHandler(ChangeAnswerStatusSecondPlayerCommand)
// export class ChangeAnswerStatusSecondPlayerUseCase implements ICommandHandler<ChangeAnswerStatusSecondPlayerCommand> {
// 	constructor(
// 		protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
// 		protected readonly pairQuizGameRepository: PairQuizGameRepository
// 	) {}
// 	async execute(command: ChangeAnswerStatusSecondPlayerCommand): Promise<any> {
// 		const firstPlayer = await this.pairQuezGameQueryRepository.getFirstPlayerByGameId(gameId)

// 		if(firstPlayer!.answer.length === gameQuestion.lenght) {
// 			return await this.pairQuizGameRepository.setFinishAnswerDateFirstPlayer(gameId)
// 		} else {
			
// 		}
// 	}
// }