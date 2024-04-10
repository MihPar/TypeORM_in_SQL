import { PairQuizGameProgressPlayer } from '../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Question } from "../../question/domain/entity.question";
import { Repository } from "typeorm";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { AnswerStatusEnum, GameStatusEnum } from "../enum/enumPendingPlayer";

@Injectable()
export class PairQuizGameRepository {
  constructor(
    @InjectRepository(Question)
    protected readonly question: Repository<Question>,
    @InjectRepository(PairQuizGame)
    protected readonly pairQuizGame: Repository<PairQuizGame>,
    @InjectRepository(PairQuizGameProgressPlayer)
    protected readonly pairQuizGameProgressPlayer: Repository<PairQuizGameProgressPlayer>,
  ) {}

  async foundGameByUserId(userId: string): Promise<boolean> {
    // const foundGameByUserId = await this.pairQuizGame.findOneBy([
    //   { firstPlayerProgressId: userId, status: GameStatusEnum.Active },
	//   { firstPlayerProgressId: userId, status: GameStatusEnum.PendingSecondPlayer},
    //   { secondPlayerProgressId: userId, status: GameStatusEnum.Active },
	//   { secondPlayerProgressId: userId, status: GameStatusEnum.PendingSecondPlayer},
    // ]);

	const foundGameByUserId = await this.pairQuizGame.findOne({
		relations: {
			firstPlayerProgress: {
				user: true
			},
			secondPlayerProgress: {
				user: true
			}
		},
		where: [
			{firstPlayerProgress: {user: {id: userId}}, status: GameStatusEnum.Active},
			{firstPlayerProgress: {user: {id: userId}}, status: GameStatusEnum.PendingSecondPlayer},
			{secondPlayerProgress: {user: {id: userId}}, status: GameStatusEnum.Active},
			{secondPlayerProgress: {user: {id: userId}}, status: GameStatusEnum.PendingSecondPlayer}
		]
	})
    if (!foundGameByUserId) return false;
    return true;
  }

  async foundGame(status: GameStatusEnum): Promise<PairQuizGame | null> {
	return await this.pairQuizGame.findOne({
		relations: {
			firstPlayerProgress:{
				user: true,
				answers: {question: true }
			},
			secondPlayerProgress: {
				user:true,
				answers: {question: true }
			},
			question: true
		}, 
		where: {
			status
		}
	})
  }

  async createNewGame(newQuizGame: PairQuizGame): Promise<PairQuizGame> {

    const createNewQuizGame = await this.pairQuizGame.save({...newQuizGame});
    return createNewQuizGame;
  }

  async updateExistingGame(game: PairQuizGame): Promise<PairQuizGame> {
	const updateGame = await this.pairQuizGame.save(game)
		return updateGame
  }

  //   async updateNewQuizGame(saveProgressFirstPlayer: PairQuizGameProgressFirstPlayer, id: string): Promise<any> {
  // 	const updateNewQuizGame = await this.pairQuizGame
  // 		.createQueryBuilder()
  // 		.update()
  // 		.set({firstPlayerProgress: saveProgressFirstPlayer})
  // 		.where(`id = :id`, {id})
  // 		.execute()
  // 		console.log("updateNewQuizGame: ", updateNewQuizGame)
  // 		return updateNewQuizGame
  //   }

  //   async changeStatusQuizGame(game: PairQuizGame): Promise<PairQuizGame | null> {
  //     const changeStatusQuizGameOnActive = await this.pairQuizGame.save(game)
  // 	  if(!changeStatusQuizGameOnActive) return null
  // 	  return changeStatusQuizGameOnActive
  //   }

  async getFiveQuestions(boolean: boolean): Promise<Question[] | null> {
    const getQuestionForQuizGame = await this.question
      .createQueryBuilder()
      .select()
      .where(`published = :boolean`, { boolean })
      .orderBy('RANDOM()')
      .take(5)
      .getMany();

	  console.log("getQuestionForQuizGame: ", getQuestionForQuizGame)

    if (!getQuestionForQuizGame) return null;
    return getQuestionForQuizGame;
  }

  async findUnanswerQuestionByUserId(id: string): Promise<PairQuizGame> {
	return await this.pairQuizGame.findOne({
		relations: {
			firstPlayerProgress: true,
			secondPlayerProgress: true
		},
		where: [
		{
			firstPlayerProgress: {userId: id},
			firstPlayerProgress: {answerStatus: AnswerStatusEnum.Correct},
			status: GameStatusEnum.Finished
		},
		{
			secondPlayerProgress: {userId: id},
			secondPlayerProgress: {answerStatus: AnswerStatusEnum.Correct},
			status: GameStatusEnum.Finished
		}
	]
		order: {firstPlayerProgress.questionNuber = 'ASC'}
	})
  }

  // async connectionOrCreatePairQuizGame(userId: string) {
  // 	const createOrConnect = await this.pairQuizGame
  // 		.createQueryBuilder()
  // 		.leftJoinAndSelect()
  // }

  // async createAnswer(answer: string) {}

  // async sendAnswerFirstPlayer(gameId: string, {questionId, answerStatus, addedAt}: object, "-0") {}
  // async sendAnswerSecondPlayer(gameId: string, {questionId, answerStatus, addedAt}: object, "-0") {}

  // async setFinishAnswerDateFirstPlayer(gameId: string) {}
}