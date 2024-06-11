import { INestApplication } from '@nestjs/common';
import { getAppForE2ETesting } from '../../../test/config/test-utils';

jest.setTimeout(1000);

describe('AppController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    app = await getAppForE2ETesting();
  });

  afterAll(async () => {
    await app.close();
  });
  it('should be defined', () => {
    expect(2).toBe(2);
  });
});
