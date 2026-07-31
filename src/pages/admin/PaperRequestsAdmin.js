import { useState } from 'react';
import { usePaperReqs, updatePaperReq } from '../../utils/notifications';
import { showToast } from '../../utils/toast';
import { addNotif } from '../../utils/notifications';

function PaperRequestsAdmin() {
  const reqs = usePaperReqs();
  const [filter, setFilter] = useState('all');
  const [noteId, setNoteId] = useState(null);
  const [note, setNote] = useState('');

  const visible = filter==='all' ? reqs : reqs.filter(r=>r.status===filter);
  const pending = reqs.filter(r=>r.status==='pending').length;

  const approve = (id) => {
    updatePaperReq(id, 'approved', note||'Request approved. Please visit the admin office to view your paper.');
    setNoteId(null); setNote('');
    showToast('✅ Request approved!', '#12c98a');
    addNotif('Paper Request Approved', 'A paper viewing request has been approved.', '✅', 'academic');
  };
  const reject = (id) => {
    updatePaperReq(id, 'rejected', note||'Request rejected. Please contact the teacher for clarification.');
    setNoteId(null); setNote('');
    showToast('Request rejected.', '#f5476b');
  };

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14,flexWrap:'wrap'}}>
        <div style={{fontWeight:700,fontSize:'.9rem'}}>Paper Viewing Requests</div>
        {pending>0 && <span className="req-status-badge pending">⏳ {pending} Pending</span>}
      </div>
      <div className="req-filter-row">
        {[['all','All'],['pending','⏳ Pending'],['approved','✅ Approved'],['rejected','❌ Rejected']].map(([v,l])=>(
          <button key={v} className={`req-filter-btn${filter===v?' on':''}`} onClick={()=>setFilter(v)}>{l}</button>
        ))}
      </div>
      {visible.length===0 ? (
        <div className="req-empty">📭 {filter==='all'?'No paper viewing requests yet.': `No ${filter} requests.`}</div>
      ) : (
        visible.map(r=>(
          <div key={r.id} className="req-card">
            <div className="req-card-hdr">
              <div className="req-card-meta">
                <div className="req-card-name">{r.studentName} <span style={{color:'var(--blue)',fontFamily:'var(--mono)',fontSize:'.76rem'}}>({r.roll})</span></div>
                <div className="req-card-sub">{r.cls} · {r.subject} · {r.examType} · {r.createdAt}</div>
              </div>
              <span className={`req-status-badge ${r.status}`}>{r.status==='pending'?'⏳':r.status==='approved'?'✅':'❌'} {r.status.charAt(0).toUpperCase()+r.status.slice(1)}</span>
            </div>
            <div className="req-card-reason">"{r.reason}"</div>
            {r.status==='pending' && (
              <>
                {noteId===r.id ? (
                  <div style={{marginTop:8}}>
                    <textarea className="fi" rows={2} value={note} onChange={e=>setNote(e.target.value)}
                      placeholder="Add a note for the student (optional)…" style={{resize:'vertical',marginBottom:8,fontSize:'.8rem'}}/>
                    <div className="req-card-actions">
                      <button className="req-approve-btn" onClick={()=>approve(r.id)}>✅ Approve</button>
                      <button className="req-reject-btn" onClick={()=>reject(r.id)}>❌ Reject</button>
                      <button className="btn-cancel" style={{fontSize:'.74rem',padding:'5px 12px'}} onClick={()=>{setNoteId(null);setNote('');}}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="req-card-actions">
                    <button className="req-approve-btn" onClick={()=>{setNoteId(r.id);setNote('');}}>✅ Review & Approve</button>
                    <button className="req-reject-btn" onClick={()=>{setNoteId(r.id);setNote('');}}>❌ Review & Reject</button>
                  </div>
                )}
              </>
            )}
            {r.adminNote && <div style={{fontSize:'.78rem',color:'var(--ink2)',padding:'6px 10px',background:'rgba(157,111,245,.07)',borderRadius:'var(--rxs)',borderLeft:'3px solid var(--violet)',marginTop:8}}><strong>Note sent:</strong> {r.adminNote}</div>}
            {r.resolvedAt && <div style={{fontSize:'.68rem',color:'var(--muted)',marginTop:6}}>Resolved: {r.resolvedAt}</div>}
          </div>
        ))
      )}
    </div>
  );
}


export default PaperRequestsAdmin;
