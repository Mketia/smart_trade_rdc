import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // custom string id like 'beans'
  name: { type: String, required: true }, // Add the raw name for dynamic products
  nameKey: { type: String }, 
  hsCode: { type: String, required: true },
  category: { type: String, enum: ['agriculture', 'merchandise'], required: true },
  baseDutyRate: { type: Number, required: true },
  isEacStrEligible: { type: Boolean, required: true },
  notes: { type: String },
  notesKey: { type: String }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
