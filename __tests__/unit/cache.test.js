import Redis from 'ioredis';

import Cache from '../../src/lib/Cache';
import redisConfig from '../../src/config/redis';

describe('Cache', () => {
  it('should be able to set and get cache', async () => {
    const key = 'x';
    const value = 'y';

    const setSpy = jest.spyOn(Redis.prototype, 'set');
    const getSpy = jest.spyOn(Redis.prototype, 'get');

    await Cache.set(key, value);
    await Cache.get(key);

    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith(
      key,
      JSON.stringify(value),
      redisConfig.expiryMode,
      redisConfig.time
    );
    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith(key);

    setSpy.mockRestore();
    getSpy.mockRestore();
  });

  it('should be able to invalidate cache by key', async () => {
    const key = 'x';

    const spy = jest.spyOn(Redis.prototype, 'del');

    await Cache.invalidate(key);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(key);

    spy.mockRestore();
  });

  it('should be able to invalidate cache by prefix', async () => {
    const keys = ['x'];
    const prefix = 'resource:x:resource';

    const keysSpy = jest.spyOn(Redis.prototype, 'keys').mockReturnValue(keys);

    const delSpy = jest.spyOn(Redis.prototype, 'del');

    await Cache.invalidatePrefix(prefix);

    expect(keysSpy).toHaveBeenCalledTimes(1);
    expect(delSpy).toHaveBeenCalledTimes(1);

    keysSpy.mockRestore();
    delSpy.mockRestore();
  });
});
