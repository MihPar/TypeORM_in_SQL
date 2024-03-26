import { IsString, MaxLength, MinLength } from "class-validator"

export class AnswerAndBodyClass {
	@IsString()
	@MinLength(10)
	@MaxLength(500)
	body: string

	@IsString()
	correctAnswers: string[]
}


export class PublishClass {
	published: boolean
}