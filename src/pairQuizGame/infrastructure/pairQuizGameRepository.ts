import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Question } from "../../question/domain/entity.question";
import { Repository } from "typeorm";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { PairQuizGameProgressFirstPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressFirstPlayer";
import { PairQuizGameProgressSecondPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressSecondPlayer";
import { GameStatusEnum } from "../enum/enumPendingPlayer";

@Injectable()
export class PairQuizGameRepository {
  constructor(
    @InjectRepository(Question)
    protected readonly question: Repository<Question>,
    @InjectRepository(PairQuizGame)
    protected readonly pairQuizGame: Repository<PairQuizGame>,
    @InjectRepository(PairQuizGameProgressFirstPlayer)
    protected readonly pairQuizGameProgressFirstPlayer: Repository<PairQuizGameProgressFirstPlayer>,
    @InjectRepository(PairQuizGameProgressSecondPlayer)
    protected readonly pairQuizGameProgressSecondPlayer: Repository<PairQuizGameProgressFirstPlayer>,
  ) {}

  async foundGameByUserIdAndStatus(status: GameStatusEnum, userId: string): Promise<boolean> {
	const foundGameByUserId = await this.pairQuizGame.find({
		relations: {
			firstPlayerProgress: true
		},
		where: {
			status,
			firstPlayerProgress: {
				userId
			}
		}
	})

	if(!foundGameByUserId) return false
	return true
  }

  async foundGame(status: GameStatusEnum): Promise<PairQuizGame | null> {
    const foundQuizGame = await this.pairQuizGame
      .createQueryBuilder()
      .select()
      .where(`'status' = :status`, { status })
      .getOne();

    if (!foundQuizGame) return null;
    return foundQuizGame;
  }

  async createNewGame(newQuizGame: PairQuizGame) {
    const createNewQuizGame = await this.pairQuizGame.save(newQuizGame);
    return createNewQuizGame;
  }

//   async changeStatusQuizGame(game: PairQuizGame): Promise<PairQuizGame | null> {
//     const changeStatusQuizGameOnActive = await this.pairQuizGame.save(game)
// 	  if(!changeStatusQuizGameOnActive) return null
// 	  return changeStatusQuizGameOnActive
//   }

  async getFiveQuestions(boolean: boolean): Promise<Question[] | null> {
	const getQuestionForQuizGame = await this.question
		.createQueryBuilder()
		.select()
		.where(`'published' = :boolean`, {boolean})
		.orderBy("RANDOM()")
		.limit(5)
		.getMany()

		if(!getQuestionForQuizGame) return null
		return getQuestionForQuizGame
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