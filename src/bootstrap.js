import dotenv from 'dotenv';

class Bootstrap {
  constructor() {
    this.init();
  }

  init() {
    dotenv.config({
      path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    });
  }
}

export default new Bootstrap();
