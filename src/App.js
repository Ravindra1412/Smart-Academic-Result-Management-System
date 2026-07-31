import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Landing from './pages/Landing';
import StudentLogin from './pages/StudentLogin';
import StudentDash from './pages/StudentDash';
import AdminLogin from './pages/AdminLogin';
import AdminDash from './pages/AdminDash';
import PublicAnalytics from './pages/PublicAnalytics';
import './App.css';

function App() {
  const { state } = useApp();
  const pages = {
    'landing': <Landing/>,
    'student-login': <StudentLogin/>,
    'student-dash': <StudentDash/>,
    'admin-login': <AdminLogin/>,
    'admin-dash': <AdminDash/>,
    'analytics': <PublicAnalytics/>,
  };
  return <div id="app-inner">{pages[state.page] || <Landing/>}</div>;
}


// ── Global keyboard shortcuts (outside React render tree) ──────────────────
function useGlobalKeyboardShortcuts() {
  useEffect(() => {
    function handler(e) {
      const tag = document.activeElement.tagName;
      const typing = tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT';
      const kbdOpen = document.getElementById('kbd-overlay').classList.contains('open');
      if (e.key==='Escape') { document.getElementById('kbd-overlay').classList.remove('open'); return; }
      if ((e.key==='?') && !typing && !kbdOpen) { e.preventDefault(); document.getElementById('kbd-overlay').classList.add('open'); return; }
      if (kbdOpen) return;
      if (e.altKey && !e.ctrlKey) {
        switch(e.key.toLowerCase()) {
          case 't': e.preventDefault(); document.body.classList.toggle('light'); break;
        }
      }
      if (e.ctrlKey && e.shiftKey) {
        if (e.key==='P') { e.preventDefault(); window.print(); }
      }
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);
}

function Root() {
  useGlobalKeyboardShortcuts();
  return (
    <AppProvider>
      <App/>
    </AppProvider>
  );
}

export default Root;
