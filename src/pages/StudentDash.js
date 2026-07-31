import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { avg, grade, gClass, grad, isPass, getRank, col, subKey } from '../utils/helpers';
import { MAX_MARK, SUBJECTS } from '../utils/constants';
import { buildStudentPDF } from '../utils/exportUtils';
import Topbar from '../components/Topbar';
import { AnimatedStatCard } from '../components/StatWidgets';
import { NotifBell, NotifPanel } from '../components/NotifPanel';
import AttendanceView from '../components/AttendanceView';
import ChangeStudentPwModal from '../components/modals/ChangeStudentPwModal';
import StudentNoticesTab from './student/StudentNoticesTab';
import PaperSeeingRequest from './student/PaperSeeingRequest';

window.dl = window.dl || function(content, name) {
  const b2 = new Blob([content], {type:'text/csv'}), u = URL.createObjectURL(b2);
  const a = document.createElement('a'); a.href=u; a.download=name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(u);
};

function StudentDash() {
  const { state, dispatch, goTo } = useApp();
  const stu = state.currentStudent;
  const [tab, setTab] = useState('results');
  const [changePwOpen, setChangePwOpen] = useState(false);
  const [stuNotifOpen, setStuNotifOpen] = useState(false);
  const canvasRef = useRef(null);
  const pieRef = useRef(null);

  useEffect(() => {
    if (!stu) { goTo('student-login'); return; }
    if (tab === 'canvas') {
      drawMarksCanvas();
      drawPieChart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, state.theme, stu]);

  if (!stu) return null;

  const a = avg(stu.marks), g = grade(a), pass = isPass(stu, state.passMark);
  const total = Object.values(stu.marks).reduce((s,v)=>s+v, 0);
  const attAllP = stu.att.flat().filter(x=>x==='p').length;
  const attAllD = stu.att.flat().filter(x=>x!=='w').length;
  const attPct = attAllD ? Math.round(attAllP/attAllD*100) : 0;

  const drawMarksCanvas = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isDark = state.theme === 'dark';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const keys = Object.keys(stu.marks), vals = keys.map(k => stu.marks[k]);
    const labels = keys.map(k => k.replace(/([A-Z])/g,' $1').trim());
    const W=canvas.width, H=canvas.height;
    const pad={t:30,r:20,b:60,l:50};
    const cW=W-pad.l-pad.r, cH=H-pad.t-pad.b;
    const barW=cW/keys.length*.55, gap=cW/keys.length;
    ctx.strokeStyle=isDark?'rgba(255,255,255,.05)':'rgba(0,0,0,.07)'; ctx.lineWidth=1;
    for(let i=0;i<=5;i++){
      const y=pad.t+cH-(cH/5*i);
      ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+cW,y); ctx.stroke();
      ctx.fillStyle=isDark?'rgba(255,255,255,.35)':'rgba(0,0,0,.5)';
      ctx.font='11px DM Mono'; ctx.textAlign='right';
      ctx.fillText((MAX_MARK/5*i).toFixed(0),pad.l-6,y+4);
    }
    vals.forEach((v, i) => {
      const x=pad.l+gap*i+(gap-barW)/2, bH=cH*(v/MAX_MARK), y=pad.t+cH-bH;
      const pct=Math.round(v/MAX_MARK*100);
      const grd=ctx.createLinearGradient(x,y,x,y+bH);
      if(pct>=80){grd.addColorStop(0,'#12c98a');grd.addColorStop(1,'#00d4b4');}
      else if(pct>=60){grd.addColorStop(0,'#4d8dff');grd.addColorStop(1,'#9d6ff5');}
      else if(pct>=40){grd.addColorStop(0,'#f5a623');grd.addColorStop(1,'#f97316');}
      else{grd.addColorStop(0,'#f5476b');grd.addColorStop(1,'#e11d48');}
      ctx.fillStyle=grd;
      const r=Math.min(6,barW/2);
      ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+barW-r,y);
      ctx.arcTo(x+barW,y,x+barW,y+r,r); ctx.lineTo(x+barW,y+bH);
      ctx.lineTo(x,y+bH); ctx.arcTo(x,y,x+r,y,r); ctx.closePath(); ctx.fill();
      ctx.fillStyle=isDark?'rgba(255,255,255,.8)':'rgba(0,0,0,.75)';
      ctx.font='bold 12px DM Mono'; ctx.textAlign='center';
      ctx.fillText(v, x+barW/2, y-6);
      ctx.fillStyle=isDark?'rgba(255,255,255,.5)':'rgba(0,0,0,.5)';
      ctx.font='9px Syne';
      labels[i].split(' ').forEach((w,wi)=>ctx.fillText(w,x+barW/2,pad.t+cH+16+wi*13));
    });
    ctx.fillStyle=isDark?'rgba(255,255,255,.7)':'rgba(0,0,0,.7)';
    ctx.font='bold 13px Crimson Pro'; ctx.textAlign='left';
    ctx.fillText(`${stu.name} — Subject Marks`, pad.l, 18);
  };

  const drawPieChart = () => {
    const canvas = pieRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isDark = state.theme === 'dark';
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const keys=Object.keys(stu.marks), vals=keys.map(k=>stu.marks[k]);
    const total=vals.reduce((a,b)=>a+b,0);
    const cx=canvas.width/2, cy=canvas.height/2, r=100;
    const colors=['#4d8dff','#12c98a','#9d6ff5','#f5a623','#f5476b','#00d4b4'];
    let start=-Math.PI/2;
    vals.forEach((v,i)=>{
      const slice=(v/total)*Math.PI*2;
      ctx.beginPath(); ctx.moveTo(cx,cy);
      ctx.arc(cx,cy,r,start,start+slice); ctx.closePath();
      ctx.fillStyle=colors[i%colors.length]; ctx.fill();
      ctx.strokeStyle=isDark?'#0b1023':'#fff'; ctx.lineWidth=2; ctx.stroke();
      const midA=start+slice/2, lx=cx+Math.cos(midA)*r*.68, ly=cy+Math.sin(midA)*r*.68;
      ctx.fillStyle='#fff'; ctx.font='bold 11px DM Mono'; ctx.textAlign='center';
      ctx.fillText(Math.round(v/total*100)+'%',lx,ly+4);
      start+=slice;
    });
    keys.forEach((k,i)=>{
      const lx=10, ly=canvas.height-120+i*18;
      ctx.fillStyle=colors[i%colors.length]; ctx.fillRect(lx,ly,10,10);
      ctx.fillStyle=isDark?'rgba(255,255,255,.65)':'rgba(0,0,0,.65)';
      ctx.font='10px Syne'; ctx.textAlign='left';
      ctx.fillText(k.replace(/([A-Z])/g,' $1').trim(),lx+14,ly+9);
    });
  };

  const exportCSV = () => {
    let csv = `EduResult Pro — ${state.schoolName}\nStudent: ${stu.name} (${stu.roll})\nClass: ${stu.cls}\n\nSubject,Max,Obtained,%,Grade,Status\n`;
    Object.keys(stu.marks).forEach(k => {
      const m=stu.marks[k], pct=Math.round(m/MAX_MARK*100);
      csv += `"${k.replace(/([A-Z])/g,' $1').trim()}",${MAX_MARK},${m},${pct}%,${grade(pct)},${m>=state.passMark?'Pass':'Fail'}\n`;
    });
    window.dl(csv, `${stu.roll}_result.csv`);
  };

  return (
    <div className="page-full">
      <Topbar badge="Student" badgeClass="badge-s" rightSlot={
        <>
          <NotifBell onClick={()=>setStuNotifOpen(o=>!o)}/>
          <button className="tb-btn" onClick={()=>{ dispatch({type:'SET_CURRENT_STU',student:null}); goTo('student-login'); }}>Logout</button>
        </>
      }>
        <span style={{fontSize:'.76rem',color:'var(--muted)'}}>{stu.name}</span>
        <div className="tb-icon-btn" onClick={()=>document.getElementById('kbd-overlay').classList.add('open')} title="Shortcuts">⌨️</div>
      </Topbar>
      <div className="pg-body">
        <div className="pg-hdr anim-fadeUp">
          <div>
            <div className="pg-title">Hello, {stu.name.split(' ')[0]}! 👋</div>
            <div className="pg-sub">{stu.roll} · Class {stu.cls} · {stu.gender} · {stu.cat||'General'}</div>
          </div>
          <div className="hdr-actions">
            <button className="tb-btn" onClick={()=>window.print()}>🖨 Print</button>
            <button className="tb-btn" onClick={exportCSV}>📥 CSV</button>
            <button className="tb-btn" onClick={()=>buildStudentPDF(stu,state.schoolName,state.academicYear,state.passMark,state.students)}>📄 PDF</button>
            <button className="tb-btn" onClick={()=>setChangePwOpen(true)}>🔑 Password</button>
          </div>
        </div>
        <div className="stat-grid">
          <AnimatedStatCard icon="📊" label="Average" value={a} note="out of 100" color={col(a)} delay={0}/>
          <AnimatedStatCard icon="🏅" label="Grade" value={g} color="var(--violet)" delay={.05}/>
          <AnimatedStatCard icon={pass?'✅':'❌'} label="Status" value={pass?'Pass':'Fail'} color={pass?'var(--green)':'var(--rose)'} delay={.1}/>
          <AnimatedStatCard icon="🏆" label="Rank" value={`#${getRank(stu, state.students)}`} color="var(--amber)" delay={.15}/>
          <AnimatedStatCard icon="📚" label="Total Marks" value={total} note={`of ${SUBJECTS.length*MAX_MARK}`} delay={.2}/>
          <AnimatedStatCard icon="📅" label="Attendance" value={`${attPct}%`} note="6-month avg" color={attPct>=75?'var(--green)':'var(--amber)'} delay={.25}/>
        </div>
        <div className="tab-strip">
          {[['results','📋 Results'],['canvas','📊 Chart'],['subjects','🎯 Subjects'],['attendance','📅 Attendance'],['notices','📢 Notices'],['paper','📄 Paper Request']].map(([t,l]) => (
            <button key={t} className={`tab-btn${tab===t?' on':''}`} onClick={()=>setTab(t)}>{l}</button>
          ))}
        </div>
        {tab==='results' && (() => {
          const rank = getRank(stu, state.students);
          return (
            <>
              {rank<=3 && (
                <div className="anim-scaleIn" style={{
                  marginBottom:14,padding:'14px 18px',borderRadius:'var(--r)',
                  background:rank===1?'linear-gradient(135deg,rgba(245,166,35,.12),rgba(245,166,35,.04))':rank===2?'linear-gradient(135deg,rgba(148,163,184,.12),rgba(148,163,184,.04))':'linear-gradient(135deg,rgba(194,98,61,.12),rgba(194,98,61,.04))',
                  border:`1px solid ${rank===1?'rgba(245,166,35,.3)':rank===2?'rgba(148,163,184,.25)':'rgba(194,98,61,.25)'}`,
                  display:'flex',alignItems:'center',gap:14
                }}>
                  <span style={{fontSize:'2rem'}}>{rank===1?'🥇':rank===2?'🥈':'🥉'}</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:'.95rem'}}>
                      {rank===1?'Outstanding Performance!':rank===2?'Excellent Work!':'Great Achievement!'}
                    </div>
                    <div style={{fontSize:'.78rem',color:'var(--ink2)',marginTop:2}}>
                      You are ranked <strong>#{rank}</strong> in your class with an average of <strong style={{color:col(avg(stu.marks))}}>{avg(stu.marks)}%</strong>. Keep it up! 🌟
                    </div>
                  </div>
                </div>
              )}
              <div className="card anim-fadeIn">
            <div className="card-hdr"><span className="card-hdr-title">Subject-wise Results</span><span style={{fontSize:'.72rem',color:'var(--muted)'}}>Academic Year {state.academicYear}</span></div>
            <table>
              <thead><tr><th>Subject</th><th>Max</th><th>Obtained</th><th>%</th><th>Grade</th><th>Status</th></tr></thead>
              <tbody>
                {Object.keys(stu.marks).map((k, i) => {
                  const m=stu.marks[k], pct=Math.round(m/MAX_MARK*100), g2=grade(pct);
                  return (
                    <tr key={k} className="anim-fadeUp" style={{animationDelay:`${i*.04}s`}}>
                      <td style={{fontWeight:600}}>{k.replace(/([A-Z])/g,' $1').trim()}</td>
                      <td>{MAX_MARK}</td>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <strong style={{color:col(pct)}}>{m}</strong>
                          <div className="mark-track" style={{width:56}}><div className="mark-fill" style={{width:`${pct}%`,background:grad(pct)}}/></div>
                        </div>
                      </td>
                      <td style={{color:col(pct),fontWeight:700}}>{pct}%</td>
                      <td><span className={`gbadge ${gClass(g2)}`}>{g2}</span></td>
                      <td style={{color:m>=state.passMark?'var(--green)':'var(--rose)',fontWeight:600}}>{m>=state.passMark?'✅ Pass':'❌ Fail'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
            </>
          );
        })()}
        {tab==='canvas' && (
          <div className="card anim-fadeIn">
            <div className="card-hdr"><span className="card-hdr-title">Visual Analysis</span></div>
            <div className="canvas-wrap">
              <canvas ref={canvasRef} width={680} height={320} style={{maxWidth:'100%'}}/>
              <canvas ref={pieRef} width={300} height={300} style={{maxWidth:'100%'}}/>
            </div>
          </div>
        )}
        {tab==='subjects' && (
          <div className="subj-grid">
            {Object.keys(stu.marks).map((k,i) => {
              const m=stu.marks[k], pct=Math.round(m/MAX_MARK*100);
              return (
                <div key={k} className="subj-card" style={{animationDelay:`${i*.05}s`}}>
                  <div className="subj-card-name">{k.replace(/([A-Z])/g,' $1').trim()}</div>
                  <div className="subj-card-mark" style={{color:col(pct)}}>{m}</div>
                  <div style={{fontSize:'.72rem',color:'var(--muted)'}}>{pct}% · <span className={`gbadge ${gClass(grade(pct))}`}>{grade(pct)}</span></div>
                  <div className="mark-track"><div className="mark-fill" style={{width:`${pct}%`,background:grad(pct)}}/></div>
                </div>
              );
            })}
          </div>
        )}
        {tab==='attendance' && <AttendanceView stu={stu} readonly/>}
        {tab==='notices' && <StudentNoticesTab/>}
        {tab==='paper' && <PaperSeeingRequest stu={stu}/>}
      </div>
      {changePwOpen && <ChangeStudentPwModal stu={stu} onClose={()=>setChangePwOpen(false)}/>}
      <NotifPanel open={stuNotifOpen} onClose={()=>setStuNotifOpen(false)}/>
    </div>
  );
}


export default StudentDash;
