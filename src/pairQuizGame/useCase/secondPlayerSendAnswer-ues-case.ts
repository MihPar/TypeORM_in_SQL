import { Question } from "../../question/domain/entity.question";
import { GameStatusEnum } from "../enum/enumPendingPlayer";

export class SecondPlayerSendAnswerCommand {
	constructor(
		firstPlayer: GameStatusEnum,
		gameId: string,
		gameQuestions: Question[],
		inputAnswer: string
	) {}
}