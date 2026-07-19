import mongoose from 'mongoose';

const AgencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  email: { type: String },
  phone: { type: String },
  rating: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Agency || mongoose.model('Agency', AgencySchema);
