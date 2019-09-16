import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../config/auth';

const generateToken = id => {
  return jwt.sign({ id }, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
  });
};

const verifyToken = async token => {
  const decoded = await promisify(jwt.verify)(token, authConfig.secret);

  return decoded.id;
};

export default {
  generateToken,
  verifyToken,
};
