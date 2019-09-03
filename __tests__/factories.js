import '../src/bootstrap';
import '../src/database';

import faker from 'faker';
import { factory, MongooseAdapter } from 'factory-girl';

import User from '../src/app/models/User';

const adapter = new MongooseAdapter();

factory.setAdapter(adapter);

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export default factory;
