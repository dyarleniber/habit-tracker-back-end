import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

import HabitChecked from './HabitChecked';

const HabitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

HabitSchema.virtual('check', {
  ref: 'HabitChecked',
  localField: '_id',
  foreignField: 'habit',
});

HabitSchema.pre('remove', async function(next) {
  await HabitChecked.deleteMany({ habit: this._id });

  next();
});

HabitSchema.pre('deleteMany', async function(next) {
  const { user } = this.getQuery();

  if (user) {
    const habits = await this.find({ user });
    const ids = habits.map(habit => habit._id);
    await HabitChecked.deleteMany({ habit: { $in: ids } });
  }

  next();
});

HabitSchema.plugin(mongoosePaginate);

export default mongoose.model('Habit', HabitSchema);
