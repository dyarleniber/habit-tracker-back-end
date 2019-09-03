import supertest from 'supertest';

import server from '../../src/server';
import factory from '../factories';
import databaseUtils from '../utils/database';

const request = supertest(server);

describe('Session authentication', () => {
  afterEach(() => databaseUtils.truncate());

  afterAll(() => databaseUtils.disconnect());

  it('should not be able to authenticate with empty data', async done => {
    const response = await request.post('/sessions').send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(Array.isArray(response.body.error)).toBe(true);

    done();
  });

  it('should not be able to authenticate with invalid data', async done => {
    const user = await factory.build('User');

    const response = await request.post('/sessions').send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'User not found');

    done();
  });

  it('should not be able to authenticate with invalid email', async done => {
    const user = await factory.create('User', {
      email: 'invalidemail',
      password: '123123',
    });

    const response = await request.post('/sessions').send({
      email: user.email,
      password: '123123',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(Array.isArray(response.body.error)).toBe(true);

    done();
  });

  it('should not be able to authenticate with invalid password', async done => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request.post('/sessions').send({
      email: user.email,
      password: '321321',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid password');

    done();
  });

  it('should be able to authenticate with valid credentials', async done => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request.post('/sessions').send({
      email: user.email,
      password: '123123',
    });

    expect(response.status).toBe(200);

    done();
  });

  it('should return a token when authenticated', async done => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request.post('/sessions').send({
      email: user.email,
      password: '123123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');

    done();
  });
});
