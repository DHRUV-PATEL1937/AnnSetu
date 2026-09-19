import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Globe, ArrowUpRight, LoaderCircle, Send, Camera } from 'lucide-react';
import { api } from './api';
import { Badge, Field } from './components';
export function Copilot({ data, onClose }) {
  const [question, setQuestion] = useState(''),
    [language, setLanguage] = useState('English'),
    [messages, setMessages] = useState([]),
    [busy, setBusy] = useState(false);
  const end = useRef(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);
  const ask = async (q) => {
    if (!q.trim() || busy) return;
    setQuestion('');
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setBusy(true);
    try {
      const r = await api('/ai/advice', { method: 'POST', body: { question: q, language } });
      setMessages((m) => [...m, { role: 'assistant', text: r.answer, evidence: r.evidence }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'error', text: e.message }]);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="copilot-overlay">
      <aside className="copilot" role="dialog" aria-modal="true" aria-label="AnnSetu AI copilot">
        <div className="copilot-header">
          <span className="insight-icon">
            <Sparkles size={23} />
          </span>
          <div>
            <h2>Your food operations copilot</h2>
            <p>Powered by Sarvam · grounded in your records</p>
          </div>
          <button className="icon-button" aria-label="Close copilot" onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="copilot-language">
          <Globe size={16} />
          <select
            aria-label="Response language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Marathi', 'Bengali'].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <Badge tone={data?.ai.configured ? 'green' : 'amber'}>
            {data?.ai.configured ? 'Key configured' : 'Not connected'}
          </Badge>
        </div>
        <div className="messages">
          {!messages.length && (
            <div className="copilot-welcome">
              <Sparkles size={33} />
              <h3>A better decision is a conversation away.</h3>
              <p>
                Ask about demand, surplus, storage or impact. I use the records your role is allowed
                to see.
              </p>
              {[
                'What should I prioritize today?',
                'Explain tomorrow’s production recommendation.',
                'Which food needs attention first?',
              ].map((q) => (
                <button key={q} onClick={() => ask(q)}>
                  {q}
                  <ArrowUpRight size={15} />
                </button>
              ))}
              <p className="small">
                AI advice never releases food, confirms deliveries or approves financial claims.
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              <small>
                {m.role === 'user'
                  ? 'YOU'
                  : m.role === 'error'
                    ? 'CONNECTION NOTICE'
                    : 'SARVAM COPILOT'}
              </small>
              <p>{m.text}</p>
              {m.evidence && (
                <small>
                  Context: {m.evidence.batches} batches · {m.evidence.consumptionDays} consumption
                  days · {m.evidence.readings} readings
                </small>
              )}
            </div>
          ))}
          {busy && (
            <div className="message">
              <LoaderCircle className="spin" size={17} /> Reviewing your operational evidence…
            </div>
          )}
          <div ref={end} />
        </div>
        <form
          className="copilot-input"
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
        >
          <input
            aria-label="Ask your copilot"
            placeholder="Ask about your workspace…"
            value={question}
            maxLength={1500}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            className="button"
            aria-label="Send question"
            disabled={busy || question.trim().length < 3}
          >
            <Send size={18} />
          </button>
        </form>
      </aside>
    </div>
  );
}
export function ImageInspection() {
  const [image, setImage] = useState(''),
    [note, setNote] = useState(''),
    [answer, setAnswer] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  return (
    <section className="panel padded spaced">
      <div className="row">
        <Camera size={22} />
        <h2>Visual quality assistant</h2>
        <Badge>Via Sarvam</Badge>
      </div>
      <p className="muted">
        Inspect visible packaging or appearance issues. An image cannot establish food safety; use
        the documented quality review for release.
      </p>
      <div className="inspection-layout">
        <div>
          <Field label="Food image · JPEG, PNG or WebP · max 4 MB">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                setError('');
                setAnswer('');
                const file = e.target.files[0];
                setImage('');
                if (!file) return;
                if (
                  file.size > 4 * 1024 * 1024 ||
                  !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
                ) {
                  setError('Use a JPEG, PNG or WebP image under 4 MB');
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => setImage(reader.result);
                reader.readAsDataURL(file);
              }}
            />
          </Field>
          <Field label="Inspection context">
            <input
              placeholder="Food type, packaging, observations…"
              value={note}
              maxLength={500}
              onChange={(e) => setNote(e.target.value)}
            />
          </Field>
          <button
            className="button secondary"
            disabled={!image || busy}
            onClick={async () => {
              setBusy(true);
              setError('');
              try {
                const r = await api('/ai/inspect', { method: 'POST', body: { image, note } });
                setAnswer(r.answer);
              } catch (e) {
                setError(e.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? <LoaderCircle size={16} className="spin" /> : <Sparkles size={16} />} Assess
            visible condition
          </button>
        </div>
        {image && <img src={image} alt="Food uploaded for advisory inspection" />}
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {answer && <div className="assessment">{answer}</div>}
    </section>
  );
}
