import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 8);

  return next();
});

UserSchema.pre('findOneAndUpdate', async function hashPassword(next) {
  const modifiedField = this.getUpdate().password;
  if (!modifiedField) {
    return next();
  }

  this.getUpdate().password = await bcrypt.hash(modifiedField, 8);

  return next();
});

UserSchema.methods = {
  compareHash(password) {
    return bcrypt.compare(password, this.password);
  },
};

export default mongoose.model('User', UserSchema);
