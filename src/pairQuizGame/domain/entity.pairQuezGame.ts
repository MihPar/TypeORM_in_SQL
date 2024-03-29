import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PairQuizGameProgressFirstPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressFirstPlayer";
import { PairQuizGameProgressSecondPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressSecondPlayer";
import { Question } from "../../question/domain/entity.question";
import { AnswerStatusEnum, GameStatusEnum } from "../enum/enumPendingPlayer";
import { GameTypeModel } from "../type/typeViewModel";

@Entity()
export class PairQuizGame {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@OneToOne(() => PairQuizGameProgressFirstPlayer, fpp => fpp.game)
	firstPlayerProgress: PairQuizGameProgressFirstPlayer

	@Column()
	firstPlayerId: string

	@OneToOne(() => PairQuizGameProgressSecondPlayer, spp => spp.game, {nullable: true})
	secondPlayerProgress: PairQuizGameProgressSecondPlayer

	@Column({nullable: true})
	secondPlayerId: string

	@Column()
	status: GameStatusEnum

	@CreateDateColumn({nullable: true})
	pairCreatedDate: Date

	@CreateDateColumn({nullable: true})
	startGameDate: Date

	@CreateDateColumn({nullable: true})
	finishGameDate: Date

	@ManyToMany(() => Question, q => q.games, {nullable: true})
	@JoinTable()
	question: Question[]

	static quizGameViewModelForFirstPlayer(quizGame: PairQuizGame, login: string, progressFirstPlayer: PairQuizGameProgressFirstPlayer): GameTypeModel {
		return {
			id: quizGame.id,
			firstPlayerProgress: {
				answers: quizGame.firstPlayerProgress.answers.map(a => ({
						questionId: a.question.id,
						answerStatus: (a.answerStatus) as AnswerStatusEnum,
						addedAt: a.addedAt
			})),
				player: {
					id: progressFirstPlayer.userId,
					login
				  },
				  score: progressFirstPlayer.score
			},
			secondPlayerProgress: {
				answers: [],
				player: {
					id: null,
					login: null
				},
				score: 0
			},
			questions: null,
			  status: GameStatusEnum.PendingSecondPlayer,
			  pairCreatedDate: null,
			  startGameDate: null,
			  finishGameDate: null
		}
	}

	static quizGameViewModelForFoundPair(foundQuizGame: PairQuizGame, progressSecondPlayer: PairQuizGameProgressSecondPlayer, login: string, getFiveQuestionsQuizGame: Question[]): GameTypeModel {
		return {
			id: foundQuizGame.id,
			firstPlayerProgress: {
				answers: [{
					questionId: foundQuizGame.firstPlayerProgress.questionId,
					answerStatus: foundQuizGame.firstPlayerProgress.answerStatus,
					addedAt: foundQuizGame.pairCreatedDate
				}],
				player: {
					id: foundQuizGame.firstPlayerProgress.userId,
					login
				  },
				  score: foundQuizGame.firstPlayerProgress.score
			},
			secondPlayerProgress: { 
				answers: [{
					questionId: progressSecondPlayer.questionId,
					answerStatus: progressSecondPlayer.answerStatus,
					addedAt: progressSecondPlayer.addedAt
			}],
			player: {
				id: progressSecondPlayer.userSecondPlyerId,
				login
			  },
			  score: progressSecondPlayer.score,
			},
			questions: getFiveQuestionsQuizGame.map(item => ({
				  id: item.id,
				  body: item.body
			})),
			  status: GameStatusEnum.Active,
			  pairCreatedDate: foundQuizGame.pairCreatedDate,
			  startGameDate: foundQuizGame.startGameDate,
			  finishGameDate: foundQuizGame.finishGameDate
		}
	}

	// static getUnfinishedGame(currentUnFinishedGame: PairQuizGame, getLoginFirstPlayer: string, getLoginSecondPlayer: string): GameTypeModel{
	// 	return {
	// 		id: currentUnFinishedGame.id,
	// 		firstPlayerProgress: {
	// 		  answers: [
	// 			{
	// 			  questionId: currentUnFinishedGame.firstPlayerProgress.questionId,
	// 			  answerStatus: currentUnFinishedGame.firstPlayerProgress.answerStatus,
	// 			  addedAt: currentUnFinishedGame.firstPlayerProgress.addedAt
	// 			}
	// 		  ],
	// 		  player: {
	// 			id: currentUnFinishedGame.firstPlayerProgress.userId,
	// 			login: getLoginFirstPlayer
	// 		  },
	// 		  score: currentUnFinishedGame.firstPlayerProgress.score
	// 		},
	// 		secondPlayerProgress: {
	// 		  answers: [
	// 			{
	// 			  questionId: currentUnFinishedGame.secondPlayerProgress.questionId,
	// 			  answerStatus: currentUnFinishedGame.secondPlayerProgress.answerStatus,
	// 			  addedAt: currentUnFinishedGame.secondPlayerProgress.addedAt
	// 			}
	// 		  ],
	// 		  player: {
	// 			id: currentUnFinishedGame.secondPlayerProgress.userSecondPlyerId,
	// 			login: getLoginSecondPlayer
	// 		  },
	// 		  score: currentUnFinishedGame.secondPlayerProgress.score
	// 		},
	// 		questions: [
	// 		  {
	// 			id: currentUnFinishedGame,
	// 			"body": "string"
	// 		  }
	// 		],
	// 		status: currentUnFinishedGame.status,
	// 		pairCreatedDate: currentUnFinishedGame.pairCreatedDate,
	// 		startGameDate: currentUnFinishedGame.startGameDate,
	// 		finishGameDate: currentUnFinishedGame.finishGameDate
	// 	}
	// }

	// static getGameById(getGame: PairQuizGame, loginFirstPlayer: string, loginSecondPlayer: string): GameTypeModel {
	// 	return {
	// 		id: getGame.id,
	// 		firstPlayerProgress: {
	// 		  answers: [
	// 			{
	// 			  questionId: getGame.firstPlayerProgress.questionId,
	// 			  answerStatus: getGame.firstPlayerProgress.answerStatus,
	// 			  addedAt: getGame.firstPlayerProgress.addedAt
	// 			}
	// 		  ],
	// 		  player: {
	// 			id: getGame.firstPlayerProgress.userId,
	// 			login: loginFirstPlayer
	// 		  },
	// 		  score: getGame.firstPlayerProgress.score
	// 		},
	// 		secondPlayerProgress: {
	// 		  answers: [
	// 			{
	// 			  questionId: getGame.secondPlayerProgress.questionId,
	// 			  answerStatus: getGame.secondPlayerProgress.answerStatus,
	// 			  addedAt: getGame.secondPlayerProgress.addedAt
	// 			}
	// 		  ],
	// 		  player: {
	// 			id: getGame.secondPlayerProgress.userSecondPlyerId,
	// 			login: loginSecondPlayer
	// 		  },
	// 		  score: getGame.secondPlayerProgress.score
	// 		},
	// 		questions: [
	// 		  {
	// 			id: getGame,
	// 			"body": "string"
	// 		  }
	// 		],
	// 		status: getGame.status,
	// 		pairCreatedDate: getGame.pairCreatedDate,
	// 		startGameDate: getGame.startGameDate,
	// 		finishGameDate: getGame.finishGameDate
	// 	  }
	// }
}

