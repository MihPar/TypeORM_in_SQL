import { strict } from 'assert';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { delay, find } from 'rxjs';
import { AppModule } from '../../../src/app.module';
import { appSettings } from '../../../src/setting';
import { GameTypeModel } from '../../../src/pairQuizGame/type/typeViewModel';
import { createAddUser, createBlogBlogger, createCom, createLike, createPostBlogger, createToken, findPost, findSABlog, getBlogByUseTwo, getCom, updateUserByIdBan } from '../../../src/helpers/helpers';
import { BanInputModel } from '../../../src/users/user.class';
import { User } from '../../../src/users/entities/user.entity';
import { UserBanViewType } from '../../../src/users/user.type';
import { InputDataModelClassAuth } from '../../../src/auth/dto/auth.class.pipe';
import { BodyBlogsModel } from '../../../src/blogsForSA/dto/blogs.class-pipe';
import { bodyPostsModelClass } from '../../../src/posts/dto/posts.class.pipe';
import { PostsViewModel } from '../../../src/posts/posts.type';
import { BlogsViewType, BlogsViewWithBanType } from '../../../src/blogs/blogs.type';
import { CommentViewModel } from '../../../src/comment/comment.type';
import { NewPasswordUseCase } from '../../../src/auth/useCase.ts/createNewPassword-use-case';
import { PaginationType } from '../../../src/types/pagination.types';
import { InputModelLikeStatusClass } from '../../../src/comment/dto/comment.class-pipe';
import { LikeStatusEnum } from '../../../src/likes/likes.emun';

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
			secondUser = await createAddUser(server, user2Creds);
			// await createAddUser(server, user3Creds);
			// await createAddUser(server, user4Creds);
		});

		it('logining users in db', async () => {
			user1Token = (
				await createToken(server, user1Creds.login, user1Creds.password)
			).body.accessToken;

			user2Token = (
				await createToken(server, user2Creds.login, user2Creds.password)
			).body.accessToken;

			user3Token = (
				await createToken(server, user3Creds.login, user3Creds.password)
			).body.accessToken;

			user4Token = (
				await createToken(server, user4Creds.login, user4Creds.password)
			).body.accessToken;

			// console.log("user1Token: ", user1Token)
		});
		
		/*  GET -> "/sa/users": should return status 200; content: users array with pagination; used additional methods: POST -> /sa/users, PUT -> /sa/users/:id/ban;  */

		// it('update user by id for ban current user', async () => {
		// 	// потом банишь автора
		// 	body = {
		// 		isBanned: true,
		// 		banReason: "ban user because is null"
		// 	}
		// 	const updateUser = await updateUserByIdBan(server, firstUser.id, body)
		// })

		// it('logining users in db', async () => {
		// 	user1Token = (
		// 		await createToken(server, user1Creds.login, user1Creds.password)
		// 	).body.accessToken;
		// })

		// it('get users', async () => {
		// 	const getUsers = await request(server)
		// 		.get('/sa/users')
		// 		.query({
		// 			banStatus: 'all' || 'banned' || 'notBanned',
		// 			searchLoginTerm: "",
		// 			searchEmailTerm: "",
		// 			sortBy: "createdAt",
		// 			sortDirection: 'desc',
		// 			pageNumber: '1',
		// 			pageSize: '10'
		// 		})
		// 		.auth('admin', 'qwerty')
			
		// 	console.log("getUsers: ", (getUsers.body as PaginationType<UserBanViewType>)
		// 	// .items
		// 	// .map(item => item.banInfo)
		// )
		// })
		

		let createBlog: BlogsViewType
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
			const blogId = createBlog.id
			// console.log("blogId: ", blogId)
			const inputDateModel: bodyPostsModelClass = {
				title: "title",
  				shortDescription: "Big content",
  				content: "Content content content"
				}
			createPost = await createPostBlogger(server, blogId, inputDateModel, user1Token)
			//  console.log("createPost: ", createPost)
		})
		
		let createCommnets: CommentViewModel
		it('create comments by postId', async() => {
			const postId = createPost.id
			// console.log("postId: ", postId)

			const content: Content = {
				content: "string string string string string"
			}
			createCommnets = await createCom(server, postId, content, user1Token)
			// console.log("createCommnets: ", createCommnets)
		})

		it('update like for comments', async () => {
			const id = createCommnets.id
			// console.log("id: ", id)
			const status: InputModelLikeStatusClass = {likeStatus: LikeStatusEnum.Dislike}

			const updateLikeForCommmnent = await createLike(server, id, status, user2Token)
			// console.log("updateLikeForCommmnent: ", updateLikeForCommmnent)
		})

		it('update like for post', async() => {
			const status: InputModelLikeStatusClass = {likeStatus: LikeStatusEnum.Dislike}
			const postId = createPost.id
			// console.log('postId: ', postId)
			const updateLikePost = await request(server).put(`/posts/${postId}/like-status`).send(status).set('Authorization', `Bearer ${user2Token}`)
			// console.log("updateLikePost:  ", updateLikePost.body)
		})


		// it('get comments by id', async () => {
		// 	const id = createCommnets.id
		// 	console.log("id: ", id)
		// 	const getCommentById = await getCom(server, id)
		// 	console.log("getCommentById: ", getCommentById)
		// })


		// вторым пользователем делаешь гет запросы на получение блога/ блогов, поста/постов, коммента все 200

		// it('find blog, and return status 200', async() => {
		// 	const getBlog = await getBlogByUseTwo(server, createBlog.id)
		// 	// console.log("getBlog: ", getBlog)
		// })

		// it('find sa blogs', async () => {
		// 	const findSA = await findSABlog(server)
		// 	console.log("findSA: ", (findSA as PaginationType<BlogsViewWithBanType>).items)
		// })

		// it('find post', async () => {
		// 	// console.log("id: ", createPost.id)
		// 	const getPost = await findPost(server, createPost.id)
		// 	console.log("findPost: ", getPost)
		// })

		// it('find comment', async() => {
		// 	const id = createCommnets.id
		// 	const getCommentById = await getCom(server, id)
		// 	// console.log("getComment: ", getCommentById)
		// })

			
		// it('update user by id for ban current user', async () => {
		// 	// потом банишь автора
		// 	body = {
		// 		isBanned: true,
		// 		banReason: "ban user because is null"
		// 	}
		// 	const updateUser = await updateUserByIdBan(server, secondUser.id, body)
		// })

		it('get comments by id', async () => {
			const id = createCommnets.id
			// console.log("id: ", id)
			const getCommentById = await getCom(server, id)
			console.log("getCommentById: ", getCommentById)
		})

