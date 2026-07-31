import { useApp } from '../context/AppContext';
import { avg, grade, isPass, col, subKey } from '../utils/helpers';
import { SUBJECTS } from '../utils/constants';
import Topbar from '../components/Topbar';
import { AnimatedStatCard } from '../components/StatWidgets';
import BarChart from '../components/BarChart';

function PublicAnalytics() {
  const { state, goTo } = useApp();
  const { students, passMark } = state;
  const total = students.length;
  const avgs = students.map(s=>avg(s.marks));
  const cAvg = avgs.length ? Math.round(avgs.reduce((a,b)=>a+b,0)/avgs.length) : 0;
  const passed = students.filter(s=>isPass(s,passMark)).length;
  const grd = {'A+':0,'A':0,'B+':0,'B':0,'C':0,'D':0,'F':0};
  students.forEach(s=>{const g2=grade(avg(s.marks));grd[g2]=(grd[g2]||0)+1;});
  const gc = {'A+':col(95),'A':col(85),'B+':col(75),'B':col(65),'C':col(55),'D':col(45),'F':col(20)};
  const sorted = [...students].sort((a,b)=>avg(b.marks)-avg(a.marks)).slice(0,5);
  const rc = ['g','s','b'];
  const subAvgs = SUBJECTS.map(sub=>total?Math.round(students.reduce((s2,s)=>s2+(s.marks[subKey(sub)]||0),0)/total):0);

  return (
    <div className="page-full">
      <Topbar badge="Analytics" badgeClass="badge-n" rightSlot={
        <button className="tb-btn" onClick={()=>goTo('landing')}>← Back</button>
      }/>
      <div className="pub-body">
        <div className="pg-hdr anim-fadeUp">
          <div><div className="pg-title">Public Analytics</div><div className="pg-sub">Class performance overview</div></div>
        </div>
        <div className="stat-grid">
          <AnimatedStatCard icon="🎓" label="Students" value={total} delay={0}/>
          <AnimatedStatCard icon="📊" label="Class Avg" value={`${cAvg}%`} color={col(cAvg)} delay={.05}/>
          <AnimatedStatCard icon="✅" label="Pass Rate" value={`${total?Math.round(passed/total*100):0}%`} color="var(--green)" delay={.1}/>
          <AnimatedStatCard icon="📚" label="Subjects" value={SUBJECTS.length} delay={.15}/>
        </div>
        <div className="two-col">
          <div className="card">
            <div className="card-hdr"><span className="card-hdr-title">Grade Distribution</span></div>
            <div className="card-body">
              {Object.entries(grd).map(([g2,c])=>(
                <div key={g2} className="dist-row">
                  <div className="dist-lbl" style={{color:gc[g2]}}>{g2}</div>
                  <div className="dist-track"><div className="dist-fill" style={{width:`${total?c/total*100:0}%`,background:gc[g2]}}>{c>0?c:''}</div></div>
                  <div className="dist-cnt">{c}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-hdr"><span className="card-hdr-title">Top 5 Leaderboard</span></div>
            <div className="card-body" style={{padding:'0 16px'}}>
              {sorted.map((s,i)=>{
                const a=avg(s.marks);
                return (
                  <div key={s.id} className="lb-row anim-slideRight" style={{animationDelay:`${i*.05}s`}}>
                    <div className={`lb-rank${rc[i]?' '+rc[i]:''}`}>{i+1}</div>
                    <div className="lb-name">{s.name} <span style={{color:'var(--muted)',fontSize:'.72rem'}}>{s.cls}</span></div>
                    <div className="lb-bar"><div className="lb-fill" style={{width:`${a}%`}}/></div>
                    <div className="lb-pct" style={{color:col(a)}}>{a}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-hdr"><span className="card-hdr-title">Subject Averages Chart</span></div>
          <div className="canvas-wrap">
            <BarChart labels={SUBJECTS} values={subAvgs} title="Class Subject Averages" id="pub-canvas"/>
          </div>
        </div>
      </div>
    </div>
  );
}


export default PublicAnalytics;
