import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { avg, grade, gClass, col } from '../../utils/helpers';

function QuickSearchSection({ onView }) {
  const { state } = useApp();
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    if (!q.trim()) return [];
    return state.students.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())||s.roll.toLowerCase().includes(q.toLowerCase())||s.cls.toLowerCase().includes(q.toLowerCase()));
  }, [q, state.students]);

  return (
    <div>
      <div className="settings-card anim-fadeUp">
        <div className="fg"><label className="fl">Search Student</label><input className="fi" placeholder="Name, roll or class…" value={q} onChange={e=>setQ(e.target.value)}/></div>
      </div>
      {results.length > 0 && (
        <div className="card anim-fadeIn">
          <table>
            <thead><tr><th>Roll</th><th>Name</th><th>Class</th><th>Avg</th><th>Grade</th><th>Actions</th></tr></thead>
            <tbody>
              {results.map((s,i) => {
                const a=avg(s.marks), g2=grade(a);
                return (
                  <tr key={s.id} style={{animationDelay:`${i*.04}s`}}>
                    <td style={{fontFamily:'var(--mono)',color:'var(--blue)',fontSize:'.76rem'}}>{s.roll}</td>
                    <td>{s.name}</td><td>{s.cls}</td>
                    <td style={{color:col(a),fontWeight:700}}>{a}%</td>
                    <td><span className={`gbadge ${gClass(g2)}`}>{g2}</span></td>
                    <td><button className="act-btn v" onClick={()=>onView(s.id)}>👁 View</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {q && results.length===0 && <div style={{color:'var(--muted)',fontSize:'.84rem',padding:20}}>No results found.</div>}
    </div>
  );
}


export default QuickSearchSection;
