# Architecture and implementation notes

## Runtime

React 19 + Vite frontend; Express 5 JSON API; Mongoose 8; local MongoDB standalone 8.x; Node 22. The frontend uses Lucide icons and Recharts. Development requests are same-origin through Vite's `/api` proxy. Production builds are served by Express. API listens on loopback only.

```
React/Vite -> /api -> Express -> Mongoose -> MongoDB annsetu
                           -> Sarvam chat / image endpoints
IoT adapter -> authenticated /api/iot/readings
```

No external AI SDK or additional provider is required. Native server `fetch` calls Sarvam with a timeout.

## Source map

| Location               | Purpose                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| src/App.jsx            | Authentication bootstrap, role navigation, workspace refresh, modal/mutation orchestration |
| src/Login.jsx          | Login and eight demo role selectors                                                        |
| src/Overview.jsx       | Role-aware overview and evidence-led next actions                                          |
| src/Operations.jsx     | Demand scenarios, approved plans, sensors, needs and route ordering UI                     |
| src/Matching.jsx       | Ranked recipient suggestions for released batches                                          |
| src/Impact.jsx         | Savings ledger, business model, impact and methodology                                     |
| src/Administration.jsx | Traceability, directory, account controls and profile                                      |
| src/AI.jsx             | Sarvam chat drawer and image assessment form                                               |
| src/components.jsx     | Shared UI, data tables, charts and form dialog                                             |
| src/actions.js         | Form definitions connected to authorized mutations                                         |
| src/api.js             | HTTP helper and presentation formatting                                                    |
| src/styles.css         | Responsive design system                                                                   |
| server/index.js        | API, authorization, validation, state transitions, scoped reports, provider integration    |
| server/models.js       | Mongo collections and indexes                                                              |
| server/domain.js       | Pure forecasting, savings, route and threshold calculations                                |
| server/seed.js         | Non-destructive demo initialization                                                        |
| tests/domain.test.js   | Pure business-rule tests                                                                   |
| tests/integration.js   | Connected API journeys and rejected transitions                                            |

## Collections

- **users:** role, organization, display name, email, bcrypt password, active status, fixed local-pilot location, per-batch capacity.
- **batches:** producer, food, quantity, storage, allergens, expiry, channel, price, human review, current state, claimant, driver, handover timestamps, proof and sponsor pledge.
- **consumptions:** prepared/consumed portions, cost per meal, date, context; unique `(owner, date)`.
- **plans:** approved portions, date and rationale; unique `(owner, date)`.
- **readings:** device name, temperature, humidity, interval energy, downtime, input/output mass, source (`demo`, `manual`, `device`).
- **savings:** monthly baseline/current waste and meal counts, supported unit cost, evidence, independent review; unique `(owner, period)`.
- **needs:** receiving organization, category, requested mass, constraints and open/closed state.
- **audits:** actor, organization, action, entity ID, descriptive evidence and server timestamps.

Mongoose timestamps are enabled. Source documents retain their owner; UI cannot supply ownership, status, actor, driver or review authority arbitrarily.

## Batch state machine

```
review -> available -> reserved -> picked_up -> delivered -> confirmed
   |          |
   +-> held <-+
        |
        +-> available (new human release; expiry/storage checks)
```

- Producer or admin can review only `review`, `held` or `available` batches in authorized scope.
- Available batches require a future expiry to claim. NGO can claim donations; buyer can claim sales.
- Claim is a `findOneAndUpdate` whose filter includes `status: available`, future expiry, channel and receiving capacity. Two concurrent claimants cannot both win.
- Driver must accept the reserved job before pickup; acceptance checks the job's mass against per-batch vehicle capacity.
- Pickup and delivery require that driver and the expected prior state, plus unexpired food.
- Confirmation requires the assigned receiving party and prior `delivered` state. Delayed acknowledgement is allowed even after the use-by time; pickup/delivery themselves must occur before expiry.
- All quantity acceptance is whole-batch. Partial deliveries, recalls and exception settlement are not silently approximated in this pilot.

## Authentication, scope and trust

Passwords are bcrypt-hashed with cost 12. JWT session lifetime is 8h in an HttpOnly, SameSite=Strict cookie. Production mode uses Secure cookies and therefore requires HTTPS. Every request loads the user and checks active status, so disabling an account takes effect on subsequent requests.

