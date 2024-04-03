import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PairQuizGameProgressPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressFirstPlayer";
import { Question } from "../../question/domain/entity.question";
import { AnswerStatusEnum, GameStatusEnum } from "../enum/enumPendingPlayer";
import { GameTypeModel } from "../type/typeViewModel";

@Entity()
export class PairQuizGame {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@OneToOne(() => PairQuizGameProgressPlayer)
	@JoinColumn()
	firstPlayerProgress: PairQuizGameProgressPlayer

	@Column({nullable: true})
	firstPlayerProgressId: string

	@OneToOne(() => PairQuizGameProgressPlayer, {nullable: true})
	@JoinColumn()
	secondPlayerProgress: PairQuizGameProgressPlayer

	@Column({nullable: true})
	secondPlayerProgressId: string

	@Column()
	status: GameStatusEnum

	@Column()
	pairCreatedDate: Date

	@Column({nullable: true})
	startGameDate: Date

	@Column({nullable: true})
	finishGameDate: Date

	@ManyToMany(() => Question, q => q.games, {nullable: true})
	@JoinTable()
	question: Question[]

	static quizGameViewModelForFirstPlayer(quizGame: PairQuizGame, login: string, id: string): GameTypeModel {
		return {
			id: quizGame.id,
			firstPlayerProgress: {
				answers: [],
				player: {
					id,
					login
				},
				score: 0
			},
			secondPlayerProgress: null,
			questions: null,
			  status: GameStatusEnum.PendingSecondPlayer,
			  pairCreatedDate: quizGame.pairCreatedDate,
			  startGameDate: null,
			  finishGameDate: null
		}
	}

	static quizGameViewModelForFoundPair(foundQuizGame: PairQuizGame, progressSecondPlayer: PairQuizGameProgressPlayer, firstLogin: string, secondlogin: string, getFiveQuestionsQuizGame: Question[], id: string): GameTypeModel {
		return {
			id: foundQuizGame.id,
			firstPlayerProgress: {
				answers: [],
				player: {
					id: foundQuizGame.firstPlayerProgressId,
					login: firstLogin
				  },
				  score: 0
			},
			secondPlayerProgress: { 
				answers: [],
			player: {
				id,
				login: secondlogin
			  },
			  score: progressSecondPlayer.score,
			},
			questions: getFiveQuestionsQuizGame.map(item => ({
				  body: item.body,
				  id: item.id,
			})),
			  status: GameStatusEnum.Active,
			  pairCreatedDate: foundQuizGame.pairCreatedDate,
			  startGameDate: foundQuizGame.startGameDate,
			  finishGameDate: foundQuizGame.finishGameDate
		}
	}

	// static getUnfinishedGame(currentUnFinishedGame: PairQuizGame, loginFirstPlayer: string, loginSecondPlayer: string, getFiveQuestions: Question[]): GameTypeModel{
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
	// 			id: currentUnFinishedGame.firstPlayerProgressId,
	// 			login: loginFirstPlayer
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
	// 			login: loginSecondPlayer
	// 		  },
	// 		  score: currentUnFinishedGame.secondPlayerProgress.score
	// 		},
	// 		questions: getFiveQuestions.map(item => ({
	// 			  body: item.body,
	// 			  id: item.id,
	// 		})),
	// 		status: currentUnFinishedGame.status,
	// 		pairCreatedDate: currentUnFinishedGame.pairCreatedDate,
	// 		startGameDate: currentUnFinishedGame.startGameDate,
	// 		finishGameDate: currentUnFinishedGame.finishGameDate
	// 	}
	// }

	static getGameById(getGame: PairQuizGame, loginFirstPlayer: string, loginSecondPlayer: string | null, getFiveQuestions: Question[], getQuestionIdForFirstPlayer: string, getQuestionIdForSecondPlayer: string | null, statusFirstPlayer: AnswerStatusEnum, statusSecondPlayer: AnswerStatusEnum | null, addedAtFirstPlayer: Date, addedAtSecondPlaye: Date | null, scoreFirstPlayer: number, scoreSecondPlayer: number | null): GameTypeModel {
		// console.log("getGame: ", getGame)
		return {
			id: getGame.id,
			firstPlayerProgress: {
			  answers: [
				{
				  questionId: getQuestionIdForFirstPlayer,
				  answerStatus: statusFirstPlayer,
				  addedAt: addedAtFirstPlayer
				}
			  ],
			  player: {
				id: getGame.firstPlayerProgressId,
				login: loginFirstPlayer
			  },
			  score: scoreFirstPlayer
			},
			secondPlayerProgress: {
			  answers: [
				{
				  questionId: getQuestionIdForSecondPlayer,
				  answerStatus: statusSecondPlayer,
				  addedAt: addedAtSecondPlaye
				}
			  ],
			  player: {
				id: getGame?.secondPlayerProgressId,
				login: loginSecondPlayer || null
			  },
			  score: scoreSecondPlayer || null
			},
			questions: getFiveQuestions.map(item => {
				return {
					id: item.id,
					body: item.body
				}
			}),
			status: getGame.status,
			pairCreatedDate: getGame.pairCreatedDate,
			startGameDate: getGame.startGameDate,
			finishGameDate: getGame.finishGameDate
		  }
	}
}

