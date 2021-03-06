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
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();

    const { _id: id, name, email } = user;

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
    const user = await User.findById(req.userId);

    if (req.body.email && req.body.email !== user.email) {
      const userExists = await User.findOne({ email: req.body.email });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    user.set(req.body);

    await user.save();

    const { _id: id, name, email, createdAt, updatedAt } = user;

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
    const user = await User.findById(req.userId);

    await user.remove();

    const { name, email } = user;

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
