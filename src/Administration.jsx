import { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, Check, MapPin, LogOut } from 'lucide-react';
import { api, roles } from './api';
import { Badge, Empty, icons } from './components';
export function ActivityView({ data }) {
  return (
    <>
      <section className="panel padded">
        <h2>Alerts requiring attention</h2>
        {data.readings[0]?.alerts.length ? (
          data.readings[0].alerts.map((a) => (
            <div className="alert-panel" key={a}>
              <AlertTriangle size={19} />
              {a}
            </div>
          ))
        ) : (
          <p className="muted">No threshold alerts in the latest available reading.</p>
        )}
      </section>
      <section className="panel spaced">
        <div className="panel-head">
          <div>
            <h2>Chain of custody & decision trail</h2>
            <p>Server-recorded actions · latest 30 events in your scope</p>
          </div>
          <ShieldCheck size={21} />
        </div>
        {data.audits.length ? (
          data.audits.map((a) => (
            <div className="audit-event" key={a._id}>
              <span>
                <Check size={15} />
              </span>
              <div>
                <strong>{a.action}</strong>
                <p>{a.detail || a.org}</p>
                <small>
                  {a.org} · {new Date(a.createdAt).toLocaleString('en-IN')} · Ref{' '}
                  {a.entity.slice(-8)}
                </small>
              </div>
            </div>
          ))
        ) : (
          <Empty title="No activity yet" />
        )}
      </section>
    </>
  );
}
export function Network({ data }) {
  return (
    <div className="network-grid">
      {data.network.map((n) => {
        const Icon = icons[n.role];
        return (
          <article className="panel padded" key={n._id}>
            <span className="network-icon">
              <Icon size={25} />
            </span>
            <h3>{n.org}</h3>
            <Badge tone="green">{roles[n.role]}</Badge>
            <p>{n.name}</p>
            <p className="muted small">
              <MapPin size={13} /> Bengaluru · {n.capacity} kg capacity
            </p>
          </article>
        );
      })}
    </div>
  );
}
export function UsersView({ open }) {
  const [users, setUsers] = useState([]),
    [error, setError] = useState('');
  const load = () =>
    api('/users')
      .then(setUsers)
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Network account access</h2>
        <Badge>{users.length} accounts</Badge>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Team member</th>
              <th>Organization</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <strong>{u.name}</strong>
                  <small>{u.email}</small>
                </td>
                <td>{u.org}</td>
                <td>{roles[u.role]}</td>
                <td>
                  <Badge tone={u.active ? 'green' : 'red'}>
                    {u.active ? 'Active' : 'Disabled'}
                  </Badge>
                </td>
                <td>
                  {u.role !== 'admin' && (
                    <button
                      className="button small secondary"
                      onClick={() =>
                        open({
                          title: u.active ? 'Disable account access' : 'Restore account access',
                          description: `${u.email}. ${u.active ? 'The account will lose access immediately.' : 'The account will be able to sign in again.'}`,
                          fields: [
                            {
                              name: 'confirm',
                              label: 'Account action',
                              options: [u.active ? 'Disable access' : 'Enable access'],
                            },
                          ],
                          save: async () => {
                            await api(`/users/${u.id}`, {
                              method: 'PATCH',
                              body: { active: !u.active },
                            });
                            await load();
                          },
                        })
                      }
                    >
                      {u.active ? 'Disable' : 'Enable'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
export function SettingsView({ user, open, logout, data }) {
  return (
    <div className="two-columns">
      <section className="panel padded">
        <p className="eyebrow">YOUR ACCOUNT</p>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <Badge tone="green">{roles[user.role]}</Badge>
        <div className="setting-line">
          <span>Organization</span>
          <strong>{user.org}</strong>
        </div>
        <div className="setting-line">
          <span>Receiving / vehicle capacity</span>
          <strong>{user.capacity} kg</strong>
        </div>
        <button
          className="button secondary"
          onClick={() =>
            open({
              title: 'Update your profile',
              fields: [
                { name: 'name', label: 'Display name', value: user.name },
                {
                  name: 'capacity',
                  label: 'Capacity per batch / job (kg)',
                  type: 'number',
                  min: 1,
                  max: 10000,
                  value: user.capacity,
                },
              ],
              save: (v) => api('/profile', { method: 'PATCH', body: v }),
            })
          }
        >
          Edit profile
        </button>
        <button className="button danger spaced" onClick={logout}>
          <LogOut size={16} /> Sign out
        </button>
      </section>
      <section className="panel padded">
        <p className="eyebrow">CONNECTED SERVICES</p>
        <div className="setting-line">
          <span>MongoDB</span>
          <Badge tone="green">Connected</Badge>
        </div>
        <p className="muted small">Local database: annsetu · 127.0.0.1:27017</p>
        <div className="setting-line">
          <span>Sarvam AI</span>
          <Badge tone={data.ai.configured ? 'green' : 'amber'}>
            {data.ai.configured ? 'Key configured' : 'Key required'}
          </Badge>
        </div>
        <p className="muted small">
          Model: {data.ai.model}. Configure SARVAM_API_KEY in the project’s .env file and restart
          the API. Keys are never sent to the browser.
        </p>
        <div className="setting-line">
          <span>IoT ingestion</span>
          <Badge>API ready</Badge>
        </div>
        <p className="muted small">
          Hardware is not connected. Device integrations use a server-side device key; readings
          identify their source.
        </p>
      </section>
    </div>
  );
}
