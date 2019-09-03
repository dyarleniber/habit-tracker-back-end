import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import factory from '../factories';
import databaseUtils from '../utils/database';
import authHelper from '../../src/app/helpers/auth';
import authConfig from '../../src/config/auth';

describe('User', () => {
  afterAll(() => databaseUtils.disconnect());

  it('should generate a valid token', async () => {
    const user = await factory.build('User');

    const token = authHelper.generateToken(user);

    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    expect(user.id).toBe(decoded.id);
  });
});
