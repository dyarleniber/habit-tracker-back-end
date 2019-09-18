import { startOfDay, addDays } from 'date-fns';

import Habit from '../models/Habit';
import HabitChecked from '../models/HabitChecked';
import Cache from '../../lib/Cache';
import BadRequestError from '../../errors/BadRequestError';
import UnauthorizedError from '../../errors/UnauthorizedError';

class CheckHabitService {
  async run({ habitId, userId }) {
    let habit = null;

    await Habit.findById(habitId)
      .then(result => {
        habit = result;
      })
      .catch(errIgnored => {});

    if (!habit) {
      throw new BadRequestError('Habit not found');
    }

    if (!habit.user.equals(userId)) {
      throw new UnauthorizedError('You are not the habit author');
    }

    const today = startOfDay(new Date());

    const tomorrow = addDays(today, 1);

    const habitCheckedExists = await HabitChecked.findOne({
      habit: habit.id,
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (habitCheckedExists) {
      throw new BadRequestError('Habit already checked');
    }

    const habitChecked = new HabitChecked({
      habit: habit.id,
    });

    await habitChecked.save();

    await Cache.invalidatePrefix(`user:${userId}:habits`);

    return habitChecked;
  }
}

export default new CheckHabitService();
