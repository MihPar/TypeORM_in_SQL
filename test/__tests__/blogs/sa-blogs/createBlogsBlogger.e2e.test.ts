import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../src/app.module';
import request from 'supertest';
import { appSettings } from '../../../../src/setting';
import { PairQuizGame } from '../../../../src/pairQuizGame/domain/entity.pairQuezGame';
import {
  GameTypeModel,
  PlayerStatisticsView,
} from '../../../../src/pairQuizGame/type/typeViewModel';
import { PaginationType } from '../../../../src/types/pagination.types';
import {
  createAddUser,
  createQuestionsAndPublished,
  createToken,
  findAllGames,
  findGameById,
  sendAnswers,
  sendAnswersFirstPlayer,
  sendAnswersSecondPlayer,
  toCreatePair,
} from '../../../../src/helpers/helpers';
import { questionsInMemory } from '../../../../src/helpers/questionMemory';
import { GameStatusEnum } from '../../../../src/pairQuizGame/enum/enumPendingPlayer';
import { delay } from 'rxjs';
import { BodyBlogsModel } from '../../../../src/blogsForSA/dto/blogs.class-pipe';
import e from 'express';
import { BlogsViewWithBanType } from '../../../../src/blogs/blogs.type';

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

  // eslint-disable-next-line prefer-const
  let user1Creds = {
    login: '1Mickle',
    password: '1qwerty',
    email: '1mpara7473@gmail.com',
  };
  // eslint-disable-next-line prefer-const
  let user2Creds = {
    login: 'Boris',
    password: '2qwerty',
    email: '2mpara7473@gmail.com',
  };
  // eslint-disable-next-line prefer-const
  let user3Creds = {
    login: 'Alex',
    password: '3qwerty',
    email: '3mpara7473@gmail.com',
  };
  // eslint-disable-next-line prefer-const
  let user4Creds = {
    login: 'Pet',
    password: '4qwerty',
    email: '4mpara7473@gmail.com',
  };

  let user1Token: string;
  let user2Token: string;
  let user3Token: string;
  let user4Token: string;

  let connectOneAndTwo: GameTypeModel;
  let connectThreeAndFour: GameTypeModel;
  let connectThreeAndOne: GameTypeModel;

  let requestBody: {
    body: string;
    correctAnswers: string[];
  };
  let answer: {
    questionId: string;
    answerStatus: string;
    addedAt: string;
  };
  let firstGame: any;
  let secondGame: any;
  let firdGame: any;
  let fourthGame: any;
  let fivethGame: any;
  let sixthGame: any;
  let seventhGame: any;

  let sendAnswerByFirstGame: any;
  let sendAnswerBySecondGame: any;

  describe('some description', () => {
    it('creting users in db', async () => {
      expect(server).toBeDefined();
      const userOne = await createAddUser(server, user1Creds);
	//   console.log(userOne.body)
    //   await createAddUser(server, user2Creds);
    //   await createAddUser(server, user3Creds);
    //   await createAddUser(server, user4Creds);
    });

    it('logining users in db', async () => {
      user1Token = (
        await createToken(server, user1Creds.login, user1Creds.password)
      ).body.accessToken;

	//   console.log("user1Token: ", user1Token)

    //   user2Token = (
    //     await createToken(server, user2Creds.login, user2Creds.password)
    //   ).body.accessToken;

    //   user3Token = (
    //     await createToken(server, user3Creds.login, user3Creds.password)
    //   ).body.accessToken;

    //   user4Token = (
    //     await createToken(server, user4Creds.login, user4Creds.password)
    //   ).body.accessToken;
    });

    it("create blogs from blogger", async() => {
		const inputDateModel: BodyBlogsModel = {
				name: "Mickle",
		        description: "I am a programmer",
		        websiteUrl: "https://google.com"
			}
		const createBlogBlogger = await request(server)
			.post("/blogger/blogs")
			.set('Authorization', `Bearer ${user1Token}`)
			.send(inputDateModel)

			expect(createBlogBlogger.status).toBe(HttpStatus.CREATED)
	})

	it("get blogs blogger", async() => {
		const getBlogsBlogger = await request(server)
			.get('/blogger/blogs')
			.set('Authorization', `Bearer ${user1Token}`)

			// console.log('getBlogsBlogger: ', getBlogsBlogger.body)
		expect(getBlogsBlogger.status).toBe(HttpStatus.OK)
	})

	it('get sa blogs', async() => {
		const getBlogsSA = await request(server)
			.get('/sa/blogs')
			.auth('admin', 'qwerty')

		// console.log("getBlogsSA: ", (getBlogsSA.body as PaginationType<BlogsViewWithBanType>).items.map(item => item.blogOwnerInfo))

		expect(getBlogsSA.status).toBe(HttpStatus.OK)
	})
  });
});
