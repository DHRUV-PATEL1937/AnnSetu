import mongoose from 'mongoose';
const { Schema } = mongoose;
const model = (name, fields) => mongoose.model(name, new Schema(fields, { timestamps: true }));
export const roles = [
  'kitchen',
  'processor',
  'ngo',
  'buyer',
  'logistics',
  'sponsor',
  'auditor',
  'admin',
];
export const User = model('User', {
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: roles },
  org: String,
  location: { lat: Number, lng: Number },
  capacity: { type: Number, default: 250 },
  active: { type: Boolean, default: true },
});
export const Batch = model('Batch', {
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  org: String,
  name: String,
  category: String,
  quantity: Number,
  unit: { type: String, default: 'kg' },
  price: Number,
  allergens: [String],
  storage: String,
  expiresAt: Date,
  status: {
    type: String,
    enum: ['review', 'available', 'reserved', 'picked_up', 'delivered', 'confirmed', 'held'],
    default: 'review',
  },
  channel: { type: String, enum: ['donation', 'sale'], default: 'donation' },
  qualityNote: String,
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  claimant: { type: Schema.Types.ObjectId, ref: 'User' },
  driver: { type: Schema.Types.ObjectId, ref: 'User' },
  claimedAt: Date,
  pickedUpAt: Date,
  deliveredAt: Date,
  confirmedAt: Date,
  proof: String,
  location: { lat: Number, lng: Number },
  destination: { lat: Number, lng: Number },
  sponsor: { type: Schema.Types.ObjectId, ref: 'User' },
  sponsorship: Number,
});
export const Reading = model('Reading', {
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  device: String,
  temperature: Number,
  humidity: Number,
  energy: Number,
  downtime: Number,
  inputKg: Number,
  outputKg: Number,
  source: String,
});
export const Consumption = model('Consumption', {
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  date: String,
  prepared: Number,
  consumed: Number,
  costPerMeal: Number,
  note: String,
});
Consumption.schema.index({ owner: 1, date: 1 }, { unique: true });
export const Plan = model('Plan', {
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  date: String,
  portions: Number,
  reason: String,
});
Plan.schema.index({ owner: 1, date: 1 }, { unique: true });
export const Saving = model('Saving', {
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  period: String,
  baselineWasteKg: Number,
  actualWasteKg: Number,
  baselineMeals: Number,
  actualMeals: Number,
  costPerKg: Number,
  evidence: String,
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewNote: String,
});
Saving.schema.index({ owner: 1, period: 1 }, { unique: true });
export const Audit = model('Audit', {
  actor: { type: Schema.Types.ObjectId, ref: 'User' },
  org: String,
  action: String,
  entity: String,
  detail: String,
});
export const Need = model('Need', {
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  org: String,
  quantity: Number,
  category: String,
  note: String,
  status: { type: String, default: 'open' },
  location: { lat: Number, lng: Number },
});
export const connect = () =>
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/annsetu', {
    serverSelectionTimeoutMS: 5000,
  });
