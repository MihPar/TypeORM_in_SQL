import { HttpStatus, INestApplication } from '@nestjs/common';
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

	let id: string
	let body: string
	let correctAnswers: string[]
	let published: boolean
	let createdAt: Date | null
	let updatedAt: Date | null

	let question: string[]
	let requestBody: {
		body: string,
		correctAnswers: string[]
	}

	let updateBody: {
		body: string,
		correctAnswers: string[]
	}

    it('create question', async () => {
      question = [
        'What is your name',
        'How old are you?',
        'Where are you from?',
        'What is your profession?',
        'What is your programmer`s language?',
        'What is your favorite framework?',
      ];

      requestBody = {
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

	  updateBody = {
        body: 'Question chapt_2',
        correctAnswers: [
          'Mickle1',
          '251',
          'Mexico1',
          'programmer1',
          'JS1',
          'Nest.js1',
        ],
      };
      const create = await request(server)
        .post('/sa/quiz/questions')
        .auth('admin', 'qwerty')
        .send(requestBody);

      expect(create.body).toEqual({
        id: expect.any(String),
        body: requestBody.body,
        correctAnswers: requestBody.correctAnswers,
        published: true,
        createdAt: expect.any(String),
        updatedAt: null,
      });

		id = create.body.id
		body = create.body.body
		correctAnswers = create.body.correctAnswers
		published = create.body.published
		createdAt = create.body.createdAt
		updatedAt = create.body.updatedAt
    });


	it('Get all questions', async() => {
		const getAllQuestions = await request(server)
			.get('/sa/quiz/questions')
			.auth('admin', 'qwerty')

			expect(getAllQuestions.status).toBe(HttpStatus.OK)

			expect(getAllQuestions.body.items[0].id).toEqual(id)
			expect(getAllQuestions.body.items[0].body).toEqual(body)
			expect(getAllQuestions.body.items[0].correctAnswers).toEqual(correctAnswers)
			expect(getAllQuestions.body.items[0].createdAt).toEqual(createdAt)
			expect(getAllQuestions.body.items[0].updatedAt).toEqual(updatedAt)
	})

	it('delete question by id', async() => {
		const deleteQuestionById = await request(server)
			.delete(`/sa/quiz/questions/${id}`)
			.auth('admin', 'qwerty')

		expect(deleteQuestionById.status).toBe(HttpStatus.NO_CONTENT)
	})

	it('Update question', async () => {
		const updateQuestion = await request(server)
			.put(`/sa/quiz/questions/${id}`)
			.auth('admin', 'qwerty')
			.send(updateBody)

		expect(updateQuestion.status).toBe(HttpStatus.NO_CONTENT)
	})

	it('Published question', async() => {
		const updatePublishedQuestion = await request(server)
			.put(`/sa/quiz/questions/${id}/publish`)
			.auth('admin', 'qwerty')
			.send({published: true})
		
		expect(updatePublishedQuestion.status).toBe(HttpStatus.NO_CONTENT)
	})
  });
});
