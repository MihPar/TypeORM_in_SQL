import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../../src/app.module";
import request from "supertest";

describe('/blogs', () => {
	let app: INestApplication;
	let server: any;
	beforeAll(async () => {
	  const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	  }).compile();
  
	  app = moduleFixture.createNestApplication();
  
	  await app.init();
	  server = app.getHttpServer();
	});
  
	afterAll(async () => {
	  await app.close();
	});
  
	afterAll((done) => {
	  done();
	});
  
	let userLogin: string
	let userId: string
	let tokenByUser: string

	describe('Quiz question', () => {
		it("Connect with existing player or to create new pair which will be waiting second player", async () => {
			/************* create user *******/
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
		
			  tokenByUser = createAccessToken.body.accessToken;
			  expect(createAccessToken.status).toBe(HttpStatus.OK);
			  expect(createAccessToken.body).toEqual({
				accessToken: expect.any(String),
			  });

			  /***************** create new pair ***********************/
			const connectOrCreatePair = await request(server)
				.post('/pair-game-quiz/pairs/connection')
				.set("Authorization", `Bearer ${tokenByUser}`)

				expect(connectOrCreatePair.status).toBe(HttpStatus.OK)

		})
	})
})  