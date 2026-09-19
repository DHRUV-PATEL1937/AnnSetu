import test from 'node:test';
import assert from 'node:assert/strict';
import { forecast, savingsValue, distance, routePlan, readingAlerts } from '../server/domain.js';
test('forecast handles cold start without fabricating predictions', () =>
  assert.equal(forecast([]).ready, false));
test('forecast backtest and attendance scenario are reproducible', () => {
  const rows = Array.from({ length: 20 }, (_, i) => ({
    date: `2026-09-${String(i + 1).padStart(2, '0')}`,
    consumed: 100,
    prepared: 140,
  }));
  const f = forecast(rows);
  assert.equal(f.expected, 100);
  assert.equal(f.planned, 100);
  assert.equal(f.mae, 0);
  assert.equal(f.surplus, 40);
  assert.equal(f.sampleSize, 14);
  assert.equal(forecast(rows, 80).expected, 80);
});
test('savings normalize meal volume, floor negatives and split fee', () => {
  assert.deepEqual(
    savingsValue({
      baselineWasteKg: 100,
      actualWasteKg: 110,
      baselineMeals: 1000,
      actualMeals: 2000,
      costPerKg: 10,
    }),
    { preventedKg: 90, gross: 900, fee: 135, retained: 765 },
  );
  assert.equal(
    savingsValue({
      baselineWasteKg: 100,
      actualWasteKg: 200,
      baselineMeals: 1000,
      actualMeals: 1000,
      costPerKg: 10,
    }).fee,
    0,
  );
});
test('route observes pickup before delivery and flags missed expiry', () => {
  const now = Date.now();
  const r = routePlan(
    [
      {
        _id: 'a',
        name: 'Food',
        status: 'reserved',
        org: 'Kitchen',
        location: { lat: 12.9, lng: 77.5 },
        destination: { lat: 12.95, lng: 77.6 },
        expiresAt: new Date(now + 60000),
        claimant: { org: 'NGO' },
      },
    ],
    { lat: 12.9, lng: 77.5 },
    now,
  );
  assert.deepEqual(
    r.stops.map((s) => s.action),
    ['Pickup', 'Deliver'],
  );
  assert.equal(r.stops[1].feasible, false);
  assert(r.totalKm > 0);
});
test('distance and empty route are stable', () => {
  assert.equal(distance({ lat: 0, lng: 0 }, { lat: 0, lng: 0 }), 0);
  assert.equal(routePlan([]).stops.length, 0);
});
test('sensor thresholds catch operational loss and cold-chain excursion', () => {
  const r = { temperature: 8, humidity: 80, downtime: 30, inputKg: 100, outputKg: 60, energy: 150 };
  assert.equal(readingAlerts(r).length, 5);
  assert.equal(
    readingAlerts({ ...r, temperature: 3, humidity: 65, downtime: 0, outputKg: 95, energy: 30 })
      .length,
    0,
  );
});
