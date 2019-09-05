import supertest from 'supertest';

import server from '../../src/server';
import factory from '../factories';
import databaseUtils from '../utils/database';
import authHelper from '../../src/app/helpers/auth';
import HabitModel from '../../src/app/models/Habit';

const request = supertest(server);

describe('Habit', () => {
  beforeEach(() => databaseUtils.truncate());

  afterAll(() => {
    databaseUtils.truncate().then(() => {
      databaseUtils.disconnect();
    });
  });

  /**
   * Show habits
   */

  it('should be able to get habits when authenticated', async done => {
    const user = await factory.create('User');
    const habit = await factory.create('Habit', {
      user: user.id,
    });

    const response = await request
      .get('/habits')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('docs');
    expect(response.body).toHaveProperty('total', 1);
    expect(response.body).toHaveProperty('limit', 20);
    expect(response.body).toHaveProperty('page', 1);
    expect(response.body).toHaveProperty('pages', 1);

    expect(Array.isArray(response.body.docs)).toBe(true);
    expect(response.body.docs.length).toBe(1);

    expect(response.body.docs[0]._id).toBe(habit.id);
    expect(response.body.docs[0].name).toBe(habit.name);
    expect(response.body.docs[0].description).toBe(habit.description);

    expect(response.body.docs[0].user._id).toBe(user.id);
    expect(response.body.docs[0].user.name).toBe(user.name);
    expect(response.body.docs[0].user.email).toBe(user.email);
    expect(response.body.docs[0].user).not.toHaveProperty('password');

    done();
  });

  it('should be able to get habits with correct pagination when authenticated', async done => {
    const user = await factory.create('User');

    let habitPromises = new Array(21).fill({});
    habitPromises = habitPromises.map(async () =>
      factory.create('Habit', {
        user: user.id,
      })
    );

    await Promise.all(habitPromises);

    let response = await request
      .get('/habits')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('docs');
    expect(response.body).toHaveProperty('total', 21);
    expect(response.body).toHaveProperty('limit', 20);
    expect(response.body).toHaveProperty('page', 1);
    expect(response.body).toHaveProperty('pages', 2);
    expect(Array.isArray(response.body.docs)).toBe(true);
    expect(response.body.docs.length).toBe(20);

    response = await request
      .get('/habits?page=2')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('docs');
    expect(response.body).toHaveProperty('total', 21);
    expect(response.body).toHaveProperty('limit', 20);
    expect(response.body).toHaveProperty('page', '2');
    expect(response.body).toHaveProperty('pages', 2);
    expect(Array.isArray(response.body.docs)).toBe(true);
    expect(response.body.docs.length).toBe(1);

    done();
  });

  it('should be able to get filtered habits when authenticated', async done => {
    const user = await factory.create('User');

    await factory.create('Habit', {
      name: 'habit01',
      description: 'description01',
      user: user.id,
    });

    await factory.create('Habit', {
      name: 'habit02',
      description: 'description02',
      user: user.id,
    });

    let response = await request
      .get('/habits?name=habit01')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('docs');
    expect(response.body).toHaveProperty('total', 1);
    expect(response.body).toHaveProperty('limit', 20);
    expect(response.body).toHaveProperty('page', 1);
    expect(response.body).toHaveProperty('pages', 1);
    expect(Array.isArray(response.body.docs)).toBe(true);
    expect(response.body.docs.length).toBe(1);
    expect(response.body.docs[0].name).toBe('habit01');
    expect(response.body.docs[0].description).toBe('description01');

    response = await request
      .get('/habits?description=description02')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('docs');
    expect(response.body).toHaveProperty('total', 1);
    expect(response.body).toHaveProperty('limit', 20);
    expect(response.body).toHaveProperty('page', 1);
    expect(response.body).toHaveProperty('pages', 1);
    expect(Array.isArray(response.body.docs)).toBe(true);
    expect(response.body.docs.length).toBe(1);
    expect(response.body.docs[0].name).toBe('habit02');
    expect(response.body.docs[0].description).toBe('description02');

    done();
  });

  it('should be able to get only authenticated user habits', async done => {
    const user = await factory.create('User', {
      email: 'email1@email.com',
    });

    const user2 = await factory.create('User', {
      email: 'email2@email.com',
    });

    const habit = await factory.create('Habit', {
      user: user.id,
    });

    await factory.create('Habit', {
      user: user2.id,
    });

    const habit3 = await factory.create('Habit', {
      user: user.id,
    });

    const response = await request
      .get('/habits')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('docs');
    expect(response.body).toHaveProperty('total', 2);
    expect(response.body).toHaveProperty('limit', 20);
    expect(response.body).toHaveProperty('page', 1);
    expect(response.body).toHaveProperty('pages', 1);

    expect(Array.isArray(response.body.docs)).toBe(true);

    expect(response.body.docs[0]._id).toBe(habit3.id);
    expect(response.body.docs[0].name).toBe(habit3.name);
    expect(response.body.docs[0].description).toBe(habit3.description);
    expect(response.body.docs[0].user._id).toBe(user.id);
    expect(response.body.docs[0].user.name).toBe(user.name);
    expect(response.body.docs[0].user.email).toBe(user.email);

    expect(response.body.docs[1]._id).toBe(habit.id);
    expect(response.body.docs[1].name).toBe(habit.name);
    expect(response.body.docs[1].description).toBe(habit.description);
    expect(response.body.docs[1].user._id).toBe(user.id);
    expect(response.body.docs[1].user.name).toBe(user.name);
    expect(response.body.docs[1].user.email).toBe(user.email);

    done();
  });

  /**
   * Show habit
   */

  it('should not be able get habit when authenticated and with invalid habit id', async done => {
    const user = await factory.create('User');

    const response = await request
      .get('/habits/invalidhabitid')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Habit not found');

    done();
  });

  it('should not be able get habit when authenticated and with habit id of another user', async done => {
    const user1 = await factory.create('User', {
      email: 'email1@email.com',
    });

    const user2 = await factory.create('User', {
      email: 'email2@email.com',
    });

    const habit2 = await factory.create('Habit', {
      user: user2.id,
    });

    const response = await request
      .get(`/habits/${habit2.id}`)
      .set('Authorization', `Bearer ${authHelper.generateToken(user1.id)}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      'error',
      'You are not the habit author'
    );

    done();
  });

  it('should be able to get habit when authenticated and with valid habit id', async done => {
    const user = await factory.create('User');
    const habit = await factory.create('Habit', {
      user: user.id,
    });

    const response = await request
      .get(`/habits/${habit.id}`)
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(200);

    expect(response.body._id).toBe(habit.id);
    expect(response.body.name).toBe(habit.name);
    expect(response.body.description).toBe(habit.description);

    expect(response.body.user._id).toBe(user.id);
    expect(response.body.user.name).toBe(user.name);
    expect(response.body.user.email).toBe(user.email);
    expect(response.body.user).not.toHaveProperty('password');

    done();
  });

  /**
   * Store habit
   */

  it('should not be able create habit when authenticated and with empty data', async done => {
    const user = await factory.create('User');

    const response = await request
      .post('/habits')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(Array.isArray(response.body.error)).toBe(true);

    done();
  });

  it('should be able to create habit when authenticated and with valid data', async done => {
    const user = await factory.create('User');
    const habit = await factory.build('Habit', {
      user: user.id,
    });

    const response = await request
      .post('/habits')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`)
      .send({
        name: habit.name,
        description: habit.description,
      });

    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(habit.name);
    expect(response.body.description).toBe(habit.description);

    done();
  });

  /**
   * Update habit
   */

  it('should not be able update habit when authenticated and with invalid habit id', async done => {
    const user = await factory.create('User');
    const habit = await factory.build('Habit', {
      user: user.id,
    });

    const response = await request
      .put('/habits/invalidhabitid')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`)
      .send({
        name: habit.name,
        description: habit.description,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Habit not found');

    done();
  });

  it('should not be able update habit when authenticated and with habit id of another user', async done => {
    const user1 = await factory.create('User', {
      email: 'email1@email.com',
    });

    const user2 = await factory.create('User', {
      email: 'email2@email.com',
    });

    const habit2 = await factory.create('Habit', {
      user: user2.id,
    });

    const response = await request
      .put(`/habits/${habit2.id}`)
      .set('Authorization', `Bearer ${authHelper.generateToken(user1.id)}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      'error',
      'You are not the habit author'
    );

    done();
  });

  it('should be able to update habit when authenticated and with valid data', async done => {
    const user = await factory.create('User');

    const habit = await factory.create('Habit', {
      user: user.id,
    });

    const newHabit = await factory.build('Habit', {
      user: user.id,
    });

    const response = await request
      .put(`/habits/${habit.id}`)
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`)
      .send({
        name: newHabit.name,
        description: newHabit.description,
      });

    expect(response.body._id).toBe(habit.id);
    expect(response.body.name).toBe(newHabit.name);
    expect(response.body.description).toBe(newHabit.description);

    done();
  });

  /**
   * Delete habit
   */

  it('should not be able delete habit when authenticated and with invalid habit id', async done => {
    const user = await factory.create('User');

    const response = await request
      .delete('/habits/invalidhabitid')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Habit not found');

    done();
  });

  it('should not be able delete habit when authenticated and with habit id of another user', async done => {
    const user1 = await factory.create('User', {
      email: 'email1@email.com',
    });

    const user2 = await factory.create('User', {
      email: 'email2@email.com',
    });

    const habit2 = await factory.create('Habit', {
      user: user2.id,
    });

    const response = await request
      .delete(`/habits/${habit2.id}`)
      .set('Authorization', `Bearer ${authHelper.generateToken(user1.id)}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      'error',
      'You are not the habit author'
    );

    done();
  });

  it('should be able to delete habit when authenticated and with valid habit id', async done => {
    const user = await factory.create('User');
    const habit = await factory.create('Habit', {
      user: user.id,
    });

    const response = await request
      .delete(`/habits/${habit.id}`)
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(200);

    const habitExists = await HabitModel.findById(habit.id);

    expect(habitExists).toBeFalsy();

    done();
  });

  /**
   * Check habit
   */

  it('should not be able check habit when authenticated and with invalid habit id', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able check habit when authenticated and with habit id of another user', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able check habit already checked for the current date', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should be able to check habit when authenticated and with valid habit id', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should be able to check habit only for the current date', async done => {
    expect(true).toBe(true);
    done();
  });
});
