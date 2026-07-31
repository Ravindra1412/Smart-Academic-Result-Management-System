import { usePwStrength } from '../hooks/useUIHooks';

function PwStrengthBar({ pw, prefix = 'pw' }) {
  const { score, label, color } = usePwStrength(pw);
  return (
    <div className="pw-strength">
      <div className="pw-bar-row">
        {[1,2,3,4].map(n => (
          <div key={n} className={`pw-seg${n<=score?' lit':''}`} style={{ background: n<=score ? color : '' }}/>
        ))}
      </div>
      <div className="pw-label" style={{ color }}>{label}</div>
    </div>
  );
}


export default PwStrengthBar;
