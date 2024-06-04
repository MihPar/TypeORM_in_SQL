import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../../src/app.module";
import request from "supertest";
import { appSettings } from "../../../../src/setting";
import { PairQuizGame } from "../../../../src/pairQuizGame/domain/entity.pairQuezGame";
import { GameTypeModel, PlayerStatisticsView } from "../../../../src/pairQuizGame/type/typeViewModel";
import { PaginationType } from "../../../../src/types/pagination.types";
import { createAddUser, createQuestionsAndPublished, createToken, findAllGames, findGameById, sendAnswers, sendAnswersFirstPlayer, sendAnswersSecondPlayer, toCreatePair } from "../../../../src/helpers/helpers";
import { questionsInMemory } from "../../../../src/helpers/questionMemory";
import { GameStatusEnum } from "../../../../src/pairQuizGame/enum/enumPendingPlayer";



describe('/blogs', () => {
	let app: INestApplication;
	let server: any;
	beforeAll(async () => {
	  const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	  }).compile();
  
	  app = moduleFixture.createNestApplication();
	appSettings(app)
	  await app.init();
	  server = app.getHttpServer();

	  const wipeAllRes = await request(server).delete("/testing/all-data").send();
	  expect(wipeAllRes.status).toBe(HttpStatus.NO_CONTENT);
	});
  
	afterAll(async () => {
	  await app.close();
	});
  
	afterAll((done) => {
	  done();
	});

	let user1Creds= {
        login: '1Mickle',
        password: '1qwerty',
        email: '1mpara7473@gmail.com',
      };
	  let user2Creds= {
        login: 'Boris',
        password: '2qwerty',
        email: '2mpara7473@gmail.com',
      };
	  let user3Creds= {
        login: 'Alex',
        password: '3qwerty',
        email: '3mpara7473@gmail.com',
      };
	  let user4Creds= {
        login: 'Pet',
        password: '4qwerty',
        email: '4mpara7473@gmail.com',
      };

	  let user1Token: string
	  let user2Token: string
	  let user3Token: string
	  let user4Token: string
	
	  let connectOneAndTwo: GameTypeModel
	  let connectThreeAndFour: GameTypeModel
	  let connectThreeAndOne: GameTypeModel

	let requestBody: {
		body: string,
		correctAnswers: string[]
	}
	let answer: {
		questionId: string
        answerStatus: string
        addedAt: string
	}
	let firstGame: any
	let secondGame: any
	let firdGame: any
	let fourthGame: any
	let fivethGame: any
	let sixthGame: any
	let seventhGame: any

	let sendAnswerByFirstGame: any
	let sendAnswerBySecondGame: any


	describe("some description",  () => {
		it("creting users in db", async () => {
			expect(server).toBeDefined()
			await createAddUser(server, user1Creds)
			await createAddUser(server, user2Creds)
			await createAddUser(server, user3Creds)
			await createAddUser(server, user4Creds)
		})

		it("logining users in db", async () => {
			user1Token = (await createToken(server, user1Creds.login, user1Creds.password)).body.accessToken

			user2Token = (await createToken(server, user2Creds.login, user2Creds.password)).body.accessToken

			user3Token = (await createToken(server, user3Creds.login, user3Creds.password)).body.accessToken

			user4Token = (await createToken(server, user4Creds.login, user4Creds.password)).body.accessToken

		})

		it('create questions and published', async () => {
			const question = await createQuestionsAndPublished(server, questionsInMemory)
			expect(question).toEqual(questionsInMemory)
		})

		it('create pairs first game (1 and 2)', async() => {
			const connectOneAndTwoRes = await toCreatePair(server, user1Token, user2Token)
			expect(connectOneAndTwoRes[0]).toBe(200)
			expect(connectOneAndTwoRes[1]).toBeDefined()
			firstGame = connectOneAndTwoRes[1]

			/* first player */
			
			const send1AnswerOnFirstGameByFirstPlayer = await sendAnswersFirstPlayer(server, user1Token, 'Incorrect', firstGame)
			const found1FirstGameFirstPlayer = await findGameById(server, firstGame.id, user1Token)
			console.log("found1FirstGameFirstPlayer: ", found1FirstGameFirstPlayer[1].firstPlayerProgress.score)

			const send2AnswerOnFirstGameByFirstPlayer = await sendAnswersFirstPlayer(server, user1Token, 'Incorrect', firstGame)
			const found2FirstGameFirstPlayer = await findGameById(server, firstGame.id, user1Token)
			console.log("found2FirstGameFirstPlayer: ", found2FirstGameFirstPlayer[1].firstPlayerProgress.score)

			const send3AnswerOnFirstGameByFirstPlayer = await sendAnswersFirstPlayer(server, user1Token, 'Incorrect', firstGame)
			const found3FirstGameFirstPlayer = await findGameById(server, firstGame.id, user1Token)
			console.log("found3FirstGameFirstPlayer: ", found3FirstGameFirstPlayer[1].firstPlayerProgress.score)

			const sendA4nswerOnFirstGameByFirstPlayer = await sendAnswersFirstPlayer(server, user1Token, 'Incorrect', firstGame)
			const found4FirstGameFirstPlayer = await findGameById(server, firstGame.id, user1Token)
			console.log("found4FirstGameFirstPlayer: ", found4FirstGameFirstPlayer[1].firstPlayerProgress.score)

			const send5AnswerOnFirstGameByFirstPlayer = await sendAnswersFirstPlayer(server, user1Token, 'Incorrect', firstGame)
			const found5FirstGameFirstPlayer = await findGameById(server, firstGame.id, user1Token)
			console.log("found5FirstGameFirstPlayer: ", found5FirstGameFirstPlayer[1].firstPlayerProgress.score)

			expect(found1FirstGameFirstPlayer[1].firstPlayerProgress.score).toBe(0)
			expect(found2FirstGameFirstPlayer[1].firstPlayerProgress.score).toBe(0)
			expect(found3FirstGameFirstPlayer[1].firstPlayerProgress.score).toBe(0)
			expect(found4FirstGameFirstPlayer[1].firstPlayerProgress.score).toBe(0)
			expect(found5FirstGameFirstPlayer[1].firstPlayerProgress.score).toBe(0)


			/* second player */
			
			const send1AnswerOnFirstGameBySecondPlayer = await sendAnswersSecondPlayer(server, user2Token, 'Correct', firstGame)
			const found1FirstGameSecond = await findGameById(server, firstGame.id, user2Token)
			console.log("found1FirstGameSecond: ", found1FirstGameSecond[1].secondPlayerProgress.score)

			const send2AnswerOnFirstGameBySecondPlayer = await sendAnswersSecondPlayer(server, user2Token, 'Correct', firstGame)
			const found2FirstGameSecond = await findGameById(server, firstGame.id, user2Token)
			console.log("found2FirstGameSecond: ", found2FirstGameSecond[1].secondPlayerProgress.score)

			const send3AnswerOnFirstGameBySecondPlayer = await sendAnswersSecondPlayer(server, user2Token, 'Correct', firstGame)
			const found3FirstGameSecond = await findGameById(server, firstGame.id, user2Token)
			console.log("found3FirstGameSecond: ", found3FirstGameSecond[1].secondPlayerProgress.score)

			const send4AnswerOnFirstGameBySecondPlayer = await sendAnswersSecondPlayer(server, user2Token, 'Correct', firstGame)
			const found4FirstGameSecond = await findGameById(server, firstGame.id, user2Token)
			console.log("found4FirstGameSecond: ", found4FirstGameSecond[1].secondPlayerProgress.score)
			console.error("--------start---------")
			const send5AnswerOnFirstGameBySecondPlayer = await sendAnswersSecondPlayer(server, user2Token, 'Correct', firstGame)
			const found5FirstGameSecond = await findGameById(server, firstGame.id, user2Token)
			console.log("found5FirstGameSecond: ", found5FirstGameSecond[1].secondPlayerProgress.score)

			// console.log("found5FirstGameSecond: ", found5FirstGameSecond[1].secondPlayerProgress.answers.map(item => item))
			

			expect(found1FirstGameSecond[1].secondPlayerProgress.score).toBe(1)
			expect(found2FirstGameSecond[1].secondPlayerProgress.score).toBe(2)
			expect(found3FirstGameSecond[1].secondPlayerProgress.score).toBe(3)
			expect(found4FirstGameSecond[1].secondPlayerProgress.score).toBe(4)
			expect(found5FirstGameSecond[1].secondPlayerProgress.score).toBe(5)



			expect(found5FirstGameSecond[0]).toBe(200) // todo скопируй енамку и вставь вместо финиш
			expect(found5FirstGameSecond[1].status).toBe(GameStatusEnum.Finished) // todo скопируй енамку и 
		})

		it.skip('create pairs second game (3 and 4)', async() => {
			const connectThreeAndFourRes = await toCreatePair(server, user3Token, user4Token)
			expect(connectThreeAndFourRes[0]).toBe(200)
			expect(connectThreeAndFourRes[1]).toBeDefined()
			secondGame = connectThreeAndFourRes[1]
			// console.log("connectThreeAndFour: ", connectThreeAndOne)

			/* first player */

			const send1AnswerOnSecondGameByThirdPlayer = await sendAnswersFirstPlayer(server, user3Token, 'Incorrect', secondGame)
			const found1SecondGameThirdPlayer = await findGameById(server, secondGame.id, user3Token)
			// console.log("found1SecondGameThirdPlayer: ", found1SecondGameThirdPlayer[1].firstPlayerProgress.score)

			const send2AnswerOnSecondGameByThirdPlayer = await sendAnswersFirstPlayer(server, user3Token, 'Incorrect', secondGame)
			const found2SecondGameThirdPlayer = await findGameById(server, secondGame.id, user3Token)
			// console.log("found2SecondGameThirdPlayer: ", found2SecondGameThirdPlayer[1].firstPlayerProgress.score)

			const send3AnswerOnSecondGameByThirdPlayer = await sendAnswersFirstPlayer(server, user3Token, 'Incorrect', secondGame)
			const found3SecondGameThirdPlayer = await findGameById(server, secondGame.id, user3Token)
			// console.log("found3SecondGameThirdPlayer: ", found3SecondGameThirdPlayer[1].firstPlayerProgress.score)

			const sendA4nswerOnSecondGameByThirdPlayer = await sendAnswersFirstPlayer(server, user3Token, 'Incorrect', secondGame)
			const found4SecondGameThirdPlayer = await findGameById(server, secondGame.id, user3Token)
			// console.log("found4SecondGameThirdPlayer: ", found4SecondGameThirdPlayer[1].firstPlayerProgress.score)

			// const send5AnswerOnSecondGameByThirdPlayer = await sendAnswersFirstPlayer(server, user3Token, 'Incorrect', secondGame)
			// const found5SecondGameThirdPlayer = await findGameById(server, secondGame.id, user3Token)
			// console.log("found5SecondGameThirdPlayer: ", found5SecondGameThirdPlayer[1].firstPlayerProgress.score)

			
			expect(found1SecondGameThirdPlayer[1].firstPlayerProgress.score).toBe(0)
			expect(found2SecondGameThirdPlayer[1].firstPlayerProgress.score).toBe(0)
			expect(found3SecondGameThirdPlayer[1].firstPlayerProgress.score).toBe(0)
			expect(found4SecondGameThirdPlayer[1].firstPlayerProgress.score).toBe(0)
			// expect(found5SecondGameThirdPlayer[1].secondPlayerProgress.score).toBe(0)


			/* second player */
			
			const send1AnswerOnSecondGameByFourthPlayer = await sendAnswersSecondPlayer(server, user4Token, 'Correct', secondGame)
			const found1SecondGameFourthPlayer = await findGameById(server, secondGame.id, user4Token)
			// console.log("found1SecondGameFourthPlayer: ", found1SecondGameFourthPlayer[1].secondPlayerProgress.score)

			const send2AnswerOnSecondGameByFourthPlayer = await sendAnswersSecondPlayer(server, user4Token, 'Correct', secondGame)
			const found2SecondGameFourthPlayer = await findGameById(server, secondGame.id, user4Token)
			// console.log("found2SecondGameFourthPlayer: ", found2SecondGameFourthPlayer[1].secondPlayerProgress.score)

			const send3AnswerOnSecondGameByFourthPlayer = await sendAnswersSecondPlayer(server, user4Token, 'Correct', secondGame)
			const found3SecondGameFourthPlayer = await findGameById(server, secondGame.id, user4Token)
			// console.log("found3SecondGameFourthPlayer: ", found3SecondGameFourthPlayer[1].secondPlayerProgress.score)

			const send4AnswerOnSecondGameByFourthPlayer = await sendAnswersSecondPlayer(server, user4Token, 'Correct', secondGame)
			const found4SecondGameFourthPlayer = await findGameById(server, secondGame.id, user4Token)
			// console.log("found4SecondGameFourthPlayer: ", found4SecondGameFourthPlayer[1].secondPlayerProgress.score)

			const send5AnswerOnSecondGameByFourthPlayer = await sendAnswersSecondPlayer(server, user4Token, 'Correct', secondGame)
			const found5SecondGameFourthPlayer = await findGameById(server, secondGame.id, user4Token)
			// console.log("found5SecondGameFourthPlayer: ", found5SecondGameFourthPlayer[1].secondPlayerProgress.score)

			// console.log("found5SecondGameFourthPlayer: ", found5SecondGameFourthPlayer[1].secondPlayerProgress.answers.map(item => item))

			expect(found1SecondGameFourthPlayer[1].secondPlayerProgress.score).toBe(1)
			expect(found2SecondGameFourthPlayer[1].secondPlayerProgress.score).toBe(2)
			expect(found3SecondGameFourthPlayer[1].secondPlayerProgress.score).toBe(3)
			expect(found4SecondGameFourthPlayer[1].secondPlayerProgress.score).toBe(4)
			expect(found5SecondGameFourthPlayer[1].secondPlayerProgress.score).toBe(5)
			
			const send5AnswerOnSecondGameByThirdPlayer = await sendAnswersFirstPlayer(server, user3Token, 'Incorrect', secondGame)
			const found5SecondGameThirdPlayer = await findGameById(server, secondGame.id, user3Token)
			// console.log("found5SecondGameThirdPlayer: ", found5SecondGameThirdPlayer[1].firstPlayerProgress.score)
			expect(found5SecondGameThirdPlayer[1].firstPlayerProgress.score).toBe(0)

			const resultSecondGameFourthPlayer = await findGameById(server, secondGame.id, user4Token)
			// console.log("fourthPalyer: ", resultSecondGameFourthPlayer[1].secondPlayerProgress.score)
			expect(resultSecondGameFourthPlayer[1].secondPlayerProgress.score).toBe(6)

			
			expect(resultSecondGameFourthPlayer[0]).toBe(200) // todo скопируй енамку и вставь вместо финиш
			expect(resultSecondGameFourthPlayer[1].status).toBe(GameStatusEnum.Finished) // todo скопируй енамку и 
		})
			
		it.skip('create pairs third game (2 and 1)', async() => {
			const connectOneAndTwoRes = await toCreatePair(server, user1Token, user2Token)
			expect(connectOneAndTwoRes[0]).toBe(200)
			expect(connectOneAndTwoRes[1]).toBeDefined()
			firdGame = connectOneAndTwoRes[1]

			/* second player */
			
			const send1AnswerOnThirdGameBySecondPlayer = await sendAnswersSecondPlayer(server, user2Token, 'Correct', firdGame)
			const found1ThirdGameSecondPlayer = await findGameById(server, firdGame.id, user2Token)
			// console.log("found1ThirdGameSecondPlayer: ", found1ThirdGameSecondPlayer[1].secondPlayerProgress.score)

			const send2AnswerOnThirdGameBySecondPlayer = await sendAnswersSecondPlayer(server, user2Token, 'Correct', firdGame)
			const found2ThirdGameSecondPlayer = await findGameById(server, firdGame.id, user2Token)
			// console.log("found2ThirdGameSecondPlayer: ", found2ThirdGameSecondPlayer[1].secondPlayerProgress.score)

			const send3AnswerOnThirdGameBySecondPlayer = await sendAnswersSecondPlayer(server, user2Token, 'Correct', firdGame)
			const found3ThirdGameSecondPlayer = await findGameById(server, firdGame.id, user2Token)
			// console.log("found3ThirdGameSecondPlayer: ", found3ThirdGameSecondPlayer[1].secondPlayerProgress.score)

			const send4AnswerOnThirdGameBySecondPlayer = await sendAnswersSecondPlayer(server, user2Token, 'Correct', firdGame)
			const found4ThirdGameSecondPlayer = await findGameById(server, firdGame.id, user2Token)
			// console.log("found4ThirdGameSecondPlayer: ", found4ThirdGameSecondPlayer[1].secondPlayerProgress.score)

			const send5AnswerOnThirdGameBySecondPlayer = await sendAnswersSecondPlayer(server, user2Token, 'Correct', firdGame)
			const found5ThirdGameSecondPlayer = await findGameById(server, firdGame.id, user2Token)
			// console.log("found5ThirdGameSecondPlayer: ", found5ThirdGameSecondPlayer[1].secondPlayerProgress.score)

			// console.log("found5FirstGameSecond: ", found5FirstGameSecond[1].secondPlayerProgress.answers.map(item => item))

			expect(found1ThirdGameSecondPlayer[1].secondPlayerProgress.score).toBe(1)
			expect(found2ThirdGameSecondPlayer[1].secondPlayerProgress.score).toBe(2)
			expect(found3ThirdGameSecondPlayer[1].secondPlayerProgress.score).toBe(3)
			expect(found4ThirdGameSecondPlayer[1].secondPlayerProgress.score).toBe(4)
			expect(found5ThirdGameSecondPlayer[1].secondPlayerProgress.score).toBe(5)

			// console.log("resultGameSecondPlayer: ", resultGameSecondPlayer[1].secondPlayerProgress.score)
			
			expect(found5ThirdGameSecondPlayer[0]).toBe(200) // todo скопируй енамку и вставь вместо финиш


			/* first player */
			
			const send1AnswerOnThirdGameByFirstPlayer = await sendAnswersFirstPlayer(server, user1Token, 'Incorrect', firdGame)
			const found1ThirdGameFirstPlayer = await findGameById(server, firdGame.id, user1Token)
			// console.log("found1ThirdGameFirstPlayer: ", found1ThirdGameFirstPlayer[1].firstPlayerProgress.score)

			const send2AnswerOnThirdGameByFirstPlayer = await sendAnswersFirstPlayer(server, user1Token, 'Incorrect', firdGame)
			const found2ThirdGameFirstPlayer = await findGameById(server, firdGame.id, user1Token)
			// console.log("found2ThirdGameFirstPlayer: ", found2ThirdGameFirstPlayer[1].firstPlayerProgress.score)

			const send3AnswerOnThirdGameByFirstPlayer = await sendAnswersFirstPlayer(server, user1Token, 'Incorrect', firdGame)
			const found3ThirdGameFirstPlayer = await findGameById(server, firdGame.id, user1Token)
			// console.log("found3ThirdGameFirstPlayer: ", found3ThirdGameFirstPlayer[1].firstPlayerProgress.score)

			const sendA4nswerOnThirdGameByFirstPlayer = await sendAnswersFirstPlayer(server, user1Token, 'Incorrect', firdGame)
			const found4ThirdGameFirstPlayer = await findGameById(server, firdGame.id, user1Token)
			// console.log("found4ThirdGameFirstPlayer: ", found4ThirdGameFirstPlayer[1].firstPlayerProgress.score)

			const send5AnswerOnThirdGameByFirstPlayer = await sendAnswersFirstPlayer(server, user1Token, 'Incorrect', firdGame)
			const found5ThirdGameFirstPlayer = await findGameById(server, firdGame.id, user1Token)
			// console.log("found5ThirdGameFirstPlayer: ", found5ThirdGameFirstPlayer[1].firstPlayerProgress.score)

			expect(found1ThirdGameFirstPlayer[1].firstPlayerProgress.score).toBe(0)
			expect(found2ThirdGameFirstPlayer[1].firstPlayerProgress.score).toBe(0)
			expect(found3ThirdGameFirstPlayer[1].firstPlayerProgress.score).toBe(0)
			expect(found4ThirdGameFirstPlayer[1].firstPlayerProgress.score).toBe(0)
			expect(found5ThirdGameFirstPlayer[1].firstPlayerProgress.score).toBe(0)

			const resultGameSecondPlayer = await findGameById(server, firdGame.id, user2Token)
			expect(resultGameSecondPlayer[1].secondPlayerProgress.score).toBe(6)
			console.log("resultGameSecondPlayer: ", resultGameSecondPlayer[1].secondPlayerProgress.score)
			expect(resultGameSecondPlayer[1].status).toBe(GameStatusEnum.Finished) // todo скопируй енамку и 

		})

		it.skip('create pair by fourth game (1 and 2)', async() => {
			const connectOneAndTwoRes = await toCreatePair(server, user1Token, user2Token)
			expect(connectOneAndTwoRes[0]).toBe(200)
			expect(connectOneAndTwoRes[1]).toBeDefined()
			fourthGame = connectOneAndTwoRes[1]
			
			/* second player */
			
			const send1AnswerOnFourthGameBySeconPlayer = await sendAnswersFirstPlayer(server, user2Token, 'Incorrect', fourthGame)
			const found1FourthGameSecondPlayer = await findGameById(server, fourthGame.id, user2Token)
			console.log("found1FourthGameSecondPlayer: ", found1FourthGameSecondPlayer[1].secondPlayerProgress.score)

			const send2AnswerOnFourthGameBySecondPlayer = await sendAnswersFirstPlayer(server, user2Token, 'Incorrect', fourthGame)
			const found2FourthGameSecondPlayer = await findGameById(server, fourthGame.id, user2Token)
			console.log("found2FourthGameSecondPlayer: ", found2FourthGameSecondPlayer[1].secondPlayerProgress.score)

			const send3AnswerOnFourthGameBySecondPlayer = await sendAnswersFirstPlayer(server, user2Token, 'Incorrect', fourthGame)
			const found3FourthGameSecondPlayer = await findGameById(server, fourthGame.id, user2Token)
			console.log("found3FourthGameSecondPlayer: ", found3FourthGameSecondPlayer[1].secondPlayerProgress.score)

			const sendA4nswerOnFourthGameBySecondPlayer = await sendAnswersFirstPlayer(server, user2Token, 'Incorrect', fourthGame)
			const found4FourthGameSecondPlayer = await findGameById(server, fourthGame.id, user2Token)
			console.log("found4FourthGameSecondPlayer: ", found4FourthGameSecondPlayer[1].secondPlayerProgress.score)

			const send5AnswerOnFourthGameBySecondPlayer = await sendAnswersFirstPlayer(server, user2Token, 'Incorrect', fourthGame)
			const found5FourthGameSecondPlayer = await findGameById(server, fourthGame.id, user2Token)
			console.log("found5FourthGameSecondPlayer: ", found5FourthGameSecondPlayer[1].secondPlayerProgress.score)

			expect(found1FourthGameSecondPlayer[1].secondPlayerProgress.score).toBe(0)
			expect(found2FourthGameSecondPlayer[1].secondPlayerProgress.score).toBe(0)
			expect(found3FourthGameSecondPlayer[1].secondPlayerProgress.score).toBe(0)
			expect(found4FourthGameSecondPlayer[1].secondPlayerProgress.score).toBe(0)
			expect(found5FourthGameSecondPlayer[1].secondPlayerProgress.score).toBe(0)

			/* first player */

			const send1AnswerOnFourthGameByFirstPlayer = await sendAnswersSecondPlayer(server, user1Token, 'Correct', fourthGame)
			const found1FourthGameFirstPlayer = await findGameById(server, fourthGame.id, user1Token)
			console.log("found1FourthGameFirstPlayer: ", found1FourthGameFirstPlayer[1].firstPlayerProgress.score)

			const send2AnswerOnFourthGameByFirstPlayer = await sendAnswersSecondPlayer(server, user1Token, 'Correct', fourthGame)
			const found2FourthGameFirstPlayer = await findGameById(server, fourthGame.id, user1Token)
			console.log("found2FourthGameFirstPlayer: ", found2FourthGameFirstPlayer[1].firstPlayerProgress.score)

			const send3AnswerOnFourthGameByFirstPlayer = await sendAnswersSecondPlayer(server, user1Token, 'Correct', fourthGame)
			const found3FourthGameFirstPlayer = await findGameById(server, fourthGame.id, user1Token)
			console.log("found3FourthGameFirstPlayer: ", found3FourthGameFirstPlayer[1].firstPlayerProgress.score)

			const send4AnswerOnFourhtGameByFirstPlayer = await sendAnswersSecondPlayer(server, user1Token, 'Correct', fourthGame)
			const found4FourthGameFirstPlayer = await findGameById(server, fourthGame.id, user1Token)
			console.log("found4FourthGameFirstPlayer: ", found4FourthGameFirstPlayer[1].firstPlayerProgress.score)

			const send5AnswerOnFourhtGameByFirstPlayer = await sendAnswersSecondPlayer(server, user1Token, 'Correct', fourthGame)
			const found5FourthGameFirstPlayer = await findGameById(server, fourthGame.id, user1Token)
			console.log("found5FourthGameFirstPlayer: ", found5FourthGameFirstPlayer[1].firstPlayerProgress.score)

			// console.log("found5FirstGameSecond: ", found5FirstGameSecond[1].secondPlayerProgress.answers.map(item => item))

			expect(found1FourthGameFirstPlayer[1].firstPlayerProgress.score).toBe(1)
			expect(found2FourthGameFirstPlayer[1].firstPlayerProgress.score).toBe(2)
			expect(found3FourthGameFirstPlayer[1].firstPlayerProgress.score).toBe(3)
			expect(found4FourthGameFirstPlayer[1].firstPlayerProgress.score).toBe(4)
			expect(found5FourthGameFirstPlayer[1].firstPlayerProgress.score).toBe(5)


			expect(found5FourthGameFirstPlayer[0]).toBe(200) // todo скопируй енамку и вставь вместо финиш
			const restulFourthGameFirstPlayer = await findGameById(server, fourthGame.id, user1Token)
			expect(restulFourthGameFirstPlayer[1].status).toBe(GameStatusEnum.Finished) // todo скопируй енамку и 
			
		})

		it.skip("create fifth game (3 and 4 user)", async () => {
			const connectThreeAndFourRes = await toCreatePair(server, user3Token, user4Token)
			expect(connectThreeAndFourRes[0]).toBe(200)
			expect(connectThreeAndFourRes[1]).toBeDefined()
			fivethGame = connectThreeAndFourRes[1]
			// console.log("connectThreeAndFour: ", connectThreeAndOne)

			/* second player */

			const send1AnswerOnFifthGameByFourthPlayer = await sendAnswersFirstPlayer(server, user4Token, 'Incorrect', fivethGame)
			const found1FifthGameFourthPlayer = await findGameById(server, fivethGame.id, user4Token)
			console.log("found1FifthGameFourthPlayer: ", found1FifthGameFourthPlayer[1].secondPlayerProgress.score)

			const send2AnswerOnFifthGameByFourthPlayer = await sendAnswersFirstPlayer(server, user4Token, 'Incorrect', fivethGame)
			const found2FifthGameFourthPlayer = await findGameById(server, fivethGame.id, user4Token)
			console.log("found2FifthGameFourthPlayer: ", found2FifthGameFourthPlayer[1].secondPlayerProgress.score)

			const send3AnswerOnFifthGameByFourthPlayer = await sendAnswersFirstPlayer(server, user4Token, 'Incorrect', fivethGame)
			const found3FifthGameFourthPlayer = await findGameById(server, fivethGame.id, user4Token)
			console.log("found3FifthGameFourthPlayer: ", found3FifthGameFourthPlayer[1].secondPlayerProgress.score)

			const sendA4nswerOnSecondGameByThirdPlayer = await sendAnswersFirstPlayer(server, user4Token, 'Incorrect', fivethGame)
			const found4FifthGameFourthPlayer = await findGameById(server, fivethGame.id, user4Token)
			console.log("found4FifthGameFourthPlayer: ", found4FifthGameFourthPlayer[1].secondPlayerProgress.score)

			// const send5AnswerOnSecondGameByThirdPlayer = await sendAnswersFirstPlayer(server, user3Token, 'Incorrect', fivethGame)
			// const found5SecondGameThirdPlayer = await findGameById(server, fivethGame.id, user3Token)
			// console.log("found5SecondGameThirdPlayer: ", found5SecondGameThirdPlayer[1].secondPlayerProgress.score)

			
			expect(found1FifthGameFourthPlayer[1].secondPlayerProgress.score).toBe(0)
			expect(found2FifthGameFourthPlayer[1].secondPlayerProgress.score).toBe(0)
			expect(found3FifthGameFourthPlayer[1].secondPlayerProgress.score).toBe(0)
			expect(found4FifthGameFourthPlayer[1].secondPlayerProgress.score).toBe(0)
			// expect(found5SecondGameThirdPlayer[1].secondPlayerProgress.score).toBe(0)


			/* first player */
			
			const send1AnswerOnFifthGameByThirdPlayer = await sendAnswersSecondPlayer(server, user3Token, 'Correct', fivethGame)
			const found1FifthGameThirdPlayer = await findGameById(server, fivethGame.id, user3Token)
			console.log("found1FifthGameThirdPlayer: ", found1FifthGameThirdPlayer[1].firstPlayerProgress.score)

			const send2AnswerOnFifthGameByThirdPlayer = await sendAnswersSecondPlayer(server, user3Token, 'Correct', fivethGame)
			const found2FifthGameThirdPlayer = await findGameById(server, fivethGame.id, user3Token)
			console.log("found2FifthGameThirdPlayer: ", found2FifthGameThirdPlayer[1].firstPlayerProgress.score)

			const send3AnswerOnFifthGameByThirdPlayer = await sendAnswersSecondPlayer(server, user3Token, 'Correct', fivethGame)
			const found3FifthGameThirdPlayer = await findGameById(server, fivethGame.id, user3Token)
			console.log("found3FifthGameThirdPlayer: ", found3FifthGameThirdPlayer[1].firstPlayerProgress.score)

			const send4AnswerOnFifthGameByThirdPlayer = await sendAnswersSecondPlayer(server, user3Token, 'Correct', fivethGame)
			const found4FifthGameThirdPlayer = await findGameById(server, fivethGame.id, user3Token)
			console.log("found4FifthGameThirdPlayer: ", found4FifthGameThirdPlayer[1].firstPlayerProgress.score)

			const send5AnswerOnFifthGameByThirdPlayer = await sendAnswersSecondPlayer(server, user3Token, 'Correct', fivethGame)
			const found5FifthGameThirdPlayer = await findGameById(server, fivethGame.id, user3Token)
			console.log("found5FifthGameThirdPlayer: ", found5FifthGameThirdPlayer[1].firstPlayerProgress.score)

			// console.log("found5SecondGameFourthPlayer: ", found5SecondGameFourthPlayer[1].firstPlayerProgress.answers.map(item => item))

			expect(found1FifthGameThirdPlayer[1].firstPlayerProgress.score).toBe(1)
			expect(found2FifthGameThirdPlayer[1].firstPlayerProgress.score).toBe(2)
			expect(found3FifthGameThirdPlayer[1].firstPlayerProgress.score).toBe(3)
			expect(found4FifthGameThirdPlayer[1].firstPlayerProgress.score).toBe(4)
			expect(found5FifthGameThirdPlayer[1].firstPlayerProgress.score).toBe(5)
			
			const send5AnswerOnFifthGameByFourthPlayer = await sendAnswersFirstPlayer(server, user4Token, 'Incorrect', secondGame)
			const found5FifthGameFourthPlayer = await findGameById(server, secondGame.id, user4Token)
			console.log("found5FifthGameFourthPlayer: ", found5FifthGameFourthPlayer[1].secondPlayerProgress.score)
			expect(found5FifthGameFourthPlayer[1].secondPlayerProgress.score).toBe(0)

			const resultFifthGameThirdPlayer = await findGameById(server, secondGame.id, user3Token)
			console.log("fourthPalyer: ", resultFifthGameThirdPlayer[1].firstPlayerProgress.score)
			expect(resultFifthGameThirdPlayer[1].firstPlayerProgress.score).toBe(6)

			
			expect(resultFifthGameThirdPlayer[0]).toBe(200) // todo скопируй енамку и вставь вместо финиш
			expect(resultFifthGameThirdPlayer[1].status).toBe(GameStatusEnum.Finished) // todo скопируй енамку и 
		})

		it.skip("create sixth game (1 and 2 user)", async() => {
			const connectOneAndTwoRes = await toCreatePair(server, user1Token, user2Token)
			expect(connectOneAndTwoRes[0]).toBe(200)
			expect(connectOneAndTwoRes[1]).toBeDefined()
			sixthGame = connectOneAndTwoRes[1]

			/* first player */
			
			const send1AnswerOnSixthGameByFirstPlayer = await sendAnswersSecondPlayer(server, user1Token, 'Correct', sixthGame)
			const found1SixthGameFirstPlayer = await findGameById(server, sixthGame.id, user1Token)
			// console.log("found1SixthGameFirstPlayer: ", found1SixthGameFirstPlayer[1].firstPlayerProgress.score)

			const send2AnswerOnSixthGameByFirstPlayer = await sendAnswersSecondPlayer(server, user1Token, 'Correct', sixthGame)
			const found2SixthGameFirstPlayer = await findGameById(server, sixthGame.id, user1Token)
			// console.log("found2SixthGameFirstPlayer: ", found2SixthGameFirstPlayer[1].firstPlayerProgress.score)

			const send3AnswerOnSixthGameByFirstPlayer = await sendAnswersSecondPlayer(server, user1Token, 'Correct', sixthGame)
			const found3SixthGameFirstPlayer = await findGameById(server, sixthGame.id, user1Token)
			// console.log("found3SixthGameFirstPlayer: ", found3SixthGameFirstPlayer[1].firstPlayerProgress.score)

			const send4AnswerOnSixthGameByFirstPlayer = await sendAnswersSecondPlayer(server, user1Token, 'Correct', sixthGame)
			const found4SixthGameFirstPlayer = await findGameById(server, sixthGame.id, user1Token)
			// console.log("found4SixthGameFirstPlayer: ", found4SixthGameFirstPlayer[1].firstPlayerProgress.score)

			const send5AnswerOnSixthGameByFirstPlayer = await sendAnswersSecondPlayer(server, user1Token, 'Correct', sixthGame)
			const found5SixthGameFirstPlayer = await findGameById(server, sixthGame.id, user2Token)
			// console.log("found5SixthGameFirstPlayer: ", found5SixthGameFirstPlayer[1].firstPlayerProgress.score)

			// console.log("found5FirstGameSecond: ", found5FirstGameSecond[1].secondPlayerProgress.answers.map(item => item))

			expect(found1SixthGameFirstPlayer[1].firstPlayerProgress.score).toBe(1)
			expect(found2SixthGameFirstPlayer[1].firstPlayerProgress.score).toBe(2)
			expect(found3SixthGameFirstPlayer[1].firstPlayerProgress.score).toBe(3)
			expect(found4SixthGameFirstPlayer[1].firstPlayerProgress.score).toBe(4)
			expect(found5SixthGameFirstPlayer[1].firstPlayerProgress.score).toBe(5)

			// console.log("resultGameSecondPlayer: ", resultGameSecondPlayer[1].secondPlayerProgress.score)
			
			expect(found5SixthGameFirstPlayer[0]).toBe(200) // todo скопируй енамку и вставь вместо финиш


			/* second player */
			
			const send1AnswerOnSixthGameBySecondPlayer = await sendAnswersFirstPlayer(server, user2Token, 'Incorrect', sixthGame)
			const found1SixthGameSecondPlayer = await findGameById(server, sixthGame.id, user2Token)
			// console.log("found1SixthGameSecondPlayer: ", found1SixthGameSecondPlayer[1].secondPlayerProgress.score)

			const send2AnswerOnSixthGameBySecondPlayer = await sendAnswersFirstPlayer(server, user2Token, 'Incorrect', sixthGame)
			const found2SixthGameSecondPlayer = await findGameById(server, sixthGame.id, user2Token)
			// console.log("found2SixthGameSecondPlayer: ", found2SixthGameSecondPlayer[1].secondPlayerProgress.score)

			const send3AnswerOnSixthGameBySecondPlayer = await sendAnswersFirstPlayer(server, user2Token, 'Incorrect', sixthGame)
			const found3SixthGameSecondPlayer = await findGameById(server, sixthGame.id, user2Token)
			// console.log("found3SixthGameSecondPlayer: ", found3SixthGameSecondPlayer[1].secondPlayerProgress.score)

			const send4AnswerOnSixthGameBySecondPlayer = await sendAnswersFirstPlayer(server, user2Token, 'Incorrect', sixthGame)
			const found4SixthGameSecondPlayer = await findGameById(server, sixthGame.id, user2Token)
			// console.log("found4SixthGameSecondPlayer: ", found4SixthGameSecondPlayer[1].secondPlayerProgress.score)

			const send5AnswerOnSixthGameBySecondPlayer = await sendAnswersFirstPlayer(server, user2Token, 'Incorrect', sixthGame)
			const found5SixthGameSecondPlayer = await findGameById(server, sixthGame.id, user2Token)
			// console.log("found5SixthGameSecondPlayer: ", found5SixthGameSecondPlayer[1].secondPlayerProgress.score)

			expect(found1SixthGameSecondPlayer[1].secondPlayerProgress.score).toBe(0)
			expect(found2SixthGameSecondPlayer[1].secondPlayerProgress.score).toBe(0)
			expect(found3SixthGameSecondPlayer[1].secondPlayerProgress.score).toBe(0)
			expect(found4SixthGameSecondPlayer[1].secondPlayerProgress.score).toBe(0)
			expect(found5SixthGameSecondPlayer[1].secondPlayerProgress.score).toBe(0)

			const resultGameSecondPlayer = await findGameById(server, sixthGame.id, user1Token)
			expect(resultGameSecondPlayer[1].firstPlayerProgress.score).toBe(6)
			// console.log("resultGameSecondPlayer: ", resultGameSecondPlayer[1].firstPlayerProgress.score)
			expect(resultGameSecondPlayer[1].status).toBe(GameStatusEnum.Finished) // todo скопируй енамку и 
		})

		// it("create seventh game (1 and 2 user)", async () => {
		// 	const connectOneAndTwoRes = await toCreatePair(server, user1Token, user2Token)
		// 	expect(connectOneAndTwoRes[0]).toBe(200)
		// 	expect(connectOneAndTwoRes[1]).toBeDefined()
		// 	seventhGame = connectOneAndTwoRes[1]

		// 	const sendAnswerBySeventhGame = await sendAnswers(server, user1Token, user2Token, questionsInMemory, seventhGame)
		// 	const findSeventhGame = await findGameById(server, seventhGame.id, user2Token)
		// 	expect(findSeventhGame[0]).toBe(200)
		// 	expect(findSeventhGame[1].status).toBe(GameStatusEnum.Finished)
		// 	// console.log("result7: ", findSeventhGame)
		// })

		it.skip('get all games', async () => {
			const {status, body : allGames} = await findAllGames(server, user1Token)
			// console.log("restult: ", allGames)
			expect(status).toBe(200);
			// expect(allGames.items).toHaveLength(2)
		})

		it.skip('get my statistic', async() => {
			const getMyStatistics = await request(server)
				.get(`/pair-game-quiz/users/my-statistic`)
				.set(`Authorization`, `Bearer ${user1Token}`)


				// создать пару и первый игрок дает ответ на все вопросы неправильно а второй после всех ответов первого дает 5 правильных 
				// счет 0 5 после каждого ответа делаешь провери на счет условно 
				//  0 0
				// 0 1
				// 0 2 
				// ...


				// после этого создаешь еще одну пару где первый игрок отвечает на 4 вопроса и все неправильные потом второй все правильные и потом первый последний (для него пятый ответ ) неправильный , счет такой же как и в предидущей игре

				// создаешь еще одну пару второй игрок дает ответы на все вопросы правильно потом первый на все неправильно счет 6 0
				// у второго доп цестой бал за все правильные ответы плюс ответил раньше другого
				 
				// после этого делаешь три игры с такими же требованиями но наоборот (игроки меняются местами)

				
				expect(getMyStatistics.status).toBe(200)
				// console.log("result: ", getMyStatistics.body)
		})

		it.skip('get user top', async () => {
			// console.log('try:')
			const getUserTop = await request(server)
				.get(`/pair-game-quiz/users/top`)
			
				// console.log("getUserTop: ", (getUserTop.body as Promise<PlayerStatisticsView | null>))
			expect(getUserTop.status).toBe(200)
		})
	})
})