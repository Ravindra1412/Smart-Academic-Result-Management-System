import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Storage, validatePwStrength } from '../../utils/helpers';
import { SK } from '../../utils/constants';
import { showToast } from '../../utils/toast';
import { addNotif, markAllNotifRead, clearAllNotifs } from '../../utils/notifications';
import PwStrengthBar from '../../components/PwStrengthBar';

function SettingsSection() {
  const { state, dispatch } = useApp();
  const [school, setSchool] = useState(state.schoolName);
  const [year, setYear] = useState(state.academicYear);
  const [pass, setPass] = useState(state.passMark);
  const [currPw, setCurrPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confPw, setConfPw] = useState('');

  const saveSettings = () => {
    dispatch({ type:'SET_SETTINGS', settings:{ schoolName:school, academicYear:year, passMark:+pass } });
    Storage.save(SK.settings, { schoolName:school, academicYear:year, passMark:+pass });
    showToast('✅ Settings saved!', '#12c98a');
  };

  const changePw = () => {
    if (currPw !== state.adminPassword) { showToast('❌ Current password incorrect','#f5476b'); return; }
    if (!validatePwStrength(newPw)) { showToast('⚠ Password must be 8+ chars, 1 uppercase, 1 number','#f5a623'); return; }
    if (newPw !== confPw) { showToast('⚠ Passwords do not match','#f5a623'); return; }
    dispatch({ type:'SET_SETTINGS', settings:{ adminPassword:newPw } });
    Storage.save(SK.adminPw, newPw);
    setCurrPw(''); setNewPw(''); setConfPw('');
    showToast('✅ Admin password updated!', '#12c98a');
  };

  return (
    <div>
      <div className="settings-card anim-fadeUp">
        <div className="settings-title">School Information</div>
        <div className="fg"><label className="fl">School Name</label><input className="fi" value={school} onChange={e=>setSchool(e.target.value)}/></div>
        <div className="fg"><label className="fl">Academic Year</label><input className="fi" value={year} onChange={e=>setYear(e.target.value)}/></div>
        <div className="fg"><label className="fl">Passing Marks (out of 100)</label><input className="fi" type="number" min={1} max={100} value={pass} onChange={e=>setPass(e.target.value)}/></div>
        <button className="btn-save" onClick={saveSettings}>💾 Save Settings</button>
      </div>
      <div className="settings-card anim-fadeUp" style={{animationDelay:'.1s'}}>
        <div className="settings-title">🔑 Change Admin Password</div>
        <div className="fg"><label className="fl">Current Password</label><input className="fi vi" type="password" value={currPw} onChange={e=>setCurrPw(e.target.value)} placeholder="Current password"/></div>
        <div className="fg"><label className="fl">New Password</label><input className="fi vi" type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="Min 8 chars"/><PwStrengthBar pw={newPw}/></div>
        <div className="fg"><label className="fl">Confirm Password</label><input className="fi vi" type="password" value={confPw} onChange={e=>setConfPw(e.target.value)} placeholder="Repeat new password"/></div>
        <button className="btn-save" onClick={changePw}>Update Password</button>
      </div>
      <div className="settings-card anim-fadeUp" style={{animationDelay:'.2s'}}>
        <div className="settings-title">🔔 Notification Center</div>
        <div style={{fontSize:'.8rem',color:'var(--ink2)',marginBottom:14,lineHeight:1.7}}>
          Send custom notifications or test the notification system. These appear in both Admin and Student dashboards.
        </div>
        <NotifTester/>
      </div>
    </div>
  );
}

function NotifTester() {
  const [msg, setMsg] = useState('');
  const [cat, setCat] = useState('system');
  const icons = { academic:'📋', admin:'🏫', attendance:'📅', alert:'⚠️', system:'💾' };
  const send = () => {
    if (!msg.trim()) { showToast('⚠ Enter a message first','#f5a623'); return; }
    addNotif('Admin Announcement', msg.trim(), icons[cat]||'🔔', cat);
    setMsg('');
  };
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:8,marginBottom:10}}>
        <input className="fi" value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Type a notification message…" onKeyDown={e=>e.key==='Enter'&&send()}/>
        <select className="f-sel" value={cat} onChange={e=>setCat(e.target.value)}>
          <option value="academic">📋 Academic</option>
          <option value="admin">🏫 Admin</option>
          <option value="attendance">📅 Attendance</option>
          <option value="alert">⚠️ Alert</option>
          <option value="system">💾 System</option>
        </select>
      </div>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        <button className="btn-save" onClick={send}>🔔 Send Notification</button>
        <button className="btn-out" onClick={markAllNotifRead}>✅ Mark All Read</button>
        <button className="btn-out" style={{borderColor:'var(--rose)',color:'var(--rose)'}} onClick={clearAllNotifs}>🗑 Clear All</button>
      </div>
    </div>
  );
}


export { SettingsSection as default, NotifTester };
