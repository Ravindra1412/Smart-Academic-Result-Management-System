import { useState, useEffect } from 'react';
import { showToast } from './toast';

// ── Notification store (shared across Student + Admin panels) ──────────────
const INIT_NOTIFS = [
  { id:1, t:'Results Published',    s:'Final exam results are now available for all students.',  u:true,  tm:'2h ago',  icon:'📋', cat:'academic' },
  { id:2, t:'New Student Enrolled', s:'STU008 Meera Iyer has been added to Class 10-A.',         u:true,  tm:'5h ago',  icon:'🎓', cat:'admin' },
  { id:3, t:'Attendance Updated',   s:'Jan–Jun 2025 attendance records have been saved.',         u:true,  tm:'1d ago',  icon:'📅', cat:'attendance' },
  { id:4, t:'Low Attendance Alert', s:'STU005 Sneha Patel is below 75% attendance threshold.',   u:false, tm:'2d ago',  icon:'⚠️', cat:'alert' },
  { id:5, t:'System Backup',        s:'Automatic data backup completed successfully.',            u:false, tm:'3d ago',  icon:'💾', cat:'system' },
  { id:6, t:'Exam Schedule Set',    s:'Unit Test 2 is scheduled for next week.',                 u:false, tm:'4d ago',  icon:'📝', cat:'academic' },
];

// Global notif state outside React (so both student & admin share same data)
let _globalNotifs = [...INIT_NOTIFS];
let _notifListeners = [];
function subscribeNotifs(fn) { _notifListeners.push(fn); return ()=>{ _notifListeners=_notifListeners.filter(f=>f!==fn); }; }
function notifyAll() { _notifListeners.forEach(f=>f([..._globalNotifs])); }
function markNotifRead(id) { _globalNotifs=_globalNotifs.map(n=>n.id===id?{...n,u:false}:n); notifyAll(); }
function markAllNotifRead() { _globalNotifs=_globalNotifs.map(n=>({...n,u:false})); notifyAll(); }
function clearAllNotifs() { _globalNotifs=[]; notifyAll(); }
function addNotif(t,s,icon='🔔',cat='system') {
  const id=Date.now();
  _globalNotifs=[{id,t,s,u:true,tm:'just now',icon,cat},..._globalNotifs];
  notifyAll();
  showToast(`🔔 ${t}`,'#4d8dff');
}

function useNotifs() {
  const [notifs, setNotifs] = useState(_globalNotifs);
  useEffect(()=>subscribeNotifs(setNotifs), []);
  return notifs;
}

const CAT_COLORS = { academic:'var(--blue)', admin:'var(--violet)', attendance:'var(--amber)', alert:'var(--rose)', system:'var(--cyan)' };


// ── Paper-seeing request store (shared across Student + Admin panels) ──────
let _paperReqs = [];
let _paperListeners = [];
function subscribePaperReqs(fn) { _paperListeners.push(fn); return ()=>{ _paperListeners=_paperListeners.filter(f=>f!==fn); }; }
function notifyPaperAll() { _paperListeners.forEach(f=>f([..._paperReqs])); }
function addPaperReq(req) {
  const id=Date.now();
  _paperReqs=[{id,...req,status:'pending',createdAt:new Date().toLocaleString('en-IN',{dateStyle:'short',timeStyle:'short'})}, ..._paperReqs];
  notifyPaperAll();
  addNotif('Paper Seeing Request',`${req.studentName} (${req.roll}) requested to see ${req.subject} paper.`,'📄','academic');
}
function updatePaperReq(id, status, adminNote='') {
  _paperReqs=_paperReqs.map(r=>r.id===id?{...r,status,adminNote,resolvedAt:new Date().toLocaleString('en-IN',{dateStyle:'short',timeStyle:'short'})}:r);
  notifyPaperAll();
}
function usePaperReqs() {
  const [reqs, setReqs] = useState(_paperReqs);
  useEffect(()=>subscribePaperReqs(setReqs), []);
  return reqs;
}


export {
  subscribeNotifs, markNotifRead, markAllNotifRead, clearAllNotifs, addNotif, useNotifs, CAT_COLORS,
  subscribePaperReqs, addPaperReq, updatePaperReq, usePaperReqs
};
