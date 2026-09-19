import 'dotenv/config';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import {
  Batch,
  Audit,
  Saving,
  Need,
  Consumption,
  Plan,
  Reading,
  connect,
} from '../server/models.js';
const base = 'http://127.0.0.1:4000/api';
const cookies = {},
  users = {},
  created = [],
  claims = [],
  needs = [],
  records = [];
let checks = 0;
async function call(role, path, { method = 'GET', body, status = 200 } = {}) {
  const r = await fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookies[role] ? { Cookie: cookies[role] } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await r.json();
  assert.equal(r.status, status, `${method} ${path}: ${JSON.stringify(data)}`);
  checks++;
  return data;
}
try {
  await connect();
  // Node's development watcher may still be restarting after source formatting.
  // Wait for readiness only; never retry or hide failed business assertions.
  const deadline = Date.now() + 15000;
  while (true) {
    try {
      const response = await fetch(base + '/health');
      if (response.ok) break;
    } catch {}
    if (Date.now() >= deadline) throw new Error('API unavailable. Start npm run dev first.');
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  await call('', '/workspace', { status: 401 });
  for (const role of [
    'kitchen',
    'processor',
    'ngo',
    'buyer',
    'logistics',
    'sponsor',
    'auditor',
    'admin',
  ]) {
    const r = await fetch(base + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `${role}@annsetu.demo`, password: 'AnnSetu@2026' }),
    });
    assert.equal(r.status, 200);
    cookies[role] = r.headers.get('set-cookie').split(';')[0];
    users[role] = await r.json();
    const w = await call(role, '/workspace');
    assert.equal(w.user.role, role);
    checks++;
  }
  await call('ngo', '/users', { status: 403 });
  await call('ngo', '/batches', { method: 'POST', body: {}, status: 403 });
  await call('kitchen', '/auth/login', {
    method: 'POST',
    body: { email: 'kitchen@annsetu.demo', password: 'incorrect' },
    status: 401,
  });
  const initial = await call('ngo', '/workspace');
  for (const channel of ['donation', 'sale']) {
    const b = await call('kitchen', '/batches', {
      method: 'POST',
      status: 201,
      body: {
        name: `Integration ${channel}`,
        category: 'Cooked meals',
        quantity: 5,
        price: channel === 'sale' ? 20 : 0,
        allergens: ['Milk'],
        storage: 'Hot held',
        expiresAt: new Date(Date.now() + 24 * 3600000).toISOString(),
        channel,
      },
    });
    created.push(b._id);
    await call('processor', `/batches/${b._id}/review`, {
      method: 'POST',
      body: { decision: 'release', note: 'Cross tenant review must not be allowed' },
      status: 404,
    });
    const role = channel === 'donation' ? 'ngo' : 'buyer';
    await call(role, `/batches/${b._id}/claim`, { method: 'POST', status: 409 });
    await call('kitchen', `/batches/${b._id}/review`, {
      method: 'POST',
      body: {
        decision: 'release',
        note: 'Test inspection: packaging intact; time and temperature checked.',
      },
    });
    const matches = await call('kitchen', `/batches/${b._id}/matches`);
    assert(matches.matches.length > 0);
    checks++;
    await call('ngo', `/batches/${b._id}/matches`, { status: 403 });
    await call(channel === 'donation' ? 'buyer' : 'ngo', `/batches/${b._id}/claim`, {
      method: 'POST',
      status: 409,
    });
    if (channel === 'donation')
      await call('sponsor', `/batches/${b._id}/sponsor`, { method: 'POST', body: { amount: 300 } });
    const results = await Promise.all(
      [0, 1].map(() =>
        fetch(base + `/batches/${b._id}/claim`, {
          method: 'POST',
          headers: { Cookie: cookies[role], 'Content-Type': 'application/json' },
        }),
      ),
    );
    assert.deepEqual(results.map((r) => r.status).sort(), [200, 409]);
    checks++;
    await call('logistics', `/batches/${b._id}/dispatch`, { method: 'POST' });
    await call('logistics', `/batches/${b._id}/transition`, {
      method: 'POST',
      body: { status: 'delivered', proof: 'Cannot skip pickup state' },
      status: 409,
    });
    await call(role, `/batches/${b._id}/transition`, {
      method: 'POST',
      body: { status: 'picked_up', proof: 'Role cannot act as driver' },
      status: 403,
    });
    await call('logistics', `/batches/${b._id}/transition`, {
      method: 'POST',
      body: { status: 'picked_up', proof: 'Sealed containers, 5 kg, test pickup reference.' },
    });
    await call('logistics', `/batches/${b._id}/transition`, {
      method: 'POST',
      body: { status: 'delivered', proof: '5 kg delivered, test handover reference.' },
    });
    await call(role, `/batches/${b._id}/transition`, {
      method: 'POST',
      body: { status: 'confirmed', proof: 'Received 5 kg; packaging intact; test confirmation.' },
    });
    await call(role, `/batches/${b._id}/transition`, {
      method: 'POST',
      body: { status: 'confirmed', proof: 'Duplicate confirmation' },
      status: 409,
    });
  }
  const after = await call('ngo', '/workspace');
  assert.equal(after.metrics.rescuedKg, initial.metrics.rescuedKg + 5);
  checks++;
  const expired = await Batch.create({
    owner: users.kitchen.id,
    org: 'Test',
    name: 'Integration expired',
    category: 'Produce',
    quantity: 1,
    status: 'available',
    expiresAt: new Date(Date.now() - 1000),
    channel: 'donation',
  });
  created.push(String(expired._id));
  await call('ngo', `/batches/${expired._id}/claim`, { method: 'POST', status: 409 });
  await call('kitchen', '/consumption', {
    method: 'POST',
    body: { date: '2026-09-01', prepared: 10, consumed: 11, costPerMeal: 10 },
    status: 400,
  });
  const cold = await call('kitchen', '/batches', {
    method: 'POST',
    status: 201,
    body: {
      name: 'Integration chilled food',
      category: 'Dairy',
      quantity: 3,
      price: 0,
      allergens: ['Milk'],
      storage: 'Chilled',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      channel: 'donation',
    },
  });
  created.push(cold._id);
  const badReading = await call('kitchen', '/readings', {
    method: 'POST',
    status: 201,
    body: {
      device: 'Integration cold sensor',
      temperature: 9,
      humidity: 65,
      energy: 20,
      downtime: 0,
      inputKg: 10,
      outputKg: 9,
    },
  });
  records.push(badReading._id);
  await call('kitchen', `/batches/${cold._id}/review`, {
    method: 'POST',
    status: 409,
    body: { decision: 'release', note: 'Test cold storage release must be rejected' },
  });
  const goodReading = await call('kitchen', '/readings', {
    method: 'POST',
    status: 201,
    body: {
      device: 'Integration cold sensor',
      temperature: 3,
      humidity: 65,
      energy: 20,
      downtime: 0,
      inputKg: 10,
      outputKg: 9,
    },
  });
  records.push(goodReading._id);
  await call('kitchen', `/batches/${cold._id}/review`, {
    method: 'POST',
    body: { decision: 'release', note: 'Test corrected cold storage evidence recorded' },
  });
  const claim = await call('kitchen', '/savings', {
    method: 'POST',
    status: 201,
    body: {
      period: '2000-01',
      baselineWasteKg: 100,
      actualWasteKg: 40,
      baselineMeals: 100,
      actualMeals: 100,
      costPerKg: 10,
      evidence: 'Test evidence references for the integration validation only.',
    },
  });
  claims.push(claim._id);
  await call('kitchen', '/savings', {
    method: 'POST',
    status: 409,
    body: {
      period: '2000-01',
      baselineWasteKg: 100,
      actualWasteKg: 40,
      baselineMeals: 100,
      actualMeals: 100,
      costPerKg: 10,
      evidence: 'Duplicate period must not create another claim.',
    },
  });
  await call('admin', `/savings/${claim._id}/review`, {
    method: 'POST',
    body: { status: 'verified', reviewNote: 'Must be independently audited' },
    status: 403,
  });
  await call('auditor', `/savings/${claim._id}/review`, {
    method: 'POST',
    body: {
      status: 'verified',
      reviewNote: 'Test review checks supported baseline and cost evidence.',
    },
  });
  await call('auditor', `/savings/${claim._id}/review`, {
    method: 'POST',
    body: { status: 'verified', reviewNote: 'Duplicate must be rejected' },
    status: 409,
  });
  const need = await call('ngo', '/needs', {
    method: 'POST',
    status: 201,
    body: { quantity: 20, category: 'Produce', note: 'Integration test request only' },
  });
  needs.push(need._id);
  await call('ngo', `/needs/${need._id}/close`, { method: 'POST' });
  await call('kitchen', '/readings', {
    method: 'POST',
    status: 400,
    body: {
      device: 'Test',
      temperature: 3,
      humidity: 55,
      energy: 10,
      downtime: 0,
      inputKg: 10,
      outputKg: 20,
    },
  });
  await call('', '/iot/readings', { method: 'POST', body: {}, status: 401 });
  const exported = await fetch(base + '/reports/export', { headers: { Cookie: cookies.ngo } });
  assert.equal(exported.status, 200);
  assert((await exported.text()).includes('Integration donation'));
  checks++;
  if (!process.env.SARVAM_API_KEY)
    await call('kitchen', '/ai/advice', {
      method: 'POST',
      body: { question: 'What should I prioritize?', language: 'English' },
      status: 503,
    });
  console.log(
    `PASS: ${checks} API assertions; all eight roles, tenant isolation, dual-channel recovery, concurrent claims, expiry, savings verification, IoT auth, export, and AI availability.`,
  );
} finally {
  await Batch.deleteMany({ _id: { $in: created } });
  await Saving.deleteMany({ _id: { $in: claims } });
  await Need.deleteMany({ _id: { $in: needs } });
  await Reading.deleteMany({ _id: { $in: records } });
  await Audit.deleteMany({ entity: { $in: [...created, ...claims, ...needs, ...records] } });
  await mongoose.disconnect();
}
