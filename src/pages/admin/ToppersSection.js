import { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { avg, col, subKey } from '../../utils/helpers';
import { SUBJECTS, MAX_MARK } from '../../utils/constants';

function ToppersSection() {
  const { state } = useApp();
  const sorted = [...state.students].sort((a,b)=>avg(b.marks)-avg(a.marks));
  const rc = ['g','s','b'];
  const top5 = sorted.slice(0,5);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isDark = state.theme === 'dark';
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const W=canvas.width, H=canvas.height, pad={t:24,r:10,b:60,l:14};
    const cW=W-pad.l-pad.r, cH=H-pad.t-pad.b;
    const barW=cW/top5.length*.5, gap=cW/top5.length;
    const colors=['#f5a623','#94a3b8','#c2623d','#4d8dff','#12c98a'];
    top5.forEach((s,i)=>{
      const a=avg(s.marks), bH=cH*(a/MAX_MARK), x=pad.l+gap*i+(gap-barW)/2, y=pad.t+cH-bH;
      ctx.fillStyle=colors[i];
      const r=Math.min(4,barW/2);
      ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+barW-r,y);
      ctx.arcTo(x+barW,y,x+barW,y+r,r); ctx.lineTo(x+barW,y+bH);
      ctx.lineTo(x,y+bH); ctx.arcTo(x,y,x+r,y,r); ctx.closePath(); ctx.fill();
      ctx.fillStyle=isDark?'rgba(255,255,255,.8)':'rgba(0,0,0,.7)';
      ctx.font='bold 10px DM Mono'; ctx.textAlign='center';
      ctx.fillText(a+'%',x+barW/2,y-4);
      ctx.fillStyle=isDark?'rgba(255,255,255,.5)':'rgba(0,0,0,.5)';
      ctx.font='9px Syne';
      ctx.fillText(s.name.split(' ')[0],x+barW/2,pad.t+cH+12);
    });
  }, [top5, state.theme]);

  return (
    <div>
      <div className="two-col">
        <div className="card">
          <div className="card-hdr"><span className="card-hdr-title">Class Leaderboard</span></div>
          <div className="card-body" style={{padding:'0 16px'}}>
            {sorted.map((s,i)=>{
              const a=avg(s.marks);
              return (
                <div key={s.id} className="lb-row anim-slideRight" style={{animationDelay:`${i*.04}s`}}>
                  <div className={`lb-rank${rc[i]?' '+rc[i]:''}`}>{i+1}</div>
                  <div className="lb-name">{s.name} <span style={{color:'var(--muted)',fontSize:'.72rem'}}>{s.cls}</span></div>
                  <div className="lb-bar"><div className="lb-fill" style={{width:`${a}%`}}/></div>
                  <div className="lb-pct" style={{color:col(a)}}>{a}%</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card">
          <div className="card-hdr"><span className="card-hdr-title">Top 5 Chart</span></div>
          <div className="canvas-wrap">
            <canvas ref={canvasRef} width={320} height={240} style={{maxWidth:'100%'}}/>
          </div>
        </div>
      </div>
      <div className="a-title" style={{fontSize:'1rem',marginTop:16}}>Subject Toppers</div>
      <div className="st-grid">
        {SUBJECTS.map((sub,i)=>{
          const k=subKey(sub), top2=[...state.students].sort((a,b)=>(b.marks[k]||0)-(a.marks[k]||0))[0];
          if(!top2) return null;
          return (
            <div key={sub} className="st-card" style={{animationDelay:`${i*.05}s`}}>
              <div style={{fontSize:'.7rem',color:'var(--muted)',marginBottom:5}}>{sub}</div>
              <div style={{fontWeight:700,fontSize:'.88rem'}}>{top2.name.split(' ')[0]}</div>
              <div style={{fontFamily:"'Crimson Pro',serif",fontSize:'1.5rem',fontWeight:600,color:col(top2.marks[k]),marginTop:2}}>{top2.marks[k]}/{MAX_MARK}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


export default ToppersSection;
