import { useApp } from '../../context/AppContext';
import { avg, grade, isPass, col, grad, subKey, att75Pct } from '../../utils/helpers';
import { ensureAtt } from '../../utils/attendance';
import { SUBJECTS } from '../../utils/constants';
import BarChart from '../../components/BarChart';

function OverviewSection() {
  const { state } = useApp();
  const { students, passMark } = state;
  const total = students.length;
  const avgs = students.map(s => avg(s.marks));
  const cAvg = avgs.length ? Math.round(avgs.reduce((a,b)=>a+b,0)/avgs.length) : 0;
  const passed = students.filter(s=>isPass(s,passMark)).length;
  const top = [...students].sort((a,b)=>avg(b.marks)-avg(a.marks))[0];
  const attAvg = students.length ? Math.round(students.reduce((a,s)=>{
    ensureAtt(s);
    const p=s.att.flat().filter(x=>x==='p').length, d=s.att.flat().filter(x=>x!=='w').length;
    return a+(d?p/d*100:0);
  },0)/students.length) : 0;

  const subAvgs = SUBJECTS.map(sub => students.length ? Math.round(students.reduce((s2,s)=>s2+(s.marks[subKey(sub)]||0),0)/students.length) : 0);
  const grd = {'A+':0,'A':0,'B+':0,'B':0,'C':0,'D':0,'F':0};
  students.forEach(s=>{const g2=grade(avg(s.marks));grd[g2]=(grd[g2]||0)+1;});
  const gc = {'A+':col(95),'A':col(85),'B+':col(75),'B':col(65),'C':col(55),'D':col(45),'F':col(20)};

  return (
    <div>
      <div className="ov-grid">
        <div className="ov-card anim-scaleIn" style={{animationDelay:'.0s'}}><div className="ov-ico">🎓</div><div className="ov-num">{total}</div><div className="ov-lbl">Total Students</div></div>
        <div className="ov-card anim-scaleIn" style={{animationDelay:'.05s'}}><div className="ov-ico">📊</div><div className="ov-num" style={{color:col(cAvg)}}>{cAvg}%</div><div className="ov-lbl">Class Average</div></div>
        <div className="ov-card anim-scaleIn" style={{animationDelay:'.1s'}}><div className="ov-ico">✅</div><div className="ov-num" style={{color:'var(--green)'}}>{passed}</div><div className="ov-lbl">Passed</div></div>
        <div className="ov-card anim-scaleIn" style={{animationDelay:'.15s'}}><div className="ov-ico">❌</div><div className="ov-num" style={{color:'var(--rose)'}}>{total-passed}</div><div className="ov-lbl">Failed</div></div>
        <div className="ov-card anim-scaleIn" style={{animationDelay:'.2s'}}><div className="ov-ico">🏆</div><div className="ov-num" style={{fontSize:'1rem',lineHeight:1.3}}>{top?top.name.split(' ')[0]:'—'}</div><div className="ov-lbl">Top Performer</div></div>
        <div className="ov-card anim-scaleIn" style={{animationDelay:'.25s'}}><div className="ov-ico">📅</div><div className="ov-num" style={{color:attAvg>=75?'var(--green)':'var(--amber)'}}>{attAvg}%</div><div className="ov-lbl">Avg Attendance</div></div>
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-hdr"><span className="card-hdr-title">Subject Averages</span></div>
          <div className="card-body">
            {SUBJECTS.map((sub,i)=>(
              <div key={sub} className="bar-row" style={{animationDelay:`${i*.04}s`}}>
                <div className="bar-lbl" style={{fontSize:'.74rem'}}>{sub}</div>
                <div className="bar-track"><div className="bar-fill" style={{width:`${subAvgs[i]}%`,background:grad(subAvgs[i])}}>{subAvgs[i]}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-hdr"><span className="card-hdr-title">Grade Distribution</span></div>
          <div className="card-body">
            {Object.entries(grd).map(([g2,c])=>(
              <div key={g2} className="dist-row">
                <div className="dist-lbl" style={{color:gc[g2]}}>{g2}</div>
                <div className="dist-track"><div className="dist-fill" style={{width:`${total?c/total*100:0}%`,background:gc[g2]}}>{c>0?c+' students':''}</div></div>
                <div className="dist-cnt">{c}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card" style={{marginTop:14}}>
        <div className="card-hdr"><span className="card-hdr-title">Subject Canvas Chart</span></div>
        <div className="canvas-wrap">
          <BarChart labels={SUBJECTS} values={subAvgs} title="Subject-wise Class Averages" id="ov-canvas"/>
        </div>
      </div>
      <div className="two-col" style={{marginTop:14}}>
        <div className="card">
          <div className="card-hdr">
            <span className="card-hdr-title">⚠️ Students Needing Attention</span>
            <span style={{fontSize:'.7rem',color:'var(--muted)'}}>{students.filter(s=>!isPass(s,passMark)||att75Pct(s)<75).length} students</span>
          </div>
          <div className="card-body" style={{padding:'0 0 8px 0',maxHeight:200,overflowY:'auto'}}>
            {students.filter(s=>!isPass(s,passMark)||att75Pct(s)<75).length===0
              ? <div style={{padding:'16px 18px',color:'var(--muted)',fontSize:'.82rem'}}>✅ All students are on track!</div>
              : students.filter(s=>!isPass(s,passMark)||att75Pct(s)<75).map(s=>{
                  const a2=avg(s.marks), attP=att75Pct(s);
                  return (
                    <div key={s.id} style={{padding:'10px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:10}}>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:'.84rem'}}>{s.name}</div>
                        <div style={{fontSize:'.72rem',color:'var(--muted)'}}>{s.roll} · {s.cls}</div>
                      </div>
                      {!isPass(s,passMark) && <span style={{fontSize:'.68rem',padding:'2px 7px',borderRadius:50,background:'rgba(245,71,107,.1)',color:'var(--rose)',fontWeight:700}}>Failed</span>}
                      {attP<75 && <span style={{fontSize:'.68rem',padding:'2px 7px',borderRadius:50,background:'rgba(245,166,35,.1)',color:'var(--amber)',fontWeight:700}}>Att {attP}%</span>}
                      <span style={{fontWeight:700,fontSize:'.82rem',color:col(a2)}}>{a2}%</span>
                    </div>
                  );
                })
            }
          </div>
        </div>
        <div className="card">
          <div className="card-hdr"><span className="card-hdr-title">📈 Subject Pass Rates</span></div>
          <div className="card-body">
            {SUBJECTS.map(sub=>{
              const k=subKey(sub), a2=total?Math.round(students.reduce((s2,s)=>s2+(s.marks[k]||0),0)/total):0;
              const passW=total?Math.round(students.filter(s=>(s.marks[k]||0)>=passMark).length/total*100):0;
              return (
                <div key={sub} style={{marginBottom:9}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'.76rem',marginBottom:3}}>
                    <span style={{color:'var(--ink2)'}}>{sub}</span>
                    <span style={{color:col(a2),fontWeight:700}}>{a2}% avg · <span style={{color:passW>=75?'var(--green)':'var(--rose)'}}>{passW}% pass</span></span>
                  </div>
                  <div style={{height:6,background:'var(--surf3)',borderRadius:50,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${a2}%`,background:grad(a2),borderRadius:50,transition:'width 1s'}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


export default OverviewSection;
