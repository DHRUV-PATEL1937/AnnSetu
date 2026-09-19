import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User, Batch, Reading, Consumption, Plan, Saving, Audit, Need, connect } from './models.js';
await connect();
const password = await bcrypt.hash('AnnSetu@2026', 12);
const definitions = [
  ['kitchen', 'Ananya Rao', 'Greenfield Campus Kitchen', 12.9716, 77.5946],
  ['processor', 'Vikram Shah', 'FreshFold Foods', 12.988, 77.612],
  ['ngo', 'Meera Nair', 'Akshaya Community Kitchen', 12.961, 77.584],
  ['buyer', 'Arjun Mehta', 'Second Serve Foods', 12.985, 77.577],
  ['logistics', 'Ravi Kumar', 'Green Mile Logistics', 12.974, 77.59],
  ['sponsor', 'Priya Iyer', 'Horizon Foundation', 12.969, 77.61],
  ['auditor', 'Neha Desai', 'Impact Assurance', 12.977, 77.598],
  ['admin', 'Dhruv', 'AnnSetu Network', 12.9716, 77.5946],
];
const currentMonth = new Date().toISOString().slice(0, 7);
const priorDate = new Date();
priorDate.setUTCMonth(priorDate.getUTCMonth() - 1, 1);
const previousMonth = priorDate.toISOString().slice(0, 7);
const users = {};
for (const [role, name, org, lat, lng] of definitions)
  users[role] = await User.findOneAndUpdate(
    { email: `${role}@annsetu.demo` },
    {
      $setOnInsert: {
        role,
        name,
        org,
        email: `${role}@annsetu.demo`,
        password,
        location: { lat, lng },
        capacity: 500,
        active: true,
      },
    },
    { upsert: true, new: true },
  );
if (!(await Batch.exists({}))) {
  const expiry = (h) => new Date(Date.now() + h * 3600000);
  const base = (role, name, quantity, category, channel, h, status = 'available') => ({
    owner: users[role]._id,
    org: users[role].org,
    location: users[role].location,
    name,
    quantity,
    category,
    channel,
    expiresAt: expiry(h),
    status,
    storage: category === 'Cooked meals' ? 'Hot held' : 'Ambient',
    price: channel === 'sale' ? 32 : 0,
    allergens: category === 'Bakery' ? ['Wheat', 'Milk'] : [],
    qualityNote: 'Demo: packaging, time and temperature records checked by operator.',
    reviewedBy: users[role]._id,
    reviewedAt: new Date(),
  });
  await Batch.insertMany([
    base('kitchen', 'Vegetable pulao', 42, 'Cooked meals', 'donation', 4),
    base('kitchen', 'Whole wheat bread', 18, 'Bakery', 'donation', 10),
    base('kitchen', 'Seasonal vegetables', 65, 'Produce', 'sale', 30),
    base('kitchen', 'Paneer curry', 24, 'Cooked meals', 'donation', 3, 'review'),
    {
      ...base('kitchen', 'Lentil dal', 32, 'Cooked meals', 'donation', 5, 'reserved'),
      claimant: users.ngo._id,
      destination: users.ngo.location,
      claimedAt: new Date(),
    },
    base('processor', 'Grade B tomatoes', 140, 'Produce', 'sale', 40),
    base('processor', 'Fresh bread assortment', 55, 'Bakery', 'donation', 16),
    base('processor', 'Rice flour', 85, 'Ingredients', 'sale', 72),
    {
      ...base('kitchen', 'Campus lunch recovery', 86, 'Cooked meals', 'donation', -20, 'confirmed'),
      claimant: users.ngo._id,
      destination: users.ngo.location,
      driver: users.logistics._id,
      confirmedAt: new Date(Date.now() - 24 * 3600000),
      deliveredAt: new Date(Date.now() - 25 * 3600000),
      proof: 'Seeded demo: recipient recorded sealed containers and received quantity.',
      sponsor: users.sponsor._id,
      sponsorship: 450,
    },
    {
      ...base('processor', 'Vegetable recovery', 120, 'Produce', 'sale', -25, 'confirmed'),
      claimant: users.buyer._id,
      destination: users.buyer.location,
      driver: users.logistics._id,
      confirmedAt: new Date(Date.now() - 48 * 3600000),
      proof: 'Seeded demo: weighed and confirmed on arrival.',
    },
  ]);
  for (const role of ['kitchen', 'processor']) {
    const histories = Array.from({ length: 28 }, (_, i) => {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - (28 - i));
      const consumed =
        (role === 'kitchen' ? 420 : 710) +
        Math.round(Math.sin(i * 0.9) * 47) +
        (i % 7 === 0 ? -60 : 0);
      return {
        owner: users[role]._id,
        date: date.toISOString().slice(0, 10),
        prepared: consumed + 30 + (i % 5) * 12,
        consumed,
        costPerMeal: 32,
        note: 'Seeded demonstration history',
      };
    });
    await Consumption.insertMany(histories);
    await Reading.insertMany(
      Array.from({ length: 12 }, (_, i) => ({
        owner: users[role]._id,
        device: role === 'kitchen' ? 'Cold room A · CR-01' : 'Processing line 02',
        temperature: role === 'processor' && i === 11 ? 7.2 : 3.1 + (i % 4) * 0.3,
        humidity: 62 + (i % 7),
        energy: role === 'processor' ? 148 + i * 2 : 34 + i,
        downtime: role === 'processor' ? 26 : 4,
        inputKg: role === 'processor' ? 280 : 90,
        outputKg: role === 'processor' ? 225 : 85,
        source: 'demo',
        createdAt: new Date(Date.now() - (12 - i) * 3600000),
      })),
    );
    await Saving.create({
      owner: users[role]._id,
      period: previousMonth,
      baselineWasteKg: 520,
      actualWasteKg: 280,
      baselineMeals: 12000,
      actualMeals: 12600,
      costPerKg: 65,
      evidence:
        'DEMO ONLY: representative normalized waste log and procurement valuation. Replace with measured, independently reviewed records.',
      status: 'verified',
      verifiedBy: users.auditor._id,
      reviewNote: 'Seeded demo verification, not a real audit.',
    });
    await Saving.create({
      owner: users[role]._id,
      period: currentMonth,
      baselineWasteKg: 150,
      actualWasteKg: 74,
      baselineMeals: 3500,
      actualMeals: 3600,
      costPerKg: 60,
      evidence:
        'DEMO ONLY: example weighbridge entries and portion counts. Pending independent review.',
    });
  }
  await Need.create({
    owner: users.ngo._id,
    org: users.ngo.org,
    quantity: 80,
    category: 'Cooked meals',
    note: 'Evening meal service for 200 people. Vegetarian meals; no nuts.',
    location: users.ngo.location,
  });
  await Audit.create({
    actor: users.admin._id,
    org: users.admin.org,
    action: 'Demonstration workspace initialized',
    entity: 'seed',
    detail: 'All initial metrics are seeded examples, not measured impact.',
  });
}
await Saving.updateMany(
  { period: 'Pilot baseline · previous month', evidence: /^DEMO ONLY:/ },
  { $set: { period: previousMonth } },
);
await Saving.updateMany(
  { period: 'Current pilot · week 2', evidence: /^DEMO ONLY:/ },
  { $set: { period: currentMonth } },
);
console.log(
  'Seed complete. Existing data preserved. Eight demo accounts: <role>@annsetu.demo / AnnSetu@2026',
);
await mongoose.disconnect();
