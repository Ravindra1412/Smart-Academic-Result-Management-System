import { useAnimatedNumber } from '../hooks/useUIHooks';

function AnimatedStatCard({ icon, label, value, note, color, delay = 0 }) {
  const animValue = useAnimatedNumber(typeof value === 'number' ? value : 0);
  return (
    <div className="stat-card anim-scaleIn" style={{ animationDelay: `${delay}s` }}>
      <span className="sc-icon">{icon}</span>
      <div className="sc-lbl">{label}</div>
      <div className="sc-val animated-num" style={{ color: color || 'var(--ink)' }}>
        {typeof value === 'number' ? animValue : value}
      </div>
      {note && <div className="sc-note">{note}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// COMPONENT: PROGRESS RING
// ═══════════════════════════════════════════════════════
function ProgressRing({ value, size = 80, color = '#4d8dff' }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="progress-ring">
      <circle className="progress-ring-track" cx={size/2} cy={size/2} r={r} />
      <circle className="progress-ring-fill" cx={size/2} cy={size/2} r={r}
        stroke={color} strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset} />
    </svg>
  );
}


export { AnimatedStatCard, ProgressRing };
