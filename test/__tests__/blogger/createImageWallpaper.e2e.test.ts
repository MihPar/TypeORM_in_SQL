import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { appSettings } from '../../../src/setting';
import { GameTypeModel } from '../../../src/pairQuizGame/type/typeViewModel';
import { BanInputModel } from '../../../src/users/user.class';
import { UserBanViewType } from '../../../src/users/user.type';
import { createAddUser, createCom, createPostBlogger, createToken } from '../../../src/helpers/helpers';
import { BlogsViewType } from '../../../src/blogs/blogs.type';
import { BodyBlogsModel } from '../../../src/blogsForSA/dto/blogs.class-pipe';
import { BanUserForBlogInputModel } from '../../../src/blogger/dto-class';
import { banUserSpecifyBlog, getAllBanUsers } from '../../../src/helpers/helperBanUserTest';
import { PostsViewModel } from '../../../src/posts/posts.type';
import { bodyPostsModelClass } from '../../../src/posts/dto/posts.class.pipe';
import { CommentViewModel } from '../../../src/comment/comment.type';
import { createBlogBlogger } from './helper/createBloggerBlog';


export interface Content {
	content: string
}

describe('/blogs', () => {
	let app: INestApplication;
	let server: any;
	beforeAll(async () => {
		// const fooMock = () => {
		// 	sendMessage: jest.fn().mockImplementation(async () => {
		// 	  console.log('Call mock create new password');
		// 	  return true;
		// 	});
		//   };

		// class MockClass {
		// 	constructor(
		// 		private newPasswordUseCase: NewPasswordUseCase
		// 	) {}
		// 	sendMessage: () => true
		// }

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
		// .overrideProvider(NewPasswordUseCase)
		// //   .useValue(fooMock)
		// //   .useClass(MockClass)
		//   .useFactory({
		// 	factory: (userCase: NewPasswordUseCase) => {
		// 		return new MockClass(userCase)
		// 	},
		// 	inject: [NewPasswordUseCase]
		//   })
		.compile();

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
	let body: BanInputModel
	let firstUser: UserBanViewType
	let secondUser: UserBanViewType

	describe('some description', () => {
		it('creting users in db', async () => {
			expect(server).toBeDefined();
			firstUser = await createAddUser(server, user1Creds);
			// console.log("user: ", firstUser)
			// secondUser = await createAddUser(server, user2Creds);
			// console.log("second: ", secondUser)
			// await createAddUser(server, user3Creds);
			// await createAddUser(server, user4Creds);
		});

		it('logining users in db', async () => {
			user1Token = (
				await createToken(server, user1Creds.login, user1Creds.password)
			).body.accessToken;

			// user2Token = (
			// 	await createToken(server, user2Creds.login, user2Creds.password)
			// ).body.accessToken;

			// user3Token = (
			// 	await createToken(server, user3Creds.login, user3Creds.password)
			// ).body.accessToken;

			// user4Token = (
			// 	await createToken(server, user4Creds.login, user4Creds.password)
			// ).body.accessToken;

		});

		let createBlog: [number, BlogsViewType]
		it('create blog by blogger', async () => {
			// console.log("user1Token: ", user1Token)
			const requestBodyAuthLogin: BodyBlogsModel = {
				name: "Lerning",
				description: "skdjfksjfksjfksfj",
				websiteUrl: `https://learn.javascript.ru`
			}
			createBlog = await createBlogBlogger(server, requestBodyAuthLogin, user1Token)

			//  console.log("createBlog: ", createBlog)
		})

		let createPost: PostsViewModel
		it('create post by blogId by blogger', async() => {
			const blogId = createBlog[1].id
			// console.log("blogId: ", blogId)
			const inputDateModel: bodyPostsModelClass = {
				title: "title",
  				shortDescription: "Big content",
  				content: "Content content content"
				}
			createPost = await createPostBlogger(server, blogId, inputDateModel, user1Token)
			//  console.log("createPost: ", createPost)
		})

		it('upload background wallpaper', async() => {
			const avatarFile = `https://storage.yandexcloud.net/michael-paramonov//content/users/111/avatars/111_avatar.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=YCAJEhVoFrKMRARF1bP9NcycH%2F20240714%2Fru-central1%2Fs3%2Faws4_request&X-Amz-Date=20240714T164714Z&X-Amz-Expires=3600&X-Amz-Signature=E04B7CF8DF3AD13A795DD908F0D4DEB9030456A27843D950B5AB5BF269A87886&X-Amz-SignedHeaders=host`
			const upload = await request(server)
				.post(`/blogger/blogs/${createBlog[1].id}/images/wallpaper`)
				.set('Authorization', `Bearer ${user1Token}`)
				.send(avatarFile)
				
			console.log("upload: ", upload.body)
		})
	})
})