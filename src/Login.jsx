import { useState } from 'react';
import { Leaf, Building2, HeartHandshake, Truck, ArrowRight, LockKeyhole } from 'lucide-react';
import { api, roles } from './api';
import { Brand, Badge, Field, icons } from './components';
export default function Login({ onLogin, onGoToRegister, onGoToLanding, initialEmail, initialPassword }) {
  const [role, setRole] = useState('kitchen'),
    [email, setEmail] = useState(initialEmail || 'kitchen@annsetu.demo'),
    [password, setPassword] = useState(initialPassword || 'AnnSetu@2026'),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  return (
    <div className="login">
      <section className="login-story">
        <Brand />
        <div className="login-story-text">
          <Badge tone="outline">
            <Leaf size={13} /> BUILT FOR A BETTER FOOD SYSTEM
          </Badge>
          <h1>
            Good food.
            <br />
            Better futures.
          </h1>
          <p>
            Prevent what we can.
            <br />
            Redistribute what we can’t.
            <br />
            Make every meal matter.
          </p>
          <div className="orbit-art">
            <div className="orbit o1" />
            <div className="orbit o2" />
            <div className="orbit o3" />
            <span className="orbit-center">
              <Leaf size={64} />
            </span>
            <span className="orbit-node n1">
              <Building2 />
            </span>
            <span className="orbit-node n2">
              <HeartHandshake />
            </span>
            <span className="orbit-node n3">
              <Truck />
            </span>
          </div>
        </div>
        <footer>
          {onGoToLanding && (
            <button type="button" className="text-link" onClick={onGoToLanding}>
              ← About AnnSetu & Process
            </button>
          )}
          <span>From surplus to shared value.</span>
        </footer>
      </section>
      <section className="login-form">
        <div className="login-top">
          <Badge tone="green">LOCAL PILOT</Badge>
          {onGoToLanding && (
            <button type="button" className="btn-ghost-sm" onClick={onGoToLanding}>
              View Process Overview
            </button>
          )}
        </div>
        <div className="login-box">
          <p className="eyebrow">WELCOME TO ANNSETU</p>
          <h2>
            Your next good move
            <br />
            starts here.
          </h2>
          <p className="muted">
            Sign in to your food sustainability workspace, or{' '}
            {onGoToRegister && (
              <button type="button" className="inline-action-btn" onClick={onGoToRegister}>
                register organization
              </button>
            )}
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError('');
              try {
                onLogin(await api('/auth/login', { method: 'POST', body: { email, password } }));
              } catch (err) {
                setError(err.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <Field label="Work email">
              <input
                autoComplete="username"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field label="Password">
              <input
                autoComplete="current-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="button login-submit" disabled={busy}>
              {busy ? 'Signing in…' : 'Enter workspace'}
              <ArrowRight size={18} />
            </button>
          </form>
          <div className="demo-divider">
            <span>EXPLORE A DEMO WORKSPACE</span>
          </div>
          <div className="role-grid">
            {Object.entries(roles).map(([r, label]) => {
              const Icon = icons[r];
              return (
                <button
                  key={r}
                  className={role === r ? 'selected' : ''}
                  onClick={() => {
                    setRole(r);
                    setEmail(`${r}@annsetu.demo`);
                    setPassword('AnnSetu@2026');
                  }}
                >
                  <Icon size={17} />
                  {label}
                </button>
              );
            })}
          </div>
          <p className="demo-note">
            <LockKeyhole size={13} /> Demo password: <strong>AnnSetu@2026</strong>
          </p>
        </div>
        <div className="login-foot">Connected communities. Measurable change.</div>
      </section>
    </div>
  );
}
