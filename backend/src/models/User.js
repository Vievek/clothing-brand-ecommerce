import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Constants for magic numbers
const MAX_NAME_LENGTH = 50;
const MIN_PASSWORD_LENGTH = 6;
const BCRYPT_SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [MAX_NAME_LENGTH, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: 'Please provide a valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [
        MIN_PASSWORD_LENGTH,
        'Password must be at least 6 characters',
      ],
      select: false,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// FIXED: Simplified the pre-save middleware without try-catch
userSchema.pre('save', async function () {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {return ;}

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);

});

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
