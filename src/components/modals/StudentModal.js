import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECTS } from '../../utils/constants';
import { subKey } from '../../utils/helpers';
import { genAtt } from '../../utils/attendance';
import { showToast } from '../../utils/toast';
import { addNotif } from '../../utils/notifications';

function StudentModal({ editId, onClose }) {
  const { state, dispatch } = useApp();
  const editing = editId ? state.students.find(s=>s.id===editId) : null;
  const [form, setForm] = useState(editing ? {
    name:editing.name, roll:editing.roll, cls:editing.cls, dob:editing.dob,
    gender:editing.gender, cat:editing.cat||'General', email:editing.email||'', phone:editing.phone||''
  } : { name:'', roll:'', cls:'', dob:'', gender:'Male', cat:'General', email:'', phone:'' });
  const [errs, setErrs] = useState({});

  const set = (k, v) => setForm(f=>({...f,[k]:v}));
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.roll.trim()) e.roll = 'Required';
    if (!form.cls.trim()) e.cls = 'Required';
    if (!/^\d{4}$/.test(form.dob)||+form.dob<1990||+form.dob>2015) e.dob = 'Enter a valid birth year (1990–2015)';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Invalid 10-digit number';
    return e;
  };

  const save = () => {
    const e = validate();
    setErrs(e);
    if (Object.keys(e).length) { showToast('⚠ Please fix highlighted errors.','#f5a623'); return; }
    if (editing) {
      dispatch({ type:'UPDATE_STUDENT', student:{ ...editing, ...form, roll:form.roll.toUpperCase() } });
      showToast('✅ Student updated!');
    } else {
      const dm = {}; SUBJECTS.forEach(sub=>dm[subKey(sub)]=0);
      dispatch({ type:'ADD_STUDENT', student:{ id:state.nextId, ...form, roll:form.roll.toUpperCase(), marks:dm, att:genAtt(.85) } });
      dispatch({ type:'INC_NEXT_ID' });
      addNotif('New Student Enrolled',`${form.name} (${form.roll.toUpperCase()}) added to Class ${form.cls}.`,'🎓','admin');
      showToast('✅ Student added!');
    }
    onClose();
  };

  return (
    <div className="m-overlay open">
      <div className="modal">
        <div className="m-title">{editing?'Edit Student':'Add New Student'}</div>
        <div className="m-sub">{editing?'Update student information.':'Fill in all required (*) fields.'}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          {[['name','Name *'],['roll','Roll No *'],['cls','Class *'],['dob','Birth Year *']].map(([k,l])=>(
            <div key={k} className="fg">
              <label className="fl">{l}</label>
              <input className={`fi${errs[k]?' err':''}`} value={form[k]} onChange={e=>set(k,e.target.value)}/>
              {errs[k] && <div className="fi-err show">{errs[k]}</div>}
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div className="fg">
            <label className="fl">Gender</label>
            <select className="fi" value={form.gender} onChange={e=>set('gender',e.target.value)}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <div className="fg">
            <label className="fl">Category</label>
            <select className="fi" value={form.cat} onChange={e=>set('cat',e.target.value)}>
              <option>General</option><option>OBC</option><option>SC</option><option>ST</option>
            </select>
          </div>
        </div>
        <div className="fg">
          <label className="fl">Email</label>
          <input className={`fi${errs.email?' err':''}`} type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="student@school.edu"/>
          {errs.email && <div className="fi-err show">{errs.email}</div>}
        </div>
        <div className="fg">
          <label className="fl">Phone</label>
          <input className={`fi${errs.phone?' err':''}`} type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="10-digit number" maxLength={10}/>
          {errs.phone && <div className="fi-err show">{errs.phone}</div>}
        </div>
        <div className="m-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={save}>💾 {editing?'Update':'Save'} Student</button>
        </div>
      </div>
    </div>
  );
}


export default StudentModal;
