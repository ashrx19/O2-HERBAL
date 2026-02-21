import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: [true, 'Email or phone is required'],
    lowercase: true,
  },
  otp: {
    type: String,
    required: [true, 'OTP is required'],
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 300, // Auto-delete 5 minutes after expiresAt timestamp
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('OTP', otpSchema);
