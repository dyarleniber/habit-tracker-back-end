import Redis from 'ioredis';

import redisConfig from '../config/redis';

class Cache {
  constructor() {
    this.redis = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      keyPrefix: redisConfig.keyPrefix,
    });
  }

  set(key, value) {
    return this.redis.set(
      key,
      JSON.stringify(value),
      redisConfig.expiryMode,
      redisConfig.time
    );
  }

  async get(key) {
    const cached = await this.redis.get(key);

    return cached ? JSON.parse(cached) : null;
  }

  invalidate(key) {
    return this.redis.del(key);
  }

  async invalidatePrefix(prefix) {
    const keys = await this.redis.keys(`${redisConfig.keyPrefix}${prefix}:*`);

    const keysWithoutPrefix = keys.map(key =>
      key.replace(`${redisConfig.keyPrefix}`, '')
    );

    if (keysWithoutPrefix && keysWithoutPrefix.length > 0) {
      await this.redis.del(keysWithoutPrefix);
    }
  }
}

export default new Cache();
