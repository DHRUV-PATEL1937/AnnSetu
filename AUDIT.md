# AnnSetu live product audit

Audited against the Render deployment at desktop (1440 px) and mobile (390 px), supplemented by the deployed React source where the Windows browser-control helper failed. The public deployment was reachable and rendered the current landing experience.

## Existing screens

- Public: landing, six-stage process, ecosystem roles, EcoRewards, feature summary, sign in, organization registration.
- Shared authenticated shell: overview, notification popover, Sarvam copilot, settings/profile, About & Process.
- Kitchen: inventory, demand planning, redistribution, storage and sensors, savings and impact.
- Food processor: inventory, demand planning, redistribution, processing and sensors, savings and impact.
- NGO/receiver: surplus exchange, recoveries, community needs, impact reports.
- Secondary buyer: surplus exchange, orders, impact reports.
- Logistics: available jobs, deliveries, route planner, impact reports.
- Sponsor: sponsor a recovery, sponsored recoveries, impact reports.
- Auditor: savings verification, traceability, impact reports.
- Administrator: network directory, user management, traceability, revenue and impact.
- Dialog flows: add surplus, quality release/hold, consumption entry, production plan, sensor reading, community need, reservation, sponsorship, pickup/delivery/receipt, savings submission/review, account access and profile editing.

## Audit findings

- Typography collapsed to 7–11 px at common laptop and mobile breakpoints, making labels, evidence and actions difficult to read.
- Many olive-gray foreground colors had weak perceived contrast on cream surfaces. Status and operational evidence blended together.
- Dense dashboard chrome competed with the actual work: role switcher, connection status, About Process, refresh, notifications and profile controls all occupied the top bar.
- The landing page was long and feature-heavy before users reached a concrete operational choice. Several statements implied stronger certification, immutability or notification capability than the pilot implements.
- Landing impact numbers were fixed marketing statements rather than saved database outcomes.
- Forms with more than five fields appeared as one large dialog. The surplus flow therefore required more scanning than its frequent-use importance justified.
- Loading used a centered spinner and gave no indication of the dashboard structure being prepared.
- Image assessment returned prose without a prominent result state or renewed human-release reminder.
- Tables depended on horizontal scrolling on narrow screens and used very small supporting text.
- Mobile cards technically reflowed, but important context became too small; the UI optimized for fitting more content instead of comprehension.
- Empty states existed, but some pages shared generic wording that did not always suggest the role-specific next action.

## Required-feature mapping

1. Landing: implemented; live confirmed demo metrics added in this redesign.
2. Role dashboards: implemented for all eight permission classes, including the four primary roles requested.
3. Forecasting: implemented with demand history, predicted demand, attendance scenario and surplus evidence.
4. Surplus listing: implemented; converted to a short multi-step dialog.
5. Quality detection: implemented through Sarvam-hosted image assessment plus mandatory human release; result state clarified.
6. Redistribution: ranked list and claim/status chain implemented. A road-map integration is not implemented.
7. Logistics: ordered pickup/delivery stops and ETA heuristic implemented. It is a schematic and does not use live traffic.
8. Processing monitoring: yield/loss, downtime, energy and threshold alerts implemented.
9. Sustainability: saved-record dashboard and CSV evidence export implemented. It is not certified ESG reporting.
10. Notifications: in-app derived alert popover implemented. External push/SMS/email delivery is not implemented.
11. Onboarding: role-aware registration implemented. The platform retains eight permission classes required by the product contract.

## Redesign decisions

- Standardized deep green, warm cream and amber accent tokens with explicit success/warning/error colors.
- Raised body and supporting text to readable sizes; preserved 44 px interaction targets and visible focus rings.
- Strengthened cards, spacing and headings so key metrics appear before charts and operational details.
- Added structural skeleton loading, multi-step forms, a clearer quality-result state and database-backed landing metrics.
- Reworded public claims to match the implemented evidence and pilot boundaries.
