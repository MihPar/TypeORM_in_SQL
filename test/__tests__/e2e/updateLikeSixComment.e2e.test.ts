import request from "supertest";
import dotenv from "dotenv";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { HTTP_STATUS } from "../../../src/utils/utils";
dotenv.config();

export function createErrorsMessageTest(fields: string[]) {
  const errorsMessages: any = [];
  for (const field of fields) {
    errorsMessages.push({
      message: expect.any(String),
      field: field ?? expect.any(String),
    });
  }
  return { errorsMessages: errorsMessages };
}

describe("/like", () => {
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
    expect(wipeAllRes.status).toBe(HTTP_STATUS.NO_CONTENT_204);
  });

  afterAll(async () => {
    await app.close();
  });

  afterAll((done) => {
    done();
  });

  const blogsValidationErrRes = {
    errorsMessages: expect.arrayContaining([
      {
        message: expect.any(String),
        field: "name",
      },
      {
        message: expect.any(String),
        field: "description",
      },
      {
        message: expect.any(String),
        field: "websiteUrl",
      },
    ]),
  };

  

  describe("PUT -> /comments/:commentId/like-status: create comment then: like the comment by user 1, user 2, user 3, user 4. get the comment after each like by user 1. ; status 204; used additional methods: POST => /blogs, POST => /posts, POST => /posts/:postId/comments, GET => /comments/:id;", () => {
	let token1: string
	let userId1: string
	let login1: string
  
	let token2: string
	let userId2: string
	let login2: string
  
	let token3: string
	let userId3: string
	let login3: string
  
	let token4: string
	let userId4: string
	let login4: string
  
	let blogId: string
	let  blogName: string
  
	let postId: string

	it ("create like-status", async () => {


	/************** crate users1 ***************/

    const createUser1 = await request(server)
	.post('/sa/users')
	.auth("admin", "qwerty")
	.send({
		"login": "Michail",
		"password": "qwerty1",
		"email": "1mpara7472@gmail.com"
	})
    expect(createUser1.status).toBe(HTTP_STATUS.CREATED_201);
    expect(createUser1.body).toEqual({
      id: expect.any(String),
      login: "Michail",
      email: "1mpara7472@gmail.com",
      createdAt: expect.any(String),
    });

	
	const loginOrEmail1 = createUser1.body.login;
    const createAccessToken1 = await request(server)
	.post("/auth/login")
	.send({
      loginOrEmail: loginOrEmail1,
      password: "qwerty1",
    });

	expect(createAccessToken1.status).toBe(HTTP_STATUS.OK_200);
    expect(createAccessToken1.body).toEqual({
      accessToken: expect.any(String),
    });
	userId1 = createUser1.body.id
	token1 = createAccessToken1.body.accessToken
	login1 = createUser1.body.login

	/************** crate users2 ***************/

	const createUser2 = await request(server)
      .post("/sa/users")
      .auth("admin", "qwerty")
      .send({
        login: "Alexander",
        password: "qwerty2",
        email: "2mpara7472@gmail.com",
      });

    expect(createUser2.status).toBe(HTTP_STATUS.CREATED_201);
    expect(createUser2.body).toEqual({
      id: expect.any(String),
      login: "Alexander",
      email: "2mpara7472@gmail.com",
      createdAt: expect.any(String),
    });

	const loginOrEmail2 = createUser2.body.login;
    const createAccessToken2 = await request(server)
	.post("/auth/login")
	.send({
      loginOrEmail: loginOrEmail2,
      password: "qwerty2",
    });

	expect(createAccessToken2.status).toBe(HTTP_STATUS.OK_200);
    expect(createAccessToken2.body).toEqual({
      accessToken: expect.any(String),
    });

	userId2 = createUser2.body.id
	token2 = createAccessToken2.body.accessToken
	login2 = createUser2.body.login

// 	/************** crate users3 ***************/

	const createUser3 = await request(server)
      .post("/sa/users")
      .auth("admin", "qwerty")
      .send({
        login: "Iliya",
        password: "qwerty3",
        email: "3mpara7472@gmail.com",
      });

    expect(createUser3.status).toBe(HTTP_STATUS.CREATED_201);
    expect(createUser3.body).toEqual({
      id: expect.any(String),
      login: "Iliya",
      email: "3mpara7472@gmail.com",
      createdAt: expect.any(String),
    });

	const loginOrEmail3 = createUser3.body.login;
    const createAccessToken3 = await request(server)
	.post("/auth/login")
	.send({
      loginOrEmail: loginOrEmail3,
      password: "qwerty3",
    });

	expect(createAccessToken3.status).toBe(HTTP_STATUS.OK_200);
    expect(createAccessToken3.body).toEqual({
      accessToken: expect.any(String),
    });

	userId3 = createUser3.body.id
	token3 = createAccessToken3.body.accessToken
	login3 = createUser3.body.login

	/************** crate users4 ***************/
	
	const createUser4 = await request(server)
	.post("/sa/users")
	.auth("admin", "qwerty")
	.send({
	  login: "Tatiana",
	  password: "qwerty4",
	  email: "4mpara7472@gmail.com",
	});

  expect(createUser4.status).toBe(HTTP_STATUS.CREATED_201);
  expect(createUser4.body).toEqual({
	id: expect.any(String),
	login: "Tatiana",
	email: "4mpara7472@gmail.com",
	createdAt: expect.any(String),
  });

  const loginOrEmail4 = createUser4.body.login;
    const createAccessToken4 = await request(server)
	.post("/auth/login")
	.send({
      loginOrEmail: loginOrEmail4,
      password: "qwerty4",
    });

	expect(createAccessToken4.status).toBe(HTTP_STATUS.OK_200);
    expect(createAccessToken4.body).toEqual({
      accessToken: expect.any(String),
    });

	userId4 = createUser4.body.id
	login4 = createUser4.body.login
	token4 = createAccessToken4.body.accessToken

// /****************************** create blogs ******************************/
    
    const createBlogs = await request(server)
      .post("/sa/blogs/")
      .auth("admin", "qwerty")
      .send({
        name: "Michail",
        description: "my description",
        websiteUrl: "https://learn.javascript.ru",
      });
    expect(createBlogs.status).toBe(HTTP_STATUS.CREATED_201);
    expect(createBlogs.body).toEqual({
      id: expect.any(String),
      name: "Michail",
      description: "my description",
      websiteUrl: "https://learn.javascript.ru",
      createdAt: expect.any(String),
      isMembership: false,
    });

    blogId = createBlogs.body.id;
    blogName = createBlogs.body.name;

//   /******************************** create Posts ******************************/

    const createPosts = await request(server)
      .post(`/sa/blogs/${blogId}/posts`)
      .auth("admin", "qwerty")
      .send({
        title: "new title",
        shortDescription: "new shortDescription",
        content:
          "myContent I like javascript and I will be a developer in javascript, back end developer",
      });

    expect(createPosts.status).toBe(HTTP_STATUS.CREATED_201);
    expect(createPosts.body).toEqual({
      id: expect.any(String),
      title: "new title",
      shortDescription: "new shortDescription",
      content:
        "myContent I like javascript and I will be a developer in javascript, back end developer",
      blogId: blogId,
      blogName: blogName,
      createdAt: expect.any(String),
	  "extendedLikesInfo": {
		"likesCount": 0,
		"dislikesCount": 0,
		"myStatus": "None",
		"newestLikes": []
	  }
    });

    postId = createPosts.body.id;
    login1 = createUser1.body.login;


/************************* create comments1 by postId and put like-status ********************/

    const createCommentByPostId1 = await request(server)
      .post(`/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${token1}`)
      .send({
        content:
          "My profession is a programmer, I work in javascript and I work for back end developer",
      });
    expect(createCommentByPostId1.status).toBe(HTTP_STATUS.CREATED_201);
    
	const likeStausComment1 = await request(server)
	  .put(`/comments/${createCommentByPostId1.body.id}/like-status`)
	  .set("Authorization", `Bearer ${token1}`)
	  .send({likeStatus: 'Like'})
	  expect(likeStausComment1.status).toBe(HTTP_STATUS.NO_CONTENT_204);

	  const getComment1 = await request(server)
	  	.get(`/comments/${createCommentByPostId1.body.id}`)
		.set("Authorization", `Bearer ${token1}`)
		expect(getComment1.status).toBe(HTTP_STATUS.OK_200)
		expect(getComment1.body).toEqual({
			id: createCommentByPostId1.body.id,
			content: expect.any(String),
			commentatorInfo: {
			  userId: userId1,
			  userLogin: login1,
			},
			createdAt: expect.any(String),
			likesInfo: {
			  likesCount: 1,
			  dislikesCount: 0,
			  myStatus: "Like",
			},
		})

	/************************* create comments2 by postId and put like-status ********************/

//  const createCommentByPostId2 = await request(server)
// .post(`/posts/${postId}/comments`)
// .set("Authorization", `Bearer ${token2}`)
// .send({
//   content:
// 	"My profession is a programmer, I work in javascript and I work for back end developer",
// });
// expect(createCommentByPostId1.status).toBe(HTTP_STATUS.CREATED_201);

// const likeStausComment2 = await request(server)
// .put(`/comments/${createCommentByPostId2.body.id}/like-status`)
// .set("Authorization", `Bearer ${token2}`)
// .send({likeStatus: 'Like'})
// expect(likeStausComment1.status).toBe(HTTP_STATUS.NO_CONTENT_204);

// const getComment2 = await request(server)
// 	.get(`/comments/${createCommentByPostId2.body.id}`)
//   .set("Authorization", `Bearer ${token1}`)
//   expect(getComment1.status).toBe(HTTP_STATUS.OK_200)
//   expect(getComment1.body).toEqual({
// 	  id: createCommentByPostId1.body.id,
// 	  content: expect.any(String),
// 	  commentatorInfo: {
// 		userId: userId1,
// 		userLogin: login1,
// 	  },
// 	  createdAt: expect.any(String),
// 	  likesInfo: {
// 		likesCount: 1,
// 		dislikesCount: 0,
// 		myStatus: "Like",
// 	  },
//   })

	  

// 	const updateCommentByCommentId2 = await request(app)
// 	.put(`/comments/${commentId}/like-status`)
// 	.set("Authorization", `Bearer ${createAccessToken2.body.accessToken}`)
// 	.send({"likeStatus": "Like"})
// 	  console.log(updateCommentByCommentId2.body)
// 	  expect(updateCommentByCommentId2.status).toBe(HTTP_STATUS.NO_CONTENT_204)

// 	  getCommentUser1 = await request(app)
// 	  .get(`/comments/${id}`)
// 	  .set("Authorization", `Bearer ${createAccessToken2.body.accessToken}`)

//   console.log(getCommentUser1.body)

//     expect(getCommentUser1.status).toBe(HTTP_STATUS.OK_200);
//     expect(getCommentUser1.body).toEqual({
//       id: id,
//       content: expect.any(String),
//       commentatorInfo: {
//         userId: userId1,
//         userLogin: login1,
//       },
//       createdAt: expect.any(String),
//       likesInfo: {
//         likesCount: 2,
//         dislikesCount: 0,
//         myStatus: "Like",
//       },
//     });

// 	const updateCommentByCommentId3 = await request(app)
// 	.put(`/comments/${commentId}/like-status`)
// 	.set("Authorization", `Bearer ${createAccessToken3.body.accessToken}`)
// 	.send({"likeStatus": "Dislike"})
// 	  console.log(updateCommentByCommentId3.body)
// 	  expect(updateCommentByCommentId3.status).toBe(HTTP_STATUS.NO_CONTENT_204)

// 	  getCommentUser1 = await request(app)
// 	  .get(`/comments/${id}`)
// 	  .set("Authorization", `Bearer ${createAccessToken3.body.accessToken}`)
//   console.log(getCommentUser1.body)

//     expect(getCommentUser1.status).toBe(HTTP_STATUS.OK_200);
//     expect(getCommentUser1.body).toEqual({
//       id: id,
//       content: expect.any(String),
//       commentatorInfo: {
//         userId: userId1,
//         userLogin: login1,
//       },
//       createdAt: expect.any(String),
//       likesInfo: {
//         likesCount: 2,
//         dislikesCount: 1,
//         myStatus: "Dislike",
//       },
//     });


// 	  const updateCommentByCommentId4 = await request(app)
// 	.put(`/comments/${commentId}/like-status`)
// 	.set("Authorization", `Bearer ${createAccessToken4.body.accessToken}`)
// 	.send({"likeStatus": "None"})
// 	  console.log(updateCommentByCommentId4.body)
// 	  expect(updateCommentByCommentId4.status).toBe(HTTP_STATUS.NO_CONTENT_204)

// 	  getCommentUser1 = await request(app)
// 	  .get(`/comments/${id}`)
// 	  .set("Authorization", `Bearer ${createAccessToken4.body.accessToken}`)
//   console.log(getCommentUser1.body)

//     expect(getCommentUser1.status).toBe(HTTP_STATUS.OK_200);
//     expect(getCommentUser1.body).toEqual({
//       id: id,
//       content: expect.any(String),
//       commentatorInfo: {
//         userId: userId1,
//         userLogin: login1,
//       },
//       createdAt: expect.any(String),
//       likesInfo: {
//         likesCount: 2,
//         dislikesCount: 1,
//         myStatus: "None",
//       },
//     });
  }, 10000);
});

})
