import Joi from 'joi';

import User from '../models/User';
import authHelper from '../helpers/auth';

class SessionController {
  async store(req, res) {
    const { error } = Joi.validate(req.body, {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required(),
    });

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (!(await user.compareHash(password))) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: authHelper.generateToken(user.id),
    });
  }
}

export default new SessionController();
