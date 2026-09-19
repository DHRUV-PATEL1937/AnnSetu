# AnnSetu implementation contract for future agents

This is the durable implementation brief. Read README.md and docs/PRODUCT.md, docs/ARCHITECTURE.md, docs/RUNBOOK.md and docs/VALIDATION.md before making changes. Preserve user work and the existing database.

## Non-negotiable product constraints

- Preserve SIH PS 26234 exactly: prevention + quality + redistribution + logistics + processing efficiency + sustainability reporting.
- Stack: MongoDB, Express, React with Vite, Node.js. Do not replace this with a static dashboard or change stacks.
- Sarvam is the only external AI provider. All provider keys stay in the server environment. Never create a fake successful AI response when a key is absent.
- Work in complete role workspaces and connected user journeys. Do not deliver an unfinished generic feature layer as a dashboard phase.
- Every button must perform a meaningful action, navigate, or explicitly explain a blocked dependency. No placeholder controls, simulated success toasts or invented impact claims.
- Retain the eight permission classes: kitchen, processor, ngo, buyer, logistics, sponsor, auditor, admin. Shelters/food banks/community kitchens share ngo capabilities.
- Existing local MongoDB: 127.0.0.1:27017; application database annsetu. Do not reset collections or alter unrelated databases. Seed must remain non-destructive.
- The donation channel must never acquire an NGO platform fee. Sponsor pledges are not revenue or completed payments.
- Brand: AnnSetu. Calm green/cream, careful typography, restrained color-coded states, Lucide icons, responsive layouts and useful empty states. Keep the UI focused on food operations.

## Engineering invariants

1. Authenticate and authorize on the server. Hiding a button is not access control.
2. Protect tenant ownership and state transitions in atomic Mongo filters. A batch may be claimed once, and confirmed once. Preserve whole-batch semantics until partial allocation is designed explicitly.
3. Do not rely on expiry computed in the browser; validate on claim, release, pickup and delivery.
4. Require documented human release. Image assessment never authorizes food safety. Chilled release requires recent in-range evidence under the pilot policy.
5. Count recovered food only after the receiving organization confirms delivery. Avoid double counting prevention and donation.
6. Require independent auditor verification before recognizing a savings success fee. Enforce one calendar-month claim per owner. No administrator override of the independent verification endpoint.
7. Store passwords as hashes, keep sessions HttpOnly, keep secrets out of responses and source control, validate input, constrain request sizes and external-call timeouts.
8. Use saved database records to calculate metrics. A constant is acceptable only if it is explicitly a configuration assumption (meal mass, emissions factor, fee rate).
9. Distinguish statistical calculations, heuristic optimization, Sarvam-generated advice, seeded examples and measured data in UI/docs.
10. Prefer small, cohesive modules. Format source with Prettier. Add tests for business invariants and changed failure cases, not trivial rendering copies.

## Completion gate for each role slice

Implement input form -> validation -> API -> authorized persistence -> downstream recipient visibility -> error/empty state -> relevant tests -> browser verification. Check the return visit, not just the initial submission. Update docs when behavior changes.

## Test and handoff discipline

- Run npm test and npm run build.
- When server behavior changes, run npm run test:integration against the local demo only.
- Inspect impacted UI with the available browser tools, including narrow viewport and console errors.
- Do not claim zero bugs, production readiness, real AI success without provider access, or physically measured IoT/ESG performance.
- Report what works, what was tested, and exact remaining external dependencies.
- Never print .env, tokens, session cookies or generated secrets in chat or logs.

## Next production work (not implemented promises)

Map traffic and real vehicle capacities; organization verification; cancellation/recall and rejection workflows; partial delivery handling; tamper-evident audit export; replica-set transactions/outbox; production notification dispatch; per-device rotating credentials and calibration; food-specific safety policy; controlled model evaluation; payment/settlement/invoicing; supported emissions factors; privacy retention and consent controls. Keep these scoped to complete role journeys.
