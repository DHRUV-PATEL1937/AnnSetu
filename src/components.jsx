import { useEffect, useRef, useState } from 'react';
import {
  Leaf,
  Package,
  Check,
  X,
  LoaderCircle,
  ArrowUpRight,
  ArrowRight,
  Clock,
  MapPin,
  ShoppingBasket,
  Building2,
  Factory,
  HeartHandshake,
  Truck,
  HandCoins,
  ShieldCheck,
  Users,
  Search,
  Bell,
  Award,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { money, number, shortDate } from './api';
export const icons = {
  kitchen: Building2,
  processor: Factory,
  ngo: HeartHandshake,
  buyer: ShoppingBasket,
  logistics: Truck,
  sponsor: HandCoins,
  auditor: ShieldCheck,
  admin: Users,
};
export function Badge({ children, tone = '' }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
export function Status({ value }) {
  const tones = {
    available: 'green',
    confirmed: 'green',
    verified: 'green',
    review: 'amber',
    pending: 'amber',
    reserved: 'blue',
    picked_up: 'blue',
    delivered: 'blue',
    held: 'red',
    rejected: 'red',
  };
  return <Badge tone={tones[value] || ''}>{value.replaceAll('_', ' ')}</Badge>;
}
export function Empty({
  title = 'Nothing here yet',
  description = 'New records will appear here as your team gets to work.',
}) {
  return (
    <div className="empty">
      <Package size={30} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
export function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
export function Brand({ small = false }) {
  return (
    <div className={`brand ${small ? 'small' : ''}`}>
      <span className="brand-symbol">
        <Leaf size={small ? 22 : 25} />
      </span>
      <span>
        annsetu<span className="brand-dot">.</span>
        <small>EVERY MEAL MATTERS</small>
      </span>
    </div>
  );
}
export function Stat({ label, value, detail, Icon = Leaf, tone = '' }) {
  return (
    <article className="stat">
      <div className="stat-label">
        {label}
        <span className={`stat-icon ${tone}`}>
          <Icon size={18} />
        </span>
      </div>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
export function Modal({ modal, onClose, onSubmit, busy, error }) {
  const first = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    first.current?.focus();
    const handler = (e) => {
      if (e.key === 'Escape' && !busy) onClose();
      if (e.key === 'Tab') {
        const inputs = [
          ...(first.current?.querySelectorAll('input,select,textarea,button') || []),
        ].filter((n) => !n.disabled);
        if (!inputs.length) return;
        const a = inputs[0],
          z = inputs.at(-1);
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          z.focus();
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
      previous?.focus();
    };
  }, [busy, onClose]);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        ref={first}
      >
        <div className="modal-head">
          <div>
            <p className="eyebrow">ANNSETU WORKSPACE</p>
            <h2 id="modal-title">{modal.title}</h2>
          </div>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
            disabled={busy}
          >
            <X />
          </button>
        </div>
        {modal.description && <p className="muted">{modal.description}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(Object.fromEntries(new FormData(e.currentTarget)));
          }}
        >
          <div className="form-grid">
            {modal.fields.map((f) => (
              <Field key={f.name} label={f.label}>
                {f.options ? (
                  <select name={f.name} defaultValue={f.value} required>
                    {f.options.map((o) => (
                      <option key={o.value ?? o} value={o.value ?? o}>
                        {o.label ?? o}
                      </option>
                    ))}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea
                    name={f.name}
                    defaultValue={f.value}
                    required={f.required !== false}
                    minLength={f.minLength}
                    maxLength={f.maxLength || 2000}
                    rows={3}
                    placeholder={f.placeholder}
                  />
                ) : (
                  <input
                    name={f.name}
                    type={f.type || 'text'}
                    defaultValue={f.value}
                    min={f.min}
                    max={f.max}
                    minLength={f.minLength}
                    step={f.step || 'any'}
                    required={f.required !== false}
                    placeholder={f.placeholder}
                  />
                )}
              </Field>
            ))}
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <div className="modal-actions">
            <button type="button" className="button secondary" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button className="button" disabled={busy}>
              {busy ? <LoaderCircle className="spin" size={17} /> : <Check size={17} />}{' '}
              {modal.submit || 'Save record'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
export function BatchArt({ category }) {
  const Icon =
    category === 'Cooked meals' ? ShoppingBasket : category === 'Bakery' ? Package : Leaf;
  return (
    <div className={`batch-art art-${category.split(' ')[0].toLowerCase()}`}>
      <div className="art-ring" />
      <Icon size={44} strokeWidth={1.3} />
      <span>{category.toUpperCase()}</span>
    </div>
  );
}
export function BatchCards({
  batches,
  action,
  buttonLabel,
  emptyText = 'No matching batches',
  limit,
}) {
  const list = limit ? batches.slice(0, limit) : batches;
  return list.length ? (
    <div className="batch-grid">
      {list.map((b) => (
        <article className="batch-card" key={b._id}>
          <BatchArt category={b.category} />
          <div className="batch-card-body">
            <div className="row spread">
              <Badge tone={b.channel === 'donation' ? 'green' : 'blue'}>
                {b.channel === 'donation' ? 'For donation' : `${money(b.price)} / kg`}
              </Badge>
              <span className="muted small">
                <MapPin size={12} />
                {b.distanceKm} km
              </span>
            </div>
            <h3>{b.name}</h3>
            <p className="muted small">{b.org}</p>
            <div className="batch-meta">
              <strong>
                {number(b.quantity)} <small>kg available</small>
              </strong>
              <span>
                <Clock size={13} />
                {b.expired
                  ? 'Expired'
                  : `${Math.max(1, Math.ceil((new Date(b.expiresAt) - Date.now()) / 3600000))}h remaining`}
              </span>
            </div>
            <p className="small allergen">
              {b.storage} · Allergens:{' '}
              {b.allergens?.length ? b.allergens.join(', ') : 'Not declared; verify'}
            </p>
            {action ? (
              <button
                className="button secondary full"
                disabled={b.expired}
                onClick={() => action(b)}
              >
                {buttonLabel || 'View batch'}
                <ArrowUpRight size={16} />
              </button>
            ) : (
              <Status value={b.status} />
            )}
          </div>
        </article>
      ))}
    </div>
  ) : (
    <Empty title={emptyText} />
  );
}
export function Chart({ history }) {
  return history.length ? (
    <div className="chart">
      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={history.slice(-14)} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="consumed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5e9174" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#5e9174" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#edf0ea" strokeDasharray="3 4" />
          <XAxis
            dataKey="date"
            tickFormatter={shortDate}
            axisLine={false}
            tickLine={false}
            minTickGap={35}
            tick={{ fontSize: 10, fill: '#88938b' }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#88938b' }} />
          <Tooltip
            labelFormatter={shortDate}
            contentStyle={{ borderRadius: 12, border: '1px solid #e6ebe3', fontSize: 12 }}
          />
          <Area
            name="Prepared"
            type="monotone"
            dataKey="prepared"
            stroke="#b8c1b0"
            strokeDasharray="5 5"
            fill="transparent"
            strokeWidth={2}
          />
          <Area
            name="Consumed"
            type="monotone"
            dataKey="consumed"
            stroke="#417859"
            fill="url(#consumed)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <Empty
      title="Start your demand history"
      description="Log consumption to see the preparation and demand trend."
    />
  );
}
export function SearchBox({ search, setSearch }) {
  return (
    <label className="search-box">
      <Search size={16} />
      <input
        aria-label="Search batches"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search food, partner or status…"
      />
    </label>
  );
}
export function BatchTable({ batches, action, actionLabel, actionFilter = () => true }) {
  return (
    <section className="panel table-panel">
      {batches.length ? (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Food & source</th>
                <th>Quantity</th>
                <th>Use by</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Next step</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b._id}>
                  <td>
                    <strong>{b.name}</strong>
                    <small>{b.org}</small>
                    <small className="mono">{b._id.slice(-8)}</small>
                  </td>
                  <td>
                    <strong>{b.quantity} kg</strong>
                    <small>{b.storage}</small>
                  </td>
                  <td>
                    {shortDate(b.expiresAt)}
                    <small>
                      {new Date(b.expiresAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {b.expired ? ' · expired' : ''}
                    </small>
                  </td>
                  <td>
                    {b.channel === 'donation' ? 'Donation' : money(b.quantity * b.price)}
                    <small>{b.claimant?.org || 'Not reserved'}</small>
                  </td>
                  <td>
                    <Status value={b.status} />
                    {b.sponsor && <small>Transport pledged</small>}
                  </td>
                  <td>
                    {action && actionFilter(b) ? (
                      <button className="button small secondary" onClick={() => action(b)}>
                        {typeof actionLabel === 'function' ? actionLabel(b) : actionLabel}
                        <ArrowRight size={13} />
                      </button>
                    ) : (
                      <span className="muted small">
                        {b.status === 'confirmed'
                          ? 'Recovery complete'
                          : b.status === 'delivered'
                            ? 'Awaiting recipient'
                            : b.driver?.name || '—'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty
          title="No batches to show"
          description="Create, reserve or accept a batch to start a recovery."
        />
      )}
    </section>
  );
}

export function NotificationPopover({ open, onClose, data, user, navigate, reviewBatch }) {
  const popoverRef = useRef(null);
  const [tab, setTab] = useState('All');

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        // avoid closing if clicked on notification bell toggle
        if (!e.target.closest('.notification')) onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  // Build notifications
  const notifications = [];

  // Reading alerts (high priority)
  const sensorAlerts = data?.readings?.[0]?.alerts || [];
  sensorAlerts.forEach((a, i) => {
    notifications.push({
      id: `alert-${i}`,
      type: 'alert',
      priority: 'high',
      title: 'Sensor & Storage Excursion',
      message: a,
      time: 'Live sensor reading',
      actionLabel: 'Check sensors',
      onAction: () => {
        onClose();
        navigate(user.role === 'processor' ? 'Processing & sensors' : 'Storage & sensors');
      },
    });
  });

  // Batches needing review (for producers)
  const reviewBatches = data?.batches?.filter((b) => b.status === 'review') || [];
  reviewBatches.slice(0, 3).forEach((b) => {
    notifications.push({
      id: `review-${b._id}`,
      type: 'alert',
      priority: 'medium',
      title: 'Quality Review Required',
      message: `Batch "${b.name}" (${b.quantity} kg) is awaiting human safety sign-off before release.`,
      time: 'Pending hold',
      actionLabel: 'Review batch',
      onAction: () => {
        onClose();
        reviewBatch(b);
      },
    });
  });

  // Food expiring soon (< 4 hours)
  const now = Date.now();
  const expiringBatches =
    data?.batches?.filter((b) => {
      if (['confirmed', 'delivered', 'rejected'].includes(b.status)) return false;
      const hoursLeft = (new Date(b.expiresAt).getTime() - now) / 3600000;
      return hoursLeft > 0 && hoursLeft <= 4;
    }) || [];

  expiringBatches.slice(0, 3).forEach((b) => {
    const hours = Math.max(1, Math.ceil((new Date(b.expiresAt).getTime() - now) / 3600000));
    notifications.push({
      id: `expire-${b._id}`,
      type: 'alert',
      priority: 'high',
      title: 'Surplus Nearing Expiry',
      message: `"${b.name}" (${b.quantity} kg) expires in ${hours} hour${hours > 1 ? 's' : ''}! Expedite handover.`,
      time: `${hours}h left`,
      actionLabel: 'View surplus',
      onAction: () => {
        onClose();
        navigate(
          ['kitchen', 'processor'].includes(user.role)
            ? 'Inventory'
            : user.role === 'logistics'
              ? 'Available jobs'
              : 'Surplus exchange',
        );
      },
    });
  });

  // Deliveries pending confirmation (for recipient NGO/Buyer)
  const pendingConfirmation =
    data?.batches?.filter(
      (b) =>
        b.status === 'delivered' &&
        (['ngo', 'buyer'].includes(user.role) || String(b.claimant?._id) === String(user.id)),
    ) || [];

  pendingConfirmation.slice(0, 2).forEach((b) => {
    notifications.push({
      id: `confirm-${b._id}`,
      type: 'update',
      priority: 'medium',
      title: 'Delivery Handover Arrived',
      message: `"${b.name}" was marked delivered by driver. Confirm receipt to complete impact tracking.`,
      time: 'Awaiting confirmation',
      actionLabel: 'Confirm receipt',
      onAction: () => {
        onClose();
        navigate(user.role === 'buyer' ? 'My orders' : 'My recoveries');
      },
    });
  });

  // Eco-Rewards milestone notification
  const rewards = data?.metrics?.rewards;
  if (rewards && rewards.totalPoints > 0) {
    notifications.push({
      id: 'eco-reward-summary',
      type: 'reward',
      priority: 'info',
      title: `${rewards.tierIcon} ${rewards.tier} Status`,
      message: `You have earned ${number(rewards.totalPoints)} AnnSetu EcoPoints from verified carbon and food savings!`,
      time: `${rewards.pointsNeeded > 0 ? `${rewards.pointsNeeded} pts to ${rewards.nextTier}` : 'Top tier achieved'}`,
      actionLabel: 'View rewards',
      onAction: () => {
        onClose();
        navigate(
          ['kitchen', 'processor'].includes(user.role) ? 'Savings & impact' : 'Impact reports',
        );
      },
    });
  }

  // Filter based on selected tab
  const filteredNotifs = notifications.filter((n) => {
    if (tab === 'Alerts') return n.type === 'alert';
    if (tab === 'Rewards') return n.type === 'reward';
    return true;
  });

  const alertCount = notifications.filter((n) => n.priority === 'high').length;

  return (
    <div
      className="notif-popover"
      ref={popoverRef}
      role="dialog"
      aria-label="Notifications popover"
    >
      <div className="notif-header">
        <div className="row">
          <Bell size={18} />
          <strong>Notifications</strong>
          <Badge tone={alertCount > 0 ? 'red' : 'green'}>
            {notifications.length} {notifications.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close notifications"
          title="Close notifications"
        >
          <X size={16} />
        </button>
      </div>

      <div className="notif-tabs">
        {['All', 'Alerts', 'Rewards'].map((t) => (
          <button
            key={t}
            className={`notif-tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
            {t === 'Alerts' && alertCount > 0 && <span className="tab-dot" />}
          </button>
        ))}
      </div>

      <div className="notif-list">
        {filteredNotifs.length ? (
          filteredNotifs.map((n) => (
            <div key={n.id} className={`notif-item ${n.priority}`}>
              <div className="notif-item-icon">
                {n.type === 'alert' ? (
                  <AlertTriangle size={18} />
                ) : n.type === 'reward' ? (
                  <Award size={18} />
                ) : (
                  <Package size={18} />
                )}
              </div>
              <div className="notif-item-body">
                <div className="row spread">
                  <strong>{n.title}</strong>
                  <span className="notif-time">{n.time}</span>
                </div>
                <p>{n.message}</p>
                {n.actionLabel && (
                  <button className="button small secondary" onClick={n.onAction}>
                    {n.actionLabel} <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="notif-empty">
            <CheckCircle2 size={32} />
            <p>All operational tasks are caught up!</p>
          </div>
        )}
      </div>

      <div className="notif-footer">
        <button
          className="text-button"
          onClick={() => {
            onClose();
            navigate('Activity');
          }}
        >
          View complete audit activity <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}

export function EcoRewardsCard({ rewards, navigate, targetPage = 'Impact reports' }) {
  if (!rewards) return null;
  return (
    <section className="eco-card panel padded">
      <div className="row spread">
        <div className="row">
          <span className="eco-tier-icon">{rewards.tierIcon}</span>
          <div>
            <span className="eyebrow">ANNSETU ECO-REWARDS</span>
            <h2 className="eco-tier-title">{rewards.tier}</h2>
          </div>
        </div>
        <div className="eco-total-points">
          <strong>{number(rewards.totalPoints)}</strong>
          <small>Green Points</small>
        </div>
      </div>

      <div className="eco-progress-wrapper">
        <div className="row spread">
          <span className="small muted">
            Level progress: <strong>{rewards.progress}%</strong>
          </span>
          <span className="small muted">
            {rewards.pointsNeeded > 0
              ? `${number(rewards.pointsNeeded)} pts to ${rewards.nextTier}`
              : 'Max Tier Achieved'}
          </span>
        </div>
        <div className="eco-progress-track">
          <div
            className="eco-progress-fill"
            style={{ width: `${Math.max(5, rewards.progress)}%` }}
          />
        </div>
      </div>

      <div className="eco-breakdown-grid">
        <div className="eco-stat-box">
          <span className="eco-stat-val">+{number(rewards.rescuePoints)}</span>
          <span className="eco-stat-lbl">Food Rescued</span>
        </div>
        <div className="eco-stat-box">
          <span className="eco-stat-val">+{number(rewards.carbonPoints)}</span>
          <span className="eco-stat-lbl">Carbon Averted</span>
        </div>
        <div className="eco-stat-box">
          <span className="eco-stat-val">+{number(rewards.preventionPoints)}</span>
          <span className="eco-stat-lbl">Waste Prevented</span>
        </div>
      </div>

      {navigate && (
        <div className="eco-foot-action">
          <button className="button secondary full" onClick={() => navigate(targetPage)}>
            <span>Explore Badges & Redeem Rewards</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </section>
  );
}

export function MilestoneBadges({ badges = [] }) {
  return (
    <section className="panel padded spaced">
      <div className="panel-head" style={{ padding: 0, marginBottom: '18px' }}>
        <div>
          <h2>Sustainability Milestones & Badges</h2>
          <p>Earned through verified surplus recoveries and carbon reduction</p>
        </div>
        <Badge tone="green">VERIFIED RECORD</Badge>
      </div>
      <div className="badges-grid">
        {badges.map((b) => (
          <div key={b.id} className={`badge-card ${b.unlocked ? 'unlocked' : 'locked'}`}>
            <div className="badge-icon-wrap">
              <Award size={26} />
              {b.unlocked ? (
                <span className="badge-check" title="Milestone unlocked">
                  <Check size={13} />
                </span>
              ) : (
                <span className="badge-lock" title="In progress">
                  🔒
                </span>
              )}
            </div>
            <strong>{b.name}</strong>
            <p>{b.description}</p>
            <span className={`badge-status-pill ${b.unlocked ? 'earned' : 'locked'}`}>
              {b.unlocked ? 'Unlocked' : 'In Progress'}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RewardsCatalog({ rewards = [] }) {
  return (
    <section className="panel padded spaced">
      <div className="panel-head" style={{ padding: 0, marginBottom: '18px' }}>
        <div>
          <h2>Sustainability Rewards & Partner Perks</h2>
          <p>Redeem your AnnSetu Green Points for operational incentives</p>
        </div>
        <Badge tone="green">POINTS REDEEMABLE</Badge>
      </div>
      <div className="rewards-grid">
        {rewards.map((r) => (
          <div key={r.id} className={`reward-catalog-card ${r.status}`}>
            <div className="row spread">
              <Badge tone={r.status === 'eligible' ? 'green' : 'amber'}>{r.category}</Badge>
              <strong className="reward-cost">{number(r.pointsCost)} pts</strong>
            </div>
            <h3>{r.title}</h3>
            <p>{r.description}</p>
            <div className="reward-action-row">
              {r.status === 'eligible' ? (
                <button
                  className="button small"
                  onClick={() =>
                    alert(`Reward "${r.title}" claimed! Your operations voucher has been logged.`)
                  }
                >
                  <Sparkles size={14} /> Claim Incentive
                </button>
              ) : (
                <span className="small muted">Need {r.pointsCost} Green Points to unlock</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
