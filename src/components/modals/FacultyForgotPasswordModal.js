import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { validatePwStrength } from '../../utils/helpers';
import { Storage } from '../../utils/helpers';
import { SK } from '../../utils/constants';
import { showToast } from '../../utils/toast';
import { addNotif } from '../../utils/notifications';
import PwStrengthBar from '../PwStrengthBar';

const FACULTY_SECURITY_QUESTIONS = [
  { q: "What is the name of the school where you currently teach?", hint: "Try your school name" },
  { q: "What subject do you primarily teach?", hint: "Try your main subject" },
  { q: "What year did you join this institution?", hint: "Try the academic year (e.g. 2024)" },
  { q: "What is the admin recovery code?", hint: "Default code is: ADMIN2024" },
];
// The correct answers to Faculty security questions (for demo, fixed answers)
const FACULTY_SEC_ANSWERS = ["Government Higher Secondary School", "All Subjects", "2024", "ADMIN2024"];

function FacultyForgotPasswordModal({ onClose }) {
  const { state, dispatch } = useApp();
  const [step, setStep] = useState(1); // 1=verify username, 2=security question, 3=reset
  const [username, setUsername] = useState('');
  const [qIdx, setQIdx] = useState(null);
  const [answer, setAnswer] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confPw, setConfPw] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [err, setErr] = useState('');

  const verifyUsername = () => {
    setErr('');
    if (!username.trim()) { setErr('Please enter your username.'); return; }
    if (username.trim().toLowerCase() !== 'admin') { setErr('❌ No faculty account found with this username.'); return; }
    // Pick a random security question
    const idx = Math.floor(Math.random() * FACULTY_SECURITY_QUESTIONS.length);
    setQIdx(idx);
    setStep(2);
  };

  const verifyAnswer = () => {
    setErr('');
    if (!answer.trim()) { setErr('Please provide an answer.'); return; }
    const correct = FACULTY_SEC_ANSWERS[qIdx];
    if (answer.trim().toLowerCase() !== correct.toLowerCase()) {
      setErr(`❌ Incorrect answer. (${FACULTY_SECURITY_QUESTIONS[qIdx].hint})`);
      return;
    }
    setStep(3);
  };

  const resetPassword = () => {
    setErr('');
    if (!validatePwStrength(newPw)) { setErr('Password must be 8+ chars, include an uppercase letter and a number.'); return; }
    if (newPw !== confPw) { setErr('❌ Passwords do not match.'); return; }
    dispatch({ type:'SET_SETTINGS', settings:{ adminPassword: newPw } });
    Storage.save(SK.adminPw, newPw);
    addNotif('Admin Password Reset', 'Faculty/Admin password was reset via the Forgot Password flow.', '🔑', 'admin');
    showToast('✅ Faculty password reset successfully!', '#12c98a');
    onClose();
  };

  const stepLabels = ['Verify Username', 'Security Question', 'New Password'];

  return (
    <div className="m-overlay open" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:480}}>
        <div className="m-title" style={{background:'linear-gradient(135deg,var(--violet),var(--blue))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
          🔑 Faculty Password Reset
        </div>
        <div className="m-sub">Securely reset your admin / faculty account password</div>

        {/* Step indicator */}
        <div className="fp-steps">
          {stepLabels.map((lbl,i)=>(
            <div key={i} className={`fp-step${step>i+1?' done':step===i+1?' active':''}`}>
              <div className="fp-step-num" style={step===i+1?{background:'var(--violet)',borderColor:'var(--violet)'}:{}}>{step>i+1?'✓':i+1}</div>
              <div className="fp-step-lbl">{lbl}</div>
            </div>
          ))}
        </div>

        {step===1 && (
          <>
            <div style={{background:'rgba(157,111,245,.07)',border:'1px solid rgba(157,111,245,.2)',borderRadius:'var(--rs)',padding:'10px 14px',marginBottom:16,fontSize:'.78rem',color:'var(--ink2)',lineHeight:1.6}}>
              🏫 This is the faculty / administrator password reset. Enter your admin username to begin.
            </div>
            <div className="fg">
              <label className="fl">Admin Username</label>
              <input className="fi vi" value={username} onChange={e=>setUsername(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&verifyUsername()} placeholder="e.g. admin" autoFocus/>
            </div>
            {err && <div className="f-err-main">{err}</div>}
            <div className="m-actions">
              <button className="btn-cancel" onClick={onClose}>Cancel</button>
              <button className="btn-primary" style={{background:'linear-gradient(135deg,var(--violet),var(--blue))'}} onClick={verifyUsername}>Continue →</button>
            </div>
          </>
        )}

        {step===2 && qIdx!==null && (
          <>
            <div style={{background:'rgba(157,111,245,.07)',border:'1px solid rgba(157,111,245,.2)',borderRadius:'var(--rs)',padding:'10px 14px',marginBottom:14,fontSize:'.8rem',color:'var(--ink2)'}}>
              Account found: <strong style={{color:'var(--ink)'}}>admin</strong> · Faculty / Administrator
            </div>
            <div className="fg">
              <label className="fl">Security Question</label>
              <div style={{padding:'11px 14px',background:'var(--surf2)',border:'1px solid var(--border)',borderRadius:'var(--rs)',fontSize:'.84rem',color:'var(--ink2)',marginBottom:10,lineHeight:1.6}}>
                {FACULTY_SECURITY_QUESTIONS[qIdx].q}
              </div>
              <input className="fi vi" value={answer} onChange={e=>setAnswer(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&verifyAnswer()} placeholder="Your answer…" autoFocus/>
              <div style={{fontSize:'.68rem',color:'var(--muted)',marginTop:5}}>
                💡 Demo tip: {FACULTY_SECURITY_QUESTIONS[qIdx].hint}
              </div>
            </div>
            {err && <div className="f-err-main">{err}</div>}
            <div className="m-actions">
              <button className="btn-cancel" onClick={()=>{setStep(1);setErr('');setAnswer('');}}>← Back</button>
              <button className="btn-primary" style={{background:'linear-gradient(135deg,var(--violet),var(--blue))'}} onClick={verifyAnswer}>Verify →</button>
            </div>
          </>
        )}

        {step===3 && (
          <>
            <div style={{background:'rgba(18,201,138,.07)',border:'1px solid rgba(18,201,138,.2)',borderRadius:'var(--rs)',padding:'10px 14px',marginBottom:16,fontSize:'.8rem',color:'var(--green)'}}>
              ✅ Identity verified! Set a strong new password for the admin account.
            </div>
            <div className="fg">
              <label className="fl">New Password</label>
              <div className="pw-wrap">
                <input className="fi vi" type={showNew?'text':'password'} value={newPw}
                  onChange={e=>setNewPw(e.target.value)} placeholder="Min 8 chars, 1 uppercase, 1 number" autoFocus/>
                <button className="pw-toggle" type="button" onClick={()=>setShowNew(v=>!v)}>{showNew?'🙈':'👁'}</button>
              </div>
              {newPw && <PwStrengthBar pw={newPw}/>}
            </div>
            <div className="fg">
              <label className="fl">Confirm New Password</label>
              <div className="pw-wrap">
                <input className="fi vi" type={showConf?'text':'password'} value={confPw}
                  onChange={e=>setConfPw(e.target.value)} placeholder="Repeat new password"/>
                <button className="pw-toggle" type="button" onClick={()=>setShowConf(v=>!v)}>{showConf?'🙈':'👁'}</button>
              </div>
            </div>
            {err && <div className="f-err-main">{err}</div>}
            <div className="m-actions">
              <button className="btn-cancel" onClick={()=>{setStep(2);setErr('');}}>← Back</button>
              <button className="btn-primary" style={{background:'linear-gradient(135deg,var(--violet),var(--blue))'}} onClick={resetPassword}>🔑 Reset Password</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


export default FacultyForgotPasswordModal;
