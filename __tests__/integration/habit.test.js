import supertest from 'supertest';
import Redis from 'ioredis';
import { endOfDay, addDays, subDays } from 'date-fns';

import factory from '../factory';
import app from '../../src/app';
import authHelper from '../../src/app/helpers/auth';
import HabitModel from '../../src/app/models/Habit';
import HabitCheckedModel from '../../src/app/models/HabitChecked';

const request = supertest(app);

describe('Habit', () => {
  /**
   * Show habits
   */

  it('should not be able to get habits with invalid filters', async () => {
    const user = await factory.create('User');

    const response = await request
      .get('/habits?id=1')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(Array.isArray(response.body.error)).toBe(true);
  });

  it('should be able to get habits', async () => {
    const user = await factory.create('User');
    const habit = await factory.create('Habit', {
      user: user.id,
    });

    const response = await request
      .get('/habits')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('docs');
    expect(response.body).toHaveProperty('totalDocs', 1);
    expect(response.body).toHaveProperty('limit', 20);
    expect(response.body).toHaveProperty('page', 1);
    expect(response.body).toHaveProperty('totalPages', 1);

    expect(Array.isArray(response.body.docs)).toBe(true);
    expect(response.body.docs.length).toBe(1);

    expect(response.body.docs[0]._id).toBe(habit.id);
    expect(response.body.docs[0].name).toBe(habit.name);
    expect(response.body.docs[0].description).toBe(habit.description);

    expect(response.body.docs[0].user._id).toBe(user.id);
    expect(response.body.docs[0].user.name).toBe(user.name);
    expect(response.body.docs[0].user.email).toBe(user.email);
    expect(response.body.docs[0].user).not.toHaveProperty('password');
  });

  it('should be able to get habits with correct pagination', async () => {
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
    expect(response.body).toHaveProperty('totalDocs', 21);
    expect(response.body).toHaveProperty('limit', 20);
    expect(response.body).toHaveProperty('page', 1);
    expect(response.body).toHaveProperty('totalPages', 2);
    expect(Array.isArray(response.body.docs)).toBe(true);
    expect(response.body.docs.length).toBe(20);

    response = await request
      .get('/habits?page=2')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('docs');
    expect(response.body).toHaveProperty('totalDocs', 21);
    expect(response.body).toHaveProperty('limit', 20);
    expect(response.body).toHaveProperty('page', 2);
    expect(response.body).toHaveProperty('totalPages', 2);
    expect(Array.isArray(response.body.docs)).toBe(true);
    expect(response.body.docs.length).toBe(1);
  });

  it('should be able to get filtered habits', async () => {
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
    expect(response.body).toHaveProperty('totalDocs', 1);
    expect(response.body).toHaveProperty('limit', 20);
    expect(response.body).toHaveProperty('page', 1);
    expect(response.body).toHaveProperty('totalPages', 1);
    expect(Array.isArray(response.body.docs)).toBe(true);
    expect(response.body.docs.length).toBe(1);
    expect(response.body.docs[0].name).toBe('habit01');
    expect(response.body.docs[0].description).toBe('description01');

    response = await request
      .get('/habits?description=description02')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('docs');
    expect(response.body).toHaveProperty('totalDocs', 1);
    expect(response.body).toHaveProperty('limit', 20);
    expect(response.body).toHaveProperty('page', 1);
    expect(response.body).toHaveProperty('totalPages', 1);
    expect(Array.isArray(response.body.docs)).toBe(true);
    expect(response.body.docs.length).toBe(1);
    expect(response.body.docs[0].name).toBe('habit02');
    expect(response.body.docs[0].description).toBe('description02');
  });

  it('should be able to get only authenticated user habits', async () => {
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
    expect(response.body).toHaveProperty('totalDocs', 2);
    expect(response.body).toHaveProperty('limit', 20);
    expect(response.body).toHaveProperty('page', 1);
    expect(response.body).toHaveProperty('totalPages', 1);

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
  });

  /**
   * Show habit
   */

  it('should not be able get habit with invalid habit id', async () => {
    const user = await factory.create('User');

    const response = await request
      .get('/habits/invalidhabitid')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Habit not found');
  });

  it('should not be able get habit with habit id of another user', async () => {
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
  });

  it('should be able to get habit with valid habit id', async () => {
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
  });

  /**
   * Store habit
   */

  it('should not be able create habit with empty data', async () => {
    const user = await factory.create('User');

    const response = await request
      .post('/habits')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(Array.isArray(response.body.error)).toBe(true);
  });

  it('should be able to create habit with valid data', async () => {
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
  });

  /**
   * Update habit
   */

  it('should not be able update habit with invalid habit id', async () => {
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
  });

  it('should not be able update habit with habit id of another user', async () => {
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
  });

  it('should not be able to update habit with invalid data', async () => {
    const user = await factory.create('User');

    const habit = await factory.create('Habit', {
      user: user.id,
    });

    const response = await request
      .put(`/habits/${habit.id}`)
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`)
      .send({
        id: 1,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(Array.isArray(response.body.error)).toBe(true);
  });

  it('should be able to update habit with valid data', async () => {
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
  });

  /**
   * Delete habit
   */

  it('should not be able delete habit with invalid habit id', async () => {
    const user = await factory.create('User');

    const response = await request
      .delete('/habits/invalidhabitid')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Habit not found');
  });

  it('should not be able delete habit with habit id of another user', async () => {
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
  });

  it('should be able to delete habit and check habits with valid habit id', async () => {
    const user = await factory.create('User');
    const habit = await factory.create('Habit', {
      user: user.id,
    });
    const habitChecked1 = await factory.create('HabitChecked', {
      habit: habit.id,
    });
    const habitChecked2 = await factory.create('HabitChecked', {
      habit: habit.id,
    });

    const response = await request
      .delete(`/habits/${habit.id}`)
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(200);

    const habitExists = await HabitModel.findById(habit.id);
    const habitChecked1Exists = await HabitCheckedModel.findById(
      habitChecked1.id
    );
    const habitChecked2Exists = await HabitCheckedModel.findById(
      habitChecked2.id
    );

    expect(habitExists).toBeFalsy();
    expect(habitChecked1Exists).toBeFalsy();
    expect(habitChecked2Exists).toBeFalsy();
  });

  /**
   * Get habits by date
   */

  it('should not be able to get habits with an invalid date', async () => {
    const user = await factory.create('User');

    const response = await request
      .get('/habits/date/invaliddate')
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid date');
  });

  it('should be able to get habits by date with a valid date', async () => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const tomorrow = addDays(today, 1);

    // It should search for all habits for today
    const searchDate = today;

    // It's is not the user used in authentication
    const user1 = await factory.create('User', {
      email: 'email1@email.com',
    });

    // It's is the user used in authentication
    const user2 = await factory.create('User', {
      email: 'email2@email.com',
    });

    // It SHOULD NOT RETURN habits of another users
    await factory.create('Habit', {
      user: user1.id,
      createdAt: yesterday,
    });

    // It SHOULD RETURN habits with creation date before or equals to search date
    const habit2 = await factory.create('Habit', {
      user: user2.id,
      createdAt: yesterday,
    });
    const habit3 = await factory.create('Habit', {
      user: user2.id,
      createdAt: today,
    });

    // It SHOULD NOT RETURN habits with creation date after the search date
    await factory.create('Habit', {
      user: user2.id,
      createdAt: tomorrow,
    });

    // It SHOULD RETURN check register for a date equals to search date
    const habitChecked1 = await factory.create('HabitChecked', {
      habit: habit2.id,
      createdAt: today,
    });

    // It SHOULD NOT RETURN check register for a date different to the search date
    await factory.create('HabitChecked', {
      habit: habit3.id,
      createdAt: yesterday,
    });

    const response = await request
      .get(`/habits/date/${searchDate.getTime()}`)
      .set('Authorization', `Bearer ${authHelper.generateToken(user2.id)}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('totalDocs', 2);

    expect(response.body).toHaveProperty('docs');
    expect(response.body.docs.length).toBe(2);

    expect(response.body.docs[0]._id).toBe(habit3.id);
    expect(response.body.docs[0].user._id).toBe(user2.id);
    expect(response.body.docs[0].check.length).toBe(0);

    expect(response.body.docs[1]._id).toBe(habit2.id);
    expect(response.body.docs[1].user._id).toBe(user2.id);
    expect(response.body.docs[1].check.length).toBe(1);
    expect(response.body.docs[1].check[0]._id).toBe(habitChecked1.id);
  });

  it('should be able to get cached habits by date', async () => {
    const page = 1;
    const searchDate = endOfDay(new Date());

    const user = await factory.create('User');
    await factory.create('Habit', {
      user: user.id,
      createdAt: searchDate,
    });
    await factory.create('Habit', {
      user: user.id,
      createdAt: searchDate,
    });

    const cachedHabits = {
      cached: true,
    };

    const spy = jest
      .spyOn(Redis.prototype, 'get')
      .mockReturnValue(JSON.stringify(cachedHabits));

    const response = await request
      .get(`/habits/date/${searchDate.getTime()}?page=${page}`)
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(cachedHabits);

    const cacheKey = `user:${
      user.id
    }:habits:page:${page}:date:${searchDate.getTime()}`;

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(cacheKey);

    spy.mockRestore();
  });

  /**
   * Check habit
   */

  it('should not be able check habit with invalid habit id', async () => {
    const user = await factory.create('User');
    const habitId = 'invalidhabitid';

    const response = await request
      .post(`/habits/${habitId}/check`)
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Habit not found');
  });

  it('should not be able check habit with habit id of another user', async () => {
    const user1 = await factory.create('User', {
      email: 'email1@email.com',
    });

    const user2 = await factory.create('User', {
      email: 'email2@email.com',
    });

    const habit = await factory.create('Habit', {
      user: user1.id,
    });

    const response = await request
      .post(`/habits/${habit.id}/check`)
      .set('Authorization', `Bearer ${authHelper.generateToken(user2.id)}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      'error',
      'You are not the habit author'
    );
  });

  it('should not be able check habit already checked for the current date', async () => {
    const user = await factory.create('User');
    const habit = await factory.create('Habit', {
      user: user.id,
    });

    await factory.create('HabitChecked', {
      habit: habit.id,
    });

    const response = await request
      .post(`/habits/${habit.id}/check`)
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Habit already checked');
  });

  it('should be able to check habit with valid habit id', async () => {
    const user = await factory.create('User');
    const habit = await factory.create('Habit', {
      user: user.id,
    });

    const response = await request
      .post(`/habits/${habit.id}/check`)
      .set('Authorization', `Bearer ${authHelper.generateToken(user.id)}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.habit).toBe(habit.id);

    const today = new Date();
    const createdAt = new Date(response.body.createdAt);

    expect(createdAt.getDate()).toBe(today.getDate());
    expect(createdAt.getMonth()).toBe(today.getMonth());
    expect(createdAt.getFullYear()).toBe(today.getFullYear());
  });
});
