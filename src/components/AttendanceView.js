import { useState } from 'react';
import { ensureAtt } from '../utils/attendance';
import { ATT_MONTHS, ATT_YEAR } from '../utils/constants';

function AttendanceView({ stu, readonly = false, onUpdate }) {
  const [month, setMonth] = useState(0);
  ensureAtt(stu);

  const monthData = stu.att[month] || [];
  const wdays = monthData.filter(x=>x!=='w');
  const p=wdays.filter(x=>x==='p').length, ab=wdays.filter(x=>x==='a').length, h=wdays.filter(x=>x==='h').length;
  const pct = wdays.length ? Math.round(p/wdays.length*100) : 0;

  const cycle = (di) => {
    if (readonly) return;
    const cur = stu.att[month][di];
    const map = {p:'a', a:'h', h:'p'};
    stu.att[month][di] = map[cur] || 'p';
    if (onUpdate) onUpdate();
  };

  const bulkMark = (status) => {
    if (readonly) return;
    stu.att[month] = stu.att[month].map(v => v==='w' ? 'w' : status);
    if (onUpdate) onUpdate();
  };

  const firstDow = new Date(ATT_YEAR, month, 1).getDay();

  // 6-month summary row
  const summary = ATT_MONTHS.map((mn, mi) => {
    const md = stu.att[mi]||[];
    const wd = md.filter(x=>x!=='w');
    const pp = wd.filter(x=>x==='p').length;
    const pct2 = wd.length ? Math.round(pp/wd.length*100) : 0;
    return { mn, pp, wd:wd.length, pct:pct2 };
  });
  const totalP = summary.reduce((a,s)=>a+s.pp,0);
  const totalD = summary.reduce((a,s)=>a+s.wd,0);
  const overallPct = totalD ? Math.round(totalP/totalD*100) : 0;

  return (
    <div className="anim-fadeIn">
      {/* 6-month summary */}
      <div className="card" style={{marginBottom:14}}>
        <div className="card-hdr">
          <span className="card-hdr-title">6-Month Summary</span>
          <span style={{fontSize:'.76rem',color:overallPct>=75?'var(--green)':'var(--rose)',fontWeight:700}}>
            Overall: {overallPct}% {overallPct<75?'⚠ Below 75%':''}
          </span>
        </div>
        <div className="card-body">
          <div className="att-6m-grid">
            {summary.map(({mn,pp,wd,pct:p2},i) => (
              <div key={mn} className="att-6m-card" style={{animationDelay:`${i*.05}s`}}>
                <div className="att-6m-name">{mn} {ATT_YEAR}</div>
                <div className="att-6m-pct" style={{color:p2>=75?'var(--green)':p2>=60?'var(--amber)':'var(--rose)'}}>{p2}%</div>
                <div style={{fontSize:'.68rem',color:'var(--muted)'}}>{pp}/{wd} days</div>
                <div className="att-6m-bar"><div className="att-6m-fill" style={{width:`${p2}%`,background:p2>=75?'var(--green)':p2>=60?'var(--amber)':'var(--rose)'}}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Monthly calendar */}
      <div className="card">
        <div className="card-hdr">
          <span className="card-hdr-title">{ATT_MONTHS[month]} {ATT_YEAR}</span>
          {!readonly && <span style={{fontSize:'.72rem',color:'var(--muted)'}}>Click day to cycle P→A→H</span>}
        </div>
        <div className="card-body">
          <div className="att-month-tabs">
            {ATT_MONTHS.map((mn,i) => (
              <button key={mn} className={`att-month-tab${i===month?' on':''}`} onClick={()=>setMonth(i)}>{mn.slice(0,3)}</button>
            ))}
          </div>
          {!readonly && (
            <div className="att-bulk-bar">
              <span style={{fontSize:'.74rem',color:'var(--muted)'}}>Bulk:</span>
              <button className="att-bulk-btn p" onClick={()=>bulkMark('p')}>✅ All Present</button>
              <button className="att-bulk-btn a" onClick={()=>bulkMark('a')}>❌ All Absent</button>
              <button className="att-bulk-btn h" onClick={()=>bulkMark('h')}>🏖 All Holiday</button>
            </div>
          )}
          <div className="att-stats-row">
            <span className="att-stat-chip p">✅ Present: {p}</span>
            <span className="att-stat-chip a">❌ Absent: {ab}</span>
            <span className="att-stat-chip h">🏖 Holiday: {h}</span>
            <span className="att-stat-chip pct">📊 {pct}%</span>
          </div>
          <div className="att-dow-labels">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><div key={d} className="att-dow-lbl">{d}</div>)}
          </div>
          <div className="att-full-grid">
            {Array(firstDow).fill(null).map((_,i)=><div key={`e${i}`}/>)}
            {monthData.map((status, di) => (
              <div key={di} className={`att-full-cell att-${status}`} onClick={()=>cycle(di)}
                title={`${ATT_MONTHS[month]} ${di+1}: ${status==='p'?'Present':status==='a'?'Absent':status==='h'?'Holiday':'Weekend'}`}
                style={{cursor:readonly||status==='w'?'default':'pointer'}}>
                <span style={{fontSize:'.66rem',fontWeight:700}}>{di+1}</span>
                <span style={{fontSize:'.52rem',opacity:.7}}>{{p:'P',a:'A',h:'H',w:''}[status]}</span>
              </div>
            ))}
          </div>
          <div className="att-legend">
            <div className="att-li"><div className="att-ld" style={{background:'rgba(18,201,138,.4)'}}/>Present</div>
            <div className="att-li"><div className="att-ld" style={{background:'rgba(245,71,107,.3)'}}/>Absent</div>
            <div className="att-li"><div className="att-ld" style={{background:'rgba(245,166,35,.3)'}}/>Holiday</div>
            <div className="att-li"><div className="att-ld" style={{background:'var(--surf)'}}/>Weekend</div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default AttendanceView;
