import Habit from '../models/Habit';

class GetHabitsService {
  async run({ userId, filters, populate = [] }) {
    const { page = 1, name, description, createdAt } = filters;

    const queryFilters = {};

    queryFilters.user = userId;

    if (name) {
      queryFilters.name = new RegExp(name, 'i');
    }

    if (description) {
      queryFilters.description = new RegExp(description, 'i');
    }

    if (createdAt) {
      queryFilters.createdAt = createdAt;
    }

    const habits = await Habit.paginate(queryFilters, {
      page,
      limit: 20,
      populate: [
        {
          path: 'user',
          select: '-password',
        },
        ...populate,
      ],
      sort: '-createdAt',
    });

    return habits;
  }
}

export default new GetHabitsService();
