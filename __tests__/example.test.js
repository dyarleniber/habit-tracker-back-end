import supertest from 'supertest';
import mongoose from 'mongoose';

import server from '../src/server';

const request = supertest(server);

describe('Session authentication', () => {
  afterAll(() => mongoose.disconnect());

  it('example', async done => {
    const response = await request.get('/');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Hello World');

    done();
  });
});
