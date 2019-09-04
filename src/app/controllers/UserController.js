import Joi from 'joi';

import User from '../models/User';

class UserController {
  async show(req, res) {
    const { id, name, email, createdAt, updatedAt } = await User.findById(
      req.userId
    );

    return res.json({ id, name, email, createdAt, updatedAt });
  }

  async store(req, res) {
    const { error } = Joi.validate(req.body, {
      name: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required(),
    });

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const { error } = Joi.validate(req.body, {
      name: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string(),
    });

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const user = await User.findById(req.userId);

    if (req.body.email && req.body.email !== user.email) {
      const userExists = await User.findOne({ email: req.body.email });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    const {
      _id: id,
      name,
      email,
      createdAt,
      updatedAt,
    } = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
    });

    return res.json({ id, name, email, createdAt, updatedAt });
  }

  async delete(req, res) {
    await User.findByIdAndDelete(req.userId);

    return res.send();
  }
}

export default new UserController();
