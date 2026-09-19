# Product thesis and differentiation

## Problem, preserved

SIH 26234, Ministry of Food Processing Industries: AI-powered prevention, quality monitoring, surplus redistribution, logistics, operational efficiency and sustainability for institutional kitchens and food processing units. AnnSetu does not narrow the statement to a donation marketplace.

## The useful distinction

Most intuitive food-rescue designs begin once surplus already exists. AnnSetu begins before cooking, follows food through its next use, and records who can substantiate the outcome. Its differentiator is the combination of a prevention-first operating workflow and an outcome-linked revenue ledger. This is a product positioning thesis, not a researched claim that no competing business has ever used gain-sharing.

The closed loop:

1. **Prevent:** consumption evidence -> demand scenario -> operator-approved production plan.
2. **Protect:** inventory -> handling and expiry checks -> documented human release.
3. **Connect:** capacity/need/distance/expiry ranking -> recipient reservation -> driver assignment.
4. **Prove:** pickup -> delivery -> receiving-party confirmation -> scoped evidence report.
5. **Improve:** normalized waste measurements -> independent savings review -> prevention dividend.

Prepared/consumed portions and physical recovered kilograms are different quantities. Never silently treat them as interchangeable.

## Revenue: prevention dividend + recovery infrastructure

### 1. The prevention dividend

Institutions pay a proposed 15% share of independently verified avoided food cost. There is no success fee on unverified or negative savings. The institution keeps 85% before other implementation costs. This aligns the vendor with reducing waste, instead of rewarding higher donation volume.

For a reporting month:

```
normalized baseline waste = baseline waste kg × actual meals / baseline meals
prevented waste kg = max(0, normalized baseline waste − actual waste kg)
verified avoided cost = prevented waste kg × supported food cost per kg
platform success fee = 15% × verified avoided cost
institution retained amount = verified avoided cost − success fee
```

Example, illustrative only: baseline 1,000 kg waste across 20,000 meals; current 600 kg waste across 22,000 meals; supported cost ₹60/kg. Normalized baseline = 1,100 kg. Avoided waste = 500 kg. Avoided cost = ₹30,000; platform fee = ₹4,500; institution retains ₹25,500 before other costs.

One claim per calendar month per institution prevents repeat billing for the same month. The independent auditor checks measurement logs, valuation, service-volume comparability, attribution and whether costs are incremental. The administrator cannot self-approve claims. Initial verified claims are explicitly seeded examples.

Commercial guardrails for a real pilot: establish the measurement period and baseline before intervention; agree which costs count; exclude food recovered through commercial resale from double-counted prevention savings; cap fees contractually; give the buyer a dispute/correction process; separate tax and logistics costs. These contractual and payment mechanisms are not implemented in the local app.

### 2. Second-life commerce

Secondary buyers acquire eligible surplus ingredients or food at an agreed price. A proposed 4% commission is calculated only after receipt is confirmed. Donation recipients pay no platform fee. This stream monetizes commercial exchange without placing food access behind a paywall.

Current implementation: whole-batch order reservation, price snapshot in the batch, confirmed sale value and fee estimate. No payment gateway, tax invoice, settlement or refund is claimed.

### 3. Sponsor the missing mile

Sponsors underwrite the transport of a particular donation, closing a common funding gap. The ledger links the pledge to a batch and counts sponsor impact only after recipient confirmation. Funds pledged for transport are **pass-through commitments**, not platform revenue. A future contracted reporting subscription could pay for sponsor portfolio assurance; it is not included in current revenue calculations.

### Unit economics to measure, not invent

Track cost per verified kg prevented, API cost per institution/month, operator support time, device amortization, verification cost, delivery cost, success-fee collections and institution retention. A pilot cannot establish profitability from seeded metrics. The pricing percentages are hypotheses to validate, not market facts.

## Eight complete login workspaces

| Role                                    | End-to-end responsibility                                                             | Main screens                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Kitchen                                 | Record meals, approve production, create/release surplus, see matches, submit savings | Overview, inventory, demand planning, redistribution, storage, savings |
| Processor                               | Measure yield, downtime and energy; manage inventory and sales/donations              | Overview, inventory, planning, redistribution, processing, savings     |
| NGO/food bank/shelter/community kitchen | Post need, reserve suitable donation, confirm receipt                                 | Overview, exchange, recoveries, community needs, impact                |
| Secondary buyer                         | Reserve a commercial batch and confirm received order                                 | Overview, exchange, orders, impact                                     |
| Logistics                               | Accept job, review stop order, record pickup and delivery                             | Overview, jobs, deliveries, route planner, impact                      |
| Sponsor                                 | Pledge transport, follow funded recoveries and confirmed impact                       | Overview, sponsor recovery, sponsored recoveries, impact               |
| Auditor                                 | Independently verify/reject savings with evidence                                     | Overview, verification, traceability, impact                           |
| Administrator                           | Monitor network, manage account access, view combined revenue                         | Overview, directory, accounts, traceability, revenue                   |

No extra consumer login is necessary for this institutional problem. Individual beneficiaries are not registered or exposed in the pilot.

## Sarvam used where it helps most

- An evidence-grounded operations copilot, with the role's real records and calculated forecasts.
- Multilingual operational explanations in seven supported UI-selected languages, generated by Sarvam.
- Advisory visual inspection through Sarvam's hosted image-capable model. No claim that appearance detects pathogens.
- Explain numerical recommendations and uncertainties; do not use a generative model as the source of financial arithmetic or safety decisions.
- Server-side provider access, bounded prompts, response timeout, rate limiting, no arbitrary tool execution, no fabricated fallback.

Demand prediction is a recency-weighted numerical baseline with observed variation and rolling MAE, not a fake LLM prediction. Routing is a transparent optimization heuristic, not a claimed traffic-aware AI service. With measured data, compare time-series models against this baseline before deciding that extra model complexity improves operations. Sarvam can interpret changes and propose human-reviewed actions; it should never replace ground-truth arithmetic.

## Delivery organization: three complete workspace groups

These are organization groups for reviewing the implemented app, not unfinished horizontal milestones:

1. **Food operations:** kitchen and processor, including planning, quality, sensors, inventory and savings.
2. **Recovery network:** NGO, buyer and logistics, including reservation through confirmation.
3. **Trust and economics:** sponsor, auditor and administrator, including attributable impact and revenue evidence.

Within each group, review the whole login journey and its downstream effects. Never declare a role done because its overview cards render.

## Evaluation plan for a real institutional pilot

Collect a consented baseline, calibrated physical waste weights, meal/service counts, approved procurement cost sources and sensor readings. Measure forecast MAE against a naive seasonal baseline, excess production, recovery timeliness, recipient-confirmed kilograms, failed pickups, food-safety holds, normalized cost savings and operator effort. Use a held-out time period; do not train and evaluate on the same days. Record failures and error bars. Compare before/after under comparable service conditions; do not claim causal impact from a dashboard trend alone.
