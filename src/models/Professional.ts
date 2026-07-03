import mongoose from 'mongoose';

const ProfessionalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['customs_agent', 'logistics'],
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
    required: true,
  },
  specialties: [{
    type: String,
  }],
  languages: [{
    type: String,
  }],
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.models.Professional || mongoose.model('Professional', ProfessionalSchema);
