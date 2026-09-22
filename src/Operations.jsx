import { useState, useEffect } from 'react';
import {
  Plus,
  Check,
  RefreshCw,
  Thermometer,
  Droplets,
  Factory,
  Zap,
  AlertTriangle,
  HeartHandshake,
  MapPin,
  Truck,
  Clock,
} from 'lucide-react';
import { api, shortDate } from './api';
import { Badge, Stat, Empty, Field, Chart } from './components';
export function Demand({ data, open }) {
  const [attendance, setAttendance] = useState(100),
    [prediction, setPrediction] = useState(data.forecast),
    [error, setError] = useState('');
  useEffect(() => {
    setPrediction(data.forecast);
  }, [data.forecast]);
  const log = () =>
    open({
      title: 'Record daily consumption',
      description: 'One entry per day. Saving the same day updates the existing record.',
      fields: [
        {
          name: 'date',
          label: 'Service date',
          type: 'date',
          value: new Date().toISOString().slice(0, 10),
        },
        { name: 'prepared', label: 'Portions prepared', type: 'number', min: 1 },
        { name: 'consumed', label: 'Portions consumed', type: 'number', min: 0 },
        { name: 'costPerMeal', label: 'Cost per portion (₹)', type: 'number', min: 1, value: 32 },
        { name: 'note', label: 'Context: event, holiday, menu', type: 'textarea', required: false },
      ],
      save: (v) => api('/consumption', { method: 'POST', body: v }),
    });
  const plan = () =>
    open({
      title: 'Approve a production plan',
      description: 'The forecast is a statistical recommendation. You approve the final quantity.',
      fields: [
        {
          name: 'date',
          label: 'Production date',
          type: 'date',
          value: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        },
        {
          name: 'portions',
          label: 'Approved portions',
          type: 'number',
          min: 1,
          value: prediction.planned,
        },
        {
          name: 'reason',
          label: 'Planning rationale',
          type: 'textarea',
          minLength: 8,
          value: `Demand baseline + ${prediction.buffer || 0} buffer portions; attendance ${attendance}%.`,
        },
      ],
      submit: 'Approve plan',
      save: (v) => api('/plans', { method: 'POST', body: v }),
    });
  return (
    <>
      <div className="section-tools">
        <Badge tone="green">Explainable forecasting</Badge>
        <div className="row">
          <button className="button secondary" onClick={log}>
            <Plus size={16} /> Log consumption
          </button>
          <button className="button" disabled={!prediction.ready} onClick={plan}>
            <Check size={16} /> Approve production plan
          </button>
        </div>
      </div>
      <div className="two-columns">
        <section className="panel padded">
          <h2>Tomorrow, with less guesswork.</h2>
          <p className="muted">
            Recency-weighted consumption baseline. Recomputed from your records.
          </p>
          <Field label={`Expected attendance relative to normal: ${attendance}%`}>
            <input
              type="range"
              min="20"
              max="200"
              value={attendance}
              onChange={(e) => setAttendance(Number(e.target.value))}
            />
          </Field>
          <button
            className="button secondary"
            onClick={async () => {
              try {
                setPrediction(await api(`/forecast?attendance=${attendance}`));
                setError('');
              } catch (e) {
                setError(e.message);
              }
            }}
          >
            <RefreshCw size={15} /> Recalculate scenario
          </button>
          {error && <p className="error">{error}</p>}
          {prediction.ready ? (
            <>
              <div className="forecast-value">
                {prediction.planned}
                <span>recommended portions</span>
              </div>
              <div className="forecast-details">
                <span>
                  Expected demand<strong>{prediction.expected}</strong>
                </span>
                <span>
                  Variation range
                  <strong>
                    {prediction.low}–{prediction.high}
                  </strong>
                </span>
                <span>
                  Backtest MAE<strong>{prediction.mae ?? 'N/A'} portions</strong>
                </span>
              </div>
              <p className="small muted">
                Observed variation, not a calibrated confidence interval. {prediction.sampleSize}{' '}
                recent observations; synthetic seed history until replaced.
              </p>
            </>
          ) : (
            <Empty title="More history needed" description={prediction.reason} />
          )}
        </section>
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Preparation & actual demand</h2>
              <p>Use measured consumption to improve planning</p>
            </div>
          </div>
          <Chart history={data.history} />
        </section>
      </div>
      <section className="panel spaced">
        <div className="panel-head">
          <h2>Approved production plans</h2>
          <Badge>{data.plans.length} records</Badge>
        </div>
        {data.plans.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Portions</th>
                  <th>Decision evidence</th>
                </tr>
              </thead>
              <tbody>
                {data.plans.map((p) => (
                  <tr key={p._id}>
                    <td>{shortDate(p.date)}</td>
                    <td>{p.portions}</td>
                    <td>{p.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            title="Your next plan starts here"
            description="Recalculate a scenario, then approve a production quantity."
          />
        )}
      </section>
    </>
  );
}
export function Sensors({ data, open }) {
  const latest = data.readings[0];
  return (
    <>
      <div className="section-tools">
        <div>
          <h2>Operational pulse</h2>
          <p className="muted small">Device API ready · current seed readings are simulated</p>
        </div>
        <button
          className="button"
          onClick={() =>
            open({
              title: 'Record an operational reading',
              description:
                'Manual entry for your local pilot. Hardware can send the same measurements to the authenticated device API.',
              fields: [
                { name: 'device', label: 'Device / processing line', value: 'Cold room A · CR-01' },
                {
                  name: 'temperature',
                  label: 'Temperature (°C)',
                  type: 'number',
                  min: -50,
                  max: 150,
                  value: 3.8,
                },
                {
                  name: 'humidity',
                  label: 'Humidity (%)',
                  type: 'number',
                  min: 0,
                  max: 100,
                  value: 65,
                },
                {
                  name: 'energy',
                  label: 'Interval energy (kWh)',
                  type: 'number',
                  min: 0,
                  value: 45,
                },
                {
                  name: 'downtime',
                  label: 'Interval downtime (min)',
                  type: 'number',
                  min: 0,
                  max: 1440,
                  value: 5,
                },
                {
                  name: 'inputKg',
                  label: 'Material input (kg)',
                  type: 'number',
                  min: 0,
                  value: 100,
                },
                {
                  name: 'outputKg',
                  label: 'Material output (kg)',
                  type: 'number',
                  min: 0,
                  value: 92,
                },
              ],
              save: (v) => api('/readings', { method: 'POST', body: v }),
            })
          }
        >
          <Plus size={16} /> Add reading
        </button>
      </div>
      <div className="stats-grid">
        <Stat
          label="Cold storage"
          value={latest ? `${latest.temperature} °C` : '—'}
          detail="Pilot target: 0–5°C"
          Icon={Thermometer}
        />
        <Stat
          label="Relative humidity"
          value={latest ? `${latest.humidity}%` : '—'}
          detail="Alert above 75%"
          Icon={Droplets}
          tone="lavender"
        />
        <Stat
          label="Material yield"
          value={
            latest?.inputKg ? `${((latest.outputKg / latest.inputKg) * 100).toFixed(1)}%` : '—'
          }
          detail="Output / input weight"
          Icon={Factory}
          tone="peach"
        />
        <Stat
          label="Energy intensity"
          value={latest?.outputKg ? `${(latest.energy / latest.outputKg).toFixed(2)}` : '—'}
          detail="kWh per kg of output"
          Icon={Zap}
          tone="lime"
        />
      </div>
      {latest?.alerts.length > 0 && (
        <div className="alert-panel">
          <AlertTriangle size={21} />
          <div>
            <strong>Review these operating conditions</strong>
            {latest.alerts.map((a) => (
              <p key={a}>{a}</p>
            ))}
          </div>
        </div>
      )}
      <section className="panel">
        <div className="panel-head">
          <h2>Sensor & processing log</h2>
          <Badge>Latest 30 readings</Badge>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Device / recorded</th>
                <th>Temperature</th>
                <th>Energy</th>
                <th>Downtime</th>
                <th>Material loss</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {data.readings.map((r) => (
                <tr key={r._id}>
                  <td>
                    <strong>{r.device}</strong>
                    <small>{new Date(r.createdAt).toLocaleString('en-IN')}</small>
                  </td>
                  <td>
                    <Badge tone={r.temperature > 5 ? 'red' : 'green'}>{r.temperature} °C</Badge>
                  </td>
                  <td>{r.energy} kWh</td>
                  <td>{r.downtime} min</td>
                  <td>{(r.inputKg - r.outputKg).toFixed(1)} kg</td>
                  <td>
                    <Badge>{r.source}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p className="muted small">
        Thresholds apply to this chilled-storage pilot, not all food categories. Production
        deployment requires food-specific validated limits and calibrated sensors.
      </p>
    </>
  );
}
export function NeedsList({ needs, close }) {
  return (
    <section className="panel spaced">
      <div className="panel-head">
        <div>
          <h2>Community needs</h2>
          <p>Capacity and dietary requirements from receiving partners</p>
        </div>
        <HeartHandshake size={21} />
      </div>
      {needs.length ? (
        needs.map((n) => (
          <div className="need-item" key={n._id}>
            <span className="food-icon">
              <HeartHandshake size={22} />
            </span>
            <div>
              <h3>{n.org}</h3>
              <p>{n.note}</p>
              <small>
                {n.quantity} kg · {n.category} · {n.status}
              </small>
            </div>
            {close && n.status === 'open' && (
              <button className="button secondary small" onClick={() => close(n)}>
                Close request
              </button>
            )}
          </div>
        ))
      ) : (
        <Empty title="No community requests yet" />
      )}
    </section>
  );
}
export function Route({ data }) {
  const route = data.route;
  return (
    <>
      <div className="stats-grid three">
        <Stat
          label="Planned stops"
          value={route.stops.length}
          detail="Pickup before delivery"
          Icon={MapPin}
        />
        <Stat
          label="Estimated route"
          value={`${route.totalKm} km`}
          detail="Straight-line distance estimate"
          Icon={Truck}
        />
        <Stat
          label="Estimated completion"
          value={`${route.totalMinutes} min`}
          detail="22 km/h + 8 min per stop"
          Icon={Clock}
        />
      </div>
      <div className="two-columns">
        <section className="route-map">
          <div className="map-grid" />
          <div className="map-label">BENGALURU · SCHEMATIC ROUTE</div>
          <svg
            viewBox="0 0 500 360"
            role="img"
            aria-label="Schematic route showing pickup and delivery stops"
          >
            <path
              d="M60 285Q150 330 165 210T285 155T435 65"
              stroke="#517c64"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8 6"
            />
            {route.stops.slice(0, 6).map((s, i) => {
              const x = 70 + i * 65,
                y = 285 - i * 42;
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="18"
                    fill={s.action === 'Pickup' ? '#234e3f' : '#bbd89b'}
                    stroke="white"
                    strokeWidth="4"
                  />
                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    fill={s.action === 'Pickup' ? 'white' : '#234e3f'}
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="map-note">
            <MapPin size={15} /> Illustration only · see ordered stops for route details
          </div>
        </section>
        <section className="panel">
          <div className="panel-head">
            <h2>Your optimized stop order</h2>
            <Badge>Expiry aware</Badge>
          </div>
          {route.stops.length ? (
            route.stops.map((s, i) => (
              <div className="route-stop" key={i}>
                <span>{i + 1}</span>
                <div>
                  <strong>
                    {s.action}: {s.name}
                  </strong>
                  <p>{s.org}</p>
                  <small>
                    {s.km} km from previous stop · ~{s.etaMinutes} min
                  </small>
                  {!s.feasible && (
                    <p className="error">
                      Estimated arrival exceeds expiry. Do not accept this route.
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <Empty
              title="Your route is clear"
              description="Accept a job from Available jobs to build your delivery route."
            />
          )}
        </section>
      </div>
      <p className="muted small">
        {route.method} Final road routing and traffic integration are not connected in this local
        pilot.
      </p>
    </>
  );
}
