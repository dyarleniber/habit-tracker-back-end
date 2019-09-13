import { resolve } from 'path';

export default {
  file: {
    filename: resolve(__dirname, '../', '../', 'logs', 'app.log'),
    level: process.env.LOG_LEVEL,
  },
  console: {
    level: process.env.LOG_LEVEL,
  },
};
