import { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { col } from '../utils/helpers';
import { MAX_MARK } from '../utils/constants';

function BarChart({ labels, values, title, id }) {
  const canvasRef = useRef(null);
  const { state } = useApp();
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isDark = state.theme === 'dark';
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const pad = { t:36, r:20, b:56, l:50 };
    const cW = W-pad.l-pad.r, cH = H-pad.t-pad.b;
    const barW = cW/labels.length*.52, gap = cW/labels.length;
    for (let i=0;i<=5;i++) {
      const y = pad.t+cH-cH/5*i;
      ctx.strokeStyle = isDark?'rgba(255,255,255,.05)':'rgba(0,0,0,.07)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+cW,y); ctx.stroke();
      ctx.fillStyle = isDark?'rgba(255,255,255,.35)':'rgba(0,0,0,.55)';
      ctx.font = '11px DM Mono'; ctx.textAlign='right';
      ctx.fillText((MAX_MARK/5*i).toFixed(0), pad.l-5, y+4);
    }
    values.forEach((v, i) => {
      const x = pad.l+gap*i+(gap-barW)/2, bH = cH*(v/MAX_MARK), y = pad.t+cH-bH;
      const pct = Math.round(v/MAX_MARK*100);
      const grd = ctx.createLinearGradient(x,y,x,y+bH);
      grd.addColorStop(0, col(pct)); grd.addColorStop(1, col(pct)+'88');
      ctx.fillStyle = grd;
      const r2 = Math.min(5, barW/2);
      ctx.beginPath(); ctx.moveTo(x+r2,y); ctx.lineTo(x+barW-r2,y);
      ctx.arcTo(x+barW,y,x+barW,y+r2,r2); ctx.lineTo(x+barW,y+bH);
      ctx.lineTo(x,y+bH); ctx.arcTo(x,y,x+r2,y,r2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = isDark?'rgba(255,255,255,.8)':'rgba(0,0,0,.7)';
      ctx.font = 'bold 11px DM Mono'; ctx.textAlign='center';
      ctx.fillText(v, x+barW/2, y-5);
      ctx.fillStyle = isDark?'rgba(255,255,255,.45)':'rgba(0,0,0,.5)';
      ctx.font = '9px Syne';
      labels[i].split(' ').forEach((w, wi) => ctx.fillText(w, x+barW/2, pad.t+cH+14+wi*12));
    });
    ctx.fillStyle = isDark?'rgba(255,255,255,.7)':'rgba(0,0,0,.7)';
    ctx.font = 'bold 13px Syne'; ctx.textAlign='left';
    ctx.fillText(title, pad.l, 22);
  }, [labels, values, title, state.theme]);
  return <canvas ref={canvasRef} id={id} width={700} height={250} style={{ maxWidth:'100%' }}/>;
}


export default BarChart;