// 		it('get users', async () => {
// 			const getUsers = await request(server)
// 				.get('/sa/users')
// 				.auth('admin', 'qwerty')
			
// 			// console.log("getUsers: ", getUsers.body)
// 		})

// 		it('get ban blog', async () => {
// 			const getBlog = await getBlogByUseTwo(server, createBlog.id)
// 			// console.log("getBlog: ", getBlog)
// 		})

		it('find post', async () => {
			const getPost = await findPost(server, createPost.id)
			console.log("findPost: ", getPost)
		})

// 		it('find comment by id', async() => {
// 			const id = createCommnets.id
// 			const getCommentById = await getCom(server, id)
// 			// console.log("getComment: ", getCommentById)
// 		})

// 		// вторым пользователем делаешь гет запросы на получение блога/ блогов, поста/постов, коммента но на все 404 либо если на все блоги или посты запрос то они просто не находятся
// 		it('update user by id for ban current user', async () => {
// // потом снимаешь бан с пользователя автора
// 			body = {
// 				isBanned: false,
// 				banReason: "ban user because is null"
// 			}
// 			const updateUser = await updateUserByIdBan(server, firstUser.id, body)
// 		})


		
// 		// вторым пользователем делаешь гет запросы на получение блога/ блогов, поста/постов, коммента все 200
// 		it('get ban blog', async () => {
// 			const getBlog = await getBlogByUseTwo(server, createBlog.id)
// 			// console.log("getBlog: ", getBlog)
// 		})

// 		it('find post', async () => {
// 			const getPost = await findPost(server, createPost.id)
// 			// console.log("findPost: ", getPost)
// 		})

// 		it('find comment', async() => {
// 			const id = createCommnets.id
// 			const getCommentById = await getCom(server, id)
// 			// console.log("getComment: ", getCommentById)
// 		})


	})
})