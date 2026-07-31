import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Topbar from '../components/Topbar';
import FacultyForgotPasswordModal from '../components/modals/FacultyForgotPasswordModal';

function AdminLogin() {
  const { state, goTo } = useApp();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [errs, setErrs] = useState({});
  const [mainErr, setMainErr] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);

  const login = () => {
    const e = {};
    if (!user.trim()) e.user = true;
    if (!pass.trim()) e.pass = true;
    setErrs(e);
    setMainErr('');
    if (Object.keys(e).length) return;
    if (user === 'admin' && pass === state.adminPassword) goTo('admin-dash');
    else setMainErr('❌ Invalid credentials.');
  };

  return (
    <div className="page-full">
      <Topbar badge="Admin" badgeClass="badge-a" rightSlot={
        <button className="tb-btn" onClick={()=>goTo('landing')}>← Back</button>
      }/>
      <div className="page-wrap">
        <div className="login-card lc-a">
          <div className="login-logo">🏫</div>
          <div className="login-h">Admin Login</div>
          <div className="login-s">Teacher / Administrator access. Full management permissions.</div>
          <div className="fg">
            <label className="fl">Username</label>
            <input className={`fi vi${errs.user?' err':''}`} value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="admin" autoComplete="username"/>
            {errs.user && <div className="fi-err show">Username is required</div>}
          </div>
          <div className="fg">
            <label className="fl">Password</label>
            <div className="pw-wrap">
              <input className={`fi vi${errs.pass?' err':''}`} type={show?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="••••••••" autoComplete="current-password"/>
              <button className="pw-toggle" type="button" onClick={()=>setShow(v=>!v)}>{show?'🙈':'👁'}</button>
            </div>
            {errs.pass && <div className="fi-err show">Password is required</div>}
          </div>
          <button className="btn-primary" style={{background:'linear-gradient(135deg,var(--violet),var(--blue))'}} onClick={login}>Login to Admin Panel →</button>
          {mainErr && <div className="f-err-main">{mainErr}</div>}
          <div style={{textAlign:'center',marginTop:10}}>
            <button className="fp-link" style={{color:'var(--violet)'}} onClick={()=>setForgotOpen(true)}>🔑 Forgot Password?</button>
          </div>
          <div className="demo-box">Username <strong>admin</strong> / Password <strong>Admin@2024</strong></div>
        </div>
      </div>
      {forgotOpen && <FacultyForgotPasswordModal onClose={()=>setForgotOpen(false)}/>}
    </div>
  );
}


export default AdminLogin;
