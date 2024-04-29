import { AnswersPlayer } from '../../pairQuizGameProgress/domain/entity.answersPlayer';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PairQuizGameProgressPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer";
import { GameStatusEnum } from "../enum/enumPendingPlayer";
import { GameTypeModel } from "../type/typeViewModel";
import { QuestionGame } from './entity.questionGame';

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

	@OneToMany(() => QuestionGame, questionGame => questionGame.pairQuizGame, {nullable: true})
	questionGames: QuestionGame[]

	// @Column({type: 'varchar', array: true})
	// questionId: string[]

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
			questions: getGameById.questionGames.length ? getGameById.questionGames.map(item => {
				return {
					id: item.question.id,
					body: item.question.body
				}
			})
			// .sort((a: any, b: any) => {return a.body - b.body}) 
			: null,
			status: getGameById.status,
			pairCreatedDate: getGameById.pairCreatedDate,
			startGameDate: getGameById.startGameDate,
			finishGameDate: getGameById.finishGameDate
		  }
		}

		static getViewModels(getGameFirstPlayer: PairQuizGame, getGameSecondPlayer: PairQuizGame, question: QuestionGame[]): GameTypeModel {
			return {
				id: getGameFirstPlayer.id,
				firstPlayerProgress: {
				  answers: getGameFirstPlayer.firstPlayerProgress.answers.map(item => AnswersPlayer.getViewModelForGame(item)),
				  player: {
					id: getGameFirstPlayer.firstPlayerProgress.user.id,
					login: getGameFirstPlayer.firstPlayerProgress.user.login
				  },
				  score: getGameFirstPlayer.firstPlayerProgress.score
				},
				secondPlayerProgress: getGameSecondPlayer.secondPlayerProgress ?  {
					answers: getGameSecondPlayer.secondPlayerProgress.answers.map(item => AnswersPlayer.getViewModelForGame(item)),
					player: {
					  id: getGameSecondPlayer.secondPlayerProgress.user.id,
					  login: getGameSecondPlayer.secondPlayerProgress.user.login
					},
					score: getGameSecondPlayer.secondPlayerProgress.score
				} : null,
				questions: question.length ? question.map(item => {
					return {
						id: item.question.id,
						body: item.question.body
					}
				}) : null,
				status: getGameFirstPlayer.status,
				pairCreatedDate: getGameFirstPlayer.pairCreatedDate,
				startGameDate: getGameFirstPlayer.startGameDate,
				finishGameDate: getGameFirstPlayer.finishGameDate
			  }
			}
	}