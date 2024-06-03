import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AnswersPlayer } from "../domain/entity.answersPlayer";
import { PairQuizGameProgressPlayer } from "../domain/entity.pairQuizGameProgressPlayer";
import { PairQuizGame } from "../../pairQuizGame/domain/entity.pairQuezGame";
import { TopUserView } from "../../pairQuizGame/type/typeViewModel";
import { PaginationType } from "../../types/pagination.types";
import { UsersQueryRepository } from "../../users/users.queryRepository";
import { StatusGameEnum } from "../../pairQuizGame/enum/enumPendingPlayer";

@Injectable()
export class PairQuizGameProgressQueryRepository {
	constructor(
		@InjectRepository(AnswersPlayer) protected readonly answersPlayer: Repository<AnswersPlayer>,
		@InjectRepository(PairQuizGameProgressPlayer) protected readonly pairQuizGameProgressPlayer: Repository<PairQuizGameProgressPlayer>,
		@InjectRepository(PairQuizGame) protected readonly pairQuizGame: Repository<PairQuizGame>,
		protected readonly usersQueryRepository: UsersQueryRepository
	) {}
	async deleteAllAnswersFirstPlayer() {
		await this.answersPlayer
			.createQueryBuilder()
			.delete()
			.execute()
			return true
	}

	async deleteAllAnswersSecondPlayer() {
		await this.answersPlayer
			.createQueryBuilder()
			.delete()
			.execute()
			return true
	}

	async deleteAllPairQuizGameProgressPlayerPlayer() {
		await this.pairQuizGameProgressPlayer
			.createQueryBuilder()
			.delete()
			.execute()
			return true
	}

	async deleteAllPairQuizGameProgressSecondPlayerPlayer() {
		await this.pairQuizGameProgressPlayer
			.createQueryBuilder()
			.delete()
			.execute()
			return true
	}

	async getQuestionByIdForFirstPlayer(userId: string): Promise<PairQuizGameProgressPlayer | null> {
		const getQuestion = await this.pairQuizGameProgressPlayer
			.createQueryBuilder()
			.select()
			.where(`"userId" = :userId`, {userId})
			.getOne()

			if(!getQuestion) return null
			return getQuestion
	}

	async getQuestionByIdForSecondPlayer(userId: string): Promise<PairQuizGameProgressPlayer | null> {
		const getQuestion = await this.pairQuizGameProgressPlayer
			.createQueryBuilder()
			.select()
			.where(`"userId" = :userId`, {userId})
			.getOne()

			if(!getQuestion) return null
			return getQuestion
	}

	async findAnswerFirstPlayer(progressId: string): Promise<AnswersPlayer | null> {
		const getAnswer = await this.answersPlayer
			.createQueryBuilder()
			.select()
			.where(`"progressId" = :progressId`, {progressId})
			.getOne()
			// .getOne()

			// console.log("getAnswer: ", getAnswer)

			if(!getAnswer) return null
			return getAnswer
	}

	async findAnswerSecondPlayer(progressId: string): Promise<AnswersPlayer | null> {
		const getAnswer = await this.answersPlayer
			.createQueryBuilder()
			.select()
			.where(`"progressId" = :progressId`, {progressId})
			.getOne()

			if(!getAnswer) return null
			return getAnswer
	}

