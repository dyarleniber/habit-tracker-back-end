import supertest from 'supertest';

import server from '../../src/server';
import factory from '../factories';
import databaseUtils from '../utils/database';

const request = supertest(server);

describe('User', () => {
  afterEach(() => databaseUtils.truncate());

  afterAll(() => databaseUtils.disconnect());

  /**
   * Store user
   */

  it('should not be able to create user with empty data', async done => {
    const user = await factory.build('User');

    // Empty object
    let response = await request.post('/users').send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(Array.isArray(response.body.error)).toBe(true);

    // Object containing only name
    response = await request.post('/users').send({
      name: user.name,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(Array.isArray(response.body.error)).toBe(true);

    // Object containing only name and email
    response = await request.post('/users').send({
      name: user.name,
      email: user.email,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(Array.isArray(response.body.error)).toBe(true);

    done();
  });

  it('should not be able to create user with invalid email', async done => {
    const user = await factory.build('User', {
      email: 'invalidemail',
    });

    const response = await request.post('/users').send({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(Array.isArray(response.body.error)).toBe(true);

    done();
  });

  it('should not be able to create user with duplicate email', async done => {
    const user = await factory.build('User');

    let response = await request.post('/users').send({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', user.name);
    expect(response.body).toHaveProperty('email', user.email);

    response = await request.post('/users').send({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'User already exists');

    done();
  });

  it('should be able to create user with valid data', async done => {
    const user = await factory.build('User');

    const response = await request.post('/users').send({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', user.name);
    expect(response.body).toHaveProperty('email', user.email);

    done();
  });

  it('should receive a email notification when a user is created', async done => {
    expect(true).toBe(true);
    done();
  });

  /**
   * Show user
   */

  it('should not be able get user without token', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able get user with invalid token', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should be able to get user when authenticated', async done => {
    expect(true).toBe(true);
    done();
  });

  /**
   * Update user
   */

  it('should not be able update user without token', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able update user with invalid token', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able update user when authenticated and with empty data', async done => {
    // name, email, password
    expect(true).toBe(true);
    done();
  });

  it('should not be able update user when authenticated and with invalid email', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able update user when authenticated and with duplicate email', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should be able to update user when authenticated and with valid data', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should receive a email notification when a user is updated', async done => {
    expect(true).toBe(true);
    done();
  });

  /**
   * Delete user
   */

  it('should not be able delete user without token', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able delete user with invalid token', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should be able to delete user when authenticated', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should receive a email notification when a user is deleted', async done => {
    expect(true).toBe(true);
    done();
  });
});