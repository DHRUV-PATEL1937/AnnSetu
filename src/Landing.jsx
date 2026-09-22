import { useState } from 'react';
import {
  Leaf,
  ArrowRight,
  ShieldCheck,
  Utensils,
  Factory,
  HeartHandshake,
  Store,
  Truck,
  HandCoins,
  FileCheck,
  Building2,
  Sparkles,
  Thermometer,
  Award,
  CheckCircle2,
  TrendingDown,
  Globe2,
  Lock,
  Compass,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Brand, Badge } from './components';
import { api, roles } from './api';

const steps = [
  {
    num: '01',
    title: 'AI Demand Forecasting & Prevention',
    tag: 'Prevention First',
    desc: 'Commercial dining, hostels, and banquets plan production with statistical baselines and Sarvam AI. Stop overproduction at the kitchen prep stage before surplus is ever created.',
    icon: TrendingDown,
    details: [
      '14-day weighted moving averages + attendance regression',
      'Early-morning prep target recommendations',
      'Avoids cost, raw material waste, and unnecessary emissions',
    ],
  },
  {
    num: '02',
    title: 'Quality Assessment & Safety Release',
    tag: 'FSSAI & Cold Chain',
    desc: 'Every surplus batch is inspected for storage conditions, shelf-life, and allergens. Automated IoT sensor tracking alerts if chilled storage warms beyond safety thresholds.',
    icon: Thermometer,
    details: [
      'Mandatory human safety release (no unverified automation)',
      'Automated IoT fridge & ambient temperature logging',
      'Allergen tagging, batch expiry limits, and storage directives',
    ],
  },
  {
    num: '03',
    title: 'Instant Donation & Surplus Exchange',
    tag: 'Zero-Fee Redistribution',
    desc: 'Surplus is published instantly to nearby registered NGOs and community kitchens at zero platform commission, or secondary processors for upcycling into shelf-stable goods.',
    icon: HeartHandshake,
    details: [
      'Strict zero-fee policy on all food donations',
      'Instant push notifications to nearby verified shelters',
      'Secondary market channel for commercial surplus repurposing',
    ],
  },
  {
    num: '04',
    title: 'Cold-Chain Logistics & Route Optimization',
    tag: 'Precedence Logistics',
    desc: 'Logistics fleets and volunteers claim jobs with optimized routing. Precedence checks guarantee pickup occurs before delivery and prevents trips on expired food.',
    icon: Truck,
    details: [
      'Automated waypoint sequencing & turnaround times',
      'Multi-drop cold-chain temperature preservation',
      'CSR Sponsor pledge integration covers fuel/transit costs',
    ],
  },
  {
    num: '05',
    title: 'Recipient Confirmation & Delivery Proof',
    tag: 'Zero-Fraud Verification',
    desc: 'The receiving NGO confirms batch quantity, temperature on arrival, and recipient count in the system. Eliminates phantom donations and double-counting.',
    icon: CheckCircle2,
    details: [
      'Immutable recipient sign-off on receipt',
      'Photo receipt proof and meal distribution logs',
      'Separation of prevention metrics from redistribution counts',
    ],
  },
  {
    num: '06',
    title: 'Audited ESG Dividends & EcoRewards',
    tag: 'Measurable ESG & Points',
    desc: 'Independent auditors verify claimed prevention savings. Organizations earn EcoPoints, unlock Gold/Platinum badges, and generate verifiable CSR sustainability reports.',
    icon: Award,
    details: [
      'Independent auditor monthly verification gate',
      'EcoPoints rewards catalog and recognition tiers',
      'Automated CSV & audit exports for CSR / ESG compliance',
    ],
  },
];

