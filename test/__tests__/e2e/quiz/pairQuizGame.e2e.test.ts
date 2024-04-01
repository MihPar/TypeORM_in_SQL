import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../../src/app.module";
import request from "supertest";

describe('/blogs', () => {
	let app: INestApplication;
	let server: any;
	beforeAll(async () => {
	  const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	  }).compile();
  
	  app = moduleFixture.createNestApplication();
  
	  await app.init();
	  server = app.getHttpServer();
	});
  
	afterAll(async () => {
	  await app.close();
	});
  
	afterAll((done) => {
	  done();
	});
  
	let userLogin: string
	let userId: string
	let tokenByUser: string

	let id: string
	let body: string
	let correctAnswers: string[]
	let published: boolean
	let createdAt: Date | null
	let updatedAt: Date | null

	let question: string[]
	let requestBody: {
		body: string,
		correctAnswers: string[]
	}

	let updateBody: {
		body: string,
		correctAnswers: string[]
	}

	describe('Quiz question', () => {
		it("Connect with existing player or to create new pair which will be waiting second player", async () => {
			/************* create user *******/
			const user = {
				login: "1Mickle",
				password: "1qwerty",
				email: "1mpara7473@gmail.com",
			  };
		
			  const createUser = await request(server)
				.post(`/sa/users`)
				.auth("admin", "qwerty")
				.send(user);
		
				userLogin = createUser.body.login;
				  userId = createUser.body.id;
		
			  expect(createUser.body).toStrictEqual({
				id: expect.any(String),
				login: user.login,
				email: user.email,
				createdAt: expect.any(String),
			  });
			  const createAccessToken = await request(server)
			  .post("/auth/login")
			  .send({
				loginOrEmail: user.login,
				password: user.password,
			  });
		
			  tokenByUser = createAccessToken.body.accessToken;
			  expect(createAccessToken.status).toBe(HttpStatus.OK);
			  expect(createAccessToken.body).toEqual({
				accessToken: expect.any(String),
			  });

			  
		})

		it("get my current unfinished game", async() => {
			const getUnfinishedGame = await request(server)
				.get('/pair-game-quiz/pairs/my-current')
				.set("Authorization", `Bearer ${tokenByUser}`)

				expect(getUnfinishedGame.status).toBe(HttpStatus.OK)
		})

		it('create question', async () => {
			question = [
			  'What is your name',
			  'How old are you?',
			  'Where are you from?',
			  'What is your profession?',
			  'What is your programmer`s language?',
			  'What is your favorite framework?',
			];
	  
			requestBody = {
			  body: 'Question chapt_1',
			  correctAnswers: [
				'Mickle',
				'25',
				'Mexico',
				'programmer',
				'JS',
				'Nest.js',
			  ],
			};
	  
			
			const create = await request(server)
			  .post('/sa/quiz/questions')
			  .auth('admin', 'qwerty')
			  .send(requestBody);
	  
			expect(create.body).toEqual({
			  id: expect.any(String),
			  body: requestBody.body,
			  correctAnswers: requestBody.correctAnswers,
			  published: true,
			  createdAt: expect.any(String),
			  updatedAt: null,
			});
	  
			  id = create.body.id
			  body = create.body.body
			  correctAnswers = create.body.correctAnswers
			  published = create.body.published
			  createdAt = create.body.createdAt
			  updatedAt = create.body.updatedAt
		  });

		  it('Update question', async () => {
			updateBody = {
				body: 'Question chapt_2',
				correctAnswers: [
				  'Mickle1',
				  '251',
				  'Mexico1',
				  'programmer1',
				  'JS1',
				  'Nest.js1',
				],
			  };
			const updateQuestion = await request(server)
				.put(`/sa/quiz/questions/${id}`)
				.auth('admin', 'qwerty')
				.send(updateBody)
	
			expect(updateQuestion.status).toBe(HttpStatus.NO_CONTENT)
		})

		it("create connection", async() => {
			/***************** create new pair ***********************/

			const connectOrCreatePair = await request(server)
				.post('/pair-game-quiz/pairs/connection')
				.set("Authorization", `Bearer ${tokenByUser}`)

				expect(connectOrCreatePair.status).toBe(HttpStatus.OK)

		})
	  

		it("get game by id", async() => {
			const getGameById = await request(server)
				.get(`/pair-game-quiz/pairs/${userId}`)
				.set("Authorization", `Bearer${tokenByUser}`)

				expect(getGameById.status).toBe(HttpStatus.OK)
		})
	})
})  