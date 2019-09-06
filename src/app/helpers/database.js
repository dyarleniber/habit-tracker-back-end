import mongoose from 'mongoose';

import databaseConfig from '../../config/database';

const connect = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(databaseConfig.uri, databaseConfig.options);
  }
};

const truncate = async () => {
  const models = mongoose.connection.modelNames();
  const promises = models.map(async model =>
    mongoose.connection.model(model).deleteMany({})
  );
  await Promise.all(promises);
};

const disconnect = async () => {
  await mongoose.disconnect();
};

export default {
  connect,
  truncate,
  disconnect,
};
