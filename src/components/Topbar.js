import { useApp } from '../context/AppContext';
import { useClock } from '../hooks/useUIHooks';

function Topbar({ badge, badgeClass, children, rightSlot }) {
  const { state, toggleTheme } = useApp();
  const time = useClock();
  return (
    <div className="topbar">
      <span className="tb-brand">EduResult Pro</span>
      <div className="react-badge"><div className="react-badge-dot"></div>React 18</div>
      {badge && <span className={`tb-badge ${badgeClass}`}>{badge}</span>}
      <div className="tb-spacer"/>
      <span className="tb-clock">{time}</span>
      {children}
      <div className="tb-icon-btn" onClick={toggleTheme} title="Toggle Theme">{state.theme === 'dark' ? '🌙' : '☀️'}</div>
      {rightSlot}
    </div>
  );
}


export default Topbar;
