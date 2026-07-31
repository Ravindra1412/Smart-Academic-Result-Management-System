import { useState, useMemo, useCallback, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { avg, grade, gClass, isPass, col, debounce } from '../../utils/helpers';
import { SUBJECTS, PAGE_SIZE } from '../../utils/constants';
import { subKey } from '../../utils/helpers';
import { showToast } from '../../utils/toast';
import { exportAdminPDF } from '../../utils/exportUtils';

window.dl = window.dl || function(content, name) {
  const b2 = new Blob([content], {type:'text/csv'}), u = URL.createObjectURL(b2);
  const a = document.createElement('a'); a.href=u; a.download=name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(u);
};

function StudentsSection({ onAdd, onEdit, onView }) {
  const { state, dispatch } = useApp();
  const [q, setQ] = useState('');
  const [filterCls, setFilterCls] = useState('');
  const [sort, setSort] = useState('roll');
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const { students, passMark } = state;

  const classes = useMemo(() => [...new Set(students.map(s=>s.cls))].sort(), [students]);

  const filtered = useMemo(() => {
    let list = students.filter(s =>
      (!q || s.name.toLowerCase().includes(q.toLowerCase()) || s.roll.toLowerCase().includes(q.toLowerCase())) &&
      (!filterCls || s.cls === filterCls)
    );
    if (sort==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
    else if (sort==='avg-d') list.sort((a,b)=>avg(b.marks)-avg(a.marks));
    else if (sort==='avg-a') list.sort((a,b)=>avg(a.marks)-avg(b.marks));
    else list.sort((a,b)=>a.roll.localeCompare(b.roll));
    return list;
  }, [students, q, filterCls, sort]);

  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const searchRef = useRef(null);
  const debouncedSuggest = useCallback(debounce((v) => {
    if (!v) { setSuggestions([]); return; }
    setSuggestions(students.filter(s=>s.name.toLowerCase().includes(v.toLowerCase())||s.roll.toLowerCase().includes(v.toLowerCase())).slice(0,5));
  }, 150), [students]);

  const deleteStudent = (id) => {
    if (!window.confirm('Delete this student permanently?')) return;
    dispatch({ type:'DELETE_STUDENT', id });
    showToast('🗑 Student deleted.', '#f5476b');
  };

  const exportCSV = () => {
    let csv = `Roll,Name,Class,Gender,Category,${SUBJECTS.join(',')},Total,Avg%,Grade,Status\n`;
    students.forEach(s => {
      const mv=SUBJECTS.map(sub=>s.marks[subKey(sub)]||0), tot=mv.reduce((a,b)=>a+b,0), a2=Math.round(tot/SUBJECTS.length);
      csv += `${s.roll},"${s.name}",${s.cls},${s.gender},${s.cat||''},${mv.join(',')},${tot},${a2}%,${grade(a2)},${isPass(s,passMark)?'Pass':'Fail'}\n`;
    });
    window.dl(csv, 'class_results.csv');
  };

  return (
    <div>
      <div className="toolbar">
        <div className="search-wrap">
          <input ref={searchRef} className="s-box" placeholder="🔍 Search name or roll…" value={q} onChange={e=>{setQ(e.target.value);debouncedSuggest(e.target.value);setPage(1);}}
            onBlur={()=>setTimeout(()=>setSuggestions([]),200)}/>
          {suggestions.length>0 && (
            <div className="suggest-box open">
              {suggestions.map(s=>(
                <div key={s.id} className="sug-item" onMouseDown={()=>{setQ(s.roll);setSuggestions([]);}}>
                  <span>{s.name}</span>
                  <span className="sug-roll">{s.roll}</span>
                  <span style={{marginLeft:'auto',fontSize:'.72rem',color:col(avg(s.marks))}}>{avg(s.marks)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <select className="f-sel" value={filterCls} onChange={e=>{setFilterCls(e.target.value);setPage(1);}}>
          <option value="">All Classes</option>
          {classes.map(c=><option key={c}>{c}</option>)}
        </select>
        <select className="f-sel" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="roll">Sort: Roll</option>
          <option value="name">Sort: Name A-Z</option>
          <option value="avg-d">Sort: Marks ↓</option>
          <option value="avg-a">Sort: Marks ↑</option>
        </select>
        <button className="btn-out" onClick={exportCSV}>📥 CSV</button>
        <button className="btn-out" onClick={()=>exportAdminPDF(state.students,state.schoolName,state.academicYear,state.passMark)}>📄 PDF</button>
        <button className="btn-add" onClick={onAdd}>＋ Add Student</button>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>Roll</th><th>Name</th><th>Class</th><th>Gender</th><th>Category</th><th>Avg %</th><th>Grade</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {paged.length ? paged.map((s,i) => {
              const a=avg(s.marks), g2=grade(a), p=isPass(s,passMark);
              return (
                <tr key={s.id} style={{animationDelay:`${i*.03}s`}}>
                  <td style={{fontFamily:'var(--mono)',fontSize:'.76rem',color:'var(--blue)'}}>{s.roll}</td>
                  <td style={{fontWeight:600}}>{s.name}</td>
                  <td>{s.cls}</td>
                  <td style={{color:'var(--muted)'}}>{s.gender}</td>
                  <td style={{color:'var(--muted)',fontSize:'.76rem'}}>{s.cat||''}</td>
                  <td style={{color:col(a),fontWeight:700}}>{a}%</td>
                  <td><span className={`gbadge ${gClass(g2)}`}>{g2}</span></td>
                  <td><span className="st-dot" style={{background:p?col(90):col(20)}}/>{p?'Pass':'Fail'}</td>
                  <td>
                    <button className="act-btn v" onClick={()=>onView(s.id)}>👁</button>
                    <button className="act-btn e" onClick={()=>onEdit(s.id)}>✏</button>
                    <button className="act-btn d" onClick={()=>deleteStudent(s.id)}>🗑</button>
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={9} style={{textAlign:'center',color:'var(--muted)',padding:28}}>No students found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="pag">
          <span className="pag-info">Showing {paged.length} of {filtered.length}</span>
          <button className="pag-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>←</button>
          {Array.from({length:pages},(_,i)=>(
            <button key={i+1} className={`pag-btn${page===i+1?' on':''}`} onClick={()=>setPage(i+1)}>{i+1}</button>
          ))}
          <button className="pag-btn" disabled={page===pages} onClick={()=>setPage(p=>p+1)}>→</button>
        </div>
      )}
    </div>
  );
}


export default StudentsSection;
