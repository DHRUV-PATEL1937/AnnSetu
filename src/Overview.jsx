import {
  Leaf,
  ArrowUpRight,
  TrendingUp,
  HeartHandshake,
  Wallet,
  Package,
  Sparkles,
  ArrowRight,
  ShoppingBasket,
} from 'lucide-react';
import { money, number } from './api';
import { Badge, Stat, Chart, Status, Empty } from './components';
const headings = {
  kitchen: [
    'A little less waste.',
    'A lot more possibility.',
    'Plan with confidence. Put every good meal to work.',
  ],
  processor: [
    'Better yield.',
    'A lighter footprint.',
    'Turn operational insight into resources saved.',
  ],
  ngo: ['Good food.', 'Greater community.', 'Bring surplus meals to the people who need them.'],
  buyer: [
    'Quality ingredients.',
    'A second opportunity.',
    'Source surplus locally and keep good food in circulation.',
  ],
  logistics: [
    'The shortest route',
    'to a bigger difference.',
    'Connect kitchens and communities, one recovery at a time.',
  ],
  sponsor: [
    'Fund the journey.',
    'Multiply the impact.',
    'Help good food reach a table, not a landfill.',
  ],
  auditor: [
    'Real evidence.',
    'Accountable impact.',
    'Independently verify the savings behind every claim.',
  ],
  admin: [
    'One connected network.',
    'Countless possibilities.',
    'Keep your food recovery ecosystem moving together.',
  ],
};
export default function Overview({ data, user, navigate, setAiOpen, reviewBatch }) {
  const h = headings[user.role],
    m = data.metrics,
    producer = ['kitchen', 'processor'].includes(user.role),
    next = producer
      ? 'Demand planning'
      : {
          ngo: 'Surplus exchange',
          buyer: 'Surplus exchange',
          logistics: 'Available jobs',
          sponsor: 'Sponsor a recovery',
          auditor: 'Savings verification',
          admin: 'Network directory',
        }[user.role];
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="live-dot" /> PREVENT. CONNECT. REGENERATE.
          </div>
          <h2>
            {h[0]}
            <br />
            <em>{h[1]}</em>
          </h2>
          <p>{h[2]}</p>
          <button onClick={() => navigate(next)}>
            {producer ? 'Plan tomorrow’s production' : 'Explore your next action'}
            <ArrowUpRight size={17} />
          </button>
        </div>
        <div className="hero-visual">
          <div className="hero-orbit orbit-a" />
          <div className="hero-orbit orbit-b" />
          <div className="hero-leaf">
            <Leaf size={86} strokeWidth={1.05} />
          </div>
          <div className="hero-float top-float">
            <span>
              <TrendingUp size={16} />
            </span>
            <div>
              Prevention first<strong>Value beyond waste</strong>
            </div>
          </div>
          <div className="hero-float bottom-float">
            <span>
              <HeartHandshake size={19} />
            </span>
            <div>
              Better, together<strong>Food connects us.</strong>
            </div>
          </div>
          <span className="hero-dot dot-a" />
          <span className="hero-dot dot-b" />
        </div>
      </section>
      <div className="stats-grid">
        <Stat
          label={producer ? 'Verified savings' : 'Food recovered'}
          value={producer ? money(m.savings) : `${number(m.rescuedKg)} kg`}
          detail={
            producer ? 'Volume-normalized · verified demo claims' : 'Recipient-confirmed recoveries'
          }
          Icon={producer ? Wallet : Leaf}
        />
        <Stat
          label="Meals made possible"
          value={number(m.mealEquivalents)}
          detail="Meal equivalents · 0.4 kg per meal"
          Icon={HeartHandshake}
          tone="peach"
        />
        <Stat
          label="Food kept in circulation"
          value={`${number(m.rescuedKg)} kg`}
          detail="Completed & confirmed handovers"
          Icon={Package}
          tone="lavender"
        />
        <Stat
          label="Estimated CO₂e avoided"
          value={`${number(m.estimatedCo2Kg)} kg`}
          detail="Illustrative estimate · factor 2.5"
          Icon={Leaf}
          tone="lime"
        />
      </div>
      <div className="overview-middle">
        <section className="panel trend-panel">
          <div className="panel-head">
            <div>
              <h2>{producer ? 'A smarter preparation rhythm' : 'Your recovery network'}</h2>
              <p>
                {producer
                  ? 'Prepared vs. consumed · latest 14 recorded days'
                  : 'Batch progress across your workspace'}
              </p>
            </div>
            <Badge>{producer ? 'Portions' : 'Live records'}</Badge>
          </div>
          {producer ? (
            <>
              <div className="chart-legend">
                <span>
                  <i className="solid" />
                  Consumed
                </span>
                <span>
                  <i />
                  Prepared
                </span>
              </div>
              <Chart history={data.history} />
            </>
          ) : (
            <div className="progress-list">
              {['available', 'reserved', 'picked_up', 'delivered', 'confirmed'].map((s, i) => {
                const count = data.batches.filter((b) => b.status === s).length;
                return (
                  <div key={s}>
                    <span>
                      <i
                        style={{
                          background: ['#95b978', '#c3cf9c', '#eecc94', '#a8c7bf', '#285346'][i],
                        }}
                      />
                      {s.replace('_', ' ')}
                    </span>
                    <div className="progress-track">
                      <i
                        style={{
                          width: `${Math.max(2, (count / Math.max(data.batches.length, 1)) * 100)}%`,
                        }}
                      />
                    </div>
                    <strong>{count}</strong>
                  </div>
                );
              })}
            </div>
          )}
          <div className="panel-foot">
            <span>
              <TrendingUp size={14} />{' '}
              {producer
                ? 'Turn yesterday’s consumption into tomorrow’s plan.'
                : 'Every confirmed handover adds to your impact.'}
            </span>
            <button onClick={() => navigate(next)}>
              Explore <ArrowRight size={14} />
            </button>
          </div>
        </section>
        <section className="insights-panel">
          <div className="row spread">
            <div className="row">
              <span className="insight-icon">
                <Sparkles size={19} />
              </span>
              <h2>Your next best move</h2>
            </div>
            <Badge tone="green">EVIDENCE LED</Badge>
          </div>
          <p className="insight-intro">Small adjustments. Meaningful outcomes.</p>
          <div className="insight-item">
            <span className="insight-number">01</span>
            <div>
              <strong>
                {producer && data.forecast.ready
                  ? `Prepare around ${data.forecast.planned} portions`
                  : 'Move surplus while it’s still good'}
              </strong>
              <p>
                {producer && data.forecast.ready
                  ? `Based on ${data.forecast.sampleSize} consumption records, with a ${data.forecast.buffer}-portion buffer.`
                  : `${data.metrics.active} active batches in your workspace. Prioritize the earliest use-by time.`}
              </p>
            </div>
          </div>
          <div className="insight-item">
            <span className="insight-number">02</span>
            <div>
              <strong>
                {data.metrics.alerts
                  ? 'Check your storage conditions'
                  : 'Close the loop on every handover'}
              </strong>
              <p>
                {data.metrics.alerts
                  ? `${data.metrics.alerts} threshold alerts in your latest sensor reading. Review before release.`
                  : 'Recipient confirmation is required before a recovery contributes to reported impact.'}
              </p>
            </div>
          </div>
          <div className="insight-bottom">
            <span>
              <i /> {data.ai.configured ? 'Sarvam configured' : 'Sarvam key not connected'}
            </span>
            <button onClick={() => setAiOpen(true)}>
              Ask your copilot <ArrowUpRight size={15} />
            </button>
          </div>
        </section>
      </div>
      <div className="overview-bottom">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>
                {producer
                  ? 'Good food, ready for its next chapter'
                  : 'Food with a second opportunity'}
              </h2>
              <p>
                {producer
                  ? 'Keep an eye on your next recovery'
                  : 'Discover what’s moving through the network'}
              </p>
            </div>
            <button className="text-button" onClick={() => navigate(producer ? 'Inventory' : next)}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="compact-batches">
            {data.batches
              .filter((b) => ['available', 'review', 'reserved'].includes(b.status))
              .slice(0, 3)
              .map((b) => (
                <div className="compact-batch" key={b._id}>
                  <div className={`food-icon ${b.category === 'Bakery' ? 'peach' : ''}`}>
                    <ShoppingBasket size={22} />
                  </div>
                  <div className="compact-name">
                    <strong>{b.name}</strong>
                    <small>{b.org}</small>
                  </div>
                  <strong>
                    {b.quantity}
                    <small> kg</small>
                  </strong>
                  <Status value={b.status} />
                  <button
                    className="icon-button"
                    aria-label={`Open ${b.name}`}
                    onClick={() =>
                      producer && b.status === 'review'
                        ? reviewBatch(b)
                        : navigate(producer ? 'Inventory' : next)
                    }
                  >
                    <ArrowUpRight size={17} />
                  </button>
                </div>
              ))}
            {!data.batches.some((b) => ['available', 'review', 'reserved'].includes(b.status)) && (
              <Empty title="All caught up" />
            )}
          </div>
        </section>
        <section className="community-card">
          <div className="row spread">
            <span className="community-icon">
              <HeartHandshake size={23} />
            </span>
            <Badge tone="outline-dark">THE BIGGER PICTURE</Badge>
          </div>
          <h2>
            Surplus for one.
            <br />A fresh start for another.
          </h2>
          <p>A connected network of kitchens, communities and people who care.</p>
          <div className="community-foot">
            <div className="avatar-stack">
              <span>AK</span>
              <span>FF</span>
              <span>GM</span>
            </div>
            <div>
              <strong>{data.network.length} partners</strong>
              <small>One shared purpose</small>
            </div>
            <ArrowUpRight size={23} />
          </div>
        </section>
      </div>
    </>
  );
}
