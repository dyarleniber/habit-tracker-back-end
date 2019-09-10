// eslint-disable-next-line import/no-extraneous-dependencies
const NodeEnvironment = require('jest-environment-node');
const MongodbMemoryServer = require('mongodb-memory-server');

class CustomEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);

    this.mongod = new MongodbMemoryServer.MongoMemoryServer();
  }

  async setup() {
    await super.setup();

    this.global.__DB_URL__ = await this.mongod.getConnectionString();
  }

  async teardown() {
    await super.teardown();

    await this.mongod.stop();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = CustomEnvironment;
