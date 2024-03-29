import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GameTypeModel } from "../type/typeViewModel";
import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";
import { AnswerStatusEnum, GameStatusEnum } from "../enum/enumPendingPlayer";
import { NotFoundException } from "@nestjs/common";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { v4 as uuidv4 } from "uuid";
import { PairQuizGameProgressFirstPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressFirstPlayer";
import { PairQuizGameProgressRepository } from "../../pairQuizGameProgress/infrastructure/pairQuizGameProgressRepository";
import { UsersQueryRepository } from "../../users/users.queryRepository";
import { PairQuizGameProgressSecondPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressSecondPlayer";

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
		protected readonly usersQueryRepository: UsersQueryRepository
	) {}
	async execute(command: CreateOrConnectGameCommand): Promise<GameTypeModel> {
		
		// 1.const foundGame =  находим игру у которой (WHERE status = "PendingSecondUser")
		// if(!foundGame) Если не нашел то: {
		// 	создаем новый PairGameQuiz
		//   заполняем все поля кроме second PlayerProgress, secondPlayerId, startgamedate, ..finishGamedate и статус PendingSecondUser questions отдаешь на фронт как null
		// }
		// else Если нашел то: {
			// меняешь статус на Active заполняешь креды второго юзера и меняешь старт гейм дейт
		//когда нашлось 2 игрока делаешь запрос на questions( где published === true) и достаешь 5 вопросов которые published в рандомном порядке(посмотреть в sql функцию в рандомном порядке)

		const foundGameByUserId = await this.pairQuizGameRepository.foundGameByUserIdAndStatus(GameStatusEnum.Active, command.userId)
		if(foundGameByUserId) return 

		const foundQuizGame = await this.pairQuizGameRepository.foundGame(GameStatusEnum.PendingSecondPlayer)
		const getLoginOfUser = await this.usersQueryRepository.findUserById(command.userId)
		const login = getLoginOfUser.login
		if(!foundQuizGame) {
			/*** create progress first player ****/
			const progressFirstPlayer = new PairQuizGameProgressFirstPlayer()
			progressFirstPlayer.userId = command.userId
			progressFirstPlayer.answerStatus = null
			progressFirstPlayer.addedAt = new Date()
			const saveProgressFirstPlayer = await this.pairQuizGameProgressRepository.createProgress(progressFirstPlayer)

			/*******  create first player for quiz game for status pending ********/
			const newQuizGame = new PairQuizGame()
			newQuizGame.firstPlayerId = command.userId
			newQuizGame.secondPlayerProgress = null
			newQuizGame.secondPlayerId = null
			newQuizGame.question = null
			newQuizGame.firstPlayerProgress = saveProgressFirstPlayer
			newQuizGame.status = GameStatusEnum.PendingSecondPlayer
			newQuizGame.pairCreatedDate = new Date()
			const createNewQuizGame = await this.pairQuizGameRepository.createNewGame(newQuizGame)
			//static medoth
			/******* to return view model creating new quiz game for first player **********/
			return PairQuizGame.quizGameViewModelForFirstPlayer(createNewQuizGame, login, saveProgressFirstPlayer)
		} else {
			//progress for secondPlayer
			const progressSecondPlayer = new PairQuizGameProgressSecondPlayer()
			progressSecondPlayer.userSecondPlyerId = command.userId
			progressSecondPlayer.answerStatus = AnswerStatusEnum.Correct
			const saveProgressSecondPlayer = await this.pairQuizGameProgressRepository.createProgressForSecondPlayer(progressSecondPlayer)
			
			foundQuizGame.secondPlayerId = command.userId
			foundQuizGame.startGameDate = new Date()
			foundQuizGame.secondPlayerProgress = saveProgressSecondPlayer
			foundQuizGame.status = GameStatusEnum.Active

			const getFiveQuestionsQuizGame = await this.pairQuizGameRepository.getFiveQuestions(true)
			foundQuizGame.question = getFiveQuestionsQuizGame

			/****** to get array of answers ********/

			// static method
			return PairQuizGame.quizGameViewModelForFoundPair(foundQuizGame, progressSecondPlayer, login, getFiveQuestionsQuizGame)
		}
	}
}