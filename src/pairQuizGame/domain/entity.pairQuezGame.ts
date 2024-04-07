import { AnswersPlayer } from '../../pairQuizGameProgress/domain/entity.answersPlayer';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PairQuizGameProgressPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer";
import { Question } from "../../question/domain/entity.question";
import { AnswerStatusEnum, GameStatusEnum } from "../enum/enumPendingPlayer";
import { GameTypeModel } from "../type/typeViewModel";

@Entity()
export class PairQuizGame {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@OneToOne(() => PairQuizGameProgressPlayer, {nullable: true})
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

	// static quizGameViewModelForFoundPair(foundQuizGame: PairQuizGame, progressSecondPlayer: PairQuizGameProgressPlayer, firstLogin: string, secondlogin: string, getFiveQuestionsQuizGame: Question[], id: string): GameTypeModel {
	// 	return {
	// 		id: foundQuizGame.id,
	// 		firstPlayerProgress: {
	// 			answers: [],
	// 			player: {
	// 				id: foundQuizGame.firstPlayerProgressId,
	// 				login: firstLogin
	// 			  },
	// 			  score: 0
	// 		},
	// 		secondPlayerProgress: { 
	// 			answers: [],
	// 		player: {
	// 			id,
	// 			login: secondlogin
	// 		  },
	// 		  score: progressSecondPlayer.score,
	// 		},
	// 		questions: getFiveQuestionsQuizGame.map(item => ({
	// 			  body: item.body,
	// 			  id: item.id,
	// 		})),
	// 		  status: GameStatusEnum.Active,
	// 		  pairCreatedDate: foundQuizGame.pairCreatedDate,
	// 		  startGameDate: foundQuizGame.startGameDate,
	// 		  finishGameDate: foundQuizGame.finishGameDate
	// 	}
	// }

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

	static getViewModel(getGameById: PairQuizGame): GameTypeModel  {
		return {
			id: getGameById.id,
			firstPlayerProgress: {
			  answers: getGameById.firstPlayerProgress.answers.map(item => AnswersPlayer.getViewModelForGame(item)),
			  player: {
				id: getGameById.firstPlayerProgress.user.id,
				login: getGameById.firstPlayerProgress.user.login
			  },
			  score: getGameById.firstPlayerProgress.score
			},
			secondPlayerProgress: getGameById.secondPlayerProgress ?  {
				answers: getGameById.secondPlayerProgress.answers.map(item => AnswersPlayer.getViewModelForGame(item)),
				player: {
				  id: getGameById.secondPlayerProgress.user.id,
				  login: getGameById.secondPlayerProgress.user.login
				},
				score: getGameById.secondPlayerProgress.score
			} : null,
			questions: getGameById.question.map(item => {
				return {
					id: item.id,
					body: item.body
				}
			}),
			status: getGameById.status,
			pairCreatedDate: getGameById.pairCreatedDate,
			startGameDate: getGameById.startGameDate,
			finishGameDate: getGameById.finishGameDate
		  }
		}
	}

