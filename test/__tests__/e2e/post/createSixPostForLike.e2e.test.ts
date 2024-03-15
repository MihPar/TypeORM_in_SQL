import request from "supertest";
import dotenv from "dotenv";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../../src/app.module";
import { appSettings } from "../../../../src/setting";
import { HTTP_STATUS } from "../../../../src/utils/utils";
dotenv.config();


const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
let dbName = process.env.mongoDBName || "mongoose-example";

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

describe("/blogs", () => {
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

  //   beforeEach(async () => {
  //     const wipeAllRes = await request(app).delete("/testing/all-data").send();
  //   });

  describe("GET -> /posts: create 6 posts then: like post 1 by user 1, user 2; like post 2 by user 2, user 3; dislike post 3 by user 1; like post 4 by user 1, user 4, user 2, user 3; like post 5 by user 2, dislike by user 3; like post 6 by user 1, dislike by user 2. Get the posts by user 1 after all likes NewestLikes should be sorted in descending; status 200; content: posts array with pagination; used additional methods: POST => /sa/blogs, POST => /sa/blogs/:blogId/posts, PUT -> posts/:postId/like-status;", () => {
    type PostType = {
      id: string;
      title: string;
      shortDescription: string;
      content: string;
      blogId: string;
      blogName: string;
      createdAt: string;
    };
    let postId1: string;
    let tokenByUser1: string;
    let postData: PostType;
    let blogNameAllPosts: string;
    let userLogin: string;
    let userId: string;
	let blogIdAllPost: string

    it("create new user, create blog, create post => return 201 status code", async () => {

		/***************************** create user1 ********************************************/
      const user = {
        login: "1Mickle",
        password: "1qwerty",
        email: "1mpara7473@gmail.com",
      };

	  const createUser = await request(server)
        .post(`/sa/users`)
        .auth("admin", "qwerty")
        .send(user);

		userLogin = createUser.body.login;
      	userId = createUser.body.id;

      expect(createUser.body).toStrictEqual({
        id: expect.any(String),
        login: user.login,
        email: user.email,
        createdAt: expect.any(String),
      });
      const createAccessToken = await request(server)
	  .post("/auth/login")
	  .send({
        loginOrEmail: user.login,
        password: user.password,
      });

      tokenByUser1 = createAccessToken.body.accessToken;
      expect(createAccessToken.status).toBe(HTTP_STATUS.OK_200);
      expect(createAccessToken.body).toEqual({
        accessToken: expect.any(String),
      });

		/***************************** create user2 ********************************************/

		const createUser2 = await request(server)
        .post(`/users`)
        .auth("admin", "qwerty")
        .send({
			login: "2Mickle",
			password: "2qwerty",
			email: "2mpara7473@gmail.com",
		  });

		  const createAccessToken2 = await request(server)
		  .post("/auth/login")
		  .send({
			loginOrEmail: user.login,
			password: user.password,
		  });

		/***************************** create user3 ********************************************/

		const createUser3 = await request(server)
        .post(`/users`)
        .auth("admin", "qwerty")
        .send({
			login: "3Mickle",
			password: "3qwerty",
			email: "3mpara7473@gmail.com",
		  });

		  const createAccessToken3 = await request(server)
		  .post("/auth/login")
		  .send({
			loginOrEmail: user.login,
			password: user.password,
		  });

		/***************************** create user4 ********************************************/

		const createUser4 = await request(server)
        .post(`/users`)
        .auth("admin", "qwerty")
        .send({
			login: "4Mickle",
			password: "4qwerty",
			email: "4mpara7473@gmail.com",
		  });

		  const createAccessToken4 = await request(server)
		  .post("/auth/login")
		  .send({
			loginOrEmail: user.login,
			password: user.password,
		  });

		/***************************** create user5 ********************************************/

		const createUser5 = await request(server)
        .post(`/users`)
        .auth("admin", "qwerty")
        .send({
			login: "5Mickle",
			password: "5qwerty",
			email: "5mpara7473@gmail.com",
		  });

		  const createAccessToken5 = await request(server)
		  .post("/auth/login")
		  .send({
			loginOrEmail: user.login,
			password: user.password,
		  });


		/***************************** create blog ********************************************/


      const createBlog = await request(server)
        .post("/sa/blogs")
        .auth("admin", "qwerty")
        .send({
          name: "Mickle",
          description: "my description",
          websiteUrl: "https://learn.javascript.ru",
        });


      expect(createBlog.status).toBe(HTTP_STATUS.CREATED_201);
      expect(createBlog.body).toEqual({
        id: expect.any(String),
        name: "Mickle",
        description: "my description",
        websiteUrl: "https://learn.javascript.ru",
        createdAt: expect.any(String),
        isMembership: false,
      });

    //   const blogId = createBlog.body.id;
	  blogIdAllPost = createBlog.body.id
      blogNameAllPosts = createBlog.body.name;

/*********************** create post ***********************************/

      const createPosts1 = await request(server)
        .post(`/sa/blogs/${blogIdAllPost}/posts`)
        .auth("admin", "qwerty")
        .send({
          title: "new title",
          shortDescription: "new shortDescription",
          content:
            "myContent I like javascript and I will be a developer in javascript, back end developer",
        });

	  postId1 = createPosts1.body.id;
      postData = createPosts1.body;
      expect(createPosts1.status).toBe(HTTP_STATUS.CREATED_201);
      expect(postData).toEqual({
        id: expect.any(String),
        title: createPosts1.body.title,
        shortDescription: createPosts1.body.shortDescription,
        content: createPosts1.body.content,
        blogId: blogIdAllPost,
        blogName: blogNameAllPosts,
        createdAt: expect.any(String),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: "None",
          newestLikes: [
            //   {
            // 	"addedAt": expect.any(String),
            // 	"userId": userId,
            // 	"login": userLogin
            //   }
          ],
        },
      })


	  const  createPosts2 = await request(server)
        .post(`/sa/blogs/${blogIdAllPost}/posts`)
        .auth("admin", "qwerty")
        .send({
          title: "2new title",
          shortDescription: "2new shortDescription",
          content:
            "2myContent I like javascript and I will be a developer in javascript, back end developer",
        })

		const  createPosts3 = await request(server)
		.post(`/sa/blogs/${blogIdAllPost}/posts`)
        .auth("admin", "qwerty")
        .send({
          title: "3new title",
          shortDescription: "3new shortDescription",
          content:
            "3myContent I like javascript and I will be a developer in javascript, back end developer",
        })


		const createPosts4 = await request(server)
       .post(`/sa/blogs/${blogIdAllPost}/posts`)
        .auth("admin", "qwerty")
        .send({
          title: "4new title",
          shortDescription: "4new shortDescription",
          content:
            "4myContent I like javascript and I will be a developer in javascript, back end developer",
        })

		const createPosts5 = await request(server)
       	.post(`/sa/blogs/${blogIdAllPost}/posts`)
        .auth("admin", "qwerty")
        .send({
          title: "5new title",
          shortDescription: "5new shortDescription",
          content:
            "5myContent I like javascript and I will be a developer in javascript, back end developer",
        })

		const createPosts6 = await request(server)
		.post(`/sa/blogs/${blogIdAllPost}/posts`)
        .auth("admin", "qwerty")
        .send({
          title: "6new title",
          shortDescription: "6new shortDescription",
          content:
            "6myContent I like javascript and I will be a developer in javascript, back end developer",
        })



/************************************** create like Post1 User1 *******************************************/

		const createLikePost1User1 = await request(server)
		.put(`/posts/${postId1}/like-status`)
		.set("Authorization", `Bearer ${tokenByUser1}`)
		.send({
			"likeStatus": "Like"
		})

		const getLikeAndCountPost1User1 = await request(server)
		.get(`/posts/${postId1}`)
        .set("Authorization", `Bearer ${tokenByUser1}`);

		const expectedPost1User1LikeInfo = {
					likesCount: 1,
			        dislikesCount: 0,
			        myStatus: 'Like',
					newestLikes: [
						{
							"addedAt": expect.any(String),
							"login": "1Mickle",
							"userId": expect.any(String),
						},
					]
				}
		expect(getLikeAndCountPost1User1.body.extendedLikesInfo).toEqual(expectedPost1User1LikeInfo)

/************************************** create like Post1 User2 *******************************************/


		const createLikePost1User2 = await request(server)
		.put(`/posts/${postId1}/like-status`)
		.set("Authorization", `Bearer ${createAccessToken2.body.accessToken}`)
		.send({
			"likeStatus": "Like"
		})
		.expect(204)

		const getLikeAndCountPost1User2 = await request(server)
			.get(`/posts/${postId1}`)
			.set("Authorization", `Bearer ${createAccessToken2.body.accessToken}`)

			const expectedPost1User2LikeInfo = {
				likesCount: 2,
				dislikesCount: 0,
				myStatus: "Like",
				newestLikes: [
					{
						"addedAt": expect.any(String),
						"login": "1Mickle",
						"userId": expect.any(String),
					},
					{
						"addedAt": expect.any(String),
						"login": "2Mickle",
						"userId": expect.any(String),
					},
				]
			}

		expect(getLikeAndCountPost1User2.body.extendedLikesInfo).toEqual(expectedPost1User2LikeInfo)

/************************************** create Post2 User2 **********************************************/

		// const createLikePost2User2 = await request(server)
		// .put(`/posts/${createPosts2.body.id}/like-status`)
		// .set("Authorization", `Bearer ${createAccessToken2.body.accessToken}`)
		// .send({
		// 	"likeStatus": "Like"
		// })

		// const getLikeAndCountPost2User2 = await request(server)
		// 	.get(`/posts/${postId1}`)
		// 	.set("Authorization", `Bearer ${createAccessToken2.body.accessToken}`)

		// const expectedPost2User2LikeInfo = {
		// 	likesCount: 2,
		// 		dislikesCount: 0,
		// 		myStatus: "Like",
		// 		newestLikes: [
		// 			{
		// 				"addedAt": expect.any(String),
		// 				"login": "2Mickle",
		// 				"userId": expect.any(String),
		// 			},
		// 		]
		// }

/************************************** create Post2 User3 **********************************************/

		// const createdislikePost2User3 = await request(server)
		// .put(`/posts/${createPosts2.body.id}/like-status`)
		// .set("Authorization", `Bearer ${createAccessToken3.body.accessToken}`)
		// .send({
		// 	"likeStatus": "Like"
		// })

/************************************** create Post3 User1 **********************************************/

		// const createDislikePos3tUser1 = await request(server)
		// .put(`/posts/${createPosts3.body.id}/like-status`)
		// .set("Authorization", `Bearer ${tokenByUser1}`)
		// .send({
		// 	"likeStatus": "Dislike"
		// })

/************************************** create Post4 User1 **********************************************/

		// const createLikePost4User1 = await request(server)
		// .put(`/posts/${createPosts4.body.id}/like-status`)
		// .set("Authorization", `Bearer ${tokenByUser1}`)
		// .send({
		// 	"likeStatus": "Like"
		// })

/************************************** create Post4 User4 **********************************************/

		// const createLikePost4User4 = await request(server)
		// .put(`/posts/${createPosts4.body.id}/like-status`)
		// .set("Authorization", `Bearer ${createAccessToken4.body.accessToken}`)
		// .send({
		// 	"likeStatus": "Like"
		// })

/************************************** create Post4 User2 **********************************************/

		// const createLikePost4User2 = await request(server)
		// .put(`/posts/${createPosts4.body.id}/like-status`)
		// .set("Authorization", `Bearer ${createAccessToken2.body.accessToken}`)
		// .send({
		// 	"likeStatus": "Like"
		// })

/************************************** create Post4 User3 **********************************************/

		// const createLikePost4User3 = await request(server)
		// .put(`/posts/${createPosts4.body.id}/like-status`)
		// .set("Authorization", `Bearer ${createAccessToken3.body.accessToken}`)
		// .send({
		// 	"likeStatus": "Like"
		// })

/************************************** create Post5 User2 **********************************************/

		// const createLikePost5User2 = await request(server)
		// .put(`/posts/${createPosts5.body.id}/like-status`)
		// .set("Authorization", `Bearer ${createAccessToken2.body.accessToken}`)
		// .send({
		// 	"likeStatus": "Like"
		// })

/************************************** create Post4 User3 **********************************************/

		// const createDislikePost5User3 = await request(server)
		// .put(`/posts/${createPosts5.body.id}/like-status`)
		// .set("Authorization", `Bearer ${createAccessToken3.body.accessToken}`)
		// .send({
		// 	"likeStatus": "Dislike"
		// })

/************************************** create Post6 User1 **********************************************/

		// const createLikePost6User1 = await request(server)
		// .put(`/posts/${createPosts6.body.id}/like-status`)
		// .set("Authorization", `Bearer ${tokenByUser1}`)
		// .send({
		// 	"likeStatus": "Like"
		// })

/************************************** create Post6 User2 **********************************************/

		// const createDislikePost6User2 = await request(server)
		// .put(`/posts/${createPosts6.body.id}/like-status`)
		// .set("Authorization", `Bearer ${createAccessToken2.body.accessToken}`)
		// .send({
		// 	"likeStatus": "Dislike"
		// })
    });

	/************************** get the post **********************************/

	// it("get post by user1 => return 200 status code", async () => {
    //     const getPostById1 = await request(server)
    //       .get(`/posts`)
    //       .set("Authorization", `Bearer ${tokenByUser1}`);

    //     console.log(getPostById1.body);
    //     expect(getPostById1.status).toBe(HTTP_STATUS.OK_200);
	// 	// expect(getPostById1.body[0]).toEqual()
	// 	//expect 1th element
	// 	const expectedFirstLikeInfo = {
	// 		likesCount: 3,
    //         dislikesCount: 1,
    //         myStatus: 'Like',
	// 	}

    //     expect(getPostById1.body.items[0].extendedLikesInfo).toStrictEqual({
    //       id: expect.any(String),
    //       title: postData.title,
    //       shortDescription: postData.shortDescription,
    //       content: postData.content,
    //       blogId: blogIdAllPost,
    //       blogName: blogNameAllPosts,
    //       createdAt: expect.any(String),
    //       extendedLikesInfo: {
    //         likesCount: expect.any(Number),
    //         dislikesCount: expect.any(Number),
    //         myStatus: expect.any(String),
    //         newestLikes: [
    //             {
    //           	"addedAt": expect.any(String),
    //           	"userId": userId,
    //           	"login": userLogin
    //             }
    //         ],
    //       },
    //     });
    //   });

	/**************************** get all posts **************************/

	  it("get all post", async() => {
		const getAllPostsByBlogId = await request(server)
          .get(`/sa/blogs/${blogIdAllPost}/posts`)
		  .set("admin", "querty")
        //   .set("Authorization", `Bearer ${tokenByUser1}`);

        console.log(getAllPostsByBlogId.body);
        expect(getAllPostsByBlogId.status).toBe(HTTP_STATUS.OK_200);
		expect(getAllPostsByBlogId.body).toEqual({
			          pagesCount: 1,
			          page: 1,
			          pageSize: 10,
			          totalCount: 1,
			          items: [
			            {
			              id: expect.any(String),
			              title: expect.any(String),
			              shortDescription: expect.any(String),
			              content: expect.any(String),
			              blogId: blogIdAllPost,
			              blogName: blogNameAllPosts,
			              createdAt: expect.any(String),
						  "extendedLikesInfo": {
							"likesCount": 0,
							"dislikesCount": 0,
							"myStatus": "None",
							"newestLikes": [
							//   {
							// 	"addedAt": expect.any(String),
							// 	"userId": userId,
							// 	"login": login
							//   }
							]
						  }
			            },
			          ],
			        })

		// const getAllPostByBlogId = await request(app)
		// .get(`/blogs/${blogIdAllPost}/posts`)
		// .set("Authorization", `Bearer ${tokenByUser1}`);
		// expect(getAllPosts.body).toEqual(getAllPostByBlogId.body)
	  })
  });
});
