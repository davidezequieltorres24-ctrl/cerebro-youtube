// Arma los subtítulos por frase. Reglas:
// 1) se corta en la puntuación y en el cambio de escena (sceneOf);
// 2) frases muy cortas ("Ahora," "rebobina,") se juntan con la siguiente si entran;
// 3) frases largas se parten en partes parejas, justo antes de una palabra de enlace si se puede.
export type Wd = {w: string; s: number; e: number};
const MAX = 7;
const MAXC = 50; // letras por subtítulo
const STRONG = new Set(['y', 'que', 'porque', 'pero', 'cuando', 'como', 'sin', 'con', 'para', 'o', 'ni', 'antes']);
const LINK = new Set(['y', 'que', 'a', 'con', 'en', 'de', 'del', 'para', 'porque', 'cada', 'sin', 'como', 'pero', 'o', 'antes', 'los', 'las', 'la', 'el', 'un', 'una', 'cuando', 'si', 'ni']);
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñü0-9]/g, '');
export const makeChunks = (W: Wd[], sceneOf: (t: number) => number): Wd[][] => {
  const segs: Wd[][] = [];
  let cur: Wd[] = [];
  W.forEach((w) => {
    if (cur.length && sceneOf(w.s) !== sceneOf(cur[0].s)) { segs.push(cur); cur = []; }
    cur.push(w);
    if (/[.,;:?!…]$/.test(w.w) && !/^\d+,$/.test(w.w)) { segs.push(cur); cur = []; }
  });
  if (cur.length) segs.push(cur);
  // juntar cortas
  const merged: Wd[][] = [];
  for (const s of segs) {
    const last = merged[merged.length - 1];
    const same = last && sceneOf(last[0].s) === sceneOf(s[0].s) && s[0].s - last[last.length - 1].e < 0.8;
    if (last && same && (last.length <= 2 || s.length <= 1) && last.length + s.length <= MAX && !/[.?!…]$/.test(last[last.length - 1].w)) last.push(...s);
    else merged.push([...s]);
  }
  // partir largas (por cantidad de letras), eligiendo el mejor punto de corte
  const len = (x: Wd[]) => x.map((w) => w.w).join(' ').length;
  const NOEND = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'a', 'se', 'me', 'te', 'tu', 'su', 'lo', 'que', 'y', 'o', 'con', 'para', 'por', 'qué', 'es', 'son', 'muy', 'más', 'no']);
  const split = (x: Wd[]): Wd[][] => {
    if (len(x) <= MAXC || x.length < 5) return [x];
    let best = -1, bestScore = Infinity;
    for (let c = 2; c <= x.length - 2; c++) {
      const A = x.slice(0, c), B = x.slice(c);
      let sc = Math.abs(len(A) - len(B));
      const prev = x[c - 1].w, next = clean(x[c].w);
      if (/[,;:]$/.test(prev)) sc -= 25;
      if (STRONG.has(next)) sc -= 20; else if (LINK.has(next)) sc -= 4;
      if (NOEND.has(clean(prev))) sc += 30;
      if (/^[A-ZÁÉÍÓÚ]/.test(prev) && /^[A-ZÁÉÍÓÚ]/.test(x[c].w)) sc += 40; // nombres propios juntos
      if (/^\d/.test(prev) || /^\d/.test(x[c].w)) sc += 30; // listas de números juntas
      if (sc < bestScore) { bestScore = sc; best = c; }
    }
    return [...split(x.slice(0, best)), ...split(x.slice(best))];
  };
  const out = merged.flatMap(split);
  return out;
};
