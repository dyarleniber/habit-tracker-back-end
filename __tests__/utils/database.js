import '../../src/bootstrap';
import '../../src/database';

import mongoose from 'mongoose';

import Habit from '../../src/app/models/Habit';
import HabitChecked from '../../src/app/models/HabitChecked';
import User from '../../src/app/models/User';

const truncate = async () => {
  await Habit.deleteMany({});
  await HabitChecked.deleteMany({});
  await User.deleteMany({});
};

const disconnect = () => {
  mongoose.disconnect();
};

export default {
  truncate,
  disconnect,
};
