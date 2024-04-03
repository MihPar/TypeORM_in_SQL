import { PairQuizGameProgressPlayer } from './../../pairQuizGameProgress/domain/entity.pairQuizGameProgressFirstPlayer';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Question } from "../../question/domain/entity.question";
import { Repository } from "typeorm";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { GameStatusEnum } from "../enum/enumPendingPlayer";

@Injectable()
export class PairQuizGameRepository {
  constructor(
    @InjectRepository(Question)
    protected readonly question: Repository<Question>,
    @InjectRepository(PairQuizGame)
    protected readonly pairQuizGame: Repository<PairQuizGame>,
    @InjectRepository(PairQuizGameProgressPlayer)
    protected readonly PairQuizGameProgressPlayer: Repository<PairQuizGameProgressPlayer>,
  ) {}

  async foundGameByUserIdAndStatus(userId: string): Promise<boolean> {
    const foundGameByUserId = await this.pairQuizGame.findOneBy([
      { firstPlayerProgressId: userId, status: GameStatusEnum.Active },
	  { firstPlayerProgressId: userId, status: GameStatusEnum.PendingSecondPlayer},
      { secondPlayerProgressId: userId, status: GameStatusEnum.Active },
	  { secondPlayerProgressId: userId, status: GameStatusEnum.PendingSecondPlayer},
    ]);

    if (!foundGameByUserId) return false;
    return true;
  }

  async foundGame(status: GameStatusEnum): Promise<PairQuizGame | null> {
    const foundQuizGame = await this.pairQuizGame
		// .findOne({
		// 	relations : {
		// 		firstPlayerProgress : true,
		// 		secondPlayerProgress : true,
		// 	//   answersOfSecondUser :true,
		// 	//   answersOfFirstUser : true
		// 	},
		// 	  where: {
		// 		  status
		// 	  }
		//   })
      // .findOneBy({status: status})
	//   .createQueryBuilder("game")
    //   .leftJoinAndSelect("game.firstPlayerProgress", "firstPlayerProgress")
    //   .leftJoinAndSelect("game.secondPlayerProgress", "secondPlayerProgress")
      .createQueryBuilder()
      .select()
      .where(`status = :status`, { status })
      .getOne();
    if (!foundQuizGame) return null;
    return foundQuizGame;
  }

  async createNewGame(newQuizGame: PairQuizGame): Promise<PairQuizGame> {
    const createNewQuizGame = await this.pairQuizGame.save(newQuizGame);
    return createNewQuizGame;
  }

  async updateExistingGame(game: PairQuizGame): Promise<PairQuizGame> {
	console.log("try")
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
      .where(`'published' = :boolean`, { boolean })
      .orderBy('RANDOM()')
      .limit(5)
      .getMany();

    if (!getQuestionForQuizGame) return null;
    return getQuestionForQuizGame;
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