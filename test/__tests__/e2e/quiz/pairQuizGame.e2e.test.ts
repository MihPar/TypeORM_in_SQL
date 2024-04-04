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

	  const wipeAllRes = await request(server).delete("/testing/all-data").send();
	  expect(wipeAllRes.status).toBe(HttpStatus.NO_CONTENT);
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

	let tokenByUser2: string
	let gameId: string

	describe('Quiz question', () => {
		it("Connect with existing player or to create new pair which will be waiting second player", async () => {
			/************* create user1 *******/
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

		/********** create user2 ****************/
		it('create second user', async () => {
			const user2 = {
				login: "Iliy",
				password: "qwerty",
				email: "mpara7473@gmail.com",
			}

		const createUser2 = await request(server)
				.post(`/sa/users`)
				.auth("admin", "qwerty")
				.send(user2);

			const createAccessToken2 = await request(server)
			  .post("/auth/login")
			  .send({
				loginOrEmail: user2.login,
				password: user2.password,
			  });
			  expect(createAccessToken2.body.accessToken).toEqual(expect.any(String))
			  tokenByUser2 = createAccessToken2.body.accessToken;
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
			  body: 'How many fingers in our hand?',
			  correctAnswers: [
				'five',
				'5',
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
			  published: false,
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
				body: 'How many hair in your heand?',
				correctAnswers: [
				  'many',
				  'million',
				  '1000000'
				],
			  };
			const updateQuestion = await request(server)
				.put(`/sa/quiz/questions/${id}`)
				.auth('admin', 'qwerty')
				.send(updateBody)
	
			expect(updateQuestion.status).toBe(HttpStatus.NO_CONTENT)
		})

		// it("get my current unfinished game", async() => {
		// 	const getUnfinishedGame = await request(server)
		// 		.get('/pair-game-quiz/pairs/my-current')
		// 		.set("Authorization", `Bearer ${tokenByUser}`)

		// 		expect(getUnfinishedGame.status).toBe(HttpStatus.OK)
		// })

		
		 
		it("create connection", async() => {
			const createPair = await request(server)
				.post('/pair-game-quiz/pairs/connection')
				.set("Authorization", `Bearer ${tokenByUser}`)

				expect(createPair.status).toBe(HttpStatus.OK)
				gameId = createPair.body.id
				expect(createPair.body.id).toEqual(expect.any(String))
				console.log("createPair: ", createPair.body)

			const connectPair = await request(server)
				.post('/pair-game-quiz/pairs/connection')
				.set("Authorization", `Bearer ${tokenByUser2}`)
				expect(connectPair.status).toBe(HttpStatus.OK)
		})
	  

		it("get game by id", async() => {
			const getGameById = await request(server)
				.get(`/pair-game-quiz/pairs/${gameId}`)
				.set("Authorization", `Bearer ${tokenByUser}`)

				expect(getGameById.status).toBe(HttpStatus.OK)
		})
	})
})  