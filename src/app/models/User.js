import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import Habit from './Habit';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 8);

  return next();
});

UserSchema.pre('remove', async function(next) {
  await Habit.deleteMany({ user: this._id });

  next();
});

UserSchema.methods = {
  compareHash(password) {
    return bcrypt.compare(password, this.password);
  },
};

export default mongoose.model('User', UserSchema);
