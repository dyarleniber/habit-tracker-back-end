import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';

const generateToken = ({ id }) => {
  return jwt.sign({ id }, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
  });
};

export default {
  generateToken,
};
