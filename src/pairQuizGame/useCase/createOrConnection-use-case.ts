import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GameTypeModel } from "../type/typeViewModel";
import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";
import { GameStatusEnum } from "../enum/enumPendingPlayer";
import { ForbiddenException } from "@nestjs/common";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { v4 as uuidv4 } from "uuid";
import { PairQuizGameProgressRepository } from "../../pairQuizGameProgress/infrastructure/pairQuizGameProgressRepository";
import { UsersQueryRepository } from "../../users/users.queryRepository";
import { PairQuizGameProgressPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressPlayer";
import { User } from "../../users/entities/user.entity";

export class CreateOrConnectGameCommand {
	constructor(
		public userId: string,
		public user: User
	) {}
}

@CommandHandler(CreateOrConnectGameCommand)
export class CreateOrConnectGameUseCase implements ICommandHandler<CreateOrConnectGameCommand> {
	constructor(
		protected readonly pairQuizGameRepository: PairQuizGameRepository,
		protected readonly pairQuizGameProgressRepository: PairQuizGameProgressRepository,
		protected readonly usersQueryRepository: UsersQueryRepository,
	) {}
	async execute(command: CreateOrConnectGameCommand): Promise<GameTypeModel> {
		const foundGameByUserId = await this.pairQuizGameRepository.foundGameByUserId(command.userId)
		if(foundGameByUserId) throw new ForbiddenException('403')
		console.log("1")
		const foundQuizGame = await this.pairQuizGameRepository.foundGame(GameStatusEnum.PendingSecondPlayer)
		const getLoginOfUser = await this.usersQueryRepository.findUserById(command.userId)
		const firstLogin = getLoginOfUser.login
		console.log("2")

		if(!foundQuizGame) {
		console.log("3")

			const progressFirstPlayer = new PairQuizGameProgressPlayer()
			progressFirstPlayer.userId = command.userId
			progressFirstPlayer.answerStatus = null
			progressFirstPlayer.addedAt = new Date()
			progressFirstPlayer.answers = []
			await this.pairQuizGameProgressRepository.createProgressFirstPlayer(progressFirstPlayer)
			
			const newQuizGame = new PairQuizGame()
			newQuizGame.firstPlayerProgressId = progressFirstPlayer.userId
			newQuizGame.secondPlayerProgressId = null
			newQuizGame.pairCreatedDate = progressFirstPlayer.addedAt
			newQuizGame.question = null
			newQuizGame.firstPlayerProgress = progressFirstPlayer
			newQuizGame.secondPlayerProgress = null
			newQuizGame.status = GameStatusEnum.PendingSecondPlayer
			// console.log("newQuizGame: ", newQuizGame)

			const createNewQuizGame = await this.pairQuizGameRepository.createNewGame(newQuizGame)
			// console.log("createNewQuizGame: ", createNewQuizGame)

			progressFirstPlayer.gameId = createNewQuizGame.id
			// console.log("progressFirstPlayer.gameId: ", progressFirstPlayer.gameId)
			await this.pairQuizGameProgressRepository.updateProgressFirstPlayer(progressFirstPlayer.gameId)
			// console.log("4")

			return PairQuizGame.quizGameViewModelForFirstPlayer(createNewQuizGame, firstLogin, command.userId)
		} else {
			foundQuizGame.startGameDate = new Date()
			foundQuizGame.status = GameStatusEnum.Active

			const progressSecondPlayer = new PairQuizGameProgressPlayer()
			progressSecondPlayer.userId = command.userId
			progressSecondPlayer.user = command.user
			progressSecondPlayer.answerStatus = null
			progressSecondPlayer.addedAt = new Date()
			progressSecondPlayer.gameId = foundQuizGame.id
			progressSecondPlayer.answers = []

			await this.pairQuizGameProgressRepository.createProgressForSecondPlayer(progressSecondPlayer)

			foundQuizGame.secondPlayerProgress = progressSecondPlayer
			foundQuizGame.secondPlayerProgressId = progressSecondPlayer.userId

			const getFiveQuestionsQuizGame = await this.pairQuizGameRepository.getFiveQuestions(true)
			foundQuizGame.question = getFiveQuestionsQuizGame

			await this.pairQuizGameRepository.createNewGame(foundQuizGame)
			// console.log("foundQuizGame: ", foundQuizGame)

			return PairQuizGame.getViewModel(foundQuizGame)
		}
	}
}