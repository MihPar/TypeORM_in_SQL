import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../../src/app.module";
import request from "supertest";
import { appSettings } from "../../../../src/setting";
import { PairQuizGame } from "../../../../src/pairQuizGame/domain/entity.pairQuezGame";
import { GameTypeModel } from "../../../../src/pairQuizGame/type/typeViewModel";
import { PaginationType } from "../../../../src/types/pagination.types";

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
  
	let userLogin: string
	let userId: string
	let tokenByUser: string

	let id: string
	let body: string
	let correctAnswers: string[]
	let published: boolean
	let createdAt: Date | null
	let updatedAt: Date | null

	let questionsInMemory: {body: string, correctAnswers: string[]}[]
	let requestBody: {
		body: string,
		correctAnswers: string[]
	}

	let updateBody: {body: string, correctAnswers: string[]}[]

	let tokenByUser2: string
	let gameId: string
	let game: any
	let game2: any
	let gameSecondPlayer: any
	let questionGame: Array<{id: string, body: string}>
	let gameConnectPair: PairQuizGame
	let tokenByUser3: string
	let tokenByUser4: string
	let user2: {
		login: string,
        password: string,
        email: string
	}

	describe('Quiz question', () => {
    it('create first player', async () => {
      /************* create user1 *******/
      const user = {
        login: '1Mickle',
        password: '1qwerty',
        email: '1mpara7473@gmail.com',
      };

      const createUser = await request(server)
        .post(`/sa/users`)
        .auth('admin', 'qwerty')
        .send(user)
		.expect(201)

      userLogin = createUser.body.login;
      userId = createUser.body.id;

      expect(createUser.body).toStrictEqual({
        id: expect.any(String),
        login: user.login,
        email: user.email,
        createdAt: expect.any(String),
      });
      const createAccessToken = await request(server).post('/auth/login').send({
        loginOrEmail: user.login,
        password: user.password,
      });

      tokenByUser = createAccessToken.body.accessToken;
      expect(createAccessToken.status).toBe(HttpStatus.OK);
      expect(createAccessToken.body).toEqual({
        accessToken: expect.any(String),
      });
    });

    /********** create user2 ****************/
    it('create second user', async () => {
       user2 = {
        login: 'Iliy',
        password: 'qwerty',
        email: 'mpara7473@gmail.com',
      };

      const createUser2 = await request(server)
        .post(`/sa/users`)
        .auth('admin', 'qwerty')
        .send(user2)
		.expect(201)

      const createAccessToken2 = await request(server)
        .post('/auth/login')
        .send({
          loginOrEmail: user2.login,
          password: user2.password,
        });
      expect(createAccessToken2.body.accessToken).toEqual(expect.any(String));
      tokenByUser2 = createAccessToken2.body.accessToken;
    });

    it('create questions', async () => {
      questionsInMemory = [
        {
          body: 'What is your name?',
          correctAnswers: ['Mickle'],
        },
        {
          body: 'How old are you?',
          correctAnswers: ['five'],
        },
        {
          body: 'Where are you from?',
          correctAnswers: ['New York'],
        },
        {
          body: 'What is your profession?',
          correctAnswers: ['developer'],
        },
        {
          body: 'What is your programmer`s language?',
          correctAnswers: ['JavaScript'],
        },
		{
			body: 'What is our language?',
			correctAnswers: ['Russia'],
		  },
      ]

      const promises = questionsInMemory.map((item) => {
        return request(server)
          .post('/sa/quiz/questions')
          .auth('admin', 'qwerty')
          .send(item);
		});

	const result = await Promise.all(promises)

	const create = result.map((item, index) => {
		expect(item.body.id).toEqual(expect.any(String));
        expect(item.body.body).toEqual(questionsInMemory[index].body);
        expect(item.body.correctAnswers).toEqual(questionsInMemory[index].correctAnswers);
        expect(item.body.published).toBe(true);
        expect(item.body.createdAt).toEqual(expect.any(String));
        expect(item.body.updatedAt).toBe(null);
		return item.body
	})
	// TODO лучше через мап
	const publishedQuestion0 = await request(server)
		.put(`/sa/quiz/questions/${create[0].id}/publish`)
		.auth('admin', 'qwerty')
		.send({ published: true });

	const publishedQuestion1 = await request(server)
		.put(`/sa/quiz/questions/${create[1].id}/publish`)
		.auth('admin', 'qwerty')
		.send({ published: true });

	const publishedQuestion2 = await request(server)
		.put(`/sa/quiz/questions/${create[2].id}/publish`)
		.auth('admin', 'qwerty')
		.send({ published: true });

	const publishedQuestion3 = await request(server)
		.put(`/sa/quiz/questions/${create[3].id}/publish`)
		.auth('admin', 'qwerty')
		.send({ published: true });

	const publishedQuestion4 = await request(server)
		.put(`/sa/quiz/questions/${create[4].id}/publish`)
		.auth('admin', 'qwerty')
		.send({ published: true });

  expect(publishedQuestion0.status).toBe(HttpStatus.NO_CONTENT);
  expect(publishedQuestion1.status).toBe(HttpStatus.NO_CONTENT);
  expect(publishedQuestion2.status).toBe(HttpStatus.NO_CONTENT);
  expect(publishedQuestion3.status).toBe(HttpStatus.NO_CONTENT);
  expect(publishedQuestion4.status).toBe(HttpStatus.NO_CONTENT);
    })

	it('create connection', async () => {
		const createPair = await request(server)
		  .post('/pair-game-quiz/pairs/connection')
		  .set('Authorization', `Bearer ${tokenByUser}`);
		expect(createPair.status).toBe(HttpStatus.OK);
		gameId = createPair.body.id;

		// console.warn(createPair.body)

		expect(createPair.body.id).toEqual(expect.any(String));

		const connectPair = await request(server)
		  .post('/pair-game-quiz/pairs/connection')
		  .set('Authorization', `Bearer ${tokenByUser2}`);

		gameConnectPair = connectPair.body
		questionGame = connectPair.body.questions
		expect(questionGame).toHaveLength(5)
		expect(connectPair.status).toBe(HttpStatus.OK);
	  });

	  /***************************************/

	  it('get current unfinished game', async () => {
		const getUnfinishedGame = await request(server)
		  .get('/pair-game-quiz/pairs/my-current')
		  .set('Authorization', `Bearer ${tokenByUser}`);
		
		expect((getUnfinishedGame.body as GameTypeModel).questions).toEqual(questionGame)
		expect(getUnfinishedGame.status).toBe(HttpStatus.OK);
		game = getUnfinishedGame.body;
	  });
  
	  it('get current unfinished game for second user', async () => {
		  const getUnfinishedGame2 = await request(server)
			.get('/pair-game-quiz/pairs/my-current')
			.set('Authorization', `Bearer ${tokenByUser2}`);
	
		expect((getUnfinishedGame2.body as GameTypeModel).questions).toEqual(questionGame)
		  expect(getUnfinishedGame2.status).toBe(HttpStatus.OK);
		  game2 = getUnfinishedGame2.body
	  });

	  it('get all games of user', async () => {
		const getAllGames = await request(server)
			.get(`/pair-game-quiz/pairs/my`)
			.set(`Authorization`, `Bearer ${tokenByUser}`)

			console.log("getAllGames: ", getAllGames.body)

			expect(getAllGames.status).toBe(HttpStatus.OK)
			expect((getAllGames.body as PaginationType<GameTypeModel>).items.map(item => item.firstPlayerProgress)).toEqual([game.firstPlayerProgress])
	  })

	  it('create first player', async () => {
		/************* create user3 *******/
		const user3 = {
		  login: 'Leonid',
		  password: 'qwerty3',
		  email: '3mpara7473@gmail.com',
		};
  
		const createUser3 = await request(server)
		  .post(`/sa/users`)
		  .auth('admin', 'qwerty')
		  .send(user3)
		  .expect(201)
  
		userLogin = createUser3.body.login;
		userId = createUser3.body.id;
  
		expect(createUser3.body).toStrictEqual({
		  id: expect.any(String),
		  login: user3.login,
		  email: user3.email,
		  createdAt: expect.any(String),
		});
		const createAccessToken = await request(server).post('/auth/login').send({
		  loginOrEmail: user3.login,
		  password: user3.password,
		});
  
		tokenByUser3 = createAccessToken.body.accessToken;
		expect(createAccessToken.status).toBe(HttpStatus.OK);
		expect(createAccessToken.body).toEqual({
		  accessToken: expect.any(String),
		});
	  });
  
	  /********** create user4 ****************/
	  it('create second user', async () => {
		const user4 = {
		  login: 'Boris',
		  password: 'qwerty4',
		  email: '4mpara7473@gmail.com',
		};
  
		const createUser4 = await request(server)
		  .post(`/sa/users`)
		  .auth('admin', 'qwerty')
		  .send(user4)
		  .expect(201)
  
		const createAccessToken4= await request(server)
		  .post('/auth/login')
		  .send({
			loginOrEmail: user2.login,
			password: user2.password,
		  });
		expect(createAccessToken4.body.accessToken).toEqual(expect.any(String));
		tokenByUser4 = createAccessToken4.body.accessToken;
	  });
  
	  it('create questions', async () => {
		questionsInMemory = [
		  {
			body: 'What is your name?',
			correctAnswers: ['Mickle'],
		  },
		  {
			body: 'How old are you?',
			correctAnswers: ['five'],
		  },
		  {
			body: 'Where are you from?',
			correctAnswers: ['New York'],
		  },
		  {
			body: 'What is your profession?',
			correctAnswers: ['developer'],
		  },
		  {
			body: 'What is your programmer`s language?',
			correctAnswers: ['JavaScript'],
		  },
		  {
			  body: 'What is our language?',
			  correctAnswers: ['Russia'],
			},
		]
  
		const promises = questionsInMemory.map((item) => {
		  return request(server)
			.post('/sa/quiz/questions')
			.auth('admin', 'qwerty')
			.send(item);
		  });
  
	  const result = await Promise.all(promises)
  
	  const create = result.map((item, index) => {
		  expect(item.body.id).toEqual(expect.any(String));
		  expect(item.body.body).toEqual(questionsInMemory[index].body);
		  expect(item.body.correctAnswers).toEqual(questionsInMemory[index].correctAnswers);
		  expect(item.body.published).toBe(true);
		  expect(item.body.createdAt).toEqual(expect.any(String));
		  expect(item.body.updatedAt).toBe(null);
		  return item.body
	  })
	  // TODO лучше через мап
	  const publishedQuestion0 = await request(server)
		  .put(`/sa/quiz/questions/${create[0].id}/publish`)
		  .auth('admin', 'qwerty')
		  .send({ published: true });
  
	  const publishedQuestion1 = await request(server)
		  .put(`/sa/quiz/questions/${create[1].id}/publish`)
		  .auth('admin', 'qwerty')
		  .send({ published: true });
  
	  const publishedQuestion2 = await request(server)
		  .put(`/sa/quiz/questions/${create[2].id}/publish`)
		  .auth('admin', 'qwerty')
		  .send({ published: true });
  
	  const publishedQuestion3 = await request(server)
		  .put(`/sa/quiz/questions/${create[3].id}/publish`)
		  .auth('admin', 'qwerty')
		  .send({ published: true });
  
	  const publishedQuestion4 = await request(server)
		  .put(`/sa/quiz/questions/${create[4].id}/publish`)
		  .auth('admin', 'qwerty')
		  .send({ published: true });
  
	expect(publishedQuestion0.status).toBe(HttpStatus.NO_CONTENT);
	expect(publishedQuestion1.status).toBe(HttpStatus.NO_CONTENT);
	expect(publishedQuestion2.status).toBe(HttpStatus.NO_CONTENT);
	expect(publishedQuestion3.status).toBe(HttpStatus.NO_CONTENT);
	expect(publishedQuestion4.status).toBe(HttpStatus.NO_CONTENT);
	  })
  
	  it('create connection two game', async () => {
		  const createPair = await request(server)
			.post('/pair-game-quiz/pairs/connection')
			.set('Authorization', `Bearer ${tokenByUser3}`);
		  expect(createPair.status).toBe(HttpStatus.OK);
		  gameId = createPair.body.id;
  
		  // console.warn(createPair.body)
  
		  expect(createPair.body.id).toEqual(expect.any(String));
  
		  const connectPair = await request(server)
			.post('/pair-game-quiz/pairs/connection')
			.set('Authorization', `Bearer ${tokenByUser4}`);
  
		  gameConnectPair = connectPair.body
		  questionGame = connectPair.body.questions
		//   expect(questionGame).toHaveLength(5)
		console.log("two game: ", connectPair.body)
		  expect(connectPair.status).toBe(HttpStatus.OK);
		});
  });
})  