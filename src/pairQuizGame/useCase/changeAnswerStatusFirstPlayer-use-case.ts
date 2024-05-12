import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Question } from "../../question/domain/entity.question";
import { PairQuezGameQueryRepository } from "../infrastructure/pairQuizGameQueryRepository";
import { compareAsc } from "date-fns";
import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";
import { NotFoundException } from "@nestjs/common";
import { PlayerStatisticsView } from "../type/typeViewModel";

export class GetCurrectUserStatisticCommand {
	constructor(
		public userId: string,
	) {}
}

@CommandHandler(GetCurrectUserStatisticCommand)
export class GetCurrectUserStatisticUseCase implements ICommandHandler<GetCurrectUserStatisticCommand> {
	constructor(
		protected readonly pairQuezGameQueryRepository: PairQuezGameQueryRepository,
		protected readonly pairQuizGameRepository: PairQuizGameRepository
	) {}
	async execute(command: GetCurrectUserStatisticCommand): Promise<PlayerStatisticsView | null> {
		const getUserStatistic = await this.pairQuizGameRepository.getStatisticOfUser(command.userId)
		if(!getUserStatistic) throw new NotFoundException([{
			message: "user not found"
		}])
		return getUserStatistic
	}
}