import mongoose from 'mongoose';

import databaseConfig from './config/database';

mongoose.connect(databaseConfig.uri, {
  useCreateIndex: true,
  useNewUrlParser: true,
});
