// Pure utility functions + localStorage/sessionStorage wrapper
const avg = marks => {
  const vals = Object.values(marks);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
};
const grade = p => p>=90?'A+':p>=80?'A':p>=70?'B+':p>=60?'B':p>=50?'C':p>=40?'D':'F';
const gClass = g => (g==='A+'||g==='A')?'gA':(g==='B+'||g==='B')?'gB':g==='C'?'gC':g==='D'?'gD':'gF';
const col = p => p>=80?'#12c98a':p>=60?'#4d8dff':p>=40?'#f5a623':'#f5476b';
const grad = p => p>=80?'linear-gradient(90deg,#12c98a,#00d4b4)':p>=60?'linear-gradient(90deg,#4d8dff,#9d6ff5)':p>=40?'linear-gradient(90deg,#f5a623,#f97316)':'linear-gradient(90deg,#f5476b,#e11d48)';
const subKey = sub => sub.replace(/ /g,'');
const isPass = (s, passMark) => Object.values(s.marks).every(m => m >= passMark);
const getRank = (s, students) => [...students].sort((a,b) => avg(b.marks)-avg(a.marks)).findIndex(x=>x.id===s.id)+1;
const att75Pct = s => {
  if (!Array.isArray(s.att)) return 0;
  const flat = Array.isArray(s.att[0]) ? s.att.reduce((a,m)=>[...a,...m],[]) : s.att;
  const wd=flat.filter(x=>x!=='w'), p=wd.filter(x=>x==='p').length;
  return wd.length?Math.round(p/wd.length*100):0;
};
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const debounce = (fn, ms) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); }; };
const validatePwStrength = pw => pw.length>=8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);

// Storage layer with error handling (Proxy pattern)
const Storage = new Proxy({}, {
  get: (_, method) => (...args) => {
    try {
      if (method === 'save') {
        const [key, val] = args;
        const json = JSON.stringify(val);
        localStorage.setItem(key, json);
        sessionStorage.setItem(key, json);
      } else if (method === 'load') {
        const [key, def = null] = args;
        const v = localStorage.getItem(key) || sessionStorage.getItem(key);
        return v ? JSON.parse(v) : def;
      }
    } catch(e) { return args[1] ?? null; }
  }
});


export { avg, grade, gClass, col, grad, subKey, isPass, getRank, att75Pct, clamp, debounce, validatePwStrength, Storage };
