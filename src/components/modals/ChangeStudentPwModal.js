import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { validatePwStrength } from '../../utils/helpers';
import { showToast } from '../../utils/toast';
import PwStrengthBar from '../PwStrengthBar';

function ChangeStudentPwModal({ stu, onClose }) {
  const { dispatch } = useApp();
  const [curr, setCurr] = useState('');
  const [nw, setNw] = useState('');
  const [conf, setConf] = useState('');
  const [showCurr, setShowCurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [errs, setErrs] = useState({});

  const save = () => {
    const e = {};
    if (curr !== stu.dob) e.curr = 'Current password is incorrect';
    if (!validatePwStrength(nw)) e.nw = 'Min 8 chars, 1 uppercase, 1 number required';
    if (nw !== conf) e.conf = 'Passwords do not match';
    setErrs(e);
    if (Object.keys(e).length) return;
    dispatch({ type:'UPDATE_STUDENT', student:{ ...stu, dob:nw } });
    showToast('✅ Password changed successfully!','#12c98a');
    onClose();
  };

  return (
    <div className="m-overlay open">
      <div className="modal" style={{maxWidth:420}}>
        <div className="m-title">🔑 Change Password</div>
        <div className="m-sub">Your new password must be at least 8 characters with an uppercase letter and a number.</div>
        <div className="fg">
          <label className="fl">Current Password</label>
          <div className="pw-wrap">
            <input className={`fi${errs.curr?' err':''}`} type={showCurr?'text':'password'} value={curr} onChange={e=>setCurr(e.target.value)} placeholder="Current password"/>
            <button className="pw-toggle" type="button" onClick={()=>setShowCurr(v=>!v)}>{showCurr?'🙈':'👁'}</button>
          </div>
          {errs.curr && <div className="fi-err show">{errs.curr}</div>}
        </div>
        <div className="fg">
          <label className="fl">New Password</label>
          <div className="pw-wrap">
            <input className={`fi${errs.nw?' err':''}`} type={showNew?'text':'password'} value={nw} onChange={e=>setNw(e.target.value)} placeholder="Min 8 chars, 1 uppercase, 1 number"/>
            <button className="pw-toggle" type="button" onClick={()=>setShowNew(v=>!v)}>{showNew?'🙈':'👁'}</button>
          </div>
          <PwStrengthBar pw={nw}/>
          {errs.nw && <div className="fi-err show">{errs.nw}</div>}
        </div>
        <div className="fg">
          <label className="fl">Confirm New Password</label>
          <div className="pw-wrap">
            <input className={`fi${errs.conf?' err':''}`} type={showConf?'text':'password'} value={conf} onChange={e=>setConf(e.target.value)} placeholder="Repeat new password"/>
            <button className="pw-toggle" type="button" onClick={()=>setShowConf(v=>!v)}>{showConf?'🙈':'👁'}</button>
          </div>
          {errs.conf && <div className="fi-err show">{errs.conf}</div>}
        </div>
        <div className="m-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={save}>💾 Save Password</button>
        </div>
      </div>
    </div>
  );
}


export default ChangeStudentPwModal;
