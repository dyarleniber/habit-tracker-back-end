import Habit from '../models/Habit';
import Cache from '../../lib/Cache';
import CheckHabitService from '../services/CheckHabitService';

class HabitController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const filters = {};

    filters.user = req.userId;

    if (req.query.name) {
      filters.name = new RegExp(req.query.name, 'i');
    }

    if (req.query.description) {
      filters.description = new RegExp(req.query.description, 'i');
    }

    const habits = await Habit.paginate(filters, {
      page,
      limit: 20,
      populate: {
        path: 'user',
        select: '-password',
      },
      sort: '-createdAt',
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
    const date = new Date(Number(req.params.date));

    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const { page = 1 } = req.query;

    date.setHours(23, 59, 59, 59);

    const cacheKey = `user:${
      req.userId
    }:habits:page:${page}:date:${date.getTime()}`;

    const cached = await Cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const filters = {};

    filters.user = req.userId;

    filters.createdAt = {};
    filters.createdAt.$lte = date;

    const initialCheckDate = new Date(date.getTime());
    initialCheckDate.setHours(0, 0, 0, 0);

    const finalCheckDate = new Date(date.getTime());
    finalCheckDate.setHours(0, 0, 0, 0);
    finalCheckDate.setDate(date.getDate() + 1);

    const habits = await Habit.paginate(filters, {
      page,
      limit: 20,
      populate: [
        {
          path: 'user',
          select: '-password',
        },
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
      ],
      sort: '-createdAt',
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
