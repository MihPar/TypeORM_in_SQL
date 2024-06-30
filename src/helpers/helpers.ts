import { strict } from 'assert';
import request from 'supertest';
import { BanInputModel, InputModelClassCreateBody } from '../users/user.class';
import { LikeStatusEnum } from '../likes/likes.emun';
import { CommentViewModel } from '../comment/comment.type';
import { Comments } from '../comment/entity/comment.entity';
import { HttpStatus } from '@nestjs/common';
import { QuestionMemory } from './questionMemory';
import { GameTypeModel } from '../pairQuizGame/type/typeViewModel';
import { UserBanViewType } from '../users/user.type';
import { InputDataModelClassAuth } from '../auth/dto/auth.class.pipe';
import { BodyBlogsModel } from '../blogsForSA/dto/blogs.class-pipe';
import { bodyPostsModelClass } from '../posts/dto/posts.class.pipe';
import { PostsViewModel } from '../posts/posts.type';
import { BlogsViewType } from '../blogs/blogs.type';
import { Content } from '../../test/__tests__/comment.30.homeWork/getCommentByIdBan.e2e.test';
import { InputModelLikeStatusClass } from '../comment/dto/comment.class-pipe';

export const commentDBToView = (
	item: Comments,
	myStatus: LikeStatusEnum | null,
): CommentViewModel => {
	return {
		id: item.id,
		content: item.content,
		// commentatorInfo: item.commentatorInfo,
		commentatorInfo: {
			userId: item.userId,
			userLogin: item.userLogin,
		},
		createdAt: item.createdAt,
		likesInfo: {
			likesCount: item?.likesCount || 0,
			dislikesCount: item?.dislikesCount || 0,
			myStatus: myStatus || LikeStatusEnum.None,
		},
	};
};

// let answer: {
//   questionId: string;
//   answerStatus: string;
//   addedAt: string;
// };

// let question: { body: string; correctAnswers: string[] }[];

// export const commentByPostView = (
// 	item: CommentClass,
//     myStatus?: LikeStatusEnum | null
//   ): CommentViewModel => {
// 	return {
// 	  id: item.id,
// 	  content: item.content,
// 	  commentatorInfo: item.commentatorInfo,
// 	  createdAt: item.createdAt,
// 	  likesInfo: {
// 		likesCount: item?.likesCount || 0,
// 		dislikesCount: item?.dislikesCount || 0,
// 		myStatus: myStatus || LikeStatusEnum.None,
// 	  },
// 	};
//   };

export const createAddUser = async (
	server: any,
	body: InputModelClassCreateBody,
): Promise<UserBanViewType> => {
	const createUser = await request(server)
		.post(`/sa/users`)
		.auth('admin', 'qwerty')
		.send(body);
	return createUser.body;
};

export const createToken = async (
	server: any,
	loginOrEmail: string,
	password: string,
) => {
	const createAccessToken = await request(server).post('/auth/login').send({
		loginOrEmail,
		password,
	});
	return createAccessToken;
};

export const updateUserByIdBan = async (server: any, id: string, body: BanInputModel) => {
	const updateUser = await request(server).put(`/sa/users/${id}/ban`).auth('admin', 'qwerty').send(body)
	// console.log("updateUser: ", updateUser.body)
	return updateUser.body
}

export const createBlogBlogger = async (server: any, requestBodyAuthLogin: BodyBlogsModel, token: string): Promise<BlogsViewType | null> => {
	const createBloByBlogger = await request(server).post('/blogger/blogs').send(requestBodyAuthLogin).set('Authorization', `Bearer ${token}`);
	return createBloByBlogger.body
}

export const createPostBlogger = async (server: any, id: string, inputDateModel: bodyPostsModelClass, token: string) => {
	const creatPost = await request(server).post(`/blogger/blogs/${id}/posts`).send(inputDateModel).set('Authorization', `Bearer ${token}`);
	return creatPost.body
}

export const createCom = async(server: any, postId: string, content: Content, token: string): Promise<CommentViewModel> => {
	const createComment = await request(server).post(`/posts/${postId}/comments`).send(content).set('Authorization', `Bearer ${token}`);
	return createComment.body
}

export const getCom = async(server: any, id: string) => {
	const getCommentsById = await request(server).get(`/comments/${id}`)
	return getCommentsById.body
}


export const createLike = async(server: any, id: string, status: InputModelLikeStatusClass, token: string) => {
	const createLike = await request(server).put(`/comments/${id}/like-status`).send(status).set('Authorization', `Bearer ${token}`)
	return createLike.body
}

export const getBlogByUseTwo = async(server: any, id: string) => {
	const getBlog = await request(server).get(`/blogs/${id}`)
	return getBlog.body
}

export const findPost = async(server: any, id: string) => {
	const findPost = await request(server).get(`/posts/${id}`)
	// console.log("findPost: ", findPost.body)
	return findPost.body
}

