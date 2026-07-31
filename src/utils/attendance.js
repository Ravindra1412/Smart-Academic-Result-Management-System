import { ATT_MONTHS, ATT_DAYS, ATT_YEAR } from './constants';

function genAtt(rate) {
  return ATT_MONTHS.map((_, mi) =>
    Array.from({ length: ATT_DAYS[mi] }, (_, di) => {
      const dow = new Date(ATT_YEAR, mi, di + 1).getDay();
      if (dow === 0 || dow === 6) return 'w';
      const r = Math.random();
      return r < .05 ? 'h' : r < .05 + (1 - rate) * .95 ? 'a' : 'p';
    })
  );
}

function ensureAtt(s) {
  if (!Array.isArray(s.att) || !Array.isArray(s.att[0])) {
    s.att = genAtt(.85);
  }
}


export { genAtt, ensureAtt };
