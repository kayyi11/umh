import { useState, useEffect, Fragment } from 'react';

// Wraps a stage so it fades+slides in the moment it is mounted.
function StageReveal({ children }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      {children}
    </div>
  );
}

function Connector() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0' }}>
      <div style={{ width: '2px', height: '20px', background: 'linear-gradient(to bottom, #334155, #475569)' }} />
      <div style={{
        width: 0, height: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: '6px solid #475569',
      }} />
    </div>
  );
}

function DetectStage({ data }) {
  const d = data || {};
  return (
    <StageReveal>
      <div style={{ background: '#131c2e', border: '1px solid rgba(245,158,11,0.35)', borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '22px' }}>🔍</span>
          <div>
            <div style={{ color: '#F59E0B', fontWeight: '700', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Stage 1 — Detect
            </div>
            <div style={{ color: '#64748B', fontSize: '11px' }}>Identifying risks and opportunities</div>
          </div>
        </div>

        {d.alert ? (
          <p style={{ color: '#CBD5E1', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>{d.alert}</p>
        ) : (
          <p style={{ color: '#475569', fontSize: '13px', fontStyle: 'italic', marginBottom: '12px' }}>Data unavailable</p>
        )}

        {Array.isArray(d.evidence) && d.evidence.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {d.evidence.map((e, i) => (
              <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#94A3B8' }}>
                <span style={{ color: '#F59E0B', flexShrink: 0, marginTop: '1px' }}>•</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </StageReveal>
  );
}

function ThinkStage({ data }) {
  const d = data || {};
  const [whyOpen, setWhyOpen] = useState(false);
  const proj = d.projection || {};
  const cur = proj.current || {};
  const prj = proj.projected || {};
  const hasProjection = proj.current && proj.projected;

  return (
    <StageReveal>
      <div style={{ background: '#131c2e', border: '1px solid rgba(59,130,246,0.35)', borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '22px' }}>🧠</span>
          <div>
            <div style={{ color: '#60A5FA', fontWeight: '700', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Stage 2 — Think
            </div>
            <div style={{ color: '#64748B', fontSize: '11px' }}>Simulating decision impact</div>
          </div>
        </div>

        {d.reasoning ? (
          <p style={{ color: '#CBD5E1', fontSize: '13px', lineHeight: '1.6', marginBottom: '14px' }}>{d.reasoning}</p>
        ) : (
          <p style={{ color: '#475569', fontSize: '13px', fontStyle: 'italic', marginBottom: '14px' }}>Data unavailable</p>
        )}

        {hasProjection && (
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '2px', fontSize: '11px' }}>
              <div style={{ padding: '6px 10px', color: '#475569' }} />
              <div style={{ padding: '6px 10px', background: '#0f172a', borderRadius: '6px 0 0 0', color: '#64748B', textAlign: 'center', fontWeight: '600' }}>Current</div>
              <div style={{ padding: '6px 10px', background: '#0f172a', borderRadius: '0 6px 0 0', color: '#60A5FA', textAlign: 'center', fontWeight: '600' }}>Projected</div>

              {['revenue', 'cost', 'profit'].map((key, idx) => (
                <Fragment key={key}>
                  <div style={{ padding: '6px 10px', background: '#0f172a', color: '#94A3B8', fontWeight: '500', textTransform: 'capitalize', borderTop: idx > 0 ? '1px solid #1e293b' : undefined }}>
                    {key}
                  </div>
                  <div style={{ padding: '6px 10px', background: '#0f172a', color: '#94A3B8', textAlign: 'center', borderTop: idx > 0 ? '1px solid #1e293b' : undefined }}>
                    RM {cur[key] ?? '—'}
                  </div>
                  <div style={{ padding: '6px 10px', background: '#0f172a', color: key === 'profit' ? '#34D399' : '#60A5FA', textAlign: 'center', fontWeight: '600', borderTop: idx > 0 ? '1px solid #1e293b' : undefined }}>
                    RM {prj[key] ?? '—'}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setWhyOpen(o => !o)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#60A5FA', fontSize: '12px', fontWeight: '600', padding: 0,
          }}
        >
          {whyOpen ? '▲ Hide explanation' : '▼ Why this recommendation?'}
        </button>

        {whyOpen && (
          <div style={{
            marginTop: '10px',
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '12px',
            color: '#94A3B8',
            lineHeight: '1.6',
          }}>
            {d.explanation || 'No explanation available.'}
          </div>
        )}
      </div>
    </StageReveal>
  );
}

function ActStage({ data }) {
  const d = data || {};
  const [editing, setEditing] = useState(false);
  const [draftText, setDraftText] = useState(d.draft_email || '');
  const [discarded, setDiscarded] = useState(false);

  if (discarded) return null;

  const displayText = draftText || d.draft_email || '';

  return (
    <StageReveal>
      <div style={{ background: '#131c2e', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '22px' }}>⚡</span>
          <div>
            <div style={{ color: '#34D399', fontWeight: '700', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Stage 3 — Act
            </div>
            <div style={{ color: '#64748B', fontSize: '11px' }}>Drafting executable actions</div>
          </div>
        </div>

        {d.draft_email ? (
          editing ? (
            <textarea
              rows={8}
              value={draftText}
              onChange={e => setDraftText(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#0f172a',
                border: '1px solid rgba(16,185,129,0.4)',
                borderRadius: '8px',
                padding: '12px',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#CBD5E1',
                lineHeight: '1.6',
                resize: 'vertical',
                outline: 'none',
                marginBottom: '12px',
              }}
            />
          ) : (
            <div style={{
              background: '#0f172a',
              border: '1px solid rgba(127,146,187,0.2)',
              borderRadius: '8px',
              padding: '12px',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#94A3B8',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6',
              marginBottom: '12px',
            }}>
              {displayText}
            </div>
          )
        ) : (
          <p style={{ color: '#475569', fontSize: '13px', fontStyle: 'italic', marginBottom: '12px' }}>Data unavailable</p>
        )}

        {Array.isArray(d.checklist) && d.checklist.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {d.checklist.map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#94A3B8', alignItems: 'flex-start' }}>
                <span style={{ color: '#34D399', flexShrink: 0, marginTop: '1px' }}>☐</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => console.log('[Execute]', displayText)}
            style={{
              flex: 1, background: '#059669', border: 'none', borderRadius: '8px',
              padding: '8px', color: '#fff', fontSize: '12px', fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Execute
          </button>
          <button
            onClick={() => {
              if (!editing) setDraftText(d.draft_email || '');
              setEditing(e => !e);
            }}
            style={{
              flex: 1, background: 'none',
              border: '1px solid rgba(127,146,187,0.4)',
              borderRadius: '8px', padding: '8px',
              color: '#94A3B8', fontSize: '12px', fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {editing ? 'Save' : 'Edit'}
          </button>
          <button
            onClick={() => setDiscarded(true)}
            style={{
              flex: 1, background: 'none',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px', padding: '8px',
              color: '#F87171', fontSize: '12px', fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Discard
          </button>
        </div>
      </div>
    </StageReveal>
  );
}

// ...existing code...
export default function StrategistFlow({ result, loading }) {
  const [visibleStages, setVisibleStages] = useState(0);

  useEffect(() => {
    if (!result || loading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisibleStages(0);
      return;
    }
    if (visibleStages === 0) setVisibleStages(1);
    const t2 = setTimeout(() => setVisibleStages(2), 1200);
    const t3 = setTimeout(() => setVisibleStages(3), 2400);
    return () => { clearTimeout(t2); clearTimeout(t3); };
  }, [result, loading, visibleStages]);

  if (!result) return null;

  // Render raw text response from backend if not using structured JSON
  if (typeof result === 'string' || result._raw || !result.agent_1_detect) {
    const textToDisplay = typeof result === 'string' ? result : (result._raw || result);
    return (
      <div style={{ background: '#131c2e', border: '1px solid rgba(127,146,187,0.3)', borderRadius: '12px', padding: '20px', color: '#CBD5E1', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '13px' }}>
        {typeof textToDisplay === 'string' ? textToDisplay : JSON.stringify(textToDisplay, null, 2)}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {visibleStages >= 1 && <DetectStage data={result.agent_1_detect} />}
      {visibleStages >= 2 && <><Connector /><ThinkStage data={result.agent_2_think} /></>}
      {visibleStages >= 3 && <><Connector /><ActStage data={result.agent_3_act} /></>}
    </div>
  );
}