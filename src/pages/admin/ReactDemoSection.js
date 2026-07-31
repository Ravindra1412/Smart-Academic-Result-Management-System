import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { avg, grade, gClass, col } from '../../utils/helpers';
import { MAX_MARK } from '../../utils/constants';
import { showToast } from '../../utils/toast';

function ReactDemoSection() {
  const { state } = useApp();
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => { setRenderCount(c=>c+1); }, [count, selected]);

  const selectRandom = () => {
    const s = state.students[Math.floor(Math.random()*state.students.length)];
    setSelected(s);
    showToast(`Props passed: ${s.name}`, '#4d8dff');
  };

  return (
    <div>
      <div className="card anim-fadeUp">
        <div className="card-hdr"><span className="card-hdr-title">React 18 State + Props Demo</span></div>
        <div className="card-body">
          <div style={{fontSize:'.82rem',color:'var(--ink2)',marginBottom:14,lineHeight:1.7}}>
            This demonstrates <strong>React hooks</strong> (useState, useEffect, useReducer, useContext, useMemo, useCallback, useRef), <strong>Context API</strong>, and the <strong>Reducer pattern</strong>.
          </div>
          <div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap'}}>
            <button className="btn-add" onClick={()=>{ setCount(c=>c+1); showToast(`State updated! Count: ${count+1}`,'#00d4b4'); }}>➕ Increment State</button>
            <button className="btn-out" onClick={()=>{ setCount(0); setSelected(null); showToast('State reset!','#9d6ff5'); }}>🔄 Reset</button>
            <button className="btn-out" onClick={selectRandom}>🎲 Random Student (Props)</button>
          </div>
          <div className="react-demo">
<<<<<<< HEAD
            <div className="react-demo-title">App State (useState hooks)</div>
=======
            <div className="react-demo-title">// App State (useState hooks)</div>
>>>>>>> 1577d48b09c347b2669b8c8e2822163553912a68
            <div className="react-cards">
              <div className="react-comp"><div className="rc-lbl">count (state)</div><div className="rc-val">{count}</div></div>
              <div className="react-comp"><div className="rc-lbl">selectedStudent</div><div className="rc-val" style={{fontSize:'.85rem'}}>{selected?selected.name:'null'}</div></div>
              <div className="react-comp"><div className="rc-lbl">students.length (context)</div><div className="rc-val">{state.students.length}</div></div>
              <div className="react-comp"><div className="rc-lbl">renderCount</div><div className="rc-val">{renderCount}</div></div>
            </div>
          </div>
          {selected && (
            <div className="react-demo" style={{marginTop:12}}>
<<<<<<< HEAD
              <div className="react-demo-title">StudentCard Component (Props)</div>
=======
              <div className="react-demo-title">// StudentCard Component (Props)</div>
>>>>>>> 1577d48b09c347b2669b8c8e2822163553912a68
              <div style={{padding:12,background:'var(--surf)',border:'1px solid var(--border)',borderRadius:'var(--rs)'}}>
                <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                  <div style={{width:44,height:44,borderRadius:'50%',background:'var(--surf3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem'}}>🎓</div>
                  <div>
                    <div style={{fontWeight:700}}>{selected.name}</div>
                    <div style={{fontSize:'.74rem',color:'var(--muted)'}}>{selected.roll} · {selected.cls}</div>
                  </div>
                  <div style={{marginLeft:'auto'}}><span className={`gbadge ${gClass(grade(avg(selected.marks)))}`}>{grade(avg(selected.marks))}</span></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginTop:12}}>
                  {Object.keys(selected.marks).map(k=>(
                    <div key={k} style={{background:'var(--surf2)',padding:8,borderRadius:'var(--rxs)',fontSize:'.72rem'}}>
                      <div style={{color:'var(--muted)'}}>{k.replace(/([A-Z])/g,' $1').trim()}</div>
                      <div style={{fontWeight:700,color:col(Math.round(selected.marks[k]/MAX_MARK*100))}}>{selected.marks[k]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default ReactDemoSection;
