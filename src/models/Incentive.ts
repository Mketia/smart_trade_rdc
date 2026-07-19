import mongoose from 'mongoose';

const IncentiveSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authority: { type: String, required: true },
  description: { type: String, required: true },
  benefits: { type: String, required: true },
  requirements: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Incentive || mongoose.model('Incentive', IncentiveSchema);
