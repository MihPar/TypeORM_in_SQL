import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../src/app.module';
import request from 'supertest';
import { appSettings } from '../../../../src/setting';
import { PairQuizGame } from '../../../../src/pairQuizGame/domain/entity.pairQuezGame';
import { GameTypeModel } from '../../../../src/pairQuizGame/type/typeViewModel';

describe('/blogs', () => {
  let app: INestApplication;
  let server: any;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSettings(app);
    await app.init();
    server = app.getHttpServer();

    const wipeAllRes = await request(server).delete('/testing/all-data').send();
    expect(wipeAllRes.status).toBe(HttpStatus.NO_CONTENT);
  });

  afterAll(async () => {
    await app.close();
  });

  afterAll((done) => {
    done();
  });

  let userLogin: string;
  let userId: string;
  let tokenByUser: string;

  let id: string;
  let body: string;
  let correctAnswers: string[];
  let published: boolean;
  let createdAt: Date | null;
  let updatedAt: Date | null;

  let questionsInMemory: { body: string; correctAnswers: string[] }[];
  let requestBody: {
    body: string;
    correctAnswers: string[];
  };

  let updateBody: { body: string; correctAnswers: string[] }[];

  let tokenByUser2: string;
  let gameId: string;
  let game: any;
  let game2: any;
  let gameSecondPlayer: any;
  let questionGame: Array<{ id: string; body: string }>;
  let gameConnectPair: PairQuizGame;

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
        .expect(201);

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
        .send(user2)
        .expect(201);

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
      ];

      const promises = questionsInMemory.map((item) => {
        return request(server)
          .post('/sa/quiz/questions')
          .auth('admin', 'qwerty')
          .send(item);
      });

      const result = await Promise.all(promises);

      const create = result.map((item, index) => {
        expect(item.body.id).toEqual(expect.any(String));
        expect(item.body.body).toEqual(questionsInMemory[index].body);
        expect(item.body.correctAnswers).toEqual(
          questionsInMemory[index].correctAnswers,
        );
        expect(item.body.published).toBe(true);
        expect(item.body.createdAt).toEqual(expect.any(String));
        expect(item.body.updatedAt).toBe(null);
        return item.body;
      });
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

      const publishedQuestion5 = await request(server)
        .put(`/sa/quiz/questions/${create[5].id}/publish`)
        .auth('admin', 'qwerty')
        .send({ published: true });

      expect(publishedQuestion0.status).toBe(HttpStatus.NO_CONTENT);
      expect(publishedQuestion1.status).toBe(HttpStatus.NO_CONTENT);
      expect(publishedQuestion2.status).toBe(HttpStatus.NO_CONTENT);
      expect(publishedQuestion3.status).toBe(HttpStatus.NO_CONTENT);
      expect(publishedQuestion4.status).toBe(HttpStatus.NO_CONTENT);
      expect(publishedQuestion5.status).toBe(HttpStatus.NO_CONTENT);
    });

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

      gameConnectPair = connectPair.body;
      questionGame = connectPair.body.questions;
      expect(questionGame).toHaveLength(5);
      expect(connectPair.status).toBe(HttpStatus.OK);

      /**
       * добавить пять вопросов неопубликованых и проверить чтобы они не попали в игру
       */
    });

    /***************************************/

    it('get current unfinished game', async () => {
      const getUnfinishedGame = await request(server)
        .get('/pair-game-quiz/pairs/my-current')
        .set('Authorization', `Bearer ${tokenByUser}`);

      expect((getUnfinishedGame.body as GameTypeModel).questions).toEqual(
        questionGame,
      );
      expect(getUnfinishedGame.status).toBe(HttpStatus.OK);
      game = getUnfinishedGame.body;
    });

    it('get current unfinished game for second user', async () => {
      const getUnfinishedGame2 = await request(server)
        .get('/pair-game-quiz/pairs/my-current')
        .set('Authorization', `Bearer ${tokenByUser2}`);

      expect((getUnfinishedGame2.body as GameTypeModel).questions).toEqual(
        questionGame,
      );
      expect(getUnfinishedGame2.status).toBe(HttpStatus.OK);
      game2 = getUnfinishedGame2.body;
    });

    it('add correct answer by first player for first question', async () => {
      const questionOne = questionsInMemory.find((item) => {
        return item.body === questionGame[0].body;
      });
      expect(questionOne.correctAnswers[0]).toBeDefined();
      expect(questionOne.correctAnswers[0]).toEqual(expect.any(String));
      const payload1 = {
        answer: questionOne.correctAnswers[0],
      };
      const sendAnswer1 = await request(server)
        .post('/pair-game-quiz/pairs/my-current/answers')
        .set('Authorization', `Bearer ${tokenByUser}`)
        .send(payload1);

      const getGameById = await request(server)
        .get(`/pair-game-quiz/pairs/${gameId}`)
        .set('Authorization', `Bearer ${tokenByUser}`);

      expect(getGameById.status).toBe(HttpStatus.OK);

      const getCurrentGame1 = await request(server)
        .get('/pair-game-quiz/pairs/my-current')
        .set('Authorization', `Bearer ${tokenByUser}`);

      expect(getCurrentGame1.status).toBe(HttpStatus.OK);

      expect((getCurrentGame1.body as GameTypeModel).questions[0]).toEqual(
        questionGame[0],
      );
      expect((getCurrentGame1.body as GameTypeModel).id).toEqual(
        getGameById.body.id,
      );
      expect(
        (getCurrentGame1.body as GameTypeModel).firstPlayerProgress,
      ).toEqual(getGameById.body.firstPlayerProgress);

      expect(sendAnswer1.status).toBe(HttpStatus.OK);
      expect(sendAnswer1.body).toEqual({
        questionId: game.questions[0].id,
        answerStatus: 'Correct',
        addedAt: expect.any(String),
      });

      let currentGame1 = getCurrentGame1.body;
      expect(currentGame1.firstPlayerProgress.answers[0].answerStatus).toBe(
        'Correct',
      );

	  expect((getCurrentGame1.body as GameTypeModel).firstPlayerProgress.score.toString()).toBe("1")
	  expect((getCurrentGame1.body as GameTypeModel).secondPlayerProgress.score.toString()).toBe("0")
	  expect((getGameById.body as GameTypeModel).firstPlayerProgress.score.toString()).toBe("1")
	  expect((getGameById.body as GameTypeModel).secondPlayerProgress.score.toString()).toBe("0")
    });

    it('add incorrect answer second player for first question', async () => {
      const questionOne = questionsInMemory.find((item) => {
        return item.body === game.questions[0].body;
      });
      const payload2 = {
        answer: 'incorrect',
      };

      const sendAnswerUserTwo = await request(server)
        .post('/pair-game-quiz/pairs/my-current/answers')
        .set('Authorization', `Bearer ${tokenByUser2}`)
        .send(payload2);

      expect(sendAnswerUserTwo.status).toBe(HttpStatus.OK);
      expect(sendAnswerUserTwo.body).toEqual({
        questionId: game.questions[0].id,
        answerStatus: 'Incorrect',
        addedAt: expect.any(String),
      });

      const getCurrentGameUserTow = await request(server)
        .get('/pair-game-quiz/pairs/my-current')
        .set('Authorization', `Bearer ${tokenByUser2}`);

      expect(getCurrentGameUserTow.status).toBe(HttpStatus.OK);
      let currentGame = getCurrentGameUserTow.body;
      expect(currentGame.secondPlayerProgress.answers[0].answerStatus).toBe(
        'Incorrect',
      );

      // проверка, что у 1го игрока ничего не поменялось
      const getCurrentGameUser2 = await request(server)
        .get('/pair-game-quiz/pairs/my-current')
        .set('Authorization', `Bearer ${tokenByUser}`);

      expect(getCurrentGameUser2.status).toBe(HttpStatus.OK);
      let currentGameUser2 = getCurrentGameUser2.body;
      expect(currentGameUser2.secondPlayerProgress.answers[0].answerStatus).toBe(
        'Incorrect',
      );
// добавить поиск игры по айди и проверку скора
	  expect((getCurrentGameUser2.body as GameTypeModel).firstPlayerProgress.score.toString()).toBe("1")
	  expect((getCurrentGameUser2.body as GameTypeModel).secondPlayerProgress.score.toString()).toBe("0")
	//   expect((getGameById.body as GameTypeModel).firstPlayerProgress.score.toString()).toBe("1")
	//   expect((getGameById.body as GameTypeModel).secondPlayerProgress.score.toString()).toBe("0")
    });

    it('send correct answer by second palyer for second question', async () => {
      const questionTwo = questionsInMemory.find((item) => {
        return item.body === game.questions[1].body;
      });
      const payload2 = {
        answer: questionTwo.correctAnswers[0],
      };
      const sendAnswerUserTwo = await request(server)
        .post('/pair-game-quiz/pairs/my-current/answers')
        .set('Authorization', `Bearer ${tokenByUser2}`)
        .send(payload2);

      const getCurrentGameUser2 = await request(server)
        .get('/pair-game-quiz/pairs/my-current')
        .set('Authorization', `Bearer ${tokenByUser2}`);
      let currentGame2 = getCurrentGameUser2.body;
      expect(currentGame2.secondPlayerProgress.answers[1].answerStatus).toBe(
        'Correct',
      );

      expect(getCurrentGameUser2.status).toBe(HttpStatus.OK);

      expect(sendAnswerUserTwo.status).toBe(HttpStatus.OK);
      expect(sendAnswerUserTwo.body).toEqual({
        questionId: game2.questions[1].id,
        answerStatus: 'Correct',
        addedAt: expect.any(String),
      });
	//   
	expect((currentGame2.body as GameTypeModel).firstPlayerProgress.score.toString()).toBe("1")
	expect((currentGame2.body as GameTypeModel).secondPlayerProgress.score.toString()).toBe("1")
	//expect((getGameById.body as GameTypeModel).firstPlayerProgress.score.toString()).toBe("1")
	//expect((getGameById.body as GameTypeModel).secondPlayerProgress.score.toString()).toBe("0")

    });

    it('get active game by id by userOne', async () => {
      const getGameById = await request(server)
        .get(`/pair-game-quiz/pairs/${gameId}`)
        .set('Authorization', `Bearer ${tokenByUser}`);

      expect(getGameById.status).toBe(HttpStatus.OK);
      // console.log("getGameById1: ", getGameById.body.firstPlayerProgress)
      // console.log("getGameById2: ", getGameById.body.secondPlayerProgress)
    });

    it('get my current game by userOne', async () => {
      const myCurrentGame = await request(server)
        .get(`/pair-game-quiz/pairs/my-current`)
        .set('Authorization', `Bearer ${tokenByUser}`);

      expect(myCurrentGame.status).toBe(HttpStatus.OK);
    });

    it('get active game by id by userOne', async () => {
      const getGameById = await request(server)
        .get(`/pair-game-quiz/pairs/${gameId}`)
        .set('Authorization', `Bearer ${tokenByUser2}`);

      expect(getGameById.status).toBe(HttpStatus.OK);
      // console.log("getGameById1: ", getGameById.body.firstPlayerProgress)
      // console.log("getGameById2: ", getGameById.body.secondPlayerProgress)
    });

    it('get my current game by userTwo', async () => {
      const myCurrentGame = await request(server)
        .get(`/pair-game-quiz/pairs/my-current`)
        .set('Authorization', `Bearer ${tokenByUser2}`);

      expect(myCurrentGame.status).toBe(HttpStatus.OK);
    });
  });
});
