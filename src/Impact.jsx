import {
  Wallet,
  Scale,
  ShoppingBasket,
  Truck,
  Leaf,
  HeartHandshake,
  Globe,
  Download,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { api, money } from './api';
import { Badge, Stat, Empty, Status, EcoRewardsCard, MilestoneBadges, RewardsCatalog } from './components';
export function Savings({ data, user, open }) {
  const submit = () =>
    open({
      title: 'Submit measured savings',
      description:
        'Savings are normalized to meal volume and independently reviewed before a success fee is recognized. Avoid overlapping reporting periods.',
      fields: [
        {
          name: 'period',
          label: 'Reporting month (one claim per month)',
          type: 'month',
          value: new Date().toISOString().slice(0, 7),
        },
        { name: 'baselineWasteKg', label: 'Baseline food waste (kg)', type: 'number', min: 0 },
        { name: 'actualWasteKg', label: 'Current food waste (kg)', type: 'number', min: 0 },
        { name: 'baselineMeals', label: 'Baseline meals served', type: 'number', min: 1 },
        { name: 'actualMeals', label: 'Current meals served', type: 'number', min: 1 },
        { name: 'costPerKg', label: 'Supported food cost (₹/kg)', type: 'number', min: 1 },
        {
          name: 'evidence',
          label: 'Weighing logs, cost source & period references',
          type: 'textarea',
          minLength: 20,
        },
      ],
      submit: 'Submit for independent review',
      save: (v) => api('/savings', { method: 'POST', body: v }),
    });
  return (
    <section className="panel spaced">
      <div className="panel-head">
        <div>
          <h2>Measured savings ledger</h2>
          <p>No verified savings. No success fee.</p>
        </div>
        {['kitchen', 'processor'].includes(user.role) && (
          <button className="button small" onClick={submit}>
            <Plus size={15} /> Submit savings
          </button>
        )}
      </div>
      {data.savings.length ? (
        <div className="savings-list">
          {data.savings.map((s) => (
            <article className="saving-row" key={s._id}>
              <div>
                <div className="row">
                  <h3>{s.period}</h3>
                  <Status value={s.status} />
                </div>
                <p>{s.owner?.org}</p>
                <p className="small">{s.evidence}</p>
                {s.reviewNote && <p className="review-note">Review: {s.reviewNote}</p>}
              </div>
              <div className="saving-amount">
                <strong>{money(s.gross)}</strong>
                <small>{s.preventedKg} kg prevented</small>
                <small>15% fee: {money(s.fee)}</small>
                {user.role === 'auditor' && s.status === 'pending' && (
                  <button
                    className="button small secondary"
                    onClick={() =>
                      open({
                        title: 'Independently review savings',
                        description:
                          'Check source logs, comparable service volume, unit cost, attribution and non-overlapping periods before verifying.',
                        fields: [
                          {
                            name: 'status',
                            label: 'Decision',
                            options: [
                              { value: 'rejected', label: 'Reject / insufficient evidence' },
                              { value: 'verified', label: 'Verify savings' },
                            ],
                          },
                          {
                            name: 'reviewNote',
                            label: 'Audit rationale and evidence',
                            type: 'textarea',
                            minLength: 12,
                          },
                        ],
                        submit: 'Record audit decision',
                        save: (v) => api(`/savings/${s._id}/review`, { method: 'POST', body: v }),
                      })
                    }
                  >
                    Review claim <ArrowUpRight size={14} />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty title="No savings claims yet" />
      )}
    </section>
  );
}
export function Impact({ data, user, open }) {
  const m = data.metrics;
  return (
    <>
      <div className="stats-grid">
        <Stat
          label="Verified savings"
          value={money(m.savings)}
          detail="After meal-volume normalization"
          Icon={Wallet}
        />
        <Stat
          label="Prevention success fee"
          value={money(m.platformFee)}
          detail="15% of verified savings · illustrative"
          Icon={Scale}
          tone="peach"
        />
        <Stat
          label="Buyer transaction fees"
          value={money(m.saleFees)}
          detail="4% of confirmed secondary sales"
          Icon={ShoppingBasket}
          tone="lavender"
        />
        <Stat
          label="Transport pledged"
          value={money(m.sponsorship)}
          detail="Confirmed recoveries · pilot pledges"
          Icon={Truck}
          tone="lime"
        />
      </div>
      <div className="two-columns">
        <section className="revenue-story">
          <Badge tone="outline">THE ANNSETU VALUE MODEL</Badge>
          <h2>
            We earn when
            <br />
            you waste less.
          </h2>
          <p>A prevention dividend aligns our business with your kitchen’s efficiency.</p>
          <div className="revenue-split">
            <div>
              <strong>85%</strong>
              <span>
                of verified savings
                <br />
                stays with the institution
              </span>
            </div>
            <div>
              <strong>15%</strong>
              <span>
                funds the platform
                <br />
                through a success fee
              </span>
            </div>
          </div>
          <p className="small">
            Proposed pilot pricing, not a payment or invoice. Donation recipients pay no platform
            fee.
          </p>
        </section>
        <section className="panel padded">
          <h2>Impact with a traceable foundation</h2>
          <div className="impact-line">
            <Leaf />
            <span>Confirmed food recovery</span>
            <strong>{m.rescuedKg} kg</strong>
          </div>
          <div className="impact-line">
            <HeartHandshake />
            <span>Estimated meal equivalents</span>
            <strong>{m.mealEquivalents}</strong>
          </div>
          <div className="impact-line">
            <Globe />
            <span>Illustrative CO₂e avoided</span>
            <strong>{m.estimatedCo2Kg} kg</strong>
          </div>
          <p className="small muted">
            Meal equivalents use 0.4 kg per meal. Carbon estimates use an illustrative 2.5 kg
            CO₂e/kg factor and exclude transport emissions. These are not certified emissions
            reductions, carbon credits or compliance attestations.
          </p>
          <a className="button secondary" href="/api/reports/export">
            <Download size={16} /> Download evidence CSV
          </a>
        </section>
      </div>
      <EcoRewardsCard rewards={m.rewards} />
      <MilestoneBadges badges={m.rewards?.badges} />
      <RewardsCatalog rewards={m.rewards?.availableRewards} />
      {['kitchen', 'processor', 'admin', 'auditor'].includes(user.role) && (
        <Savings data={data} user={user} open={open} />
      )}
      <section className="panel padded spaced">
        <h2>A business model that protects the mission</h2>
        <div className="business-grid">
          <div>
            <span>01</span>
            <h3>Prevention dividend</h3>
            <p>
              Institutions pay only on independently verified, volume-adjusted food cost savings.
            </p>
          </div>
          <div>
            <span>02</span>
            <h3>Second-life commerce</h3>
            <p>
              A 4% fee applies to confirmed commercial surplus orders. Donated food carries no
              platform fee.
            </p>
          </div>
          <div>
            <span>03</span>
            <h3>Sponsor the missing mile</h3>
            <p>
              Sponsors underwrite transport, with outcomes tied to recipient confirmation. Pledges
              are not platform revenue.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
export function Methodology() {
  return (
    <section className="panel padded methodology">
      <p className="eyebrow">HONEST BY DESIGN</p>
      <h2>Good decisions start with clear evidence.</h2>
      {[
        [
          'Forecasting',
          'A recency-weighted average of up to 14 consumption days, adjusted for attendance. A buffer uses observed demand variation. Rolling backtest mean absolute error is shown; it is not a claim of validated model accuracy.',
        ],
        [
          'Food quality',
          'Use-by checks and operator release gate redistribution. Sarvam-hosted image assessment flags visible issues but cannot certify microbiological safety. Human review remains mandatory.',
        ],
        [
          'Savings',
          'Baseline waste is scaled by current meals / baseline meals. Avoided waste × supported cost per kg gives gross savings. Negative savings are floored at zero. Independent audit approves or rejects each claim.',
        ],
        [
          'Recovery impact',
          'Only recipient-confirmed batches count. Estimated meals use 0.4 kg per meal. The illustrative CO₂e factor is 2.5 kg per kg of food; transport and lifecycle differences are not included. Not certified ESG compliance.',
        ],
        [
          'Revenue',
          'The proposed 15% success fee applies to verified savings. A separate 4% commission applies to confirmed secondary sales. Transport sponsorship is a pledge, not collected revenue. No real payments are processed.',
        ],
        [
          'Demo and production boundary',
          'Initial food batches, consumption, readings and verified claims are demonstration records. Replace them with measured data before evaluating performance. The local pilot is not a food safety certification or production readiness claim.',
        ],
      ].map(([title, body]) => (
        <div key={title}>
          <h3>{title}</h3>
          <p>{body}</p>
        </div>
      ))}
    </section>
  );
}