	async getTopUsers(
		sort: string[],
		pageNumber: number,
		pageSize: number,
		
	): Promise<PaginationType<TopUserView>> {
		const stackAllGamesByUser = await this.pairQuizGameProgressPlayer.find({
			relations: {user: true},
			order: {addedAt: "ASC"}
		})
	// const stackAllGamesByUser = await this.pairQuizGameProgressPlayer
	// 		.createQueryBuilder()
	// 		.select(`'userId'`)
	// 		.distinct(true)
	// 		.getRawMany();

	const uniqUserByIds = Array.from(new Set(stackAllGamesByUser.map(item => item.userId)))
	// console.log('result: ', uniqUserByIds)
    const sortParam = sort.map((param) => param.replace(/\+/g, ' '));
	// console.log("sortParam: ", sortParam)
    const totalCountQuery = await uniqUserByIds.length;

    const items = await Promise.all(
		uniqUserByIds.map(async (userId) => {
        const user = await this.usersQueryRepository.findUserById(userId);
		// console.log("user: ", user)
        const playerSumScores = await this.pairQuizGameProgressPlayer
          .createQueryBuilder()
          .select('SUM(score)', 'sumScore')
          .where(`"userId" = :userId`, { userId })
          .getRawOne()
          .then((result) => parseInt(result.sumScore));

		  const playerTotalGameCount = await this.pairQuizGameProgressPlayer
          .createQueryBuilder()
          .where(`"userId" = :userId`, { userId })
          .getCount();

		//   console.log("playerTotalGameCount: ", typeof playerTotalGameCount)

        // const playerAvgScores = +(
        //   playerSumScores / playerTotalGameCount
        // ).toFixed(2);

		const playerAvgScores =
      Math.ceil((playerSumScores / playerTotalGameCount) * 100) / 100;

        const playerWinCount = await this.pairQuizGameProgressPlayer
          .createQueryBuilder()
          .where(`"userId" = :userId`, { userId })
          .andWhere(`"userStatus" = :status`, { status: StatusGameEnum.Winner })
          .getCount();

        const playerLossCount = await this.pairQuizGameProgressPlayer
          .createQueryBuilder()
          .where(`"userId" = :userId`, { userId })
          .andWhere(`"userStatus" = :status`, { status: StatusGameEnum.Loser })
          .getCount();

        const playerDrawsCount = await this.pairQuizGameProgressPlayer
          .createQueryBuilder()
          .where(`"userId" = :userId`, { userId })
          .andWhere(`"userStatus" = :status`, { status: StatusGameEnum.Draw })
          .getCount();

        return {
          sumScore: playerSumScores,
          avgScores: playerAvgScores,
          gamesCount: playerTotalGameCount,
          winsCount: playerWinCount,
          lossesCount: playerLossCount,
          drawsCount: playerDrawsCount,
          player: {
            id: user!.id,
            login: user!.login,
          },
        };
      }),
    );

	// console.log("items: ", items)
    const sortedItems = items
      .sort((a, b) => {
        for (const sortCriteria of sortParam) {
			// console.log("sortCriteria: ", sortCriteria)
          const [fieldName, sortDirection] = sortCriteria.split(' ', 2);
          if (fieldName === 'avgScores') {
            if (a.avgScores > b.avgScores) {
              return sortDirection === 'desc' ? -1 : 1;
            } else if (a.avgScores < b.avgScores) {
              return sortDirection === 'desc' ? 1 : -1;
            }
          } else if (fieldName === 'sumScore') {
            if (a.sumScore > b.sumScore) {
              return sortDirection === 'desc' ? -1 : 1;
            } else if (a.sumScore < b.sumScore) {
              return sortDirection === 'desc' ? 1 : -1;
            }
          } else if (fieldName === 'winsCount') {
            if (a.winsCount > b.winsCount) {
              return sortDirection === 'desc' ? -1 : 1;
            } else if (a.winsCount < b.winsCount) {
              return sortDirection === 'desc' ? 1 : -1;
            }
          } else if (fieldName === 'lossesCount') {
            if (a.lossesCount > b.lossesCount) {
              return sortDirection === 'desc' ? -1 : 1;
            } else if (a.lossesCount < b.lossesCount) {
              return sortDirection === 'desc' ? 1 : -1;
            }
          } else if (fieldName === 'drawsCount') {
            if (a.drawsCount > b.drawsCount) {
              return sortDirection === 'desc' ? -1 : 1;
            } else if (a.drawsCount < b.drawsCount) {
              return sortDirection === 'desc' ? 1 : -1;
            }
          }
        }
        return 0;
      })
      //.slice((+pageNumber - 1) * +pageSize, +pageNumber * +pageSize);
	
    return {
      pagesCount: Math.ceil(totalCountQuery / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCountQuery,
      items: sortedItems
    };
	}
}