import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GameTypeModel } from "../type/typeViewModel";
import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";
import { AnswerStatusEnum, GameStatusEnum } from "../enum/enumPendingPlayer";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { v4 as uuidv4 } from "uuid";
import { PairQuizGameProgressFirstPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressFirstPlayer";
import { PairQuizGameProgressRepository } from "../../pairQuizGameProgress/infrastructure/pairQuizGameProgressRepository";
import { UsersQueryRepository } from "../../users/users.queryRepository";
import { PairQuizGameProgressSecondPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressSecondPlayer";
import { AnswersFirstPlayer } from "../../pairQuizGameProgress/domain/entity.answersFirstPlayer";

export class CreateOrConnectGameCommand {
	constructor(
		public userId: string
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
		
		const foundGameByUserId = await this.pairQuizGameRepository.foundGameByUserIdAndStatus(command.userId)
		if(foundGameByUserId) throw new ForbiddenException('403')
		
		const foundQuizGame = await this.pairQuizGameRepository.foundGame(GameStatusEnum.PendingSecondPlayer)
		const getLoginOfUser = await this.usersQueryRepository.findUserById(command.userId)
		const firstLogin = getLoginOfUser.login
		if(!foundQuizGame) {
			const newQuizGame = new PairQuizGame()
			newQuizGame.firstPlayerProgressId = command.userId
			newQuizGame.secondPlayerProgressId = null
			newQuizGame.pairCreatedDate = new Date()
			newQuizGame.question = null
			newQuizGame.status = GameStatusEnum.PendingSecondPlayer
			const createNewQuizGame = await this.pairQuizGameRepository.createNewGame(newQuizGame)

			const progressFirstPlayer = new PairQuizGameProgressFirstPlayer()
			progressFirstPlayer.userFirstPlyerId = command.userId
			progressFirstPlayer.answerStatus = null
			progressFirstPlayer.addedAt = new Date()
			progressFirstPlayer.gameId = createNewQuizGame.id
			progressFirstPlayer.answers = []

			const saveProgressFirstPlayer = await this.pairQuizGameProgressRepository.createProgress(progressFirstPlayer)

			return PairQuizGame.quizGameViewModelForFirstPlayer(createNewQuizGame, firstLogin, command.userId)
		} else {
			foundQuizGame.startGameDate = new Date()
			foundQuizGame.status = GameStatusEnum.Active

			const progressSecondPlayer = new PairQuizGameProgressSecondPlayer()
			progressSecondPlayer.userSecondPlyerId = command.userId
			progressSecondPlayer.answerStatus = null
			progressSecondPlayer.addedAt = new Date()
			progressSecondPlayer.gameId = foundQuizGame.id
			progressSecondPlayer.answers = []

			const saveProgressSecondPlayer = await this.pairQuizGameProgressRepository.createProgressForSecondPlayer(progressSecondPlayer)

			const getFiveQuestionsQuizGame = await this.pairQuizGameRepository.getFiveQuestions(true)
			foundQuizGame.question = getFiveQuestionsQuizGame

			const getLoginOfSecondPlayer = await this.usersQueryRepository.findUserById(foundQuizGame.firstPlayerProgressId)
			const secondLogin = getLoginOfSecondPlayer.login

			return PairQuizGame.quizGameViewModelForFoundPair(foundQuizGame, saveProgressSecondPlayer, firstLogin,secondLogin, getFiveQuestionsQuizGame, command.userId)
		}
	}
}