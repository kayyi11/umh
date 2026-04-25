import { useState, useEffect } from 'react';

const LINES = [
  '🔍 Detecting risks...',
  '🧠 Thinking through impact...',
  '⚡ Drafting actions...',
];

export default function ProcessingLog() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timers = LINES.map((_, i) =>
      setTimeout(() => setVisibleCount(i + 1), (i + 1) * 800)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
      {LINES.map((line, i) => (
        <div
          key={i}
          style={{
            opacity: i < visibleCount ? 1 : 0,
            transition: 'opacity 0.4s ease',
            color: '#94a3b8',
            fontSize: '14px',
            fontFamily: 'monospace',
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}
