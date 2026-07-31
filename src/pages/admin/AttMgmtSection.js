import { useState, useEffect, useMemo, useReducer } from 'react';
import { useApp } from '../../context/AppContext';
import { ensureAtt } from '../../utils/attendance';
import { ATT_MONTHS, ATT_YEAR } from '../../utils/constants';
import { showToast } from '../../utils/toast';
import AttendanceView from '../../components/AttendanceView';

window.dl = window.dl || function(content, name) {
  const b2 = new Blob([content], {type:'text/csv'}), u = URL.createObjectURL(b2);
  const a = document.createElement('a'); a.href=u; a.download=name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(u);
};

function AttMgmtSection() {
  const { state, dispatch } = useApp();
  const [stuId, setStuId] = useState('');
  const [, forceUpdate] = useReducer(x=>x+1, 0);
  const stu = useMemo(() => state.students.find(s=>s.id===+stuId), [state.students, stuId]);

  useEffect(() => { if (stu) ensureAtt(stu); }, [stu]);

  const save = () => {
    if (!stu) { showToast('⚠ Select a student first','#f5a623'); return; }
    dispatch({ type:'UPDATE_STUDENT', student:{...stu} });
    showToast(`✅ Attendance saved for ${stu.name}!`,'#00d4b4');
  };

  const exportCSV = () => {
    if (!stu) return;
    let csv = `Student: ${stu.name} (${stu.roll})\nMonth,Working Days,Present,Absent,Holiday,%\n`;
    ATT_MONTHS.forEach((mn,mi)=>{
      const md=stu.att[mi]||[], wd=md.filter(x=>x!=='w');
      const p=wd.filter(x=>x==='p').length, ab=wd.filter(x=>x==='a').length, h=wd.filter(x=>x==='h').length;
      csv += `${mn} ${ATT_YEAR},${wd.length},${p},${ab},${h},${wd.length?Math.round(p/wd.length*100):0}%\n`;
    });
    window.dl(csv, `${stu.roll}_attendance.csv`);
  };

  return (
    <div>
      <div style={{display:'flex',gap:12,marginBottom:14,flexWrap:'wrap',alignItems:'center'}}>
        <div className="fg" style={{margin:0,flex:1,minWidth:200}}>
          <select className="fi vi" value={stuId} onChange={e=>setStuId(e.target.value)}>
            <option value="">-- Select Student --</option>
            {state.students.map(s=><option key={s.id} value={s.id}>{s.roll} — {s.name} ({s.cls})</option>)}
          </select>
        </div>
        <button className="btn-save" onClick={save}>💾 Save Attendance</button>
        <button className="btn-out" onClick={exportCSV}>📥 Export CSV</button>
      </div>
      {stu ? (
        <AttendanceView stu={stu} readonly={false} onUpdate={forceUpdate}/>
      ) : (
        <div style={{color:'var(--muted)',fontSize:'.88rem',padding:40,textAlign:'center',animation:'fadeIn .4s ease'}}>
          ☝️ Select a student above to manage their attendance.
        </div>
      )}
    </div>
  );
}


export default AttMgmtSection;
