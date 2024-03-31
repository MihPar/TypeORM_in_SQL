import { IsArray, IsBoolean, IsString, MaxLength, MinLength } from "class-validator"

export class AnswerAndBodyClass {
	@IsString()
	@MinLength(10)
	@MaxLength(500)
	body: string

	@IsArray()
	correctAnswers: string[]
}


export class PublishClass {
	@IsBoolean()
	published: boolean
}