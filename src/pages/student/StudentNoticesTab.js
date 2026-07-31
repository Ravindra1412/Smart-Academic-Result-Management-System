import { useState } from 'react';
import { useNotifs, markNotifRead, markAllNotifRead, CAT_COLORS } from '../../utils/notifications';

function StudentNoticesTab() {
  const notifs = useNotifs();
  const [filter, setFilter] = useState('all');
  const visible = filter==='all' ? notifs : notifs.filter(n=>n.cat===filter);
  const unread  = notifs.filter(n=>n.u).length;

  return (
    <div className="anim-fadeIn">
      <div className="card" style={{marginBottom:14}}>
        <div className="card-hdr" style={{flexWrap:'wrap',gap:8}}>
          <span className="card-hdr-title">📢 School Notices & Notifications</span>
          <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
            {unread>0 && (
              <span style={{fontSize:'.7rem',background:'rgba(245,71,107,.1)',color:'var(--rose)',padding:'2px 8px',borderRadius:50,fontWeight:700}}>
                {unread} unread
              </span>
            )}
            {unread>0 && <button className="tb-btn" style={{padding:'3px 10px',fontSize:'.72rem'}} onClick={markAllNotifRead}>Mark all read</button>}
          </div>
        </div>
        <div style={{display:'flex',gap:4,padding:'8px 14px',borderBottom:'1px solid var(--border)',flexWrap:'wrap'}}>
          {['all','academic','admin','attendance','alert','system'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{
              padding:'3px 10px',borderRadius:50,fontSize:'.68rem',fontWeight:700,cursor:'pointer',
              background:filter===f?'rgba(77,141,255,.15)':'transparent',
              border:filter===f?'1px solid var(--blue)':'1px solid var(--border)',
              color:filter===f?'var(--blue)':'var(--muted)',textTransform:'capitalize'
            }}>{f}</button>
          ))}
        </div>
        <div style={{maxHeight:420,overflowY:'auto'}}>
          {visible.length===0 && (
            <div style={{padding:32,textAlign:'center',color:'var(--muted)'}}>
              <div style={{fontSize:'2rem',marginBottom:8}}>🎉</div>
              <div style={{fontSize:'.84rem'}}>No notices in this category</div>
            </div>
          )}
          {visible.map(n=>(
            <div key={n.id} onClick={()=>markNotifRead(n.id)} style={{
              padding:'14px 18px',borderBottom:'1px solid var(--border)',
              display:'flex',gap:12,alignItems:'flex-start',cursor:'pointer',
              background:n.u?'rgba(77,141,255,.03)':'transparent',
              transition:'background .15s'
            }}>
              <div style={{
                width:38,height:38,borderRadius:10,flexShrink:0,
                background:`${CAT_COLORS[n.cat]||'var(--blue)'}18`,
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem'
              }}>{n.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:n.u?700:600,fontSize:'.86rem',display:'flex',alignItems:'center',gap:7}}>
                  {n.t}
                  {n.u && <span style={{width:7,height:7,borderRadius:'50%',background:'var(--blue)',display:'inline-block',flexShrink:0}}/>}
                </div>
                <div style={{fontSize:'.78rem',color:'var(--ink2)',marginTop:3,lineHeight:1.6}}>{n.s}</div>
                <div style={{fontSize:'.68rem',color:'var(--muted)',marginTop:4,display:'flex',gap:8}}>
                  <span>{n.tm}</span>
                  <span style={{color:CAT_COLORS[n.cat]||'var(--blue)',textTransform:'capitalize',fontWeight:600}}>#{n.cat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:'8px 16px',borderTop:'1px solid var(--border)',fontSize:'.7rem',color:'var(--muted)',textAlign:'center'}}>
          {notifs.length} total notices · {unread} unread
        </div>
      </div>
    </div>
  );
}


export default StudentNoticesTab;
