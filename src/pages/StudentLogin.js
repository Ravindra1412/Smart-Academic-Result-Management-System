import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { addNotif } from '../utils/notifications';
import Topbar from '../components/Topbar';
import ForgotPasswordModal from '../components/modals/ForgotPasswordModal';

function StudentLogin() {
  const { state, dispatch, goTo } = useApp();
  const [roll, setRoll] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errs, setErrs] = useState({});
  const [mainErr, setMainErr] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);

  const handlePasswordReset = (stuId, newPass) => {
    const updated = state.students.find(s=>s.id===stuId);
    if (updated) {
      dispatch({ type:'UPDATE_STUDENT', student:{...updated, dob: newPass} });
    }
  };

  const login = () => {
    const e = {};
    if (!roll.trim()) e.roll = true;
    if (!pass.trim()) e.pass = true;
    setErrs(e);
    if (Object.keys(e).length) return;
    const stu = state.students.find(s => s.roll === roll.trim().toUpperCase() && s.dob === pass.trim());
    if (!stu) { setMainErr('❌ Invalid roll number or password.'); return; }
    dispatch({ type:'SET_CURRENT_STU', student: stu });
    addNotif('Student Login',`${stu.name} logged in successfully.`,'🎓','admin');
    // Auto-warn if attendance < 75%
    const _attP=stu.att.flat().filter(x=>x==='p').length, _attD=stu.att.flat().filter(x=>x!=='w').length;
    const _attPct=_attD?Math.round(_attP/_attD*100):100;
    if(_attPct<75) addNotif('Low Attendance Warning',`${stu.name}'s attendance is ${_attPct}% — below the 75% requirement.`,'⚠️','alert');
    goTo('student-dash');
  };

  return (
    <div className="page-full">
      <Topbar badge="Student" badgeClass="badge-s" rightSlot={
        <button className="tb-btn" onClick={() => goTo('landing')}>← Back</button>
      }/>
      <div className="page-wrap">
        <div className="login-card lc-s">
          <div className="login-logo">🎓</div>
          <div className="login-h">Student Login</div>
          <div className="login-s">Enter your roll number and date of birth year to access your results.</div>
          <div className="fg">
            <label className="fl">Roll Number</label>
            <input className={`fi${errs.roll?' err':''}`} value={roll} onChange={e=>setRoll(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="e.g. STU001"/>
            {errs.roll && <div className="fi-err show">Roll number is required</div>}
          </div>
          <div className="fg">
            <label className="fl">Password (Birth Year)</label>
            <div className="pw-wrap">
              <input className={`fi${errs.pass?' err':''}`} type={showPass?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="e.g. 2003"/>
              <button className="pw-toggle" type="button" onClick={() => setShowPass(v=>!v)}>{showPass?'🙈':'👁'}</button>
            </div>
            {errs.pass && <div className="fi-err show">Password is required</div>}
          </div>
          <button className="btn-primary" onClick={login}>View My Results →</button>
          {mainErr && <div className="f-err-main">{mainErr}</div>}
          <div style={{textAlign:'center',marginTop:10}}>
            <button className="fp-link" onClick={()=>setForgotOpen(true)}>🔑 Forgot Password?</button>
          </div>
          <div className="demo-box">
            Roll <strong>STU001</strong> / Pass <strong>2003</strong> &nbsp;·&nbsp;
            Roll <strong>STU002</strong> / Pass <strong>2004</strong><br/>
            Roll <strong>STU003</strong> / Pass <strong>2002</strong>
          </div>
        </div>
      </div>
      {forgotOpen && <ForgotPasswordModal onClose={()=>setForgotOpen(false)} students={state.students} onPasswordReset={handlePasswordReset}/>}
    </div>
  );
}


export default StudentLogin;
