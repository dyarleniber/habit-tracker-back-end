import factory from '../factory';
import authHelper from '../../src/app/helpers/auth';

describe('User', () => {
  it('should generate a valid token', async () => {
    const user = await factory.build('User');

    const token = authHelper.generateToken(user.id);

    const decodedUserId = await authHelper.verifyToken(token);

    expect(decodedUserId).toBe(user.id);
  });

  it('should catch an error in case of invalid token', async () => {
    expect.assertions(1);

    try {
      await authHelper.verifyToken('invalidtoken');
    } catch (e) {
      expect(e).toEqual({
        name: 'JsonWebTokenError',
        message: 'jwt malformed',
      });
    }
  });
});
