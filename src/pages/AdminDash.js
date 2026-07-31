import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNotifs, usePaperReqs } from '../utils/notifications';
import { showToast } from '../utils/toast';
import Topbar from '../components/Topbar';
import { NotifBell, NotifPanel } from '../components/NotifPanel';
import StudentModal from '../components/modals/StudentModal';
import ViewStudentModal from '../components/modals/ViewStudentModal';
import OverviewSection from './admin/OverviewSection';
import StudentsSection from './admin/StudentsSection';
import MarksSection from './admin/MarksSection';
import AttMgmtSection from './admin/AttMgmtSection';
import AnalyticsSection from './admin/AnalyticsSection';
import ToppersSection from './admin/ToppersSection';
import PaperRequestsAdmin from './admin/PaperRequestsAdmin';
import QuickSearchSection from './admin/QuickSearchSection';
import ReactDemoSection from './admin/ReactDemoSection';
import SettingsSection from './admin/SettingsSection';

function AdminDash() {
  const { state, dispatch, goTo } = useApp();
  const [section, setSection] = useState('overview');
  const [addModal, setAddModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifCount = useNotifs().filter(n=>n.u).length;
  const paperReqCount = usePaperReqs().filter(r=>r.status==='pending').length;
  const sections = [
    { id:'overview', icon:'📊', label:'Overview' },
    { id:'students', icon:'🎓', label:'Students' },
    { id:'marks', icon:'📝', label:'Marks Entry' },
    { id:'attendance', icon:'📅', label:'Attendance' },
    { id:'analytics', icon:'📈', label:'Analytics' },
    { id:'toppers', icon:'🏆', label:'Toppers' },
    { id:'paperreqs', icon:'📄', label:'Paper Requests', badge: paperReqCount },
    { id:'search', icon:'🔍', label:'Search' },
    { id:'react', icon:'⚛️', label:'React Demo' },
    { id:'settings', icon:'⚙️', label:'Settings' },
  ];

  const exportSavedHTML = () => {
    const src = document.documentElement.outerHTML;
    const blob = new Blob([src], { type:'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'EduResult_React_saved.html';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    showToast('💾 Saved HTML downloaded!','#00d4b4');
  };

  const sectionTitles = { overview:'Dashboard Overview', students:'Student Records', marks:'Marks Entry', attendance:'📅 Attendance Management', analytics:'Class Analytics', toppers:'🏆 Toppers & Leaderboard', paperreqs:'📄 Paper Viewing Requests', search:'🔍 Quick Search', react:'⚛️ React Concepts Demo', settings:'⚙️ Settings' };

  return (
    <div className="page-full">
      <Topbar badge="Admin" badgeClass="badge-a" rightSlot={
        <>
          <NotifBell onClick={()=>setNotifOpen(o=>!o)}/>
          <button className="tb-btn" onClick={()=>document.getElementById('kbd-overlay').classList.add('open')} style={{fontFamily:'var(--mono)',fontSize:'.7rem'}}>⌨️ ?</button>
          <button className="tb-btn" onClick={exportSavedHTML} style={{borderColor:'var(--cyan)',color:'var(--cyan)'}}>💾 Save File</button>
          <button className="tb-btn" onClick={()=>goTo('landing')}>Logout</button>
        </>
      }/>
      <div className="admin-shell">
        <div className="sidebar">
          <div className="sb-sect">Main</div>
          {sections.slice(0,4).map(s=>(
            <div key={s.id} className={`sb-item${section===s.id?' on':''}`} onClick={()=>setSection(s.id)}>
              <span className="sb-ico">{s.icon}</span>{s.label}
            </div>
          ))}
          <div className="sb-sect">Reports</div>
          {sections.slice(4,7).map(s=>(
            <div key={s.id} className={`sb-item${section===s.id?' on':''}`} onClick={()=>setSection(s.id)} style={{position:'relative'}}>
              <span className="sb-ico">{s.icon}</span>{s.label}
              {s.badge>0 && <span style={{marginLeft:'auto',background:'var(--amber)',color:'#000',fontSize:'.58rem',fontWeight:800,padding:'1px 6px',borderRadius:50,minWidth:18,textAlign:'center'}}>{s.badge}</span>}
            </div>
          ))}
          <div className="sb-sect">Tools</div>
          {sections.slice(7).map(s=>(
            <div key={s.id} className={`sb-item${section===s.id?' on':''}`} onClick={()=>setSection(s.id)}>
              <span className="sb-ico">{s.icon}</span>{s.label}
            </div>
          ))}
        </div>
        <div className="admin-main">
          <div className="a-title">{sectionTitles[section]}</div>
          {section==='overview' && <OverviewSection/>}
          {section==='students' && <StudentsSection onAdd={()=>setAddModal(true)} onEdit={id=>setEditId(id)} onView={id=>setViewId(id)}/>}
          {section==='marks' && <MarksSection/>}
          {section==='attendance' && <AttMgmtSection/>}
          {section==='analytics' && <AnalyticsSection/>}
          {section==='toppers' && <ToppersSection/>}
          {section==='paperreqs' && <PaperRequestsAdmin/>}
          {section==='search' && <QuickSearchSection onView={id=>setViewId(id)}/>}
          {section==='react' && <ReactDemoSection/>}
          {section==='settings' && <SettingsSection/>}
        </div>
      </div>
      <NotifPanel open={notifOpen} onClose={()=>setNotifOpen(false)}/>
      {(addModal||editId) && <StudentModal editId={editId} onClose={()=>{setAddModal(false);setEditId(null);}}/>}
      {viewId && <ViewStudentModal stuId={viewId} onClose={()=>setViewId(null)}/>}
    </div>
  );
}


export default AdminDash;
