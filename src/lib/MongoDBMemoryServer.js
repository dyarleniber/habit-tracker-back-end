// eslint-disable-next-line import/no-extraneous-dependencies
const { MongoMemoryServer } = require('mongodb-memory-server');

class MongoDBMemoryServer {
  constructor() {
    this.mongod = new MongoMemoryServer({
      autoStart: false,
    });
  }

  start() {
    return this.mongod.start();
  }

  stop() {
    return this.mongod.stop();
  }

  getConnectionString() {
    return this.mongod.getConnectionString();
  }
}

module.exports = new MongoDBMemoryServer();
