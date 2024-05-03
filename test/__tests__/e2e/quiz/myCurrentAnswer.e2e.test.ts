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
        // {
        //   body: 'Where are you from?',
        //   correctAnswers: ['New York', 'NewYork'],
        // },
        // {
        //   body: 'What is your profession?',
        //   correctAnswers: ['developer', 'backend developer'],
        // },
        // {
        //   body: 'What is your programmer`s language?',
        //   correctAnswers: ['JavaScript', 'javascript'],
        // },
      ]
	//   .sort((a: any, b: any) => {return a.body - b.body});

      const promises = question.map((item, index) => {
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

        expect(publishedQuestion0.status).toBe(HttpStatus.NO_CONTENT);
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
		//   console.log("connectPair: ", connectPair.body.questions)
		  questionGame = connectPair.body.questions
		expect(connectPair.status).toBe(HttpStatus.OK);
	  });

	  // first player

    it('get current unfinished game first player', async () => {
      const getUnfinishedGame = await request(server)
        .get('/pair-game-quiz/pairs/my-current')
        .set('Authorization', `Bearer ${tokenByUser}`);

      expect(getUnfinishedGame.status).toBe(HttpStatus.OK);
      game = getUnfinishedGame.body;
	//    console.log('game: ', game.questions)
    });

    it('send answer for first question', async () => {
		const questionForCorrectAnswer = question.find((item) => {
			return item.body === questionGame[0].body
		})
      const payload = {
		answer: questionForCorrectAnswer.correctAnswers[0]
      };

	  const sendAnswer0 = await request(server)
        .post('/pair-game-quiz/pairs/my-current/answers')
        .set('Authorization', `Bearer ${tokenByUser}`)
        .send(payload);

		const getCurrentGame = await request(server)
        .get('/pair-game-quiz/pairs/my-current')
        .set('Authorization', `Bearer ${tokenByUser}`);

      expect(getCurrentGame.status).toBe(HttpStatus.OK);
      let currentGame = getCurrentGame.body;
	//   console.log('currentGame: ', currentGame.questions)

      expect(sendAnswer0.status).toBe(HttpStatus.OK);
      expect(sendAnswer0.body).toEqual({
        questionId: game.questions[0].id,
        answerStatus: 'Correct',
        addedAt: expect.any(String),
      });
    });
    // it('send current answer for second question', async () => {
	// 	const questionForCorrectAnswer = question.find((item) => {
	// 		return item.body === questionGame[1].body
	// 	})
    //   const payload = {
	// 	answer: questionForCorrectAnswer.correctAnswers[1]
    //   };
    //   const sendAnswer1 = await request(server)
    //     .post('/pair-game-quiz/pairs/my-current/answers')
    //     .set('Authorization', `Bearer ${tokenByUser}`)
    //     .send(payload);

    //   expect(sendAnswer1.status).toBe(HttpStatus.OK);
    //   expect(sendAnswer1.body).toEqual({
    //     questionId: game.questions[1].id,
    //     answerStatus: 'Correct',
    //     addedAt: expect.any(String),
    //   });
    // });
	// it('send current answer for third question', async () => {
	// 	const questionForCorrectAnswer = question.find((item) => {
	// 		return item.body === questionGame[2].body
	// 	})
    //   const payload = {
	// 	answer: questionForCorrectAnswer.correctAnswers[0]
    //   };
	// 	const sendAnswer2 = await request(server)
	// 	  .post('/pair-game-quiz/pairs/my-current/answers')
	// 	  .set('Authorization', `Bearer ${tokenByUser}`)
	// 	  .send(payload);
  
	// 	expect(sendAnswer2.status).toBe(HttpStatus.OK);
	// 	expect(sendAnswer2.body).toEqual({
	// 	  questionId: game.questions[2].id,
	// 	  answerStatus: 'Correct',
	// 	  addedAt: expect.any(String),
	// 	});
	//   });
	// it('send current answer for four question', async () => {
	// 	const questionForCorrectAnswer = question.find((item) => {
	// 		return item.body === questionGame[3].body
	// 	})
	// 	const payload = {
	// 		answer: questionForCorrectAnswer.correctAnswers[1]
	// 	};
    //   const sendAnswer3 = await request(server)
    //     .post('/pair-game-quiz/pairs/my-current/answers')
    //     .set('Authorization', `Bearer ${tokenByUser}`)
    //     .send(payload);

    //   expect(sendAnswer3.status).toBe(HttpStatus.OK);
    //   expect(sendAnswer3.body).toEqual({
    //     questionId: game.questions[3].id,
    //     answerStatus: 'Correct',
    //     addedAt: expect.any(String),
    //   });
    // });
	// it('send current answer for fith question', async () => {
	// 	const questionForCorrectAnswer = question.find((item) => {
	// 		return item.body === questionGame[4].body
	// 	})
	// 	const payload = {
	// 		answer: questionForCorrectAnswer.correctAnswers[1]
	// 	};
	// 	const sendAnswer4 = await request(server)
	// 	  .post('/pair-game-quiz/pairs/my-current/answers')
	// 	  .set('Authorization', `Bearer ${tokenByUser}`)
	// 	  .send(payload);
  
	// 	expect(sendAnswer4.status).toBe(HttpStatus.OK);
	// 	expect(sendAnswer4.body).toEqual({
	// 	  questionId: game.questions[4].id,
	// 	  answerStatus: 'Correct',
	// 	  addedAt: expect.any(String),
	// 	});
	//   });

	//   // second player

	//   it('get current unfinished game second player', async () => {
	// 	const getUnfinishedGame = await request(server)
	// 	  .get('/pair-game-quiz/pairs/my-current')
	// 	  .set('Authorization', `Bearer ${tokenByUser2}`);

		  
	// 	//   console.log("getUnfinishedGame: ", getUnfinishedGame.body)
  
	// 	expect(getUnfinishedGame.status).toBe(HttpStatus.OK);
	// 	gameSecondPlayer = getUnfinishedGame.body;
	//   });
  
	//   it('send answer for first question', async () => {
	// 	const questionForCorrectAnswer = question.find((item) => {
	// 		return item.body === game.questions[0].body
	// 	})
	// 	const payload = {
	// 		answer: questionForCorrectAnswer.correctAnswers[0]
	// 	};

	// 	const sendAnswer0 = await request(server)
	// 	  .post('/pair-game-quiz/pairs/my-current/answers')
	// 	  .set('Authorization', `Bearer ${tokenByUser2}`)
	// 	  .send(payload);
  
	// 	expect(sendAnswer0.status).toBe(HttpStatus.OK);
	// 	expect(sendAnswer0.body).toEqual({
	// 	  questionId: gameSecondPlayer.questions[0].id,
	// 	  answerStatus: 'Correct',
	// 	  addedAt: expect.any(String),
	// 	});
	//   });
	//   it('send current answer for second question', async () => {
	// 	const questionForCorrectAnswer = question.find((item) => {
	// 		return item.body === game.questions[1].body
	// 	})
	// 	const payload = {
	// 		answer: questionForCorrectAnswer.correctAnswers[1]
	// 	};
	// 	const sendAnswer1 = await request(server)
	// 	  .post('/pair-game-quiz/pairs/my-current/answers')
	// 	  .set('Authorization', `Bearer ${tokenByUser2}`)
	// 	  .send(payload);
  
	// 	expect(sendAnswer1.status).toBe(HttpStatus.OK);
	// 	expect(sendAnswer1.body).toEqual({
	// 	  questionId: gameSecondPlayer.questions[1].id,
	// 	  answerStatus: 'Correct',
	// 	  addedAt: expect.any(String),
	// 	});
	//   });
	//   it('send current answer for third question', async () => {
	// 	const questionForCorrectAnswer = question.find((item) => {
	// 		return item.body === game.questions[2].body
	// 	})
	// 	const payload = {
	// 		answer: questionForCorrectAnswer.correctAnswers[1]
	// 	};
	// 	  const sendAnswer2 = await request(server)
	// 		.post('/pair-game-quiz/pairs/my-current/answers')
	// 		.set('Authorization', `Bearer ${tokenByUser2}`)
	// 		.send(payload);
	
	// 	  expect(sendAnswer2.status).toBe(HttpStatus.OK);
	// 	  expect(sendAnswer2.body).toEqual({
	// 		questionId: gameSecondPlayer.questions[2].id,
	// 		answerStatus: 'Correct',
	// 		addedAt: expect.any(String),
	// 	  });
	// 	});
	// 	it('send current answer for four question', async () => {
	// 		const questionForCorrectAnswer = question.find((item) => {
	// 			return item.body === game.questions[3].body
	// 		})
	// 		const payload = {
	// 			answer: questionForCorrectAnswer.correctAnswers[1]
	// 		};
	// 	const sendAnswer3 = await request(server)
	// 	  .post('/pair-game-quiz/pairs/my-current/answers')
	// 	  .set('Authorization', `Bearer ${tokenByUser2}`)
	// 	  .send(payload);
  
	// 	expect(sendAnswer3.status).toBe(HttpStatus.OK);
	// 	expect(sendAnswer3.body).toEqual({
	// 	  questionId: gameSecondPlayer.questions[3].id,
	// 	  answerStatus: 'Correct',
	// 	  addedAt: expect.any(String),
	// 	});
	//   });
	//   it('send current answer for fith question', async () => {
	// 	const questionForCorrectAnswer = question.find((item) => {
	// 		return item.body === game.questions[4].body
	// 	})
	// 	const payload = {
	// 		answer: questionForCorrectAnswer.correctAnswers[1]
	// 	};
	// 	  const sendAnswer4 = await request(server)
	// 		.post('/pair-game-quiz/pairs/my-current/answers')
	// 		.set('Authorization', `Bearer ${tokenByUser2}`)
	// 		.send(payload);
	
	// 	  expect(sendAnswer4.status).toBe(HttpStatus.OK);
	// 	  expect(sendAnswer4.body).toEqual({
	// 		questionId: gameSecondPlayer.questions[4].id,
	// 		answerStatus: 'Correct',
	// 		addedAt: expect.any(String),
	// 	  });
	// 	});
  });
})  