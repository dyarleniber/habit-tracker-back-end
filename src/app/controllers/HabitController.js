import Habit from '../models/Habit';
import Cache from '../../lib/Cache';

class HabitController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const cacheKey = `user:${req.userId}:habits:${page}`;

    const cached = await Cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

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
        select: 'name email createdAt updatedAt',
      },
      sort: '-createdAt',
    });

    await Cache.set(cacheKey, habits);

    return res.json(habits);
  }

  async show(req, res) {
    try {
      const habit = await Habit.findById(req.params.id).populate({
        path: 'user',
        select: 'name email createdAt updatedAt',
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

  async check(req, res) {
    res.json({ message: 'Ok' });
  }
}

export default new HabitController();