Express applies Helmet, JSON size limits, origin checks for browser mutations, rate limiting, Zod validation and centralized errors. User-facing API responses omit password hashes and secrets. Production infrastructure still needs HTTPS, secret management, retention policies, backups and a security assessment.

Producers see their own batches/history/readings/plans/savings. Recipients see eligible exchange batches and their own orders. Drivers see unassigned reserved jobs and assigned jobs. Sponsors see eligible donation opportunities and their own pledges; sponsor confirmed metrics are scoped to their own funded batches. Administrators and auditors see the network for operational governance/verification. Directory entries intentionally contain organization, role, contact name, location and capacity, not credentials.

The administrator can disable/enable users but cannot call the independent auditor verification endpoint. Receiving users cannot create inventory, advance driver states, release food or verify savings.

## Forecast method

Use up to 14 recent consumption records, weighted 1..n by recency. Expected portions = weighted mean × attendance scenario. Safety buffer = ceil(0.7 × recent observed standard deviation). The displayed interval uses observed variation, not a calibrated predictive confidence interval. Rolling one-step MAE uses earlier records only for each backtest target. At least three observations are required. Historical query uses the latest 180 observations, reordered chronologically before forecasting.

This baseline is deterministic, inspectable and stable without paid AI. Sarvam interprets its evidence. A learned production model requires real data, validation and comparison with baseline performance; seeded history is not training evidence.

## Matching and route planning

Matching filters receiving role, active status, capacity and estimated arrival before expiry. Scores reward shorter straight-line distance and a matching open category request. Allergen/dietary text is displayed for human confirmation; it is not silently classified as safe by a language model.

Route planning chooses nearby eligible stops with an expiry urgency adjustment, and inserts a delivery only after its pickup. Travel estimates use haversine distance, assumed 22 km/h and 8 minutes service time per stop. It flags predicted expiry misses. The map is a schematic, not geospatial road directions. Capacity is per job; the pilot does not solve aggregate vehicle-load constraints across simultaneous jobs.

## Sensor policy

Manual readings and authenticated hardware payloads share schema validation. Source is assigned by the server. Pilot alerts: chilled temperature outside 0–5°C, humidity above 75%, downtime above 20 min, yield below 85%, energy intensity above 1.5 kWh/kg. Before releasing chilled food, require the latest producer reading from the past two hours and an in-range temperature.

These are explicit pilot settings, not food-wide regulatory standards. Device-to-batch mapping, calibration, separate policies by food/storage class and continuous excursion duration need hardware rollout. Ambient/hot/frozen policies are not inferred from the chilled threshold.

## Sarvam boundary

The copilot builds a bounded server-side context from permitted records and computed forecasts. It uses a system instruction that distinguishes data from instructions, forbids unsupported numeric claims and forbids autonomous releases/payments/confirmations. The model receives no execution tools. Plain-text output is rendered as React text, not HTML. Calls time out after 45 seconds and return honest configuration/provider errors.

Chat uses `sarvam-105b` on v1. Image input uses `gemma4` through Sarvam v2 with image data URLs and explicit visual-only limitations. This requires beta endpoint access; no key was supplied during implementation, so live provider output has not been verified. The application does not substitute another provider.

## Impact, financial calculations and exports

- Recovered kg = sum of recipient-confirmed batches in scope.
- Meal equivalents = floor(recovered kg / 0.4), not unique individuals fed.
- Illustrative carbon estimate = recovered kg × 2.5 kg CO2e/kg. Transport emissions and food-specific lifecycle factors are omitted.
- Savings fees use only independently verified claims. Donation recovery is not counted as prevention savings by default.
- Sales fee = 4% of confirmed sale mass × per-kg price.
- Sponsorship remains an uncollected pledge; confirmed scope is shown separately from platform fee totals.
- CSV uses quoted cells, escapes quotes and neutralizes formula-leading characters. It exports only confirmed recoveries in the user's scope and labels methodology limitations.

## Persistence tradeoffs

The user's MongoDB is standalone. Core state transitions use atomic single-document writes; audit inserts are separate writes. This is not a transactional or tamper-proof ledger. A crash between the batch change and audit insert can leave a missing audit event. Before commercial use, introduce embedded immutable events or replica-set transactions with an outbox and retry/idempotency strategy. Repeated state transition requests are rejected; they are not charged twice.

The local pilot polls workspace data every 30 seconds and refreshes immediately after its own mutations. It is near-real-time, not a WebSocket telemetry stream. Hardware can ingest observations continuously through the API.
