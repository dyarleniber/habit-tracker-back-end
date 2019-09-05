import Joi from 'joi';

import Habit from '../models/Habit';

class HabitController {
  async index(req, res) {
    const { error } = Joi.validate(req.query, {
      name: Joi.string(),
      description: Joi.string(),
      page: Joi.number(),
    });

    if (error) {
      return res.status(400).json({ error: error.details });
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
      page: req.query.page || 1,
      limit: 20,
      populate: {
        path: 'user',
        select: 'name email createdAt updatedAt',
      },
      sort: '-createdAt',
    });

    return res.json(habits);
  }

  async show(req, res) {
    const { error } = Joi.validate(req.params, {
      id: Joi.string().required(),
    });

    if (error) {
      return res.status(400).json({ error: error.details });
    }

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
    const { error } = Joi.validate(req.body, {
      name: Joi.string().required(),
      description: Joi.string().required(),
    });

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const habit = await Habit.create({ ...req.body, user: req.userId });

    return res.json(habit);
  }

  async update(req, res) {
    const { bodyError } = Joi.validate(req.body, {
      name: Joi.string(),
      description: Joi.string(),
    });

    const { paramsError } = Joi.validate(req.params, {
      id: Joi.string().required(),
    });

    if (bodyError || paramsError) {
      const error = bodyError || paramsError;
      return res.status(400).json({ error: error.details });
    }

    try {
      const habit = await Habit.findById(req.params.id);

      if (!habit.user.equals(req.userId)) {
        return res.status(401).json({ error: 'You are not the habit author' });
      }

      const newHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      return res.json(newHabit);
    } catch (err) {
      return res.status(400).json({ error: 'Habit not found' });
    }
  }

  async delete(req, res) {
    const { error } = Joi.validate(req.params, {
      id: Joi.string().required(),
    });

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    try {
      const habit = await Habit.findById(req.params.id);

      if (!habit.user.equals(req.userId)) {
        return res.status(401).json({ error: 'You are not the habit author' });
      }

      await Habit.findByIdAndDelete(req.params.id);

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
