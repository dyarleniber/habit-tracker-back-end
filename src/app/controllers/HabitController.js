import { startOfDay, endOfDay, addDays } from 'date-fns';

import Habit from '../models/Habit';
import Cache from '../../lib/Cache';
import GetHabitsService from '../services/GetHabitsService';
import CheckHabitService from '../services/CheckHabitService';

class HabitController {
  async index(req, res) {
    const habits = await GetHabitsService.run({
      userId: req.userId,
      filters: req.query,
    });

    return res.json(habits);
  }

  async show(req, res) {
    try {
      const habit = await Habit.findById(req.params.id).populate({
        path: 'user',
        select: '-password',
      });

      if (!habit.user._id.equals(req.userId)) {
        return res.status(401).json({ error: 'You are not the habit author' });
      }

      return res.json(habit);
    } catch (err) {
      return res.status(400).json({ error: 'Habit not found' });
    }
  }

  async store(req, res) {
    const habit = new Habit({
      name: req.body.name,
      description: req.body.description,
      user: req.userId,
    });

    await habit.save();

    await Cache.invalidatePrefix(`user:${req.userId}:habits`);

    return res.json(habit);
  }

  async update(req, res) {
    try {
      const habit = await Habit.findById(req.params.id);

      if (!habit.user.equals(req.userId)) {
        return res.status(401).json({ error: 'You are not the habit author' });
      }

      habit.set(req.body);

      await habit.save();

      await Cache.invalidatePrefix(`user:${req.userId}:habits`);

      return res.json(habit);
    } catch (err) {
      return res.status(400).json({ error: 'Habit not found' });
    }
  }

  async delete(req, res) {
    try {
      const habit = await Habit.findById(req.params.id);

      if (!habit.user.equals(req.userId)) {
        return res.status(401).json({ error: 'You are not the habit author' });
      }

      await habit.remove();

      await Cache.invalidatePrefix(`user:${req.userId}:habits`);

      return res.send();
    } catch (err) {
      return res.status(400).json({ error: 'Habit not found' });
    }
  }

  async getByDate(req, res) {
    const { page = 1 } = req.query;

    const date = endOfDay(new Date(Number(req.params.date)));

    const cacheKey = `user:${
      req.userId
    }:habits:page:${page}:date:${date.getTime()}`;

    const cached = await Cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const filters = {
      page,
      createdAt: {
        $lte: date,
      },
    };

    const initialCheckDate = startOfDay(date);

    const finalCheckDate = addDays(startOfDay(date), 1);

    const populate = [
      {
        path: 'check',
        match: {
          createdAt: {
            $gte: initialCheckDate,
            $lt: finalCheckDate,
          },
        },
        options: { limit: 1 },
        sort: '-createdAt',
      },
    ];

    const habits = await GetHabitsService.run({
      userId: req.userId,
      filters,
      populate,
    });

    await Cache.set(cacheKey, habits);

    return res.json(habits);
  }

  async check(req, res) {
    const checkHabit = await CheckHabitService.run({
      habitId: req.params.id,
      userId: req.userId,
    });

    return res.json(checkHabit);
  }
}

export default new HabitController();
