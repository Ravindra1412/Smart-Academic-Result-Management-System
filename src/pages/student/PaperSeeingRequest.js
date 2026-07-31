import { useState } from 'react';
import { showToast } from '../../utils/toast';
import { addPaperReq, usePaperReqs } from '../../utils/notifications';

function PaperSeeingRequest({ stu }) {
  const [subject, setSubject] = useState('');
  const [reason, setReason] = useState('');
  const [examType, setExamType] = useState('Final Exam');
  const [submitted, setSubmitted] = useState(false);
  const myReqs = usePaperReqs().filter(r=>r.studentId===stu.id);

  const submit = () => {
    if (!subject) { showToast('⚠ Select a subject first','#f5a623'); return; }
    if (!reason.trim() || reason.trim().length < 10) { showToast('⚠ Please provide a detailed reason (min 10 chars)','#f5a623'); return; }
    // Check no duplicate pending request for same subject
    const dupPending = myReqs.find(r=>r.subject===subject&&r.status==='pending');
    if (dupPending) { showToast('⚠ You already have a pending request for this subject','#f5a623'); return; }
    addPaperReq({ studentId:stu.id, studentName:stu.name, roll:stu.roll, cls:stu.cls, subject, examType, reason:reason.trim() });
    setSubject(''); setReason(''); setSubmitted(true);
    setTimeout(()=>setSubmitted(false), 3000);
  };

  const statusInfo = { pending:{icon:'⏳',label:'Pending Review'}, approved:{icon:'✅',label:'Approved'}, rejected:{icon:'❌',label:'Rejected'} };

  return (
    <div className="paper-req-tab">
      {/* Request form */}
      <div className="paper-req-form">
        <div style={{fontWeight:700,fontSize:'1rem',marginBottom:4}}>📄 Request Paper Viewing</div>
        <div style={{fontSize:'.78rem',color:'var(--ink2)',marginBottom:16,lineHeight:1.65}}>
          Submit a request to view your evaluated answer sheet for any subject. Admin will review and respond.
        </div>
        <div className="two-col">
          <div className="fg">
            <label className="fl">Subject *</label>
            <select className="fi" value={subject} onChange={e=>setSubject(e.target.value)}>
              <option value="">-- Select Subject --</option>
              {Object.keys(stu.marks).map(k=>(
                <option key={k} value={k.replace(/([A-Z])/g,' $1').trim()}>{k.replace(/([A-Z])/g,' $1').trim()}</option>
              ))}
            </select>
          </div>
          <div className="fg">
            <label className="fl">Exam Type</label>
            <select className="fi" value={examType} onChange={e=>setExamType(e.target.value)}>
              {['Final Exam','Unit Test 1','Unit Test 2','Mid-Term','Quarterly'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="fg">
          <label className="fl">Reason for Request *</label>
          <textarea className="fi" rows={3} value={reason} onChange={e=>setReason(e.target.value)}
            placeholder="Explain why you want to see your paper (e.g. I believe there may be a marking error in Question 3…)"
            style={{resize:'vertical',minHeight:80}}/>
          <div style={{fontSize:'.68rem',color:'var(--muted)',marginTop:4}}>{reason.length}/300 characters</div>
        </div>
        <button className="btn-primary" onClick={submit} style={{width:'auto',padding:'10px 28px'}}>
          {submitted?'✅ Submitted!':'📤 Submit Request'}
        </button>
      </div>

      {/* My requests history */}
      <div style={{fontWeight:700,fontSize:'.9rem',marginBottom:10}}>📋 My Requests ({myReqs.length})</div>
      {myReqs.length===0 ? (
        <div className="req-empty">📭 No requests yet. Submit your first paper viewing request above.</div>
      ) : (
        myReqs.map(r=>(
          <div key={r.id} className="req-card">
            <div className="req-card-hdr">
              <div className="req-card-meta">
                <div className="req-card-name">{r.subject} — {r.examType}</div>
                <div className="req-card-sub">Submitted: {r.createdAt}</div>
              </div>
              <span className={`req-status-badge ${r.status}`}>{statusInfo[r.status]?.icon} {statusInfo[r.status]?.label}</span>
            </div>
            <div className="req-card-reason">"{r.reason}"</div>
            {r.adminNote && (
              <div style={{fontSize:'.78rem',color:'var(--ink2)',padding:'6px 10px',background:'rgba(157,111,245,.07)',borderRadius:'var(--rxs)',borderLeft:'3px solid var(--violet)'}}>
                <strong>Admin Note:</strong> {r.adminNote}
              </div>
            )}
            {r.resolvedAt && <div style={{fontSize:'.68rem',color:'var(--muted)',marginTop:6}}>Resolved: {r.resolvedAt}</div>}
          </div>
        ))
      )}
    </div>
  );
}


export default PaperSeeingRequest;