const ecosystemRoles = [
  {
    id: 'kitchen',
    name: 'Commercial Kitchens',
    label: 'Kitchen & Catering',
    desc: 'Hotels, cafeterias, universities, and mess facilities reducing prep waste and redistributing prepared meals safely.',
    features: ['AI Demand Planner', 'Batch Safety Logger', 'Zero-Waste Inventory'],
    demoEmail: 'kitchen@annsetu.demo',
    icon: Utensils,
  },
  {
    id: 'processor',
    name: 'Food Processors',
    label: 'Upcyclers & Packers',
    desc: 'Agro-processing units and canning facilities purchasing wholesale surplus fruit, grain, and vegetables to make packaged foods.',
    features: ['Bulk Ingestion', 'Processing Quality Logs', 'Secondary Sourcing'],
    demoEmail: 'processor@annsetu.demo',
    icon: Factory,
  },
  {
    id: 'ngo',
    name: 'NGOs & Food Banks',
    label: 'Shelters & Relief',
    desc: 'Charities, night shelters, and hunger relief groups claiming fresh donations nearby without platform cuts.',
    features: ['Zero-Fee Claims', 'Community Need Requests', 'Proof of Delivery'],
    demoEmail: 'ngo@annsetu.demo',
    icon: HeartHandshake,
  },
  {
    id: 'buyer',
    name: 'Commercial Buyers',
    label: 'Discount & Feed Markets',
    desc: 'Value-grocers, farm feed producers, and food outlets purchasing discounted surplus before best-by dates.',
    features: ['Discount Marketplace', 'Order Tracking', 'Cost Savings Ledgers'],
    demoEmail: 'buyer@annsetu.demo',
    icon: Store,
  },
  {
    id: 'logistics',
    name: 'Logistics Fleets',
    label: 'Cold-Chain Couriers',
    desc: 'Urban delivery fleets, EV van drivers, and volunteer transporters fulfilling cold-chain pickups and deliveries.',
    features: ['Live Route Planner', 'Dispatch Precedence', 'Sensor Alerts'],
    demoEmail: 'logistics@annsetu.demo',
    icon: Truck,
  },
  {
    id: 'sponsor',
    name: 'CSR & ESG Sponsors',
    label: 'Corporate Backers',
    desc: 'Companies and foundations underwriting transport and cold-storage expenses for charitable food deliveries.',
    features: ['Transit Sponsorship', 'CSR Impact Ledgers', 'Carbon Avoided Reports'],
    demoEmail: 'sponsor@annsetu.demo',
    icon: HandCoins,
  },
  {
    id: 'auditor',
    name: 'Independent Auditors',
    label: 'ESG Verifiers',
    desc: 'Third-party sustainability certifiers verifying verified savings and certifying environmental dividend claims.',
    features: ['Audit Verification Gate', 'One-Month Fraud Checks', 'ESG Proof Vault'],
    demoEmail: 'auditor@annsetu.demo',
    icon: FileCheck,
  },
  {
    id: 'admin',
    name: 'Platform Administrators',
    label: 'System Governance',
    desc: 'Network operators managing ecosystem participants, platform health, traceability, and system configuration.',
    features: ['Network Directory', 'User Governance', 'End-to-End Traceability'],
    demoEmail: 'admin@annsetu.demo',
    icon: ShieldCheck,
  },
];

