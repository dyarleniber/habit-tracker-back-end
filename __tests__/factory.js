import faker from 'faker';
import { factory, MongooseAdapter } from 'factory-girl';

import User from '../src/app/models/User';
import Habit from '../src/app/models/Habit';
import HabitChecked from '../src/app/models/HabitChecked';

const adapter = new MongooseAdapter();

factory.setAdapter(adapter);

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Habit', Habit, {
  name: faker.lorem.word(),
  description: faker.lorem.sentence(),
});

factory.define('HabitChecked', HabitChecked, {
  createdAt: new Date(),
});

export default factory;
