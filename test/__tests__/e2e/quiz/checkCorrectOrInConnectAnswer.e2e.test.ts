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
	let game2: any
	let gameSecondPlayer: any
	let questionGame: Array<{id: string, body: string}>

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
    });

    /********** create user2 ****************/
    it('create second user', async () => {
      const user2 = {
        login: 'Iliy',
        password: 'qwerty',
        email: 'mpara7473@gmail.com',
      };

      const createUser2 = await request(server)
        .post(`/sa/users`)
        .auth('admin', 'qwerty')
        .send(user2);

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
      question = [
        {
          body: 'What is your name?',
          correctAnswers: ['Mickle', 'Mike'],
        },
        {
          body: 'How old are you?',
          correctAnswers: ['five', '5'],
        },
        {
          body: 'Where are you from?',
          correctAnswers: ['New York', 'NewYork'],
        },
        {
          body: 'What is your profession?',
          correctAnswers: ['developer', 'backend developer'],
        },
        {
          body: 'What is your programmer`s language?',
          correctAnswers: ['JavaScript', 'javascript'],
        },
      ]

      const promises = question.map((item) => {
        return request(server)
          .post('/sa/quiz/questions')
          .auth('admin', 'qwerty')
          .send(item);
		});

	const result = await Promise.all(promises)

	const create = result.map((item, index) => {
		expect(item.body.id).toEqual(expect.any(String));
        expect(item.body.body).toEqual(question[index].body);
        expect(item.body.correctAnswers).toEqual(question[index].correctAnswers);
        expect(item.body.published).toBe(true);
        expect(item.body.createdAt).toEqual(item.body.createdAt);
        expect(item.body.updatedAt).toBe(null);
		return item.body
	})

	const publishedQuestion0 = await request(server)
		.put(`/sa/quiz/questions/${create[0].id}/publish`)
		.auth('admin', 'qwerty')
		.send({ published: true });

		const publishedQuestion1 = await request(server)
		.put(`/sa/quiz/questions/${create[1].id}/publish`)
		.auth('admin', 'qwerty')
		.send({ published: true });

  expect(publishedQuestion0.status).toBe(HttpStatus.NO_CONTENT);
  expect(publishedQuestion1.status).toBe(HttpStatus.NO_CONTENT);
    })

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

	  /***************************************/

	  it('get current unfinished game', async () => {
		const getUnfinishedGame = await request(server)
		  .get('/pair-game-quiz/pairs/my-current')
		  .set('Authorization', `Bearer ${tokenByUser}`);
  
		expect(getUnfinishedGame.status).toBe(HttpStatus.OK);
		game = getUnfinishedGame.body;
	  });
  
	  it('get current unfinished game for second user', async () => {
		  const getUnfinishedGame2 = await request(server)
			.get('/pair-game-quiz/pairs/my-current')
			.set('Authorization', `Bearer ${tokenByUser2}`);
	
		  expect(getUnfinishedGame2.status).toBe(HttpStatus.OK);
		  game2 = getUnfinishedGame2.body
	  });

    
    it('send correct answer for first question first player', async () => {
		/** 1 **/
		const questionOne = question.find((item) => {
			return item.body === questionGame[0].body
		})
      const payload1 = {
		answer: questionOne.correctAnswers[0]
      };
	  const sendAnswer1 = await request(server)
        .post('/pair-game-quiz/pairs/my-current/answers')
        .set('Authorization', `Bearer ${tokenByUser}`)
        .send(payload1);

		const getCurrentGame1 = await request(server)
        .get('/pair-game-quiz/pairs/my-current')
        .set('Authorization', `Bearer ${tokenByUser}`);

      expect(getCurrentGame1.status).toBe(HttpStatus.OK);
      let currentGame1 = getCurrentGame1.body;


      expect(sendAnswer1.status).toBe(HttpStatus.OK);
      expect(sendAnswer1.body).toEqual({
        questionId: game.questions[0].id,
        answerStatus: 'Correct',
        addedAt: expect.any(String),
      });
    });

    it('send incorrect answer for first question second player', async () => {
	/*2*/
	const questionTwo = question.find((item) => {
		return item.body === game.questions[0].body
	})
	const payload2 = {
		answer: questionTwo.correctAnswers[5]
	};

	const sendAnswer2 = await request(server)
	  .post('/pair-game-quiz/pairs/my-current/answers')
	  .set('Authorization', `Bearer ${tokenByUser2}`)
	  .send(payload2);

	//   const getCurrentGame2 = await request(server)
	//   .get('/pair-game-quiz/pairs/my-current')
	//   .set('Authorization', `Bearer ${tokenByUser2}`);

	// expect(getCurrentGame2.status).toBe(HttpStatus.OK);
	// let currentGame2 = getCurrentGame2.body;

	expect(sendAnswer2.status).toBe(HttpStatus.OK);
	expect(sendAnswer2.body).toEqual({
		questionId: game.questions[0].id,
		answerStatus: 'InCorrect',
		addedAt: expect.any(String),
	  });
    });

	it('send correct answer for second question by second palyer', async () => {
		/*2*/
		const questionTwo = question.find((item) => {
			return item.body === game.questions[1].body
		})
		const payload2 = {
			answer: questionTwo.correctAnswers[0]
		};
	// console.log("payload2: ", payload2)
		const sendAnswer2 = await request(server)
		  .post('/pair-game-quiz/pairs/my-current/answers')
		  .set('Authorization', `Bearer ${tokenByUser2}`)
		  .send(payload2);
	
		  const getCurrentGame2 = await request(server)
		  .get('/pair-game-quiz/pairs/my-current')
		  .set('Authorization', `Bearer ${tokenByUser2}`);
	
		expect(getCurrentGame2.status).toBe(HttpStatus.OK);
		// let currentGame2 = getCurrentGame2.body;
		// console.log('currentGame: ', currentGame2.questions)
	
		expect(sendAnswer2.status).toBe(HttpStatus.OK);
		expect(sendAnswer2.body).toEqual({
		  questionId: game2.questions[1].id,
		  answerStatus: 'Correct',
		  addedAt: expect.any(String),
		});
	  });
  });
})  