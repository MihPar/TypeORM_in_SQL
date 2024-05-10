import { stringify } from 'querystring';
import { PairQuizGameProgressPlayer } from '../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Question } from "../../question/domain/entity.question";
import { Repository } from "typeorm";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { AnswerStatusEnum, GameStatusEnum } from "../enum/enumPendingPlayer";
import { AnswersPlayer } from '../../pairQuizGameProgress/domain/entity.answersPlayer';
import { QuestionGame } from '../domain/entity.questionGame';

@Injectable()
export class PairQuizGameRepository {
  constructor(
    @InjectRepository(Question)
    protected readonly question: Repository<Question>,
    @InjectRepository(PairQuizGame)
    protected readonly pairQuizGame: Repository<PairQuizGame>,
    @InjectRepository(PairQuizGameProgressPlayer)
    protected readonly pairQuizGameProgressPlayer: Repository<PairQuizGameProgressPlayer>,
	@InjectRepository(AnswersPlayer) protected readonly answersPlayer: Repository<AnswersPlayer>,
	@InjectRepository(QuestionGame) protected readonly questionGame: Repository<QuestionGame>
  ) {}

  async foundGameByUserId(userId: string): Promise<boolean> {
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
			questionGames: true
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

  async getFiveQuestions(boolean: boolean): Promise<Question[] | null> {
    const getQuestionForQuizGame = await this.question
      .createQueryBuilder()
      .select()
      .where(`published = :boolean`, { boolean })
      .orderBy('RANDOM()')
      .take(5)
      .getMany();

    if (!getQuestionForQuizGame) return null;
    return getQuestionForQuizGame
	// .sort((a: any, b: any) => {return a.body - b.body});
  }

//   async findUnanswerQuestionByUserId(id: string): Promise<PairQuizGame> {
// 	return await this.pairQuizGame.findOne({
// 		relations: {
// 			firstPlayerProgress: true,
// 			secondPlayerProgress: true
// 		},
// 		where: [{firstPlayerProgress: {userId: id}},
// 		{
// 			firstPlayerProgress: {answerStatus: AnswerStatusEnum.Correct},
// 			status: GameStatusEnum.Finished
// 		},
// 		{secondPlayerProgress: {userId: id}},
// 		{
// 			secondPlayerProgress: {answerStatus: AnswerStatusEnum.Correct},
// 			status: GameStatusEnum.Finished
// 		}
// 	],
// 	})
//   }

  async sendAnswerPlayer(playerId: string, count: string) {
	const answersFirstPlayer = await this.pairQuizGameProgressPlayer
		.createQueryBuilder()
		.update()
		.set({score: () => Boolean(count) ?  "score + 1": "score + 0"})
		.where({id: playerId})
		.execute()
  }

  async createQuestions(createQuestions: QuestionGame[]) {
	return await this.questionGame.save(createQuestions)
  }
}