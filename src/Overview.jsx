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
  Award,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { money, number, roles } from './api';
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
    rewards = m.rewards,
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
      <section className="dashboard-welcome">
        <div className="welcome-main">
          <div className="welcome-meta-row">
            <span className="welcome-role-badge">{roles[user.role]}</span>
            <span className="live-dot" />
            <span className="welcome-org">{user.org}</span>
          </div>
          <h2 className="welcome-title">
            Hello, {user.name.split(' ')[0]} 👋
          </h2>
          <p className="welcome-subhead">{h[2]}</p>
        </div>

        <div className="welcome-actions">
          {rewards && (
            <div
              className="welcome-reward-pill"
              onClick={() => navigate(producer ? 'Savings & impact' : 'Impact reports')}
              title="Click to view EcoPoints & Reward Tier breakdown"
            >
              <span className="reward-icon">{rewards.tierIcon}</span>
              <div>
                <strong>{rewards.tier}</strong>
                <small>{number(rewards.totalPoints)} Green Points</small>
              </div>
              <ArrowRight size={15} />
            </div>
          )}
          <button className="button" onClick={() => navigate(next)}>
            {producer ? 'Plan tomorrow’s production' : 'Explore recovery network'}
            <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      <div className="stats-grid">
        <Stat
          label={producer ? 'Verified savings' : 'Food recovered'}
          value={producer ? money(m.savings) : `${number(m.rescuedKg)} kg`}
          detail={
            producer ? 'Volume-normalized · verified claims' : 'Recipient-confirmed recoveries'
          }
          Icon={producer ? Wallet : Leaf}
        />
        <Stat
          label="Meals made possible"
          value={number(m.mealEquivalents)}
          detail="0.4 kg standard meal equivalent"
          Icon={HeartHandshake}
          tone="peach"
        />
        <Stat
          label="Estimated CO₂e avoided"
          value={`${number(m.estimatedCo2Kg)} kg`}
          detail="Factor 2.5 kg CO₂e / kg saved"
          Icon={Leaf}
          tone="lime"
        />
        <Stat
          label="AnnSetu EcoPoints"
          value={`${number(rewards?.totalPoints || 0)} pts`}
          detail={`${rewards?.tierIcon || '🌱'} ${rewards?.tier || 'Eco Guardian'} · Badges & Perks`}
          Icon={Award}
          tone="lavender"
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
              <HeartHandshake size={24} />
            </span>
            <Badge tone="green">CONNECTED LOOP</Badge>
          </div>
          <h2>
            Surplus for one.
            <br />Nourishment for another.
          </h2>
          <p>
            Connected kitchens, certified processors, NGOs and transport partners working in harmony.
          </p>
          <div className="community-foot">
            <div>
              <strong>{data.network.length} active partners</strong>
              <small>Bengaluru Regional Ecosystem</small>
            </div>
            <button
              className="icon-button"
              onClick={() => navigate('Network directory')}
              aria-label="View network directory"
              title="View network directory"
            >
              <ArrowUpRight size={20} />
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
