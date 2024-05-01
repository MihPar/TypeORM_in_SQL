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

	let question: {body: string, correctAnswers: string[]}[]
	let requestBody: {
		body: string,
		correctAnswers: string[]
	}

	let updateBody: {body: string, correctAnswers: string[]}[]

	let tokenByUser2: string
	let gameId: string
	let game: any
	let gameSecondPlayer: any
	let questionGame: Array<{id: string, body: string}>

	describe('Quiz question', () => {
    it('Create first player', async () => {
      /************* create user1 *******/
      const user = {
        login: '1Mickle',
        password: '1qwerty',
        email: '1mpara7473@gmail.com',
      };

      const createUser = await request(server)
        .post(`/sa/users`)
        .auth('admin', 'qwerty')
        .send(user);

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

	  /************* create user2 *******/

	  const user2 = {
        login: 'Iliy',
        password: 'qwerty',
        email: 'mpara7473@gmail.com',
      };

      const createUser2 = await request(server)
        .post(`/sa/users`)
        .auth('admin', 'qwerty')
        .send(user2);

      userLogin = createUser2.body.login;
      userId = createUser2.body.id;

      expect(createUser.body).toStrictEqual({
        id: expect.any(String),
        login: user.login,
        email: user.email,
        createdAt: expect.any(String),
      });
      const createAccessToken2 = await request(server).post('/auth/login').send({
        loginOrEmail: user2.login,
        password: user2.password,
      });

      tokenByUser2 = createAccessToken2.body.accessToken;
      expect(createAccessToken2.status).toBe(HttpStatus.OK);
      expect(createAccessToken2.body).toEqual({
        accessToken: expect.any(String),
      });
    });
    });


	it('create connection', async () => {
		const createPair = await request(server)
		  .post('/pair-game-quiz/pairs/connection')
		  .set('Authorization', `Bearer ${tokenByUser}`);
  
		expect(createPair.status).toBe(HttpStatus.OK);
		gameId = createPair.body.id;
		expect(createPair.body.id).toEqual(expect.any(String));
  
		const connectPair = await request(server)
		  .post('/pair-game-quiz/pairs/connection')
		  .set('Authorization', `Bearer ${tokenByUser2}`);
		questionGame = connectPair.body.questions
		expect(connectPair.status).toBe(HttpStatus.OK);
	  });


    it('get game by id', async () => {
      const getGameById = await request(server)
        .get(`/pair-game-quiz/pairs/${gameId}`)
        .set('Authorization', `Bearer ${tokenByUser}`);

      expect(getGameById.status).toBe(HttpStatus.OK);
    });

	it('return unfinished game', async() => {
		const getUnfinishedGame = await request(server)
		   .get('/pair-game-quiz/pairs/my-current')
		   .set('Authorization', `Bearer ${tokenByUser}`);
   
		   expect(getUnfinishedGame.status).toBe(HttpStatus.OK)
	 })

  });

  