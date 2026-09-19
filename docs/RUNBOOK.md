# Local runbook

## Starting and inspecting

1. Ensure the local MongoDB service is running on port 27017.
2. In D:\SIH, run `npm install` if dependencies are absent.
3. Keep `.env` local. A random JWT secret and device key were generated for this installation; do not print them.
4. Run `npm run seed` once to initialize demo accounts. It preserves existing records and passwords.
5. Run `npm run dev`. Open http://127.0.0.1:5173.
6. In Compass, use mongodb://127.0.0.1:27017 and open `annsetu`.

Health endpoint: GET http://127.0.0.1:4000/api/health. Startup fails clearly if MongoDB is unavailable or JWT_SECRET is too short. The health endpoint confirms the running service; it is not a continuous database availability probe.

## Demonstration script

### Kitchen to community

- Sign in as kitchen. Visit Demand planning; inspect MAE, vary attendance, recalculate and approve tomorrow's plan.
- Add a donation batch with a future use-by time. It appears in review, not in the recipient exchange.
- Open Quality review. Record handling evidence and release the batch. Chilled food needs a recent in-range storage reading first.
- Open Redistribution to inspect automatically ranked receiving partners.
- Sign in as ngo, reserve the batch in Surplus exchange. The batch disappears from the available pool and appears in My recoveries.
- Sign in as sponsor and pledge transport for an eligible donation; this records no payment.
- Sign in as logistics, accept the job, inspect Route planner, record pickup and delivery with handover evidence.
- Sign in as ngo, confirm receipt. Only now do recovered kilograms and impact estimates increase.

### Processing to secondary buyer

- Sign in as processor. Review Processing & sensors; inspect yield, loss, downtime and energy.
- Record a reading to see threshold calculations update.
- Create a sale batch with positive price per kg, review and release it.
- Sign in as buyer, reserve it; follow the same driver/recipient handover chain.
- Confirm the order. Revenue views show the proposed commission, without pretending a payment happened.

### Savings and governance

- Kitchen/processor submits a claim for a calendar month not already used. Use measured baseline/current weights, meal counts and a supported cost source.
- Auditor reviews evidence and verifies or rejects. Other roles cannot use that endpoint.
- Administrator inspects Revenue & impact and Traceability, and can disable a non-admin account.
- Export the recovery CSV. It contains confirmed batch evidence and clearly labeled estimate assumptions.

## IoT adapter

`POST /api/iot/readings`

Headers: `Content-Type: application/json`, `x-device-key: <IOT_API_KEY from local environment>`.

```json
{
  "ownerId": "<24-character producer user id>",
  "device": "Cold room A - CR-01",
  "temperature": 3.8,
  "humidity": 65,
  "energy": 45,
  "downtime": 5,
  "inputKg": 100,
  "outputKg": 92
}
```

Get the producer ID from the authenticated administrator's User management API, or from Compass. Never embed the device secret in browser code. This pilot uses a shared server device key; production requires per-device credentials, rotation, ownership binding, calibration, sampling timestamps and replay protection.

## Troubleshooting

- **Cannot connect / startup timeout:** check MongoDB service and MONGODB_URI. Compass itself is not the database server.
- **Port in use:** stop the previous AnnSetu process you started; do not terminate arbitrary Node processes. The dev command starts both API and Vite.
- **Connection interrupted while editing:** the Node watcher briefly restarts the API. Refresh once it reports MongoDB connected.
- **Sarvam not connected:** set SARVAM_API_KEY in .env and restart. Browser credentials are unrelated to the provider key.
- **Sarvam 401/403/429/5xx:** check account/API entitlement, key, quota and provider status. Vision requires beta access; ordinary chat access does not imply it.
- **No available food:** initial demo food has real expiry timestamps. Create a new batch and release it. Seed intentionally does not reset expired or claimed food.
- **No matching partners:** check whole-batch capacity, remaining shelf life, channel and active recipient accounts.
- **Cannot claim:** the batch may be expired, already reserved, in the wrong channel or beyond the receiving account's capacity.
- **Cannot deliver:** ensure the correct driver accepted and picked up the batch before delivery; expiry cannot be bypassed.
- **Savings record already exists:** one calendar-month claim is allowed per owner. The pilot does not implement financial claim correction/resubmission workflows.
- **Cookie missing on production:** Secure cookies need HTTPS when NODE_ENV=production. Use local development mode on loopback HTTP.

## Test data and retention

Initial records are explicitly demonstration data. Do not cite their numbers as real savings, meals served or emissions reductions. Integration tests record the IDs they create and clean up only those IDs. Seed never drops collections. Do not add a reset button without an explicit user request and a scoped recovery plan.

## Production handoff checklist

Production readiness requires verified organizations and operator training; food-specific safety policy and regulatory review; measured baselines and consent; real hardware and per-device keys; TLS and deployment hardening; job capacity and traffic routing; exception/recall/partial-delivery workflows; audit consistency; payment contracts and settlement; source-supported emissions reporting; privacy retention; automated monitoring/backups; and load/security/model evaluations. These are documented integration boundaries, not capabilities claimed by the local demonstration.
