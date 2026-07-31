import { useApp } from '../../context/AppContext';
import { avg, grade, isPass, col, subKey } from '../../utils/helpers';
import { SUBJECTS } from '../../utils/constants';
import BarChart from '../../components/BarChart';

function AnalyticsSection() {
  const { state } = useApp();
  const { students, passMark } = state;
  const total = students.length;
  const grd = {'A+':0,'A':0,'B+':0,'B':0,'C':0,'D':0,'F':0};
  students.forEach(s=>{const g2=grade(avg(s.marks));grd[g2]=(grd[g2]||0)+1;});
  const gc = {'A+':col(95),'A':col(85),'B+':col(75),'B':col(65),'C':col(55),'D':col(45),'F':col(20)};
  const passed = students.filter(s=>isPass(s,passMark)).length;
  const pct = total ? Math.round(passed/total*100) : 0;
  const subAvgs = SUBJECTS.map(sub=>total?Math.round(students.reduce((s2,s)=>s2+(s.marks[subKey(sub)]||0),0)/total):0);

  return (
    <div>
      <div className="analytics-grid">
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
        <div className="card">
          <div className="card-hdr"><span className="card-hdr-title">Pass / Fail Ratio</span></div>
          <div className="card-body">
            <div style={{textAlign:'center',marginBottom:10}}>
              <div style={{fontFamily:"'Crimson Pro',serif",fontSize:'2.2rem',fontWeight:600,color:'var(--green)'}}>{pct}%</div>
              <div style={{fontSize:'.74rem',color:'var(--muted)'}}>Pass Rate</div>
            </div>
            <div className="dist-row"><div className="dist-lbl" style={{color:'var(--green)'}}>Pass</div><div className="dist-track"><div className="dist-fill" style={{width:`${pct}%`,background:'var(--green)'}}>{passed} students</div></div><div className="dist-cnt">{passed}</div></div>
            <div className="dist-row" style={{marginTop:7}}><div className="dist-lbl" style={{color:'var(--rose)'}}>Fail</div><div className="dist-track"><div className="dist-fill" style={{width:`${100-pct}%`,background:'var(--rose)'}}>{total-passed>0?`${total-passed} students`:''}</div></div><div className="dist-cnt">{total-passed}</div></div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-hdr"><span className="card-hdr-title">Subject Canvas Chart</span></div>
        <div className="canvas-wrap">
          <BarChart labels={SUBJECTS} values={subAvgs} title="Subject-wise Class Averages" id="an-canvas"/>
        </div>
      </div>
    </div>
  );
}


export default AnalyticsSection;
