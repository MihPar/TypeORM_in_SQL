import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuestionTypeModel } from "../type/typeViewModel";
import { PairQuizGameRepository } from "../infrastructure/pairQuizGameRepository";
import { AnswerStatusEnum, GameStatusEnum } from "../enum/enumPendingPlayer";
import { NotFoundException } from "@nestjs/common";
import { PairQuizGame } from "../domain/entity.pairQuezGame";
import { v4 as uuidv4 } from "uuid";
import { PairQuizGameProgressFirstPlayer } from "../../pairQuizGameProgress/domain/entity.pairQuizGameProgressFirstPlayer";
import { PairQuizGameProgressRepository } from "../../pairQuizGameProgress/infrastructure/pairQuizGameProgressRepository";
import { UsersQueryRepository } from "../../users/users.queryRepository";

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
	async execute(command: CreateOrConnectGameCommand): Promise<QuestionTypeModel> {
		
		// 1.const foundGame =  находим игру у которой (WHERE status = "PendingSecondUser")
		// if(!foundGame) Если не нашел то: {
		// 	создаем новый PairGameQuiz
		//   заполняем все поля кроме second PlayerProgress, secondPlayerId, startgamedate, ..finishGamedate и статус PendingSecondUser questions отдаешь на фронт как null
	// }
		// else Если нашел то: {
			// меняешь статус на Active заполняешь креды второго юзера и меняешь старт гейм дейт
		//когда нашлось 2 игрока делаешь запрос на questions( где published === true) и достаешь 5 вопросов которые published в рандомном порядке(посмотреть в sql функцию в рандомном порядке)

		const foundQuizGame = await this.pairQuizGameRepository.foundGame(GameStatusEnum.PendingSecondPlayer)
		const getLoginOfUser = await this.usersQueryRepository.findUserById(command.userId)
		const login = getLoginOfUser.login
		if(!foundQuizGame) {

			/*** create progress first player ****/
			const progressFirstPlayer = new PairQuizGameProgressFirstPlayer()
			progressFirstPlayer.userId = command.userId
			progressFirstPlayer.answerStatus = AnswerStatusEnum.Correct
			const saveProgressFirstPlayer = await this.pairQuizGameProgressRepository.createProgress(progressFirstPlayer)

			/*******  create first player for quiz game for status pending ********/
			const idForfirstPlayer = command.userId
			const newQuizGame = new PairQuizGame()
			newQuizGame.firstPlayerId = idForfirstPlayer
			newQuizGame.question = null
			newQuizGame.firstPlayerProgress = saveProgressFirstPlayer
			newQuizGame.status = GameStatusEnum.PendingSecondPlayer
			newQuizGame.pairCreatedDate = new Date()
			const createNewQuizGame = await this.pairQuizGameRepository.createNewGame(newQuizGame)
			//static medoth
			/******* to return view model creating new quiz game for first player **********/
			const published = true
			const getFiveQuestionsQuizGame = await this.pairQuizGameRepository.getFiveQuestions(published)

			return PairQuizGame.quizGameViewModel(createNewQuizGame, login, getFiveQuestionsQuizGame, saveProgressFirstPlayer)
		} else {
			//progress for secondPlayer

			foundQuizGame.secondPlayerId = command.userId
			foundQuizGame.startGameDate = new Date()
			const published = true
			const getFiveQuestionsQuizGame = await this.pairQuizGameRepository.getFiveQuestions(published)
			foundQuizGame.question = getFiveQuestionsQuizGame
			
			const toAddSecondPlayer = await this.pairQuizGameRepository.changeStatusQuizGame(foundQuizGame)

			// static method
			return PairQuizGame.quizGameViewModel(foundQuizGame, login, getFiveQuestionsQuizGame)
		}
		

		// const createPairQuizGame = await this.pairQuizGameRepository.connectionOrCreatePairQuizGame(command.userId)

		return 
		}
}