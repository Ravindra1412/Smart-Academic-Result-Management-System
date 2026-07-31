import { useState } from 'react';
import { showToast } from '../../utils/toast';
import PwStrengthBar from '../PwStrengthBar';

const SECURITY_QUESTIONS = [
  "What is your mother's first name?",
  "What city were you born in?",
  "What is the name of your primary school?",
  "What is your favourite colour?",
];

function ForgotPasswordModal({ onClose, students, onPasswordReset }) {
  const [step, setStep] = useState(1); // 1=find account, 2=security question, 3=reset
  const [roll, setRoll] = useState('');
  const [foundStu, setFoundStu] = useState(null);
  const [answer, setAnswer] = useState('');
  const [secQ, setSecQ] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const [err, setErr] = useState('');
  const [showNew, setShowNew] = useState(false);

  // For demo: security question stored in student record (or use birth year as fallback)
  const findAccount = () => {
    setErr('');
    if (!roll.trim()) { setErr('Please enter your roll number.'); return; }
    const stu = students.find(s=>s.roll===roll.trim().toUpperCase());
    if (!stu) { setErr('❌ No account found with this roll number.'); return; }
    setFoundStu(stu);
    // Pick a security question (we derive it from student data for demo)
    setSecQ(SECURITY_QUESTIONS[stu.id % SECURITY_QUESTIONS.length]);
    setStep(2);
  };

  const verifyAnswer = () => {
    setErr('');
    if (!answer.trim()) { setErr('Please provide an answer.'); return; }
    // Demo: accept the student's DOB year as the answer (simulating stored answer)
    if (answer.trim() !== foundStu.dob) {
      setErr('❌ Incorrect answer. (Hint: Try your birth year)'); return;
    }
    setStep(3);
  };

  const resetPassword = () => {
    setErr('');
    if (!newPass.trim() || newPass.length < 4) { setErr('Password must be at least 4 characters.'); return; }
    if (newPass !== confPass) { setErr('❌ Passwords do not match.'); return; }
    onPasswordReset(foundStu.id, newPass);
    showToast('✅ Password reset successfully!', '#12c98a');
    onClose();
  };

  const stepLabels = ['Find Account', 'Verify Identity', 'Reset Password'];

  return (
    <div className="m-overlay open" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:460}}>
        <div className="m-title">🔑 Forgot Password</div>
        <div className="m-sub">Reset your student account password</div>

        {/* Step indicator */}
        <div className="fp-steps">
          {stepLabels.map((lbl,i)=>(
            <div key={i} className={`fp-step${step>i+1?' done':step===i+1?' active':''}`}>
              <div className="fp-step-num">{step>i+1?'✓':i+1}</div>
              <div className="fp-step-lbl">{lbl}</div>
            </div>
          ))}
        </div>

        {step===1 && (
          <>
            <div className="fg">
              <label className="fl">Roll Number</label>
              <input className="fi" value={roll} onChange={e=>setRoll(e.target.value)} onKeyDown={e=>e.key==='Enter'&&findAccount()} placeholder="e.g. STU001" autoFocus/>
            </div>
            {err && <div className="f-err-main">{err}</div>}
            <div className="m-actions">
              <button className="btn-cancel" onClick={onClose}>Cancel</button>
              <button className="btn-primary" onClick={findAccount}>Find Account →</button>
            </div>
          </>
        )}

        {step===2 && foundStu && (
          <>
            <div style={{background:'rgba(77,141,255,.07)',border:'1px solid rgba(77,141,255,.18)',borderRadius:'var(--rs)',padding:'10px 14px',marginBottom:14,fontSize:'.8rem',color:'var(--ink2)'}}>
              Found: <strong style={{color:'var(--ink)'}}>{foundStu.name}</strong> · {foundStu.roll} · Class {foundStu.cls}
            </div>
            <div className="fg">
              <label className="fl">Security Question</label>
              <div style={{padding:'10px 14px',background:'var(--surf2)',border:'1px solid var(--border)',borderRadius:'var(--rs)',fontSize:'.84rem',color:'var(--ink2)',marginBottom:10}}>{secQ}</div>
              <input className="fi" value={answer} onChange={e=>setAnswer(e.target.value)} onKeyDown={e=>e.key==='Enter'&&verifyAnswer()} placeholder="Your answer…" autoFocus/>
              <div style={{fontSize:'.68rem',color:'var(--muted)',marginTop:5}}>💡 Demo tip: enter your birth year as the answer</div>
            </div>
            {err && <div className="f-err-main">{err}</div>}
            <div className="m-actions">
              <button className="btn-cancel" onClick={()=>{setStep(1);setErr('');}}>← Back</button>
              <button className="btn-primary" onClick={verifyAnswer}>Verify →</button>
            </div>
          </>
        )}

        {step===3 && (
          <>
            <div style={{background:'rgba(18,201,138,.07)',border:'1px solid rgba(18,201,138,.2)',borderRadius:'var(--rs)',padding:'10px 14px',marginBottom:14,fontSize:'.8rem',color:'var(--green)'}}>
              ✅ Identity verified! Set a new password for <strong>{foundStu.name}</strong>
            </div>
            <div className="fg">
              <label className="fl">New Password</label>
              <div className="pw-wrap">
                <input className="fi" type={showNew?'text':'password'} value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="New password (min 4 chars)" autoFocus/>
                <button className="pw-toggle" type="button" onClick={()=>setShowNew(v=>!v)}>{showNew?'🙈':'👁'}</button>
              </div>
              {newPass && <PwStrengthBar pw={newPass}/>}
            </div>
            <div className="fg">
              <label className="fl">Confirm New Password</label>
              <input className="fi" type="password" value={confPass} onChange={e=>setConfPass(e.target.value)} placeholder="Repeat new password"/>
            </div>
            {err && <div className="f-err-main">{err}</div>}
            <div className="m-actions">
              <button className="btn-cancel" onClick={()=>{setStep(2);setErr('');}}>← Back</button>
              <button className="btn-primary" onClick={resetPassword}>🔑 Reset Password</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


export default ForgotPasswordModal;
