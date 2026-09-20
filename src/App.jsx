import { useEffect, useState, useCallback } from 'react';
import {
  Leaf,
  LayoutDashboard,
  Package,
  ChartNoAxesCombined,
  HeartHandshake,
  Truck,
  Factory,
  ShieldCheck,
  Wallet,
  Users,
  Settings,
  Bell,
  ChevronDown,
  ArrowUpRight,
  Plus,
  Download,
  Menu,
  Sun,
  Sparkles,
  Thermometer,
  FileCheck,
  ShoppingBasket,
  ChevronRight,
  RefreshCw,
  LoaderCircle,
  Globe,
  HandCoins,
  CheckCheck,
  X,
  Compass,
} from 'lucide-react';
import { api, roles } from './api';
import { Brand, Badge, Modal, SearchBox, BatchTable, BatchCards, NotificationPopover } from './components';
import Login from './Login';
import Register from './Register';
import Landing from './Landing';
import Overview from './Overview';
import Matching from './Matching';
import { Demand, Sensors, NeedsList, Route } from './Operations';
import { Impact, Savings, Methodology } from './Impact';
import { ActivityView, Network, UsersView, SettingsView } from './Administration';
import { Copilot, ImageInspection } from './AI';
import { makeActions } from './actions';
const roleNav = {
  kitchen: [
    'Overview',
    'Inventory',
    'Demand planning',
    'Redistribution',
    'Storage & sensors',
    'Savings & impact',
  ],
  processor: [
    'Overview',
    'Inventory',
    'Demand planning',
    'Redistribution',
    'Processing & sensors',
    'Savings & impact',
  ],
  ngo: ['Overview', 'Surplus exchange', 'My recoveries', 'Community needs', 'Impact reports'],
  buyer: ['Overview', 'Surplus exchange', 'My orders', 'Impact reports'],
  logistics: ['Overview', 'Available jobs', 'My deliveries', 'Route planner', 'Impact reports'],
  sponsor: ['Overview', 'Sponsor a recovery', 'Sponsored recoveries', 'Impact reports'],
  auditor: ['Overview', 'Savings verification', 'Traceability', 'Impact reports'],
  admin: ['Overview', 'Network directory', 'User management', 'Traceability', 'Revenue & impact'],
};
const navIcons = {
  Overview: LayoutDashboard,
  Inventory: Package,
  'Demand planning': ChartNoAxesCombined,
  Redistribution: HeartHandshake,
  'Storage & sensors': Thermometer,
  'Processing & sensors': Factory,
  'Savings & impact': Wallet,
  'Surplus exchange': ShoppingBasket,
  'My recoveries': HeartHandshake,
  'My orders': Package,
  'Community needs': Users,
  'Impact reports': Leaf,
  'Available jobs': Truck,
  'My deliveries': Package,
  'Route planner': MapPinIcon,
  'Sponsor a recovery': HandCoins,
  'Sponsored recoveries': HeartHandshake,
  'Savings verification': FileCheck,
  Traceability: ShieldCheck,
  'Network directory': Globe,
  'User management': Users,
  'Revenue & impact': Wallet,
};
function MapPinIcon(props) {
  return <Globe {...props} />;
}
export default function App() {
  const [user, setUser] = useState(null),
    [checking, setChecking] = useState(true),
    [data, setData] = useState(null),
    [page, setPage] = useState('Overview'),
    [search, setSearch] = useState(''),
    [error, setError] = useState(''),
    [toast, setToast] = useState(''),
    [modal, setModal] = useState(null),
    [formError, setFormError] = useState(''),
    [busy, setBusy] = useState(false),
    [mobile, setMobile] = useState(false),
    [aiOpen, setAiOpen] = useState(false),
    [notifOpen, setNotifOpen] = useState(false),
    [refreshing, setRefreshing] = useState(false),
    [authView, setAuthView] = useState('landing'),
    [viewingAbout, setViewingAbout] = useState(false),
    [demoEmail, setDemoEmail] = useState(''),
    [demoPassword, setDemoPassword] = useState('');
  const handleQuickLogin = async (email, password) => {
    setBusy(true);
    try {
      const u = await api('/auth/login', { method: 'POST', body: { email, password } });
      setUser(u);
      setPage('Overview');
      setData(null);
      setViewingAbout(false);
      setToast(`Welcome back, ${u.name}!`);
    } catch (err) {
      setToast(err.message);
      setDemoEmail(email);
      setDemoPassword(password);
      setAuthView('login');
    } finally {
      setBusy(false);
    }
  };
  const refresh = useCallback(async () => {
    try {
      const result = await api('/workspace');
      setData(result);
      setUser(result.user);
      setError('');
    } catch (e) {
      if (e.status === 401) {
        setUser(null);
        setData(null);
      } else setError(e.message);
    }
  }, []);
  useEffect(() => {
    api('/auth/me')
      .then(setUser)
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);
  useEffect(() => {
    if (!user?.id) return;
    refresh();
    const timer = setInterval(refresh, 30000);
    return () => clearInterval(timer);
  }, [user?.id, refresh]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  const navigate = (p) => {
    setPage(p);
    setSearch('');
    setMobile(false);
  };
  const open = (m) => {
    setFormError('');
    setModal(m);
  };
  const mutate = async (path, body = {}, success = 'Saved successfully') => {
    setBusy(true);
    try {
      const result = await api(path, { method: 'POST', body });
      await refresh();
      setToast(success);
      return result;
    } catch (e) {
      setToast(e.message);
      throw e;
    } finally {
      setBusy(false);
    }
  };
  const submit = async (values) => {
    setBusy(true);
    setFormError('');
    try {
      await modal.save(values);
      await refresh();
      setModal(null);
      setToast(modal.success || 'Saved successfully');
    } catch (e) {
      setFormError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const actions = makeActions(open),
    { batchForm, reviewBatch, claim, transition } = actions;
  if (checking)
    return (
      <div className="loading">
        <Brand />
        <LoaderCircle className="spin" />
      </div>
    );
  if (!user) {
    if (authView === 'landing')
      return (
        <Landing
          onGoToLogin={() => setAuthView('login')}
          onGoToRegister={() => setAuthView('register')}
          onQuickLogin={handleQuickLogin}
        />
      );
    if (authView === 'register')
      return (
        <Register
          onRegister={(u) => {
            setUser(u);
            setPage('Overview');
            setData(null);
            setToast(`Welcome to AnnSetu, ${u.name}!`);
          }}
          onGoToLogin={() => setAuthView('login')}
          onGoToLanding={() => setAuthView('landing')}
        />
      );
    return (
      <Login
        initialEmail={demoEmail}
        initialPassword={demoPassword}
        onLogin={(u) => {
          setUser(u);
          setPage('Overview');
          setData(null);
        }}
        onGoToRegister={() => setAuthView('register')}
        onGoToLanding={() => setAuthView('landing')}
      />
    );
  }
  if (viewingAbout)
    return (
      <Landing
        user={user}
        onBackToWorkspace={() => setViewingAbout(false)}
        onGoToLogin={() => {}}
        onGoToRegister={() => {}}
        onQuickLogin={handleQuickLogin}
      />
    );
  const nav = roleNav[user.role],
    isProducer = ['kitchen', 'processor'].includes(user.role),
    filtered =
      data?.batches.filter((b) =>
        `${b.name} ${b.org} ${b.status}`.toLowerCase().includes(search.toLowerCase()),
      ) || [];
  function renderPage() {
    if (page === 'Overview')
      return (
        <Overview
          data={data}
          user={user}
          navigate={navigate}
          setAiOpen={setAiOpen}
          reviewBatch={reviewBatch}
        />
      );
    if (page === 'Inventory')
      return (
        <>
          <div className="section-tools">
            <div className="row">
              <h2>Food inventory</h2>
              <Badge>{filtered.length} batches</Badge>
            </div>
            <SearchBox search={search} setSearch={setSearch} />
          </div>
          <BatchTable
            batches={filtered}
            action={reviewBatch}
            actionLabel="Quality review"
            actionFilter={(b) => ['review', 'held', 'available'].includes(b.status)}
          />
          <ImageInspection />
        </>
      );
    if (page === 'Demand planning') return <Demand data={data} open={open} />;
    if (page.includes('sensors')) return <Sensors data={data} open={open} />;
    if (
      ['Surplus exchange', 'Redistribution', 'Sponsor a recovery', 'Available jobs'].includes(page)
    )
      return (
        <>
          <div className="section-tools">
            <div className="row">
              <h2>
                {page === 'Available jobs' ? 'Ready for pickup' : 'The local recovery network'}
              </h2>
              <Badge tone="green">Bengaluru</Badge>
            </div>
            <SearchBox search={search} setSearch={setSearch} />
          </div>
          {page === 'Redistribution' ? (
            <>
              <BatchTable
                batches={filtered.filter((b) => b.status !== 'review')}
                action={reviewBatch}
                actionLabel="Review"
                actionFilter={(b) => b.status === 'available'}
              />
              <Matching batches={filtered} />
              <NeedsList needs={data.needs} />
            </>
          ) : (
            <BatchCards
              batches={filtered.filter((b) =>
                page === 'Available jobs'
                  ? b.status === 'reserved' && !b.driver
                  : page === 'Sponsor a recovery'
                    ? b.channel === 'donation' &&
                      !b.sponsor &&
                      ['available', 'reserved'].includes(b.status) &&
                      !b.expired
                    : b.status === 'available' && !b.expired,
              )}
              action={
                page === 'Available jobs'
                  ? actions.dispatch
                  : page === 'Sponsor a recovery'
                    ? actions.sponsor
                    : claim
              }
              buttonLabel={
                page === 'Available jobs'
                  ? 'Accept recovery job'
                  : page === 'Sponsor a recovery'
                    ? 'Fund the journey'
                    : 'Reserve batch'
              }
            />
          )}
        </>
      );
    if (['My recoveries', 'My orders', 'My deliveries', 'Sponsored recoveries'].includes(page))
      return (
        <BatchTable
          batches={filtered.filter((b) =>
            page === 'My deliveries'
              ? b.driver?._id === user.id
              : page === 'Sponsored recoveries'
                ? b.sponsor?._id === user.id
                : b.claimant?._id === user.id,
          )}
          action={(b) =>
            transition(
              b,
              b.status === 'reserved'
                ? 'picked_up'
                : b.status === 'picked_up'
                  ? 'delivered'
                  : 'confirmed',
            )
          }
          actionLabel={(b) =>
            b.status === 'reserved'
              ? 'Record pickup'
              : b.status === 'picked_up'
                ? 'Record delivery'
                : 'Confirm receipt'
          }
          actionFilter={(b) =>
            page === 'My deliveries'
              ? ['reserved', 'picked_up'].includes(b.status)
              : page !== 'Sponsored recoveries' && b.status === 'delivered'
          }
        />
      );
    if (page === 'Community needs')
      return (
        <>
          <div className="section-tools">
            <h2>Your community’s requests</h2>
            <button className="button" onClick={actions.need}>
              <Plus size={16} /> Post a need
            </button>
          </div>
          <NeedsList
            needs={data.needs}
            close={(n) => mutate(`/needs/${n._id}/close`, {}, 'Request closed').catch(() => {})}
          />
        </>
      );
    if (page === 'Route planner') return <Route data={data} />;
    if (page === 'Savings verification') return <Savings data={data} user={user} open={open} />;
    if (['Savings & impact', 'Impact reports', 'Revenue & impact'].includes(page))
      return <Impact data={data} user={user} open={open} />;
    if (['Traceability', 'Activity'].includes(page)) return <ActivityView data={data} />;
    if (page === 'Network directory') return <Network data={data} />;
    if (page === 'User management') return <UsersView open={open} />;
    if (page === 'Settings')
      return (
        <SettingsView
          user={user}
          open={open}
          logout={async () => {
            await api('/auth/logout', { method: 'POST' });
            setUser(null);
            setData(null);
            setAiOpen(false);
          }}
          data={data}
        />
      );
    return <Methodology />;
  }
  return (
    <div className="app">
      {mobile && <div className="sidebar-scrim" onClick={() => setMobile(false)} />}
      <aside className={`sidebar ${mobile ? 'mobile-open' : ''}`}>
        <Brand small />
        <div className="workspace-tag">
          <span className="workspace-avatar">{user.org.slice(0, 1)}</span>
          <div>
            <strong>{user.org}</strong>
            <small>{roles[user.role]}</small>
          </div>
        </div>
        <p className="nav-label">WORKSPACE</p>
        <nav>
          {nav.map((n) => {
            const Icon = navIcons[n];
            return (
              <button key={n} className={page === n ? 'active' : ''} onClick={() => navigate(n)}>
                <Icon size={18} />
                <span>{n}</span>
                {n === 'Inventory' &&
                  data?.batches.filter((b) => b.status === 'review').length > 0 && (
                    <span className="nav-count">
                      {data.batches.filter((b) => b.status === 'review').length}
                    </span>
                  )}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="impact-note">
            <span className="tiny-leaf">
              <Leaf size={19} />
            </span>
            <strong>
              Small actions.
              <br />
              Lasting impact.
            </strong>
            <p>Your next decision could save someone's next meal.</p>
            <button onClick={() => setAiOpen(true)}>
              Meet your copilot <ArrowUpRight size={15} />
            </button>
          </div>
          <button
            className="settings"
            onClick={() => setViewingAbout(true)}
          >
            <Compass size={17} /> About & Process
          </button>
          <button
            className={`settings ${page === 'Settings' ? 'selected' : ''}`}
            onClick={() => navigate('Settings')}
          >
            <Settings size={17} /> Workspace settings
          </button>
          <button className="profile" onClick={() => navigate('Settings')}>
            <span className="avatar">
              {user.name
                .split(' ')
                .map((x) => x[0])
                .join('')
                .slice(0, 2)}
            </span>
            <span>
              <strong>{user.name}</strong>
              <small>{roles[user.role]}</small>
            </span>
            <ChevronDown size={15} />
          </button>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-toggle"
              aria-label="Open menu"
              onClick={() => setMobile(!mobile)}
            >
              <Menu />
            </button>
            <span>Workspace</span>
            <ChevronRight size={13} />
            <strong>{page}</strong>
          </div>
          <div className="topbar-right">
            <button
              className="topbar-btn-pill"
              title="Learn how AnnSetu works and explore the 6-stage food recovery lifecycle"
              onClick={() => setViewingAbout(true)}
            >
              <Compass size={14} />
              <span>About Process</span>
            </button>
            <div className="role-switcher-wrap" title="Switch demo role instantly">
              <span className="switcher-lbl">Role:</span>
              <select
                className="role-switcher-select"
                value={user.role}
                aria-label="Switch active demo role"
                onChange={async (e) => {
                  const targetRole = e.target.value;
                  if (targetRole === user.role) return;
                  try {
                    const u = await api('/auth/login', {
                      method: 'POST',
                      body: { email: `${targetRole}@annsetu.demo`, password: 'AnnSetu@2026' },
                    });
                    setUser(u);
                    setData(null);
                    setPage('Overview');
                    setToast(`Switched workspace to ${roles[targetRole]}`);
                  } catch (err) {
                    setToast(err.message);
                  }
                }}
              >
                {Object.entries(roles).map(([r, label]) => (
                  <option key={r} value={r}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <span className="connection">
              <i className={error ? 'disconnected' : ''} />
              {error ? 'Connection interrupted' : data ? 'MongoDB connected' : 'Connecting…'}
            </span>
            <button
              className="icon-button"
              title="Refresh workspace"
              aria-label="Refresh workspace"
              onClick={async () => {
                setRefreshing(true);
                await refresh();
                setRefreshing(false);
              }}
            >
              <RefreshCw size={17} className={refreshing ? 'spin' : ''} />
            </button>
            <div className="notification-wrapper">
              <button
                className={`icon-button notification ${notifOpen ? 'active' : ''}`}
                title="View operational alerts and notifications"
                aria-label="View operational alerts and notifications"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell size={18} />
                {(data?.metrics?.alerts > 0 ||
                  data?.batches?.some((b) => b.status === 'review') ||
                  data?.batches?.some((b) => {
                    const h = (new Date(b.expiresAt).getTime() - Date.now()) / 3600000;
                    return h > 0 && h <= 4 && !['confirmed', 'delivered', 'rejected'].includes(b.status);
                  })) && <i className="pulse" />}
              </button>
              <NotificationPopover
                open={notifOpen}
                onClose={() => setNotifOpen(false)}
                data={data}
                user={user}
                navigate={navigate}
                reviewBatch={reviewBatch}
              />
            </div>
            <span className="topbar-divider" />
            <span className="avatar small-avatar">
              {user.name
                .split(' ')
                .map((x) => x[0])
                .join('')
                .slice(0, 2)}
            </span>
          </div>
        </header>
        <div className="content">
          {error && (
            <div className="error banner" role="alert">
              {error}
              <button onClick={refresh}>Retry</button>
            </div>
          )}
          {!data ? (
            <div className="loading">
              <LoaderCircle className="spin" />
              <p>Preparing your workspace…</p>
            </div>
          ) : (
            <>
              <div className="page-header">
                <div>
                  <p className="eyebrow">
                    {page === 'Overview'
                      ? `HELLO, ${user.name.split(' ')[0].toUpperCase()} · LET’S MAKE A DIFFERENCE`
                      : 'YOUR CONNECTED FOOD ECOSYSTEM'}
                  </p>
                  <h1>{page === 'Overview' ? 'Your impact, at a glance.' : page}</h1>
                  <p>
                    {page === 'Overview'
                      ? 'A clearer picture of your food. A better outcome for everyone.'
                      : {
                          Inventory:
                            'Every batch accounted for, from preparation to its next purpose.',
                          'Demand planning': 'Use consumption evidence to prepare just enough.',
                          'Surplus exchange':
                            'Fresh opportunities to keep good food in the community.',
                          'Savings verification':
                            'Independent review turns measured savings into accountable revenue.',
                        }[page] || 'Connected records. Practical actions. Measurable progress.'}
                  </p>
                </div>
                <div className="page-actions">
                  {isProducer && ['Overview', 'Inventory', 'Redistribution'].includes(page) ? (
                    <button className="button" onClick={batchForm}>
                      <Plus size={17} /> Add food batch
                    </button>
                  ) : (
                    <a className="button secondary" href="/api/reports/export">
                      <Download size={16} /> Export impact
                    </a>
                  )}
                  <div className="date-pill">
                    <Sun size={15} />
                    {new Date().toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
              <div className="pilot-strip">
                <span>
                  <i /> LOCAL PILOT
                </span>
                <p>
                  Seeded demonstration records · live database workflows · estimates clearly
                  identified
                </p>
                <button onClick={() => navigate('Methodology')}>
                  How we measure <ArrowUpRight size={13} />
                </button>
              </div>
              {renderPage()}
              <footer className="workspace-footer">
                <span>
                  <Leaf size={13} /> Every meal matters. Every action counts.
                </span>
                <span>AnnSetu · Responsible by design</span>
              </footer>
            </>
          )}
        </div>
      </main>
      <button className="copilot-fab" onClick={() => setAiOpen(true)}>
        <Sparkles size={18} />
        <span>Ask AnnSetu</span>
        <span className="ai-pill">AI</span>
      </button>
      {aiOpen && <Copilot data={data} onClose={() => setAiOpen(false)} />}{' '}
      {modal && (
        <Modal
          modal={modal}
          busy={busy}
          error={formError}
          onClose={() => !busy && setModal(null)}
          onSubmit={submit}
        />
      )}{' '}
      {toast && (
        <div className="toast" role="status">
          <CheckCheck size={19} />
          {toast}
          <button aria-label="Dismiss message" onClick={() => setToast('')}>
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
