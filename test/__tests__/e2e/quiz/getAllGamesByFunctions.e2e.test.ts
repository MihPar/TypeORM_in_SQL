import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../../src/app.module";
import request from "supertest";
import { appSettings } from "../../../../src/setting";
import { PairQuizGame } from "../../../../src/pairQuizGame/domain/entity.pairQuezGame";
import { GameTypeModel } from "../../../../src/pairQuizGame/type/typeViewModel";
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
        login: '3Mickle',
        password: '3qwerty',
        email: '3mpara7473@gmail.com',
      };
	  let user4Creds= {
        login: '4Mickle',
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

		it('create pairs first and second game', async() => {
			const connectOneAndTwoRes = await toCreatePair(server, user1Token, user2Token)
			expect(connectOneAndTwoRes[0]).toBe(200)
			expect(connectOneAndTwoRes[1]).toBeDefined()
			firstGame = connectOneAndTwoRes[1]
			// console.log("connectOneAndTwo: ", connectOneAndTwo)

			const connectThreeAndFourRes = await toCreatePair(server, user3Token, user4Token)
			expect(connectThreeAndFourRes[0]).toBe(200)
			expect(connectThreeAndFourRes[1]).toBeDefined()
			secondGame = connectThreeAndFourRes[1]
			// console.log("connectThreeAndFour: ", connectThreeAndOne)
		})

		it('send answers for questions by first and second game', async() => {
			console.log("before send answers: ", 1)
			const sendAnswerByFirstGame = await sendAnswers(server, user1Token, user2Token, questionsInMemory, firstGame)
			console.log("after sening answers: ", 2)

			// console.log("sendAnswerByFirstGame: ", sendAnswerByFirstGame)
			const foundGameOneAndTwoOnFinish = await findGameById(server, firstGame.id, user1Token)
			console.log("foundGameOneAndTwoOnFinish: ", foundGameOneAndTwoOnFinish[1])
			console.log("first: ", foundGameOneAndTwoOnFinish[1].firstPlayerProgress.answers)
			console.log("second: ", foundGameOneAndTwoOnFinish[1].secondPlayerProgress.answers)
			// todo добавить метод нахождения игры по айди для проверки того что она окончена и можно игрокам-участникам начинать новую игру
			expect(foundGameOneAndTwoOnFinish[0]).toBe(200) // todo скопируй енамку и вставь вместо финиш
			expect(foundGameOneAndTwoOnFinish[1].status).toBe(GameStatusEnum.Finished) // todo скопируй енамку и вставь вместо финиш
			// const sendAnswerBySecondGame = await sendAnswers(server, user3Token, user4Token, questionsInMemory, secondGame)
			// // console.log("result: ", resultThreeAndFour)
			// const foundGameThreeAndFourOnFinish = await findGameById(server, secondGame.id, user1Token)
			// expect(sendAnswerBySecondGame[0]).toBe(200)
			// expect(sendAnswerBySecondGame[1].status).toBe(GameStatusEnum.Finished)
		})
			
		// it('create pairs third and forth game', async() => {
		// 	connectOneAndTwo = await toCreatePair(server, user1Token, user2Token)
		// 	// console.log("connectOneAndTwo: ", connectOneAndTwo)

		// 	connectThreeAndFour = await toCreatePair(server, user3Token, user4Token)
		// 	// console.log("connectThreeAndFour: ", connectThreeAndOne)
		// })

		// it('send answers for questions by third and forth game', async() => {
		// 	const resultOneAndTwo = await sendAnswers(server, user1Token, user2Token, questionsInMemory, connectOneAndTwo)
			// console.log("result: ", resultOneAndTwo)

			// const resultThreeAndFour = await sendAnswers(server, user3Token, user4Token, questionsInMemory, connectThreeAndFour)
			// console.log("result: ", resultThreeAndFour)
		// })

		// it("create fifth game (1 and 3 user)", async () => {
		// 	connectOneAndTwo = await toCreatePair(server, user1Token, user3Token)
		// 	// console.log("connectOneAndTwo: ", connectOneAndTwo)

		// 	const resultOneAndTwo = await sendAnswers(server, user1Token, user3Token, questionsInMemory, connectOneAndTwo)
		// 	console.log("result: ", resultOneAndTwo)
		// })

		// it("create sixth game (1 and 4 user)", async() => {
		// 	connectOneAndTwo = await toCreatePair(server, user1Token, user4Token)
		// 	// console.log("connectOneAndTwo: ", connectOneAndTwo)

		// 	const resultOneAndTwo = await sendAnswers(server, user1Token, user4Token, questionsInMemory, connectOneAndTwo)
		// 	console.log("result: ", resultOneAndTwo)
		// })

		// it("create seventh game (1 and 2 user)", async () => {
		// 	connectOneAndTwo = await toCreatePair(server, user1Token, user2Token)
		// 	// console.log("connectOneAndTwo: ", connectOneAndTwo)
		// })

		// it('get all games', async () => {
		// 	const allGames = await findAllGames(server, user1Token)
		// 	console.log("allGames: ", allGames)
		// })
	})
})