import { useState } from 'react';
import { useNotifs, markNotifRead, markAllNotifRead, clearAllNotifs, CAT_COLORS } from '../utils/notifications';

function NotifPanel({ open, onClose }) {
  const notifs = useNotifs();
  const unread = notifs.filter(n=>n.u).length;
  const [filter, setFilter] = useState('all');

  if (!open) return null;

  const visible = filter==='all' ? notifs : filter==='unread' ? notifs.filter(n=>n.u) : notifs.filter(n=>n.cat===filter);

  return (
    <div className="notif-panel open">
      <div className="np-hdr">
        <span className="np-title">
          🔔 Notifications
          {unread>0 && <span style={{marginLeft:6,background:'var(--rose)',color:'#fff',fontSize:'.6rem',fontWeight:700,padding:'1px 6px',borderRadius:50}}>{unread}</span>}
        </span>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          {unread>0 && <button style={{background:'none',border:'none',color:'var(--blue)',fontSize:'.7rem',cursor:'pointer',fontWeight:600}} onClick={markAllNotifRead}>Mark all read</button>}
          {notifs.length>0 && <button style={{background:'none',border:'none',color:'var(--rose)',fontSize:'.7rem',cursor:'pointer',fontWeight:600}} onClick={clearAllNotifs}>Clear all</button>}
          <button className="np-close" onClick={onClose}>✕</button>
        </div>
      </div>
      <div style={{display:'flex',gap:4,padding:'8px 12px',borderBottom:'1px solid var(--border)',flexWrap:'wrap'}}>
        {['all','unread','academic','admin','attendance','alert'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:'2px 8px',borderRadius:50,fontSize:'.65rem',fontWeight:700,cursor:'pointer',
            background:filter===f?'rgba(77,141,255,.15)':'transparent',
            border:filter===f?'1px solid var(--blue)':'1px solid var(--border)',
            color:filter===f?'var(--blue)':'var(--muted)',textTransform:'capitalize'
          }}>{f}</button>
        ))}
      </div>
      <div className="np-list">
        {visible.length===0 && <div style={{padding:24,textAlign:'center',color:'var(--muted)',fontSize:'.82rem'}}>No notifications{filter!=='all'?' in this category':''} 🎉</div>}
        {visible.map((n)=>(
          <div key={n.id} className="np-item" onClick={()=>markNotifRead(n.id)} style={{opacity:n.u?1:.65}}>
            <div style={{width:32,height:32,borderRadius:8,background:`${CAT_COLORS[n.cat]||'var(--blue)'}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>{n.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div className="np-ititle" style={{display:'flex',alignItems:'center',gap:6}}>
                {n.t}
                {n.u && <span style={{width:6,height:6,borderRadius:'50%',background:'var(--blue)',display:'inline-block',flexShrink:0}}/>}
              </div>
              <div className="np-isub">{n.s}</div>
              <div style={{fontSize:'.66rem',color:'var(--muted)',marginTop:2}}>{n.tm}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:'10px 14px',borderTop:'1px solid var(--border)',fontSize:'.7rem',color:'var(--muted)',textAlign:'center'}}>
        {notifs.length} total · {unread} unread
      </div>
    </div>
  );
}

function NotifBell({ onClick }) {
  const notifs = useNotifs();
  const unread = notifs.filter(n=>n.u).length;
  return (
    <div className="tb-icon-btn" onClick={onClick} title="Notifications" style={{position:'relative'}}>
      <span>🔔</span>
      {unread>0 && <span className="notif-dot" style={{background:'var(--rose)',minWidth:14,height:14,fontSize:'.52rem',display:'flex',alignItems:'center',justifyContent:'center'}}>{unread>9?'9+':unread}</span>}
    </div>
  );
}


export { NotifPanel, NotifBell };
