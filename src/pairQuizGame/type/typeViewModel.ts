import { AnswerStatusEnum, GameStatusEnum } from "../enum/enumPendingPlayer"

export type QuestionTypeModel = {
  id: string
  firstPlayerProgress: PlayerModel
  secondPlayerProgress: PlayerModel,
  questions: QuestionType[],
  status: GameStatusEnum,
  pairCreatedDate: Date,
  startGameDate: Date,
  finishGameDate: Date
}

export type PlayerModel = {
	answers: AnswerType[],
	player: Player,
	score: number
}

export type AnswerType = {
    questionId: string,
    answerStatus: AnswerStatusEnum,
    addedAt: Date
}

export type Player = {
	id: string
	login: string
  }

export type QuestionType = {
	id: string
	body: string
}
