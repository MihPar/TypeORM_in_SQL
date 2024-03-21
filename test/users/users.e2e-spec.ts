import { INestApplication } from '@nestjs/common';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { getAppAndCleanDB } from './test-utils';
import request from 'supertest';
  

describe('Users - /users (e2e)', () => {
  const createUser = (index: number) => ({
    firstName: 'FirstName #1' + index,
    lastName: 'LastName #1' + index,
  })

  let app: INestApplication;

  beforeAll(async () => {
	app = await getAppAndCleanDB()
  })
  let newUser1
  let newUser2
  let newUser3
  let newUser4

  it('Create uesr1 [POST /users]', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(createUser(1) as CreateUserDto)
      .expect(201)
      .then(({ body }) => {
		newUser1 = body
        expect(body).toEqual({
			...createUser(1),
			id: expect.any(Number)
		});
      });
  });

  it('Create user2 [POST /users]', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(createUser(2) as CreateUserDto)
      .expect(201)
      .then(({ body }) => {
		newUser2 = body
        expect(body).toEqual({
			...createUser(2),
			id: expect.any(Number)
		});
      });
  });

  it('Create user3 [POST /users]', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(createUser(3) as CreateUserDto)
      .expect(201)
      .then(({ body }) => {
		newUser3 = body
        expect(body).toEqual({
			...createUser(3),
			id: expect.any(Number)
		});
      });
  });
  
  it('Get all users [GET /users]', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('Get one user [GET /users/:id]', () => {
    return request(app.getHttpServer())
      .get('/users/2')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
      });
  });

//   it('Delete one user [DELETE /users/:id]', () => {
//     return request(app.getHttpServer()).delete('/users/1').expect(200);
//   });

  afterAll(async () => {
    await app.close();
  });

});
