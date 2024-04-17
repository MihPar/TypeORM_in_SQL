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
			questions: getGameById.question.length ? getGameById.question.map(item => {
				return {
					id: item.id,
					body: item.body
				}
			}) : null,
			status: getGameById.status,
			pairCreatedDate: getGameById.pairCreatedDate,
			startGameDate: getGameById.startGameDate,
			finishGameDate: getGameById.finishGameDate
		  }
		}
	}