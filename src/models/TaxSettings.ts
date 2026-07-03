import mongoose from 'mongoose';

const TaxSettingsSchema = new mongoose.Schema({
  baseDutyBeans: { type: Number, default: 0.25 },
  baseDutyMaize: { type: Number, default: 0.25 },
  baseDutyCassava: { type: Number, default: 0.25 },
  baseDutyVegetables: { type: Number, default: 0.25 },
  baseDutyTextiles: { type: Number, default: 0.25 },
  baseDutyElectronics: { type: Number, default: 0.10 },
  baseDutyAgriInputs: { type: Number, default: 0.10 },
  vatDrc: { type: Number, default: 16.0 },
  vatRwanda: { type: Number, default: 18.0 },
  occFeeDrc: { type: Number, default: 1.5 },
  whNonRegDrc: { type: Number, default: 5.0 },
  whNonRegRwanda: { type: Number, default: 5.0 },
  whRegDrc: { type: Number, default: 1.5 },
}, { timestamps: true });

export default mongoose.models.TaxSettings || mongoose.model('TaxSettings', TaxSettingsSchema);
