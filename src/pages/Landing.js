import { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useMouseGlow } from '../hooks/useUIHooks';
import ParticleCanvas from '../components/ParticleCanvas';

function PortalCard({ card: c, index: i, onClick }) {
  const ref = useRef(null);
  useMouseGlow(ref);
  return (
    <div ref={ref} className="pcard anim-fadeUp" style={{ '--c':c.color,'--glow':c.glow,'--sg':c.sg, animationDelay:`${.1+i*.08}s` }} onClick={onClick}>
      <div className="pc-icon">{c.icon}</div>
      <div className="pc-title">{c.title}</div>
      <p className="pc-desc">{c.desc}</p>
      <div className="pc-arrow" style={{color:c.color}}>Enter →</div>
    </div>
  );
}

function Landing() {
  const { goTo, toggleTheme, state } = useApp();
  const cards = [
    { id:'student', icon:'🎓', title:'Student Portal', desc:'View results, attendance, grades, and performance charts.', color:'var(--blue)', glow:'rgba(77,141,255,.15)', sg:'rgba(77,141,255,.18)', cls:'badge-s' },
    { id:'admin',   icon:'🏫', title:'Admin Panel',   desc:'Full control: add students, enter marks, manage attendance.', color:'var(--violet)', glow:'rgba(157,111,245,.12)', sg:'rgba(157,111,245,.2)', cls:'badge-a' },
    { id:'analytics',icon:'📊',title:'Analytics',     desc:'Public class statistics, grade distribution, leaderboard.', color:'var(--cyan)', glow:'rgba(0,212,180,.1)', sg:'rgba(0,212,180,.18)', cls:'badge-n' },
  ];
  const handleClick = (id) => {
    if (id === 'student') goTo('student-login');
    else if (id === 'admin') goTo('admin-login');
    else goTo('analytics');
  };
  return (
    <div className="landing">
      <ParticleCanvas/>
      <div className="anim-fadeUp" style={{textAlign:'center'}}>
        <span className="hero-badge"><span className="badge-dot"/>React 18 + Advanced JS</span>
      </div>
      <div style={{textAlign:'center'}}>
        <h1 className="hero-title">
          <span className="word"><span className="anim-fadeUp delay-1">Student</span></span>{' '}
          <span className="word"><span className="accent anim-fadeUp delay-2">Result</span></span>{' '}
          <span className="word"><span className="anim-fadeUp delay-3">Management</span></span>
        </h1>
        <p className="hero-sub anim-fadeUp delay-4">
          Powered by React 18 · Context API · Custom Hooks · Reducer Pattern
        </p>
      </div>
      <div className="portal-grid">
        {cards.map((c, i) => (
          <PortalCard key={c.id} card={c} index={i} onClick={() => handleClick(c.id)}/>
        ))}
      </div>
      <div className="pill-row anim-fadeUp delay-6">
        {['⚛️ React 18','🧠 Custom Hooks','📦 Context API','🔄 useReducer','✨ Animations','📅 6-Month Attendance','⌨️ Keyboard Shortcuts','📊 Canvas Charts','🔒 Strong Auth','📥 CSV + PDF'].map(p => (
          <span key={p} className="pill">{p}</span>
        ))}
      </div>
      <div style={{position:'absolute',top:16,right:20,display:'flex',gap:8}}>
        <div className="tb-icon-btn" onClick={toggleTheme}>{state.theme==='dark'?'🌙':'☀️'}</div>
      </div>
    </div>
  );
}


export default Landing;
