export const round = (n, places = 1) => Number(n.toFixed(places));
export function forecast(history, attendance = 100) {
  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length < 3)
    return {
      ready: false,
      reason: 'Record at least three days of consumption to calculate a forecast.',
    };
  const recent = sorted.slice(-14),
    total = recent.reduce((s, _, i) => s + i + 1, 0);
  const mean = recent.reduce((s, r, i) => s + r.consumed * (i + 1), 0) / total;
  const error = Math.sqrt(recent.reduce((s, r) => s + (r.consumed - mean) ** 2, 0) / recent.length);
  const expected = Math.round((mean * attendance) / 100),
    buffer = Math.ceil(error * 0.7);
  const planned = expected + buffer;
  const backtests = sorted.slice(3).map((r, i) => {
    const prev = sorted.slice(Math.max(0, i + 3 - 14), i + 3);
    const sum = prev.reduce((s, _, j) => s + j + 1, 0);
    return Math.abs(r.consumed - prev.reduce((s, x, j) => s + x.consumed * (j + 1), 0) / sum);
  });
  return {
    ready: true,
    expected,
    planned,
    low: Math.max(0, Math.round(expected - error)),
    high: Math.round(expected + error),
    buffer,
    sampleSize: recent.length,
    method: 'Recency-weighted demand baseline',
    mae: backtests.length ? round(backtests.reduce((s, x) => s + x, 0) / backtests.length) : null,
    surplus: Math.max(0, Math.round(recent.at(-1).prepared - expected)),
    attendance,
  };
}
export function savingsValue(s) {
  const normalizedBaseline =
    s.baselineMeals > 0 ? (s.baselineWasteKg / s.baselineMeals) * s.actualMeals : 0;
  const preventedKg = Math.max(0, normalizedBaseline - s.actualWasteKg);
  const gross = Math.round(preventedKg * s.costPerKg);
  return {
    preventedKg: round(preventedKg),
    gross,
    fee: Math.round(gross * 0.15),
    retained: gross - Math.round(gross * 0.15),
  };
}
export function distance(a, b) {
  if (!a || !b) return 0;
  const rad = (x) => (x * Math.PI) / 180;
  const p =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(p), Math.sqrt(1 - p));
}
export function routePlan(batches, start = { lat: 12.9716, lng: 77.5946 }, now = Date.now()) {
  let current = start,
    minutes = 0;
  const stops = [],
    remaining = batches
      .filter((b) => ['reserved', 'picked_up'].includes(b.status))
      .map((b) => ({ ...b, pickup: b.status === 'reserved' }));
  while (remaining.length) {
    remaining.sort((a, b) => {
      const score = (x) =>
        distance(current, x.pickup ? x.location : x.destination) +
        Math.max(0, (new Date(x.expiresAt).getTime() - now) / 3600000) * 0.25;
      return score(a) - score(b);
    });
    const item = remaining.shift();
    const target = item.pickup ? item.location : item.destination;
    const km = distance(current, target);
    minutes += (km / 22) * 60 + 8;
    stops.push({
      batchId: String(item._id),
      name: item.name,
      action: item.pickup ? 'Pickup' : 'Deliver',
      org: item.pickup ? item.org : item.claimant?.org || 'Recipient',
      km: round(km),
      etaMinutes: Math.ceil(minutes),
      expiresAt: item.expiresAt,
      feasible: now + minutes * 60000 < new Date(item.expiresAt).getTime(),
      location: target,
    });
    current = target;
    if (item.pickup) remaining.push({ ...item, pickup: false });
  }
  return {
    stops,
    totalKm: round(stops.reduce((s, x) => s + x.km, 0)),
    totalMinutes: Math.ceil(minutes),
    method:
      'Precedence-constrained nearest stop, with expiry priority. Straight-line distance; estimated 22 km/h and 8 minutes per stop. Not live traffic routing.',
  };
}
export function readingAlerts(r) {
  return [
    r.temperature > 5 ? 'Cold storage above configured 5°C threshold' : null,
    r.temperature < 0 ? 'Cold storage below configured 0°C threshold' : null,
    r.humidity > 75 ? 'Humidity above 75%' : null,
    r.downtime > 20 ? 'Machine downtime above 20 minutes' : null,
    r.inputKg > 0 && r.outputKg / r.inputKg < 0.85 ? 'Material yield below 85%' : null,
    r.outputKg > 0 && r.energy / r.outputKg > 1.5 ? 'Energy intensity above 1.5 kWh/kg' : null,
  ].filter(Boolean);
}
