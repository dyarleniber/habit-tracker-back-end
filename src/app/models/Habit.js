import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

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

HabitSchema.plugin(mongoosePaginate);

export default mongoose.model('Habit', HabitSchema);