export const findSABlog = async(server: any) => {
	const findBlog = await request(server).get('/sa/blogs').query({
		searchNameTerm: "",
		sortBy: "createdAt",
		sortDirection: 'desc',
		pageNumber: '1',
		pageSize: '10'
	}).auth('admin', 'qwerty')
	return findBlog.body
}

export const aDescribe = (skip: boolean): jest.Describe => {
	if (skip) {
		return describe.skip;
	}
	return describe;
};

export const sortAddedAt = <T extends { addedAt: Date }>(
	arr: Array<T>,
): Array<T> => {
	return arr.sort((a: T, b: T) => {
		// console.error(a.addedAt.toString(),  b.addedAt.toString())
		return a.addedAt.toISOString() > b.addedAt.toISOString() ? 1 : -1;
	});
};
// type Arr = {
// 		questionId: string,
// 		answerStatus: string
// 		addedAt: string
// 	}
// type Obj = Arr[]
// export const sortAddedAt = (obj: Obj) => {
// 	return obj.sort((a: Arr, b: Arr) => {return a.addedAt.toString() > b.addedAt.toString() ? 1 : -1})
// }

// функция создания пары

export const createQuestionsAndPublished = async (
	server: any,
	questionsInMemory: QuestionMemory,
) => {
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

	expect(publishedQuestion0.status).toBe(HttpStatus.NO_CONTENT);
	expect(publishedQuestion1.status).toBe(HttpStatus.NO_CONTENT);
	expect(publishedQuestion2.status).toBe(HttpStatus.NO_CONTENT);
	expect(publishedQuestion3.status).toBe(HttpStatus.NO_CONTENT);
	expect(publishedQuestion4.status).toBe(HttpStatus.NO_CONTENT);

	if (
		!publishedQuestion0 &&
		!publishedQuestion1 &&
		!publishedQuestion2 &&
		!publishedQuestion3 &&
		!publishedQuestion4
	)
		return false;
	return questionsInMemory;
};

export const toCreatePair = async (
	server: any,
	accessTokenOne: string,
	accessTokenTwo: string,
): Promise<[number, GameTypeModel | null]> => {
	const createPair = await request(server)
		.post('/pair-game-quiz/pairs/connection')
		.set('Authorization', `Bearer ${accessTokenOne}`);
	// .expect(200)

	const connectPair = await request(server)
		.post('/pair-game-quiz/pairs/connection')
		.set('Authorization', `Bearer ${accessTokenTwo}`);
	// .expect(200)
	if (!createPair && !connectPair) return null;
	return [connectPair.status, connectPair.body];
};
// автоматические ответы на вопросы в игре пользователями

export const findAllGames = async (server: any, accessToken: string) => {
	try {
		const getAllGames = await request(server)
			.get('/pair-game-quiz/pairs/my')
			.set(`Authorization`, `Bearer ${accessToken}`);
		return { status: getAllGames.status, body: getAllGames.body };
	} catch (err) {
		console.log(err, 'do not have any games by exists user');
	}
};

export const sendAnswers = async (
	server: any,
	accessTokenOne: string,
	accessTokenTwo: string,
	questions: QuestionMemory,
	game: GameTypeModel,
) => {
	for (const questionInGame of game.questions) {
		game.questions.indexOf(questionInGame);
		const answer = questions.find(
			(questionInMemory) => questionInMemory.body === questionInGame.body,
		).correctAnswers[0];

		const payload = {
			answer,
		};
		await delay(100);

		await request(server)
			.post('/pair-game-quiz/pairs/my-current/answers')
			.set('Authorization', `Bearer ${accessTokenOne}`)
			.send(payload);

		await delay(100);

		await request(server)
			.post('/pair-game-quiz/pairs/my-current/answers')
			.set('Authorization', `Bearer ${accessTokenTwo}`)
			.send(payload);
	}

	//   return sendAnswer.body
};

export const sendAnswersFirstPlayer = async (
	server: any,
	accessTokenOne: string,
	str: string,
	firstGame: any,
) => {
	const payload = {
		answer: str,
	};
	await delay(100);

	const sendAnswerFirstPlayer = await request(server)
		.post('/pair-game-quiz/pairs/my-current/answers')
		.set('Authorization', `Bearer ${accessTokenOne}`)
		.send(payload);

	return sendAnswerFirstPlayer;
};
export const sendAnswersSecondPlayer = async (
	server: any,
	accessTokenTwo: string,
	str: string,
) => {
	const payload = {
		answer: str,
	};
	await delay(100);

	const sendAnswerSecondPlayer = await request(server)
		.post('/pair-game-quiz/pairs/my-current/answers')
		.set('Authorization', `Bearer ${accessTokenTwo}`)
		.send(payload);

	return sendAnswerSecondPlayer;
};

export const findGameById = async (
	server: any,
	id: string,
	accessToke: string,
): Promise<[number, GameTypeModel | null]> => {
	const getGameById = await request(server)
		.get(`/pair-game-quiz/pairs/${id}`)
		.set('Authorization', `Bearer ${accessToke}`);
	return [getGameById.status, getGameById.body];
};

export const delay = async (milliseconds: number): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, milliseconds);
	});
};
