import User from '../models/User';
import authHelper from '../helpers/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    req.userId = await authHelper.verifyToken(token);

    const userExists = await User.findById(req.userId);
    if (!userExists) {
      throw new Error('Invalid token');
    }

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
