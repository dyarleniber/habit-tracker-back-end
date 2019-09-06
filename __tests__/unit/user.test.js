import bcrypt from 'bcryptjs';

import factory from '../factory';

describe('User', () => {
  it('should encrypt user password', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const compareHash = await bcrypt.compare('123123', user.password);

    expect(compareHash).toBe(true);
  });
});
