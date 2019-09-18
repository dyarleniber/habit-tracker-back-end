import dotenv from 'dotenv';

import dotenvConfig from './config/dotenv';

class Bootstrap {
  constructor() {
    this.init();
  }

  init() {
    dotenv.config(dotenvConfig);
  }
}

export default new Bootstrap();
