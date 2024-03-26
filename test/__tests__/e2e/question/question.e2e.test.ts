import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../src/app.module';
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

  describe('Quiz question', () => {
    it('create question', async () => {
      const question = [
        'What is your name',
        'How old are you?',
        'Where are you from?',
        'What is your profession?',
        'What is your programmer`s language?',
        'What is your favorite framework?',
      ];

      const requestBody = {
        body: 'Question chapt_1',
        correctAnswers: [
          'Mickle',
          '25',
          'Mexico',
          'programmer',
          'JS',
          'Nest.js',
        ],
      };
      const result = await request(server)
        .post('/sa/quiz/questions')
        .auth('admin', 'qwerty')
        .send(requestBody);

      expect(result.body).toEqual({
        id: expect.any(String),
        body: requestBody.body,
        correctAnswers: requestBody.correctAnswers,
        published: true,
        createdAt: expect.any(String),
        updatedAt: null,
      });
    });
  });
});
