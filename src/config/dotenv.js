export default {
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
};
