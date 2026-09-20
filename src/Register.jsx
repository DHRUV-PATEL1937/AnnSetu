import { useState } from 'react';
import {
  Leaf,
  Building2,
  HeartHandshake,
  Truck,
  ArrowRight,
  ShieldCheck,
  Factory,
  Utensils,
  Store,
  FileCheck,
  HandCoins,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { api } from './api';
import { Brand, Badge, Field } from './components';

const registerRoles = [
  {
    id: 'kitchen',
    title: 'Commercial Kitchen / Catering',
    desc: 'Commercial dining, mess, banquets, hotel kitchens preventing and logging surplus.',
    icon: Utensils,
  },
  {
    id: 'processor',
    title: 'Food Processor / Packer',
    desc: 'Manufacturers converting perishable surplus into shelf-stable foods.',
    icon: Factory,
  },
  {
    id: 'ngo',
    title: 'NGO / Food Bank / Shelter',
    desc: 'Charities, shelters, and community kitchens distributing fresh meals.',
    icon: HeartHandshake,
  },
  {
    id: 'buyer',
    title: 'Commercial Buyer / Secondary Market',
    desc: 'Discount groceries, livestock/feed buyers, and secondary retail purchasing safe surplus.',
    icon: Store,
  },
  {
    id: 'logistics',
    title: 'Logistics / Fleet Provider',
    desc: 'Cold-chain drivers and transport teams handling pickups and deliveries.',
    icon: Truck,
  },
  {
    id: 'sponsor',
    title: 'ESG Sponsor / CSR Partner',
    desc: 'Corporations pledging funds to cover cold-chain transit costs for donation batches.',
    icon: HandCoins,
  },
  {
    id: 'auditor',
    title: 'Independent ESG Auditor',
    desc: 'Independent certified verifiers verifying prevented waste dividends.',
    icon: FileCheck,
  },
];

export default function Register({ onRegister, onGoToLogin, onGoToLanding }) {
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('kitchen');
  const [capacity, setCapacity] = useState('250');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      const user = await api('/auth/register', {
        method: 'POST',
        body: {
          name: name.trim(),
          org: org.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
          capacity: Number(capacity) || 250,
          location: { lat: 28.6139, lng: 77.209 },
        },
      });
      onRegister(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login register-layout">
      <section className="login-story">
        <Brand />
        <div className="login-story-text">
          <Badge tone="outline">
            <Leaf size={13} /> JOIN THE ANNSETU ECOSYSTEM
          </Badge>
          <h1>
            Turn surplus food
            <br />
            into verified good.
          </h1>
          <p>
            Join hundreds of kitchens, food processors, verified NGOs, and cold-chain fleets in
            building India's zero-waste food grid.
          </p>

          <div className="register-perks">
            <div className="perk-item">
              <CheckCircle2 size={18} className="perk-icon" />
              <div>
                <strong>Zero NGO Platform Fees</strong>
                <p>Donations flow directly to shelters without intermediary commissions.</p>
              </div>
            </div>
            <div className="perk-item">
              <CheckCircle2 size={18} className="perk-icon" />
              <div>
                <strong>Cold-Chain IoT & Safety Logging</strong>
                <p>Auditable digital records for temperature excursion and food shelf-life.</p>
              </div>
            </div>
            <div className="perk-item">
              <CheckCircle2 size={18} className="perk-icon" />
              <div>
                <strong>Auditor-Verified ESG Credits</strong>
                <p>Count carbon abatement, landfill diversion, and earn EcoPoints.</p>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <button type="button" className="text-link" onClick={onGoToLanding}>
            ← Back to About AnnSetu
          </button>
          <span>SIH PS 26234 Compliance</span>
        </footer>
      </section>

      <section className="login-form register-form-section">
        <div className="login-top">
          <Badge tone="green">NEW ORGANIZATION</Badge>
          <button type="button" className="btn-ghost-sm" onClick={onGoToLanding}>
            Explore Process
          </button>
        </div>

        <div className="login-box register-box">
          <p className="eyebrow">ORGANIZATION REGISTRATION</p>
          <h2>Create your workspace</h2>
          <p className="muted">
            Already have an account?{' '}
            <button type="button" className="inline-action-btn" onClick={onGoToLogin}>
              Sign in here
            </button>
          </p>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-two-col">
              <Field label="Organization / Entity name">
                <input
                  type="text"
                  placeholder="e.g. Apex Kitchens, Robin Hood Army"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  required
                />
              </Field>

              <Field label="Authorized representative name">
                <input
                  type="text"
                  placeholder="e.g. Priyanshu Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="form-two-col">
              <Field label="Work email">
                <input
                  type="email"
                  placeholder="name@organization.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field label="Password (min 8 characters)">
                <input
                  type="password"
                  placeholder="••••••••"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
            </div>

            <Field label="Select your primary operational role">
              <div className="role-selector-cards">
                {registerRoles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      type="button"
                      key={r.id}
                      className={`role-option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setRole(r.id)}
                    >
                      <div className="role-option-head">
                        <span className="role-icon-wrap">
                          <Icon size={16} />
                        </span>
                        <strong>{r.title}</strong>
                      </div>
                      <p>{r.desc}</p>
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Typical daily capacity or recovery volume (kg/day)">
              <input
                type="number"
                min="10"
                max="50000"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="250"
              />
            </Field>

            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}

            <button className="button login-submit" disabled={busy}>
              {busy ? 'Registering workspace…' : 'Create Organization Workspace'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="register-helper-notes">
            <p>
              <ShieldCheck size={14} /> Passwords hashed securely with bcrypt. Sessions protected
              by HttpOnly tokens. All operations comply with FSSAI & SIH 26234 food safety invariants.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
