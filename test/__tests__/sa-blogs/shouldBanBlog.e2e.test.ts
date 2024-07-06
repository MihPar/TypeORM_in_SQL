import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { appSettings } from '../../../src/setting';
import { GameTypeModel } from '../../../src/pairQuizGame/type/typeViewModel';
import { createAddUser, createToken } from '../../../src/helpers/helpers';
import { BanBlogInputModel, BodyBlogsModel } from '../../../src/blogsForSA/dto/blogs.class-pipe';
import { createBlogBlogger } from '../blogger/helper/createBloggerBlog';
import { getAllBlogs, getBlogById } from '../blogs/helper/blogs';
import { banUnbanBlog, findSABlog } from './helperSABlogs/saBlogs';

describe('/blogs', () => {
	let app: INestApplication;
	let server: any;
	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule
			],
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
			  await createAddUser(server, user2Creds);
			  await createAddUser(server, user3Creds);
			//   await createAddUser(server, user4Creds);
		});

		it('logining users in db', async () => {
			user1Token = (
				await createToken(server, user1Creds.login, user1Creds.password)
			).body.accessToken;

			//   console.log("user1Token: ", user1Token)

			  user2Token = (
			    await createToken(server, user2Creds.login, user2Creds.password)
			  ).body.accessToken;

			  user3Token = (
			    await createToken(server, user3Creds.login, user3Creds.password)
			  ).body.accessToken;

			//   user4Token = (
			//     await createToken(server, user4Creds.login, user4Creds.password)
			//   ).body.accessToken;
		});

		let blogId: string
		it("create blogs from blogger by first user", async() => {
			const inputDateModel: BodyBlogsModel = {
					name: "Mickle",
					description: "I am a programmer",
					websiteUrl: "https://google.com"
				}
			const createBlogs = await createBlogBlogger(server, inputDateModel, user1Token)
			// console.log("createBlogsFirstUser: ", createBlogs[1])
				blogId = createBlogs[1].id
			// expect(createBlogBlogger[0]).toBe(HttpStatus.CREATED)
		})

		it("create blogs from blogger by second user", async() => {
			const inputDateModel: BodyBlogsModel = {
					name: "Iliy",
					description: "I am a backend developer",
					websiteUrl: "https://yandex.com"
				}
			const createBlogs = await createBlogBlogger(server, inputDateModel, user2Token)
			// console.log("createBlogsSecondUser: ", createBlogs[1])
				// blogId = createBlogs[1].id
			// expect(createBlogBlogger[0]).toBe(HttpStatus.CREATED)
		})

		it("create blogs from blogger by third user", async() => {
			const inputDateModel: BodyBlogsModel = {
					name: "Mariy",
					description: "I am a backend developer",
					websiteUrl: "https://yandex.com"
				}
			const createBlogs = await createBlogBlogger(server, inputDateModel, user3Token)
			// console.log("createBlogsThirdUser: ", createBlogs[1])
				// blogId = createBlogs[1].id
			// expect(createBlogBlogger[0]).toBe(HttpStatus.CREATED)
		})

		it('find all blogs', async() => {
			await getAllBlogs(server)
		})

		it('get blog by id', async() => {
			// console.log('blogId: ', blogId)
			await getBlogById(server, blogId)
		})

		it('get saBlogs', async () => {
			await findSABlog(server)
		})
		
		it('update banUnban blog', async() => {
			const bodyBan: BanBlogInputModel = {
				isBanned: true
			}
			await banUnbanBlog(server, blogId, bodyBan)
		})
	});
});