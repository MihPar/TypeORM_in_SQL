import request from 'supertest';
import { InputModelClassCreateBody } from '../users/user.class';
import { Posts } from '../posts/entity/entity.posts';
import { LikeStatusEnum } from '../likes/likes.emun';
import { PostsViewModel } from '../posts/posts.type';
import { CommentViewModel } from '../comment/comment.type';
import { Comments } from '../comment/entity/comment.entity';
import { AnswersPlayer } from '../pairQuizGameProgress/domain/entity.answersPlayer';
import { HttpStatus } from '@nestjs/common';
import { QuestionMemory, questionsInMemory } from './questionMemory';
import { GameTypeModel } from '../pairQuizGame/type/typeViewModel';

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

let answer: {
  questionId: string;
  answerStatus: string;
  addedAt: string;
};

let question: { body: string; correctAnswers: string[] }[];

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
) => {
  const createUser = await request(server)
    .post(`/sa/users`)
    .auth('admin', 'qwerty')
    .send(body);
  return createUser;
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

export const aDescribe = (skip: boolean): jest.Describe => {
  if (skip) {
    return describe.skip;
  }
  return describe;
};

export const sortAddedAt = <T extends { addedAt: string | Date }>(
  arr: Array<T>,
): Array<T> => {
  return arr.sort((a: T, b: T) =>
    a.addedAt.toString() > b.addedAt.toString() ? 1 : -1,
  );
};

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
    return getAllGames.body;
  } catch (err) {
    console.log(err, 'do not have any games by exists user');
  }
};

export const sendAnswers = async (
  server: any,
  accessTokenOne: string,
  accessTokenTwo: string,
  questions: QuestionMemory,
  game: GameTypeModel, // callback - это функция обратного вызова (по-русски) портому это всегда функция
) => {
//   const array = game.questions;
// //   console.log(">>>", game)
//   const questionsForCurrectAnswers = questions.find((item) => {
// 	let arr: Array<object>
// 	for(let i = 0; i < array.length; i++) {
// 		//arr = array[i].body
// 		if(array[i].body === item.body) return true;
// 		//return arr

// 	}
//     // for (let item of array) {
//     //   return item;
//     // }
//     // return item.body === item.body;
//     //return item.body === arr;
//   });

game.questions.forEach(async (questionInGame, index) => {
	console.log("index: ", index)
	// console.log("question: ", questions)
	const answer = questions.find(questionInMemory => questionInMemory.body === questionInGame.body).correctAnswers[0]

	const payload = {
		answer
	  };
	  await delay(100)

	const sendAnswerFirstPlayer = await request(server)
    .post('/pair-game-quiz/pairs/my-current/answers')
    .set('Authorization', `Bearer ${accessTokenOne}`)
    .send(payload);

	await delay(100)
	
	const sendAnswerSecondPlayer = await request(server)
    .post('/pair-game-quiz/pairs/my-current/answers')
    .set('Authorization', `Bearer ${accessTokenTwo}`)
    .send(payload);

})

//   return sendAnswer.body
};

export const findGameById = async(server: any, id: string, accessToke: string): Promise<[number, GameTypeModel | null]> => {
	const getGameById = await request(server)
		.get(`/pair-game-quiz/pairs/${id}`)
		.set('Authorization', `Bearer ${accessToke}`);
		return [getGameById.status, getGameById.body]
}

export const delay = async (milliseconds: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, milliseconds)
    })
  }