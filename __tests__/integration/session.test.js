import supertest from 'supertest';

import factory from '../factory';
import server from '../../src/server';

const request = supertest(server);

describe('Session authentication', () => {
  it('should not be able to authenticate with empty data', async () => {
    const response = await request.post('/sessions').send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(Array.isArray(response.body.error)).toBe(true);
  });

  it('should not be able to authenticate with invalid data', async () => {
    const user = await factory.build('User');

    const response = await request.post('/sessions').send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it('should not be able to authenticate with invalid email', async () => {
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
  });

  it('should not be able to authenticate with invalid password', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request.post('/sessions').send({
      email: user.email,
      password: '321321',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid password');
  });

  it('should be able to authenticate with valid credentials', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request.post('/sessions').send({
      email: user.email,
      password: '123123',
    });

    expect(response.status).toBe(200);
  });

  it('should return a token when authenticated', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request.post('/sessions').send({
      email: user.email,
      password: '123123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
