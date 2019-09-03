import Joi from 'joi';

import User from '../models/User';

class UserController {
  async show(req, res) {
    res.json({ message: 'Ok' });
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
    res.json({ message: 'Ok' });
  }

  async delete(req, res) {
    res.json({ message: 'Ok' });
  }
}

export default new UserController();
