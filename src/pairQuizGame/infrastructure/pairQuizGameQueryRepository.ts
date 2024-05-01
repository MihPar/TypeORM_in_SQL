import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { In, Not, Repository } from "typeorm";
import { AnswerStatusEnum, GameStatusEnum } from "../enum/enumPendingPlayer";
import { GameTypeModel } from "../type/typeViewModel";
import { UsersQueryRepository } from "../../users/users.queryRepository";
import { PairQuizGameRepository } from "./pairQuizGameRepository";
import { PairQuizGameProgressQueryRepository } from "../../pairQuizGameProgress/infrastructure/pairQuizGameProgressQueryRepository";
import { PairQuizGameProgressPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer";
import { AnswersPlayer } from "../../pairQuizGameProgress/domain/entity.answersPlayer";
import { QuestionGame } from "../domain/entity.questionGame";


@Injectable()
export class PairQuezGameQueryRepository {
  constructor(
    @InjectRepository(PairQuizGame) protected readonly pairQuezGame: Repository<PairQuizGame>,
	@InjectRepository(PairQuizGameProgressPlayer) protected readonly pairQuizGameProgressPlayer: Repository<PairQuizGameProgressPlayer>,
	@InjectRepository(AnswersPlayer) protected readonly answersPlayer: Repository<AnswersPlayer>,
	@InjectRepository(QuestionGame) protected readonly questionGame: Repository<QuestionGame>,
    protected readonly usersQueryRepository: UsersQueryRepository,
    protected readonly pairQuizGameRepository: PairQuizGameRepository,
    protected readonly pairQuizGameProgressQueryRepository: PairQuizGameProgressQueryRepository,
  ) {}
  async deleteAllPairQuizGame() {
	
    await this.pairQuezGame.createQueryBuilder().delete().execute();
    return true;
  }

  async deleteAllQuestionGames() {
    await this.questionGame.createQueryBuilder().delete().execute();
    return true;
  }

  async getCurrentUnFinGame(
    userId: string,
    statuses: GameStatusEnum[],
  ): Promise<GameTypeModel | null> {
		const currentUnFinishedGame = await this.pairQuezGame.findOne({
			relations: {
				firstPlayerProgress: {user: true, answers: {question: true}},
				secondPlayerProgress: {user: true, answers: {question: true}},
				questionGames: {question: {questionGame: true}}
			},
			where: [
				{firstPlayerProgress: {user: {id: userId}}, status: In(statuses)},
				{secondPlayerProgress: {user: {id: userId}}, status: In(statuses)}
			],
			order: {questionGames: {index: "ASC"}}
		// }
		// sortBy(question => idex: ASC, answers => addedAt: ASC)
		})

		if(!currentUnFinishedGame) return null

	const currentUnFinishedGameFirstPlayer = await this.pairQuizGameProgressPlayer.findOne({
				relations: {user: {progressPlayer: true}, answers: {progress: true}},
				where: {gameId: currentUnFinishedGame.id, id: currentUnFinishedGame.firstPlayerProgress.id},
				order: {answers: {addedAt: "ASC"}}
			})
	
	if(currentUnFinishedGame.status === GameStatusEnum.PendingSecondPlayer) return null

	const currentUnFinishedGameSecondPlayer = await this.pairQuizGameProgressPlayer.findOne({
				relations: {user: {progressPlayer: true}, answers: {progress: true}},
				where: {gameId: currentUnFinishedGame.id, id: currentUnFinishedGame.secondPlayerProgress.id},
				order: {answers: {addedAt: "ASC"}}
			})

	// const questionGame = await this.questionGame.findOne({
	// 	relations: {question: {questionGame: true}},
	// 	where: {pairQuizGameId: currentUnFinishedGame.id},
	// 	order: {index: "ASC"}
	// })
		// const currentUnFinishedGame = await this.pairQuezGame
		// .createQueryBuilder('game')
		// .leftJoinAndSelect('game.firstPlayerProgress', 'pairQuizGameProgressPlayer')
		// .leftJoinAndSelect('game.firstPlayerProgress', 'user')
		// .leftJoinAndSelect('game.firstPlayerProgress', 'answers')
		// .leftJoinAndSelect('game.firstPlayerProgress', 'question')
		// .leftJoinAndSelect('game.secondPlayerProgress', 'pairQuizGameProgressPlayer')
		// .leftJoinAndSelect('game.secondPlayerProgress', 'user')
		// .leftJoinAndSelect('game.secondPlayerProgress', 'answers')
		// .leftJoinAndSelect('game.secondPlayerProgress', 'question')
		// .leftJoinAndSelect('game.questionGames', 'questionGame')
		// .leftJoinAndSelect('game.questionGames', 'question')
		// .where(`"game.firstPlayerProgress.user" = :"userId" AND "game.status" = :statusOne OR "game.status" = :statusTwo`, {userId, statusOne: statuses[0], statusTwo: statuses[1]})
		// .andWhere(`"game.secondPlayerProgress.user" = :"userId" AND "game.status" = :statusOne OR "game.status" = :statusTwo`, {userId, statusOne: statuses[0], statusTwo: statuses[1]})
		// .orderBy({
		// 	"game.questionGames.index": "ASC",
		// 	"game.firstPlayerProgress.answers.addedAt": "ASC",
		// 	"game.secondPlayerProgress.answers.addedAt": "ASC"
		// })
		// .getOne()

    // const currentUnFinishedGame = await this.pairQuezGame.findOne({
	// 	relations: {
	// 		firstPlayerProgress: {user: true, answers: {question: true}},
	// 		secondPlayerProgress: {user: true, answers: {question: true}},
	// 		questionGames: {question: {questionGame: true}}
	// 	},
	// 	where: [
	// 		{firstPlayerProgress: {user: {id: userId}}, status: In(statuses)},
	// 		{secondPlayerProgress: {user: {id: userId}}, status: In(statuses)}
	// 	]
	// // }
	// // sortBy(question => idex: ASC, answers => addedAt: ASC)
	// })

	if (!currentUnFinishedGame) return null;
    // return PairQuizGame.getViewModel(currentUnFinishedGame)
	// if(currentUnFinishedGameFirstPlayer || currentUnFinishedGameSecondPlayer) return null
	return PairQuizGame.getViewModels(currentUnFinishedGame, currentUnFinishedGameFirstPlayer, currentUnFinishedGameSecondPlayer)
  }

  async getGameById(id: string): Promise<GameTypeModel | null> {
    const getGameById: PairQuizGame = await this.getRawGameById(id)
    if (!getGameById) return null;
    return PairQuizGame.getViewModel(getGameById);
  }

  async getRawGameById(id: string): Promise<PairQuizGame | null> {
	// const getGameById = await this.pairQuezGame
	// 	.createQueryBuilder('game')
	// 	.leftJoinAndSelect('game.firstPlayerProgress', 'pairQuizGameProgressPlayer')
	// 	.leftJoinAndSelect('game.firstPlayerProgress', 'user')
	// 	.leftJoinAndSelect('game.firstPlayerProgress', 'answers')
	// 	.leftJoinAndSelect('game.firstPlayerProgress', 'question')
	// 	.leftJoinAndSelect('game.secondPlayerProgress', 'pairQuizGameProgressPlayer')
	// 	.leftJoinAndSelect('game.secondPlayerProgress', 'user')
	// 	.leftJoinAndSelect('game.secondPlayerProgress', 'answers')
	// 	.leftJoinAndSelect('game.secondPlayerProgress', 'question')
	// 	.leftJoinAndSelect('game.questionGames', 'questionGame')
	// 	.leftJoinAndSelect('game.questionGames', 'question')
	// 	.where(`game.id = :id`, {id})
	// 	.orderBy({
	// 		"game.questionGames.index": "ASC",
	// 		"game.firstPlayerProgress.answers.addedAt": "ASC",
	// 		"game.secondPlayerProgress.answers.addedAt": "ASC"
	// 	})
	// 	.getOne()
    const getGameById: PairQuizGame = await this.pairQuezGame.findOne({
      relations: {
        firstPlayerProgress: { user: true, answers: { question: true } },
        secondPlayerProgress: { user: true, answers: { question: true } },
        questionGames: { question: { questionGame: true } },
      },
      where: { id },
      order: {
        questionGames: { index: 'ASC' },
        firstPlayerProgress: { answers: { addedAt: 'ASC' } },
        secondPlayerProgress: { answers: { addedAt: 'ASC' } },
      },
      // sortBy(question => idex: ASC, answers => addedAt: ASC)
    });
    if (!getGameById) return null;
    return getGameById
  }
  

  async getUnfinishedGame(userId: string): Promise<PairQuizGame | null> {
	const getGame = await this.pairQuezGame.findOne({
		relations: {
			firstPlayerProgress: {user: true, answers: true},
			secondPlayerProgress: {user: true, answers: true},
			questionGames: {question: {questionGame: true}}
		},
		where: [
			{status: Not(GameStatusEnum.Finished), firstPlayerProgress: {user: {id: userId}}},
			{status:  Not(GameStatusEnum.Finished), secondPlayerProgress: {user: {id: userId}}},
		]
	})
	if(!getGame) return null

	return getGame
  }

  async getGameByUserIdAndStatuses(userId: string, statuses: GameStatusEnum[]): Promise<PairQuizGame | null> {
	const getGame = await this.pairQuezGame.findOne({
		relations: {
			firstPlayerProgress: {user: true, answers: true},
			secondPlayerProgress: {user: true, answers: true},
			questionGames: {question: true}
		},
		where: [
			{status: In(statuses), firstPlayerProgress: {user: {id: userId}}},
			{status: In(statuses), secondPlayerProgress: {user: {id: userId}}},
		]
	})
	if(!getGame) return null

	return getGame
  }

  async getPlayerByGameIdAndUserId(gameId: string, userId?: string): Promise<PairQuizGameProgressPlayer | null> {
	const getFirstPlayer = await this.pairQuizGameProgressPlayer.findOne({
		relations: {
			user: true,
			answers: true
		},
		where: {gameId, userId}
	})
	
	if(!getFirstPlayer) return null
	return getFirstPlayer
  }

  async createAnswers(answer: AnswersPlayer) {
	return await this.answersPlayer.save(answer)
  }

  async setFinishAnswerDateFirstPlayer(gameId: string): Promise<void> {
	const result = await this.pairQuizGameProgressPlayer.update({gameId}, {answerStatus: AnswerStatusEnum.Correct})
  }

  async increaseCountFirstPlayer(gameId: string) {
	return await this.pairQuizGameProgressPlayer.increment({gameId}, "score", 1 )
  }

  async increaseCountSecondPlayer(gameId: string) {
	return await this.pairQuizGameProgressPlayer.increment({gameId}, "score", 1 )
  }

  async addBonusFirstPalyer(gameId: string) {
	return await this.pairQuizGameProgressPlayer.update({gameId}, {bonus_score: 1})
  }

  async addBonusSecondPalyer(gameId: string) {
	return await this.pairQuizGameProgressPlayer.update({gameId}, {bonus_score: 1})
  }

  async changeGameStatusToFinished(gameId: string) {
	return await this.pairQuezGame.update({id: gameId}, {status: GameStatusEnum.Finished})
  }
}