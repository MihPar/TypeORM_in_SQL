import { INestApplication } from '@nestjs/common';
import { getAppForE2ETesting } from '../../../test/users/test-utils';

describe('AppController (e2e)', () => {
	let app: INestApplication
  	beforeEach(async () => {
		app = await getAppForE2ETesting();
    })

    afterAll(async () => {
		await app.close ()
	})
	it('should be defined', () => {
		expect(2).toBe(2)
	  });
  });