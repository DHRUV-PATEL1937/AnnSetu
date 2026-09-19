# AnnSetu — every meal matters

A local MERN implementation for **SIH problem statement 26234**: AI-Powered Smart Food Waste Reduction and Sustainable Redistribution Ecosystem for Institutional Kitchens and Food Processing Units. The problem statement is unchanged.

AnnSetu connects prevention, safe surplus release, redistribution, logistics and independently reviewed savings. The eight role-specific workspaces share real MongoDB records, rather than separate dashboard mockups.

## Run locally

Requirements: Node.js 22+, npm, MongoDB running at `127.0.0.1:27017`.

```powershell
npm install
# On a new machine, copy .env.example to .env and set random secrets.
npm run seed
npm run dev
```

Open **http://127.0.0.1:5173**. API: **http://127.0.0.1:4000/api**.

The configured database is **mongodb://127.0.0.1:27017/annsetu**. Compass is a database client: connect Compass to the same host and refresh the database list. Existing databases are not modified. Seeding creates only missing accounts and only seeds operational records when the batches collection is empty; it does not reset data.

For a built frontend served by Express:

```powershell
npm run build
npm start
# http://127.0.0.1:4000
```

Do not start two API processes on port 4000. The development command already starts both services.

## Demo accounts

All accounts use **AnnSetu@2026**. These are deliberately public local demo credentials; do not deploy them publicly.

| Workspace                                     | Email                  |
| --------------------------------------------- | ---------------------- |
| Institutional kitchen                         | kitchen@annsetu.demo   |
| Food processing unit                          | processor@annsetu.demo |
| NGO / food bank / shelter / community kitchen | ngo@annsetu.demo       |
| Secondary buyer                               | buyer@annsetu.demo     |
| Logistics partner                             | logistics@annsetu.demo |
| Impact sponsor                                | sponsor@annsetu.demo   |
| Independent auditor                           | auditor@annsetu.demo   |
| Platform administrator                        | admin@annsetu.demo     |

Each login has a complete local workflow. NGO, food bank, shelter and community kitchen are one recipient permission class, distinguished by organization, rather than four duplicate dashboards.

## Sarvam configuration

Set `SARVAM_API_KEY` in `.env`, then restart the API. Never put the key in a `VITE_` variable or commit it.

- Chat: `https://api.sarvam.ai/v1/chat/completions`, model `sarvam-105b`, header `api-subscription-key`.
- Image assessment: `https://api.sarvam.ai/v2/chat/completions`, default model `gemma4`, hosted by Sarvam. This is a Sarvam-hosted open model, not a native Sarvam vision model; the endpoint requires appropriate beta access.
- Copilot responses support English, Hindi, Kannada, Tamil, Telugu, Marathi and Bengali, using the chosen response language.
- The server sends role-scoped food records, recent readings and computed forecast evidence. It does not send passwords, API keys, other tenants' private records or the entire database.
- The copilot is advisory. It cannot execute food release, financial approval or delivery confirmation.
- Without a key, the UI and API explicitly report unavailability. There are no fabricated AI responses.

API references checked during implementation: [Sarvam chat V1](https://docs.sarvam.ai/api-reference/chat/chat-completions-v1), [Sarvam hosted models](https://docs.sarvam.ai/api-reference/open-source/chat-completions), [authentication](https://docs.sarvam.ai/api-reference/authentication).

## What works now

- Cookie authentication, bcrypt password hashes, database-backed role checks and per-account record scope.
- Batch creation, documented human release/hold, expiry validation, concurrent-safe whole-batch reservation.
- Ranked partner matching by category need, capacity, proximity and estimated arrival before expiry.
- Donation and commercial channels with enforced recipient roles.
- Driver acceptance, pickup, delivery and separate recipient confirmation.
- Route ordering with pickup precedence and expiry feasibility estimates.
- Daily consumption entry, recency-weighted forecasts, attendance scenarios, backtest MAE and approved production plans.
- Manual readings and device-key-authenticated IoT ingestion; cold-storage, humidity, yield, downtime and energy alerts.
- Fresh chilled-storage evidence required before releasing chilled food.
- Sarvam copilot and advisory image assessment integration.
- Savings submission, independent audit verification, proposed success-fee calculations, buyer fee calculations and sponsorship pledges.
- Community requests, profile capacity settings, administrator account enable/disable controls, activity history and impact CSV export.
- Responsive layouts, real empty/error states, keyboard-accessible forms and modal focus handling.

## Distinctive business model

**The prevention dividend:** an institution keeps 85% of independently verified food-cost savings; AnnSetu earns a proposed 15%. Waste baselines are normalized by meal volume, so simply serving fewer meals does not create a success fee. Calendar-month claim uniqueness prevents duplicate monthly claims per institution.

**Second-life commerce:** a proposed 4% fee on recipient-confirmed commercial surplus orders. NGO donations carry no platform fee.

**Sponsor the missing mile:** sponsors pledge transport for specific recoveries. Only recipient-confirmed recoveries contribute to sponsor impact. Sponsorship money is pass-through funding, not platform revenue, and this pilot does not collect payments.

These are proposed commercial terms, not claims of industry-wide novelty, contracted income or audited financial results. See [product strategy](docs/PRODUCT.md) for economics and the differentiation argument.

## Validation

```powershell
npm test
# With npm run dev running:
npm run test:integration
npm run build
npm run format:check
```

Integration tests use the local demo database, create records identified as integration tests, and remove only the IDs they created. They exercise both donation and sale chains, role boundaries, concurrent claims, expiry rejection and independent audit. Do not aim this test script at a production database.

## Deliberate pilot boundaries

Initial records and impact numbers are seeded demonstrations. Forecasting is an explainable statistical baseline, not a trained or validated production ML claim. Sensor hardware, traffic maps, payment collection, certified ESG reporting, organization verification and production deployment are not connected. Food photos cannot establish microbiological safety. Carbon factors are illustrative, not carbon credits.

Read [ARCHITECTURE.md](docs/ARCHITECTURE.md), [RUNBOOK.md](docs/RUNBOOK.md), [VALIDATION.md](docs/VALIDATION.md) and [AGENTS.md](AGENTS.md) before extending the project.
