import { useState, useEffect, useRef, useMemo } from 'react';

function useClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function useAnimatedNumber(target) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 30;
    const id = setInterval(() => {
      start = Math.min(start + step, target);
      setCurrent(Math.round(start));
      if (start >= target) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [target]);
  return current;
}

function useMouseGlow(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const handler = e => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };
    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, []);
}

function usePwStrength(pw) {
  return useMemo(() => {
    const checks = [pw.length>=8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)];
    const score = checks.filter(Boolean).length;
    const labels = ['Too Weak','Weak','Good','Strong'];
    const colors = ['#f5476b','#f5a623','#4d8dff','#12c98a'];
    return { score, label: pw.length ? labels[score-1]||'Too Weak' : '', color: colors[score-1]||'' };
  }, [pw]);
}


export { useClock, useAnimatedNumber, useMouseGlow, usePwStrength };
