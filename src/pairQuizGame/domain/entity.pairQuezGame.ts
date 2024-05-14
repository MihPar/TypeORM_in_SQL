import { sortAddedAt } from './../../helpers/helpers';
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
			  answers: getGameById.firstPlayerProgress.answers.sort(sortAddedAt).map(item => AnswersPlayer.getViewModelForGame(item)),
			  player: {
				id: getGameById.firstPlayerProgress.user.id,
				login: getGameById.firstPlayerProgress.user.login
			  },
			  score: getGameById.firstPlayerProgress.score
			},
			secondPlayerProgress: getGameById.secondPlayerProgress ?  {
				answers: getGameById.secondPlayerProgress.answers.sort(sortAddedAt).map(item => AnswersPlayer.getViewModelForGame(item)),
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
			}) : null,
			status: getGameById.status,
			pairCreatedDate: getGameById.pairCreatedDate,
			startGameDate: getGameById.startGameDate,
			finishGameDate: getGameById.finishGameDate
		  }
		}

		static getViewModelPaging(getGameById: PairQuizGame, game: PairQuizGame): GameTypeModel  {
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
				questions: game.questionGames.length ?  game.questionGames.map(item => {
					return {
						id: item.question.id,
						body: item.question.body
					}
				})
				: null,
				status: getGameById.status,
				pairCreatedDate: getGameById.pairCreatedDate,
				startGameDate: getGameById.startGameDate,
				finishGameDate: getGameById.finishGameDate
			  }
			}

			
		static getViewModels(game: PairQuizGame, getGameFirstPlayer: PairQuizGameProgressPlayer, getGameSecondPlayer: PairQuizGameProgressPlayer): GameTypeModel {
			
			return {
				id: game.id,
				firstPlayerProgress: getGameFirstPlayer ? {
				  answers: getGameFirstPlayer.answers.map(item => AnswersPlayer.getViewModelForGame(item)),
				  player: {
					id: getGameFirstPlayer.user.id,
					login: getGameFirstPlayer.user.login
				  },
				  score: getGameFirstPlayer.score
				} : null,
				secondPlayerProgress: getGameSecondPlayer ?  {
					answers: getGameSecondPlayer.answers.map(item => AnswersPlayer.getViewModelForGame(item)),
					player: {
					  id: getGameSecondPlayer.user.id,
					  login: getGameSecondPlayer.user.login
					},
					score: getGameSecondPlayer.score
				} : null,
				questions: game.questionGames.length ? game.questionGames.map(item => {
					return {
						id: item.question.id,
						body: item.question.body
					}
				}) : null,
				status: game.status,
				pairCreatedDate: game.pairCreatedDate,
				startGameDate: game.startGameDate,
				finishGameDate: game.finishGameDate
			  }
			}
	}