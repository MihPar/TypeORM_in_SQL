import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { appSettings } from '../../../src/setting';
import { GameTypeModel } from '../../../src/pairQuizGame/type/typeViewModel';
import { BanInputModel } from '../../../src/users/user.class';
import { UserBanViewType } from '../../../src/users/user.type';
import { createAddUser, createPostBlogger, createToken } from '../../../src/helpers/helpers';
import { BlogsViewType } from '../../../src/blogs/blogs.type';
import { BodyBlogsModel } from '../../../src/blogsForSA/dto/blogs.class-pipe';
import { PostsViewModel } from '../../../src/posts/posts.type';
import { bodyPostsModelClass } from '../../../src/posts/dto/posts.class.pipe';
import { createBlogBlogger } from './helper/createBloggerBlog';
import { getBlogById } from '../blogs/helper/blogs';


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

			//  console.log("createBlog: ", createBlog[1])
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
			const file = `/Users/mihailparamonov/Documents/programmer/it-incubator/1028*321/6b285022-b168-4fe9-a6fa-fe5f6f5f1eb1_avatar.jpeg`
			const uploadWallpaper = await request(server)
				.post(`/blogger/blogs/${createBlog[1].id}/images/wallpaper`)
				.set('Authorization', `Bearer ${user1Token}`)
				.attach('file', file)
				
			// console.log("uploadWallpaper: ", uploadWallpaper.body)
		})

		it("upload image main blog", async() => {
			const file = `/Users/mihailparamonov/Documents/programmer/it-incubator/156*156/014a9a8f-7953-466e-83ed-00db88dbe2c4_avatar.jpeg`
			const uploadImageMain = await request(server)
				.post(`/blogger/blogs/${createBlog[1].id}/images/main`)
				.set('Authorization', `Bearer ${user1Token}`)
				.attach('file', file)
				
			// console.log("uploadImageMain: ", uploadImageMain.body)
		})

		it("upload main image for post", async() => {
			const file = `/Users/mihailparamonov/Documents/programmer/it-incubator/149*96/image.jpg`
			const uploadImageForPost = await request(server)
				.post(`/blogger/blogs/${createBlog[1].id}/posts/${createPost.id}/images/main`)
				.set('Authorization', `Bearer ${user1Token}`)
				.attach('file', file)
				
			console.log("uploadImageForPost: ", uploadImageForPost.body)
		})

		it("get blog by id", async() => {
			const blog = await getBlogById(server, createBlog[1].id)
			// console.log("blog: ", blog)
		})
	})
})