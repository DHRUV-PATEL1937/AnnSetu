import { useState, useEffect } from 'react';
import { ArrowUpRight, MapPin, HeartHandshake, Target } from 'lucide-react';
import { api } from './api';
import { Badge, Empty, Field } from './components';
export default function Matching({ batches }) {
  const available = batches.filter((b) => b.status === 'available' && !b.expired);
  const [selected, setSelected] = useState(''),
    [result, setResult] = useState(null),
    [error, setError] = useState('');
  const selectedId = available.some((b) => b._id === selected) ? selected : available[0]?._id;
  useEffect(() => {
    if (!selectedId) {
      setResult(null);
      return;
    }
    let active = true;
    setError('');
    api(`/batches/${selectedId}/matches`)
      .then((r) => {
        if (active) setResult(r);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [selectedId]);
  return (
    <section className="panel padded spaced">
      <div className="row">
        <Target size={21} />
        <h2>Smart redistribution matches</h2>
        <Badge tone="green">Capacity + need + distance</Badge>
      </div>
      <p className="muted small">
        Automatically ranked eligible partners. Reservation remains with the receiving organization.
      </p>
      {available.length ? (
        <>
          <Field label="Released batch to match">
            <select value={selectedId} onChange={(e) => setSelected(e.target.value)}>
              {available.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} · {b.quantity} kg · {b.channel}
                </option>
              ))}
            </select>
          </Field>
          {error && <p className="error">{error}</p>}
          {result?.matches.length ? (
            <div className="network-grid">
              {result.matches.map((m, i) => (
                <div className="match-card" key={m.id}>
                  <div className="row spread">
                    <Badge tone="green">#{i + 1} recommended</Badge>
                    <HeartHandshake size={19} />
                  </div>
                  <h3>{m.org}</h3>
                  <p>
                    <MapPin size={13} /> {m.distanceKm} km · ~{m.etaMinutes} min
                  </p>
                  <p>{m.capacity} kg receiving capacity</p>
                  <p>
                    {m.requestedKg
                      ? `${m.requestedKg} kg category request`
                      : 'No matching category request'}
                  </p>
                  <small>{m.need}</small>
                  <Badge tone="green">Arrival estimated before expiry</Badge>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="No eligible partners for this batch"
              description="Check capacity, remaining shelf life or the recovery channel."
            />
          )}
          <p className="muted small spaced">{result?.reason}</p>
        </>
      ) : (
        <Empty
          title="Release a batch to find its next home"
          description="Matching starts after a batch passes human quality review."
        />
      )}
    </section>
  );
}
