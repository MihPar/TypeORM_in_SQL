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
import { QuestionGame } from "../domain/entity.questionGame";
import { Question } from "../../question/domain/entity.question";
// import { questions } from "../infrastructure/pairQuizGameQueryRepository";

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
		// const foundGameByUserId = await this.pairQuizGameRepository.foundGameByUserId(command.userId)
		// if(foundGameByUserId) throw new ForbiddenException('403')
		const foundQuizGame = await this.pairQuizGameRepository.foundGame(GameStatusEnum.PendingSecondPlayer)
		const getLoginOfUser = await this.usersQueryRepository.findUserById(command.userId)
		const firstLogin = getLoginOfUser.login

		if(!foundQuizGame) {
			const progressFirstPlayer = new PairQuizGameProgressPlayer()
			progressFirstPlayer.userId = command.userId
			progressFirstPlayer.user = command.user
			// progressFirstPlayer.answerStatus = null
			progressFirstPlayer.addedAt = new Date()
			progressFirstPlayer.answers = []
			const createProgressFirstPlayer = await this.pairQuizGameProgressRepository.createProgressFirstPlayer(progressFirstPlayer)
			
			const newQuizGame = new PairQuizGame()
			newQuizGame.firstPlayerProgressId = progressFirstPlayer.id
			newQuizGame.secondPlayerProgressId = null
			newQuizGame.pairCreatedDate = progressFirstPlayer.addedAt
			newQuizGame.questionGames = null
			newQuizGame.firstPlayerProgress = createProgressFirstPlayer
			newQuizGame.secondPlayerProgress = null
			newQuizGame.status = GameStatusEnum.PendingSecondPlayer
			
			const createNewQuizGame = await this.pairQuizGameRepository.createNewGame(newQuizGame)

			createProgressFirstPlayer.gameId = createNewQuizGame.id
			await this.pairQuizGameProgressRepository.updateProgressFirstPlayer(createProgressFirstPlayer.id, createProgressFirstPlayer.gameId)

			return PairQuizGame.quizGameViewModelForFirstPlayer(createNewQuizGame, firstLogin, command.userId)
		} else {
			foundQuizGame.startGameDate = new Date()
			foundQuizGame.status = GameStatusEnum.Active

			const progressSecondPlayer = new PairQuizGameProgressPlayer()
			progressSecondPlayer.userId = command.userId
			progressSecondPlayer.user = command.user
			// progressSecondPlayer.answerStatus = null
			progressSecondPlayer.addedAt = new Date()
			progressSecondPlayer.gameId = foundQuizGame.id
			progressSecondPlayer.answers = []

			await this.pairQuizGameProgressRepository.createProgressForSecondPlayer(progressSecondPlayer)
			foundQuizGame.secondPlayerProgress = progressSecondPlayer
			foundQuizGame.secondPlayerProgressId = progressSecondPlayer.id

			const getFiveQuestionsQuizGame = await this.pairQuizGameRepository.getFiveQuestions(true)
			
			const questionGames: QuestionGame[] = getFiveQuestionsQuizGame.map((item, index) => {
				const questionGame = new QuestionGame();
				questionGame.index = index
				questionGame.pairQuizGame = foundQuizGame
				questionGame.question = item
				return questionGame
			});

			const saveQuestions = await this.pairQuizGameRepository.createQuestions(questionGames)
			foundQuizGame.questionGames = saveQuestions
			
			await this.pairQuizGameRepository.createNewGame(foundQuizGame)
			return PairQuizGame.getViewModel(foundQuizGame)
		}
	}
}