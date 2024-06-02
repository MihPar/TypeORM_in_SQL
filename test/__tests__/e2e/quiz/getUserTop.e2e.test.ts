import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../../src/app.module";
import request from "supertest";
import { appSettings } from "../../../../src/setting";
import { PairQuizGame } from "../../../../src/pairQuizGame/domain/entity.pairQuezGame";
import { GameTypeModel, PlayerStatisticsView } from "../../../../src/pairQuizGame/type/typeViewModel";
import { PaginationType } from "../../../../src/types/pagination.types";
import { createAddUser, createQuestionsAndPublished, createToken, findAllGames, findGameById, sendAnswers, toCreatePair } from "../../../../src/helpers/helpers";
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
	let firsdGame: any
	let fourthGame: any
	let fivethGame: any
	let sithGame: any
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
			// console.log("connectOneAndTwo: ", connectOneAndTwo)

			// console.log("before send answers: ", 1)
			const sendAnswerByFirstGame = await sendAnswers(server, user1Token, user2Token, questionsInMemory, firstGame)
			// console.log("after sening answers: ", 2)

			// console.log("sendAnswerByFirstGame: ", sendAnswerByFirstGame)
			const foundFirstGame = await findGameById(server, firstGame.id, user1Token)
			// console.log("foundFirstGame: ", foundFirstGame[1])
			// console.log("first: ", foundFirstGame[1].firstPlayerProgress.answers)
			// console.log("second: ", foundFirstGame[1].secondPlayerProgress.answers)
			// todo добавить метод нахождения игры по айди для проверки того что она окончена и можно игрокам-участникам начинать новую игру
			expect(foundFirstGame[0]).toBe(200) // todo скопируй енамку и вставь вместо финиш
			expect(foundFirstGame[1].status).toBe(GameStatusEnum.Finished) // todo скопируй енамку и вставь вместо финиш
			// console.log("result1: ", foundFirstGame)
			
		})

		it('create pairs second game (3 and 4)', async() => {
			const connectThreeAndFourRes = await toCreatePair(server, user3Token, user4Token)
			expect(connectThreeAndFourRes[0]).toBe(200)
			expect(connectThreeAndFourRes[1]).toBeDefined()
			secondGame = connectThreeAndFourRes[1]
			// console.log("connectThreeAndFour: ", connectThreeAndOne)

			const sendAnswerBySecondGame = await sendAnswers(server, user3Token, user4Token, questionsInMemory, secondGame)
			const foundSecondGame = await findGameById(server, secondGame.id, user3Token)
			expect(foundSecondGame[0]).toBe(200)
			expect(foundSecondGame[1].status).toBe(GameStatusEnum.Finished)
			// console.log("result2: ", foundSecondGame)
			
		})
			
		it('create pairs third game (1 and 4)', async() => {
			const connectOnedAndFourRes = await toCreatePair(server, user1Token, user4Token)
			expect(connectOnedAndFourRes[0]).toBe(200)
			expect(connectOnedAndFourRes[1]).toBeDefined()
			firsdGame = connectOnedAndFourRes[1]
			// console.log("connectOneAndTwo: ", connectOneAndTwo)

			const sendAnswerByfirdthGame = await sendAnswers(server, user1Token, user4Token, questionsInMemory, firsdGame)

			const foundGameByThirdGame = await findGameById(server, firsdGame.id, user1Token)
			expect(foundGameByThirdGame[0]).toBe(200)
			expect(foundGameByThirdGame[1].status).toBe(GameStatusEnum.Finished)
			// console.log("result3: ", foundGameByThirdGame)

		})

		it('create pair by fourth game (3 and 2)', async() => {
			const connectThreeAndTwoRes = await toCreatePair(server, user3Token, user2Token)
			expect(connectThreeAndTwoRes[0]).toBe(200)
			expect(connectThreeAndTwoRes[1]).toBeDefined()
			fourthGame = connectThreeAndTwoRes[1]
			// console.log("connectThreeAndFour: ", connectThreeAndOne)

			const sendAnswerByFourGame = await sendAnswers(server, user3Token, user2Token, questionsInMemory, fourthGame)

			const foundGameByFourGame = await findGameById(server,fourthGame.id, user2Token)
			expect(foundGameByFourGame[0]).toBe(200)
			expect(foundGameByFourGame[1].status).toBe(GameStatusEnum.Finished)
			// console.log("result4: ", foundGameByFourGame)
		})

		it("create fifth game (1 and 3 user)", async () => {
			const connectOneAndTreeRes = await toCreatePair(server, user1Token, user3Token)
			expect(connectOneAndTreeRes[0]).toBe(200)
			expect(connectOneAndTreeRes[1]).toBeDefined()
			fivethGame = connectOneAndTreeRes[1]

			// console.log("connectOneAndTwo: ", connectOneAndTwo)
			const sendAnswerByThirdsGame = await sendAnswers(server, user1Token, user3Token, questionsInMemory, fivethGame)

			const foundFithGame = await findGameById(server, fivethGame.id, user3Token)
			expect(foundFithGame[0]).toBe(200)
			expect(foundFithGame[1].status).toBe(GameStatusEnum.Finished)
			// console.log("result5: ", foundFithGame)
		})

		it("create sixth game (1 and 4 user)", async() => {
			const connectOneAndFourRes = await toCreatePair(server, user1Token, user4Token)
			expect(connectOneAndFourRes[0]).toBe(200)
			expect(connectOneAndFourRes[1]).toBeDefined()
			sithGame = connectOneAndFourRes[1]

			// console.log("connectOneAndTwo: ", connectOneAndTwo)

			const sendAnswerBeSixthGame = await sendAnswers(server, user1Token, user4Token, questionsInMemory, sithGame)
			const findSixthGame = await findGameById(server, sithGame.id, user1Token)
			expect(findSixthGame[0]).toBe(200)
			expect(findSixthGame[1].status).toBe(GameStatusEnum.Finished)
			// console.log("result6: ", findSixthGame)
		})

		it("create seventh game (1 and 2 user)", async () => {
			const connectOneAndTwoRes = await toCreatePair(server, user1Token, user2Token)
			expect(connectOneAndTwoRes[0]).toBe(200)
			expect(connectOneAndTwoRes[1]).toBeDefined()
			seventhGame = connectOneAndTwoRes[1]

			const sendAnswerBySeventhGame = await sendAnswers(server, user1Token, user2Token, questionsInMemory, seventhGame)
			const findSeventhGame = await findGameById(server, seventhGame.id, user2Token)
			expect(findSeventhGame[0]).toBe(200)
			expect(findSeventhGame[1].status).toBe(GameStatusEnum.Finished)
			// console.log("result7: ", findSeventhGame)
		})

		it('get all games', async () => {
			const {status, body : allGames} = await findAllGames(server, user1Token)
			// console.log("restult: ", allGames)
			expect(status).toBe(200);
			expect(allGames.items).toHaveLength(5)
		})

		it('get my statistic', async() => {
			const getMyStatistics = await request(server)
				.get(`/pair-game-quiz/users/my-statistic`)
				.set(`Authorization`, `Bearer ${user1Token}`)

				expect(getMyStatistics.status).toBe(200)
				console.log("result: ", getMyStatistics.body)
		})

		it('get user top', async () => {
			console.log('try:')
			const getUserTop = await request(server)
				.get(`/pair-game-quiz/users/top`)
			
				// console.log("getUserTop: ", (getUserTop.body as Promise<PlayerStatisticsView | null>))
			expect(getUserTop.status).toBe(200)
		})
	})
})