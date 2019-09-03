import bcrypt from 'bcryptjs';

import factory from '../factories';
import databaseUtils from '../utils/database';

describe('User', () => {
  afterEach(() => databaseUtils.truncate());

  afterAll(() => databaseUtils.disconnect());

  it('should encrypt user password', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const compareHash = await bcrypt.compare('123123', user.password);

    expect(compareHash).toBe(true);
  });
});
