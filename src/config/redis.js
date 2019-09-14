export default {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  keyPrefix: 'cache:',
  expiryMode: 'EX',
  time: 60 * 60 * 24,
};
