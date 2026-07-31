import { useApp } from '../../context/AppContext';
import { avg, grade, gClass, isPass, getRank, col } from '../../utils/helpers';
import { MAX_MARK } from '../../utils/constants';
import { buildStudentPDF } from '../../utils/exportUtils';

function ViewStudentModal({ stuId, onClose }) {
  const { state } = useApp();
  const s = state.students.find(x=>x.id===stuId);
  if (!s) return null;
  const a=avg(s.marks), g2=grade(a), p=isPass(s,state.passMark);
  return (
    <div className="m-overlay open">
      <div className="modal" style={{maxWidth:580}}>
        <div className="m-title">{s.name}</div>
        <div className="m-sub">{s.roll} · {s.cls} · {s.gender} · {s.cat||'General'} · {s.email||'N/A'}</div>
        <div className="stat-grid">
          <div className="stat-card"><div className="sc-lbl">Average</div><div className="sc-val" style={{color:col(a)}}>{a}%</div></div>
          <div className="stat-card"><div className="sc-lbl">Grade</div><div className="sc-val">{g2}</div></div>
          <div className="stat-card"><div className="sc-lbl">Status</div><div className="sc-val" style={{fontSize:'1.1rem'}}>{p?'✅ Pass':'❌ Fail'}</div></div>
          <div className="stat-card"><div className="sc-lbl">Rank</div><div className="sc-val">#{getRank(s, state.students)}</div></div>
        </div>
        <table>
          <thead><tr><th>Subject</th><th>Marks</th><th>%</th><th>Grade</th><th>Status</th></tr></thead>
          <tbody>
            {Object.keys(s.marks).map(k=>{
              const m=s.marks[k], pct=Math.round(m/MAX_MARK*100), g3=grade(pct);
              return (
                <tr key={k}>
                  <td>{k.replace(/([A-Z])/g,' $1').trim()}</td>
                  <td style={{fontWeight:700}}>{m}/{MAX_MARK}</td>
                  <td style={{color:col(pct),fontWeight:700}}>{pct}%</td>
                  <td><span className={`gbadge ${gClass(g3)}`}>{g3}</span></td>
                  <td style={{color:m>=state.passMark?'var(--green)':'var(--rose)',fontWeight:600}}>{m>=state.passMark?'✅ Pass':'❌ Fail'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="m-actions">
          <button className="btn-cancel" onClick={onClose}>Close</button>
          <button className="btn-save" onClick={()=>buildStudentPDF(s,state.schoolName,state.academicYear,state.passMark,state.students)}>📄 PDF</button>
        </div>
      </div>
    </div>
  );
}


export default ViewStudentModal;