export default function Landing({
  user,
  onGoToLogin,
  onGoToRegister,
  onQuickLogin,
  onBackToWorkspace,
}) {
  const [activeRole, setActiveRole] = useState(ecosystemRoles[0]);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="landing-page">
      {/* Top Navbar */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <Brand />
          </div>

          <nav className="landing-links">
            <a href="#process">How it works</a>
            <a href="#roles">Ecosystem Roles</a>
            <a href="#rewards">EcoPoints & Rewards</a>
            <a href="#features">Key Features</a>
          </nav>

          <div className="landing-nav-actions">
            {user ? (
              <button className="button" onClick={onBackToWorkspace}>
                Back to Workspace ({user.org})
                <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button className="button secondary" onClick={onGoToLogin}>
                  Sign In
                </button>
                <button className="button" onClick={onGoToRegister}>
                  Register Organization
                  <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-badge">
          <Badge tone="green">
            <Leaf size={14} /> Smart India Hackathon · Problem Statement 26234
          </Badge>
        </div>

        <h1 className="hero-title">
          India's Connected Grid for <span className="highlight-text">Zero Food Waste</span> &
          Verified Redistribution
        </h1>

        <p className="hero-lead">
          AnnSetu connects commercial kitchens, verified NGOs, cold-chain couriers, and ESG auditors
          into one transparent network. Prevent overproduction, redistribute surplus safely, and
          verify every meal with zero intermediary fees.
        </p>

        <div className="hero-cta-group">
          <button className="button hero-cta-btn" onClick={onGoToRegister}>
            Register Your Organization <ArrowRight size={18} />
          </button>
          <button className="button secondary hero-cta-btn" onClick={onGoToLogin}>
            Sign In / Launch Demo <Zap size={18} />
          </button>
        </div>

        <div className="hero-stats-strip">
          <div className="hero-stat-cell">
            <span className="hero-stat-val">0%</span>
            <span className="hero-stat-lbl">NGO Platform Commission</span>
          </div>
          <div className="hero-stat-cell">
            <span className="hero-stat-val">8 Roles</span>
            <span className="hero-stat-lbl">Connected Stakeholders</span>
          </div>
          <div className="hero-stat-cell">
            <span className="hero-stat-val">100%</span>
            <span className="hero-stat-lbl">Audited Recipient Delivery</span>
          </div>
          <div className="hero-stat-cell">
            <span className="hero-stat-val">Sarvam AI</span>
            <span className="hero-stat-lbl">Multilingual Food Copilot</span>
          </div>
        </div>
      </section>

      {/* Quick Demo Launcher Card */}
      <section className="demo-launcher-bar">
        <div className="demo-launcher-content">
          <div className="demo-launcher-text">
            <span className="demo-badge">QUICK DEMO ACCESS</span>
            <h3>Explore AnnSetu live with 1-click role logins</h3>
            <p>
              Select any role below to enter the full workspace immediately as a demo participant:
            </p>
          </div>
          <div className="demo-chips-grid">
            {ecosystemRoles.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  className="demo-chip-btn"
                  onClick={() => onQuickLogin(r.demoEmail, 'AnnSetu@2026')}
                  title={`Sign in as ${r.name}`}
                >
                  <Icon size={15} />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Complete 6-Step Process Walkthrough */}
      <section id="process" className="landing-section process-section">
        <div className="section-header">
          <span className="eyebrow">THE COMPLETE LIFECYCLE</span>
          <h2>How AnnSetu works from end to end</h2>
          <p>
            Six coordinated stages turn raw ingredient waste into hot, wholesome meals for
            communities, verified by independent ESG auditors.
          </p>
        </div>

        <div className="process-timeline-grid">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            const isSelected = activeStep === idx;
            return (
              <div
                key={st.num}
                className={`process-card ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveStep(idx)}
              >
                <div className="process-card-top">
                  <span className="process-number">{st.num}</span>
                  <Badge tone={isSelected ? 'green' : 'outline'}>{st.tag}</Badge>
                </div>
                <div className="process-card-icon">
                  <Icon size={24} />
                </div>
                <h3>{st.title}</h3>
                <p className="process-desc">{st.desc}</p>
                <ul className="process-bullets">
                  {st.details.map((d, i) => (
                    <li key={i}>
                      <CheckCircle2 size={14} />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ecosystem Roles Matrix */}
      <section id="roles" className="landing-section roles-section">
        <div className="section-header">
          <span className="eyebrow">A COMPLETE ECOSYSTEM</span>
          <h2>Tailored workspaces for all 8 stakeholders</h2>
          <p>
            AnnSetu preserves strict role permissions and distinct workflows so every participant
            has the exact tools they need.
          </p>
        </div>

        <div className="role-showcase-container">
          <div className="role-nav-column">
            {ecosystemRoles.map((r) => {
              const Icon = r.icon;
              const isSelected = activeRole.id === r.id;
              return (
                <button
                  key={r.id}
                  className={`role-nav-pill ${isSelected ? 'selected' : ''}`}
                  onClick={() => setActiveRole(r)}
                >
                  <Icon size={18} />
                  <span>{r.name}</span>
                  <ChevronRight size={15} className="nav-arrow" />
                </button>
              );
            })}
          </div>

          <div className="role-detail-card">
            <div className="role-detail-header">
              <div className="role-avatar-badge">
                <activeRole.icon size={32} />
              </div>
              <div>
                <span className="role-type-tag">{activeRole.label}</span>
                <h3>{activeRole.name}</h3>
                <p className="role-summary">{activeRole.desc}</p>
              </div>
            </div>

            <div className="role-features-list">
              <h4>Primary Workspace Capabilities:</h4>
              <div className="feature-tags-grid">
                {activeRole.features.map((f, i) => (
                  <div key={i} className="feature-tag-card">
                    <CheckCircle2 size={16} className="feature-check" />
                    <strong>{f}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="role-card-footer">
              <button
                className="button"
                onClick={() => onQuickLogin(activeRole.demoEmail, 'AnnSetu@2026')}
              >
                Launch {activeRole.name} Workspace <ArrowRight size={16} />
              </button>
              <button className="button secondary" onClick={onGoToRegister}>
                Register as {activeRole.label}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* EcoRewards & Carbon Points Section */}
      <section id="rewards" className="landing-section rewards-section">
        <div className="section-header">
          <span className="eyebrow">INCENTIVES & ESG RECOGNITION</span>
          <h2>EcoRewards: Turning sustainability into tangible value</h2>
          <p>
            AnnSetu turns verified waste reduction and community redistribution into quantified
            EcoPoints, tiered badges, and recognized ESG achievements.
          </p>
        </div>

        <div className="rewards-overview-grid">
          <div className="points-rules-card">
            <h3>How You Earn Points</h3>
            <div className="rules-list">
              <div className="rule-row">
                <span className="point-badge">+10 pts / kg</span>
                <div>
                  <strong>Surplus Food Redistributed</strong>
                  <p>Safely delivered to verified NGOs and community kitchens.</p>
                </div>
              </div>
              <div className="rule-row">
                <span className="point-badge">+25 pts / kg CO₂e</span>
                <div>
                  <strong>Greenhouse Gas Emissions Avoided</strong>
                  <p>Diverted from methane-producing landfills.</p>
                </div>
              </div>
              <div className="rule-row">
                <span className="point-badge">+50 pts / plan</span>
                <div>
                  <strong>Demand Planning Accuracy</strong>
                  <p>Minimizing raw ingredient overprep through baseline forecasting.</p>
                </div>
              </div>
              <div className="rule-row">
                <span className="point-badge">+100 pts / audit</span>
                <div>
                  <strong>Audited Savings Milestone</strong>
                  <p>Certified by an independent third-party ESG auditor.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="tiers-preview-card">
            <h3>Recognition Tiers & Perks</h3>
            <div className="tier-cards-list">
              <div className="tier-preview bronze">
                <Award size={20} />
                <div>
                  <strong>Bronze Participant</strong>
                  <span>0 - 499 pts · Onboarding certificate & basic ESG badge</span>
                </div>
              </div>
              <div className="tier-preview silver">
                <Award size={20} />
                <div>
                  <strong>Silver Champion</strong>
                  <span>500 - 1,499 pts · Priority logistics matching & CSR recognition</span>
                </div>
              </div>
              <div className="tier-preview gold">
                <Award size={20} />
                <div>
                  <strong>Gold Guardian</strong>
                  <span>1,500 - 3,499 pts · Verified ESG badge & preferred donor status</span>
                </div>
              </div>
              <div className="tier-preview platinum">
                <Award size={20} />
                <div>
                  <strong>Platinum Vanguard</strong>
                  <span>3,500+ pts · Annual Sustainability Trophy & corporate dividend report</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User-Friendly System Features */}
      <section id="features" className="landing-section features-section">
        <div className="section-header">
          <span className="eyebrow">BUILT FOR SPEED & SIMPLICITY</span>
          <h2>Designed for fast daily food operations</h2>
          <p>
            No complex menus or confusing dashboards. Every button accomplishes a real operational
            action.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-icon-circle">
              <Sparkles size={22} />
            </div>
            <h3>Sarvam AI Food Copilot</h3>
            <p>
              Natural language food intelligence answering freshness questions, batch conversions,
              and demand analysis with Indian dietary context.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-circle">
              <Zap size={22} />
            </div>
            <h3>Real-Time Alert Notifications</h3>
            <p>
              Instant notification center warning of expiring batches, cold-chain temperature
              excursions, and pending recipient delivery confirmations.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-circle">
              <Thermometer size={22} />
            </div>
            <h3>IoT Sensor Integrations</h3>
            <p>
              Digital fridge and cold-room monitoring flagging out-of-range storage to prevent food
              spoilage before it happens.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-circle">
              <Globe2 size={22} />
            </div>
            <h3>Zero-Commission Guarantee</h3>
            <p>
              Transparent platform rules ensure NGOs receive food 100% free of platform cuts, funded
              transparently by sponsor pledges.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="landing-cta-banner">
        <h2>Ready to build a hunger-free, zero-waste future?</h2>
        <p>Register your kitchen, NGO, or fleet today and be part of AnnSetu's living food grid.</p>
        <div className="cta-banner-buttons">
          <button className="button" onClick={onGoToRegister}>
            Register Your Organization <ArrowRight size={18} />
          </button>
          <button className="button secondary" onClick={onGoToLogin}>
            Sign In to Existing Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-col-brand">
            <Brand />
            <p>
              Smart Food Waste Reduction & Redistribution Ecosystem. Developed for Smart India
              Hackathon PS 26234.
            </p>
          </div>
          <div className="footer-col">
            <strong>Platform</strong>
            <a href="#process">How it Works</a>
            <a href="#roles">Ecosystem Roles</a>
            <a href="#rewards">EcoRewards</a>
            <a href="#features">Key Features</a>
          </div>
          <div className="footer-col">
            <strong>Access</strong>
            <button type="button" className="footer-link-btn" onClick={onGoToLogin}>
              Sign In
            </button>
            <button type="button" className="footer-link-btn" onClick={onGoToRegister}>
              Register
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => onQuickLogin('kitchen@annsetu.demo', 'AnnSetu@2026')}
            >
              Demo Kitchen
            </button>
          </div>
          <div className="footer-col">
            <strong>Compliance</strong>
            <span>FSSAI Safe Food Standards</span>
            <span>SIH PS 26234 Compliance</span>
            <span>Zero NGO Platform Fees</span>
          </div>
        </div>
        <div className="footer-bottom-bar">
          <span>© 2026 AnnSetu Ecosystem · Every meal matters. Every action counts.</span>
          <span>Calm Green & Cream Food Sustainability Architecture</span>
        </div>
      </footer>
    </div>
  );
}
