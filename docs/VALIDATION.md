# Validation record

Validation performed locally on 19 September 2026 using Node 22.14.0, the user's MongoDB at 127.0.0.1:27017, and the running Vite/Express application.

## Automated checks

- `npm test`: **6/6 unit tests passed**. Cold-start forecasting, recency/attendance behavior, backtest result, savings normalization and fee arithmetic, route pickup precedence, expiry infeasibility, distance, operational alert thresholds.
- `npm run test:integration`: **74 API assertions passed**. Eight successful logins and workspace scopes; unauthenticated/unauthorized rejection; incorrect password; cross-producer isolation; release before claim; donation/sale role separation; ranked recipient matches; concurrent double-claim prevention; driver state ordering; recipient-only confirmation; repeated confirmation rejection; expired claims; consumption validation; cold-storage release gate and corrected reading; independent savings review; monthly duplicate rejection; community need close; sensor mass-balance validation; device-key rejection; CSV evidence export; missing Sarvam key response.
- Production build: passed.
- npm dependency audit, including development dependencies: **0 known vulnerabilities** reported at verification time. This is not a substitute for a security assessment.
- Formatting: Prettier is configured for source, tests, docs and project configuration.

The integration script creates its own batches, claims, readings and needs, then deletes only those IDs and their associated audit events. It leaves seeded accounts and baseline records intact.

## Browser checks

Verified in the Codex browser through actual UI interactions:

- All eight roles sign in with their generated demo credentials.
- Every role-specific navigation destination renders its expected heading and data/empty state without a reported application alert.
- Kitchen: inventory, demand, redistribution, storage and savings.
- Processor: inventory, demand, redistribution, processing readings and savings.
- NGO: exchange, recoveries, community needs and impact.
- Buyer: exchange, orders and impact.
- Logistics: available jobs, deliveries, route planner and impact.
- Sponsor: recovery funding, sponsored recoveries and impact.
- Auditor: savings verification, traceability and impact.
- Administrator: directory, account controls, traceability and revenue.
- Settings and sign-out operate across successive role changes.
- Desktop overview visually inspected.
- At a 390 × 844 mobile viewport: no horizontal document overflow, collapsed navigation works, batch creation dialog can be completed and submitted.
- Created a synthetic test batch via the mobile form, reviewed/released it, and verified the saved state in the inventory. Removed that one test batch and its audit events afterward.
- The tested role navigation produced no browser console errors or warnings. Expected network errors during development-server restart were resolved and retested.

## Not claimed as verified

- Live Sarvam generation or image reasoning: no provider API key supplied. Missing-key behavior was verified. Vision also needs beta API entitlement.
- Real sensor hardware, cold-chain calibration, traffic routing, aggregate vehicle-capacity optimization or real payments.
- Real-world food-safety performance, causal savings, measured carbon reductions or regulatory/ESG certification.
- Production load, penetration testing, accessibility certification, cross-browser coverage, recovery after process/database failure or external model reliability.

Passing these checks supports a working local pilot; it does not justify a promise that software has no bugs.
