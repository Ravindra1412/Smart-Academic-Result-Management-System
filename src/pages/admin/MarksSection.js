import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { avg, grade, col, subKey } from '../../utils/helpers';
import { SUBJECTS, MAX_MARK } from '../../utils/constants';
import { showToast } from '../../utils/toast';
import { addNotif } from '../../utils/notifications';
import { buildStudentPDF } from '../../utils/exportUtils';

function MarksSection() {
  const { state, dispatch } = useApp();
  const [stuId, setStuId] = useState('');
  const [markVals, setMarkVals] = useState({});
  const [preview, setPreview] = useState(null);

  const stu = useMemo(() => state.students.find(s=>s.id===+stuId), [state.students, stuId]);

  useEffect(() => {
    if (stu) {
      const mv = {};
      SUBJECTS.forEach(sub => { mv[subKey(sub)] = stu.marks[subKey(sub)] || 0; });
      setMarkVals(mv);
    }
<<<<<<< HEAD
  }, [stuId, stu]);
=======
  }, [stuId]);
>>>>>>> 1577d48b09c347b2669b8c8e2822163553912a68

  useEffect(() => {
    if (!stu) { setPreview(null); return; }
    const vals = Object.values(markVals).map(Number);
    const tot = vals.reduce((a,b)=>a+b, 0);
    const a2 = SUBJECTS.length ? Math.round(tot/SUBJECTS.length) : 0;
    setPreview({ tot, a2, g: grade(a2) });
  }, [markVals, stu]);

  const save = () => {
    if (!stu) return;
    const invalid = Object.entries(markVals).some(([,v])=>+v<0||+v>MAX_MARK||isNaN(+v));
    if (invalid) { showToast('⚠ Fix mark values first.','#f5a623'); return; }
    const updated = { ...stu, marks: Object.fromEntries(Object.entries(markVals).map(([k,v])=>[k,+v])) };
    dispatch({ type:'UPDATE_STUDENT', student: updated });
    addNotif(`Marks Updated`,`${stu.name}'s marks have been saved (Avg: ${Object.values(markVals).reduce((a,b)=>+a+ +b,0)/SUBJECTS.length|0}%).`,'📝','academic');
    showToast(`✅ Marks saved for ${stu.name}!`, '#12c98a');
  };

  return (
    <div className="marks-card anim-fadeUp">
      <div className="fg">
        <label className="fl">Select Student</label>
        <select className="fi vi" value={stuId} onChange={e=>setStuId(e.target.value)}>
          <option value="">-- Choose Student --</option>
          {state.students.map(s=><option key={s.id} value={s.id}>{s.roll} — {s.name} ({s.cls})</option>)}
        </select>
      </div>
      {stu && (
        <>
          <div style={{fontSize:'.8rem',color:'var(--ink2)',padding:'8px 0'}}>
            Current Avg: <strong style={{color:col(avg(stu.marks))}}>{avg(stu.marks)}%</strong> · Grade: <strong>{grade(avg(stu.marks))}</strong>
          </div>
          <div className="mk-grid">
            {SUBJECTS.map(sub => {
              const k = subKey(sub);
              const v = markVals[k] ?? 0;
              const err = +v < 0 || +v > MAX_MARK;
              return (
                <div key={k} className="fg">
                  <label className="fl">{sub}</label>
                  <input className={`fi vi${err?' err':''}`} type="number" min={0} max={MAX_MARK} value={v}
                    onChange={e=>setMarkVals(prev=>({...prev,[k]:e.target.value}))}/>
                  {err && <div className="fi-err show">Must be 0–{MAX_MARK}</div>}
                </div>
              );
            })}
          </div>
          {preview && (
            <div className="mk-preview">
              Preview → Avg: <strong style={{color:col(preview.a2)}}>{preview.a2}%</strong> · Grade: <strong>{preview.g}</strong> · Total: <strong>{preview.tot}/{SUBJECTS.length*MAX_MARK}</strong>
            </div>
          )}
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <button className="btn-save" onClick={save}>💾 Save Marks</button>
            <button className="btn-out" onClick={()=>buildStudentPDF(stu,state.schoolName,state.academicYear,state.passMark,state.students)}>📄 PDF Report</button>
          </div>
        </>
      )}
    </div>
  );
}


export default MarksSection;
