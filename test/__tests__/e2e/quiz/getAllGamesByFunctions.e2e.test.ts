import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../../src/app.module";
import request from "supertest";
import { appSettings } from "../../../../src/setting";
import { PairQuizGame } from "../../../../src/pairQuizGame/domain/entity.pairQuezGame";
import { GameTypeModel } from "../../../../src/pairQuizGame/type/typeViewModel";
import { PaginationType } from "../../../../src/types/pagination.types";
import { createAddUser, createQuestionsAndPublished, createToken, findAllGames, sendAnswers, toCreatePair } from "../../../../src/helpers/helpers";
import { questionsInMemory } from "../../../../src/helpers/questionMemory";



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

		it('create pairs', async() => {
			connectOneAndTwo = await toCreatePair(server, user1Token, user2Token)
			// console.log("connectOneAndTwo: ", connectOneAndTwo)

			connectThreeAndOne = await toCreatePair(server, user3Token, user4Token)
			// console.log("connectThreeAndFour: ", connectThreeAndOne)
		})

		it('send answers for questions', async() => {
			const result = await sendAnswers(server, user1Token, user2Token, questionsInMemory, connectThreeAndOne)
			console.log("result: ", result)
		})

		it('get all games', async () => {
			const allGames = await findAllGames(server, user1Token)
			console.log("allGames: ", allGames)
		})
	})
})