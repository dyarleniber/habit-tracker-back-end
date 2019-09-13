const MongoDBMemoryServer = require('../src/lib/MongoDBMemoryServer');

module.exports = async () => {
  await MongoDBMemoryServer.stop();
};
