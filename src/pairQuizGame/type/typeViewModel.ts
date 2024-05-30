import { AnswerStatusEnum, GameStatusEnum } from "../enum/enumPendingPlayer"

export type GameTypeModel = {
  id: string
  firstPlayerProgress: PlayerModel
  secondPlayerProgress: PlayerModel
  questions: QuestionType[]
  status: GameStatusEnum
  pairCreatedDate: Date
  startGameDate: Date
  finishGameDate: Date
}

export type PlayerModel = {
	answers: AnswerType[]
	player: Player
	score: number
}

export type AnswerType = {
    questionId: string
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

export type PlayerStatisticsView = {
	sumScore: number;
	avgScores: number;
	gamesCount: number;
	winsCount: number;
	lossesCount: number;
	drawsCount: number;
  };

export type TopUserView = {
	sumScore: number;
	avgScores: number;
	gamesCount: number;
	winsCount: number;
	lossesCount: number;
	drawsCount: number;
	player: {
	  id: string;
	  login: string;
	};
  };