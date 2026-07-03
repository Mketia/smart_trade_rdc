import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['small_trader', 'corporate', 'admin'],
    default: 'small_trader',
  },
  companyName: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  description: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
