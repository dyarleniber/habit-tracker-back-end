import Joi from 'joi';
import { join } from 'path';
import { format } from 'date-fns';

import User from '../models/User';
import Mail from '../../lib/Mail';

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

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Welcome!',
      template: join('user', 'createdUser'),
      context: {
        name,
      },
    });

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

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Profile updated',
      template: join('user', 'updatedUser'),
      context: {
        name,
        updatedAt: format(updatedAt, 'PPpp'),
      },
    });

    return res.json({ id, name, email, createdAt, updatedAt });
  }

  async delete(req, res) {
    const { name, email } = await User.findById(req.userId);

    await User.findByIdAndDelete(req.userId);

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'User removed',
      template: join('user', 'deletedUser'),
      context: {
        name,
      },
    });

    return res.send();
  }
}

export default new UserController();
