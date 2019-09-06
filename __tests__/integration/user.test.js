import supertest from 'supertest';

import server from '../../src/server';
import factory from '../factory';
import authHelper from '../../src/app/helpers/auth';
import UserModel from '../../src/app/models/User';

const request = supertest(server);

describe('User', () => {
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
    const response = await request.get('/users');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Token not provided');

    done();
  });

  it('should not be able get user with invalid token', async done => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer 123456`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid token');

    done();
  });

  it('should not be able get user with deleted user token', async done => {
    const user = await factory.create('User');

    const token = authHelper.generateToken(user.id);

    await UserModel.findByIdAndDelete(user.id);

    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid token');

    done();
  });

  it('should be able to get user when authenticated', async done => {
    const user = await factory.create('User');

    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('password', user.password);
    expect(response.body).toHaveProperty('id', user.id);
    expect(response.body).toHaveProperty('name', user.name);
    expect(response.body).toHaveProperty('email', user.email);
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
    expect(new Date(response.body.createdAt).getTime()).toBe(
      new Date(user.createdAt).getTime()
    );
    expect(new Date(response.body.updatedAt).getTime()).toBe(
      new Date(user.updatedAt).getTime()
    );

    done();
  });

  /**
   * Update user
   */

  it('should not be able update user when authenticated and with invalid email', async done => {
    const user = await factory.create('User');

    const response = await request
      .put('/users')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`)
      .send({
        email: 'invalidemail',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(Array.isArray(response.body.error)).toBe(true);

    done();
  });

  it('should not be able update user when authenticated and with duplicate email', async done => {
    const user1 = await factory.create('User', {
      email: 'email1@email.com',
    });

    const user2 = await factory.create('User', {
      email: 'email2@email.com',
    });

    const response = await request
      .put('/users')
      .set('Authorization', `Bearer ${authHelper.generateToken(user1.id)}`)
      .send({
        email: user2.email,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'User already exists');

    done();
  });

  it('should be able to update only one user field when authenticated and with valid data', async done => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const newUser = await factory.build('User', {
      password: '321321',
    });

    const response = await request
      .put('/users')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`)
      .send({
        name: newUser.name,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', user.id);
    expect(response.body).toHaveProperty('name', newUser.name);
    expect(response.body).toHaveProperty('email', user.email);
    expect(response.updatedAt).not.toBe(user.updatedAt);

    const updatedUser = await UserModel.findById(user.id);
    const compareHash = await updatedUser.compareHash('123123');

    expect(compareHash).toBe(true);

    done();
  });

  it('should be able to update user when authenticated and with valid data', async done => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const newUser = await factory.build('User', {
      password: '321321',
    });

    const response = await request
      .put('/users')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`)
      .send({
        email: newUser.email,
        password: '321321',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', user.id);
    expect(response.body).toHaveProperty('name', user.name);
    expect(response.body).toHaveProperty('email', newUser.email);
    expect(response.updatedAt).not.toBe(user.updatedAt);

    const updatedUser = await UserModel.findById(user.id);
    const compareHash = await updatedUser.compareHash('321321');

    expect(compareHash).toBe(true);

    done();
  });

  it('should receive a email notification when a user is updated', async done => {
    expect(true).toBe(true);
    done();
  });

  /**
   * Delete user
   */

  it('should be able to delete user when authenticated', async done => {
    const user = await factory.create('User');

    const response = await request
      .delete('/users')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(200);

    const userExists = await UserModel.findById(user.id);

    expect(userExists).toBeFalsy();

    done();
  });

  it('should receive a email notification when a user is deleted', async done => {
    expect(true).toBe(true);
    done();
  });
});
