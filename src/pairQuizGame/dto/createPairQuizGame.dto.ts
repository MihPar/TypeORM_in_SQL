import { IsString } from "class-validator";

export class GameAnswerDto {
	@IsString()
	answer: string
}
