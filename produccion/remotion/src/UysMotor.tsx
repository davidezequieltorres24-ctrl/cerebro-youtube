// Motor de video de Universo Y Si: dibujo 2D plano + movimiento por código.
// Cada plano empieza en su frase ancla (a). Fundido cruzado entre planos, reloj "HORA X" fijo,
// etiquetas enmarcadas con flecha, subtítulos por frase con contorno limpio y capas de ambiente.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, Easing, continueRender, delayRender} from 'remotion';
import {makeChunks} from './captionChunks';

// fuente de títulos (Archivo Black) cargada desde public/fonts
const fontHandle = typeof window !== 'undefined' ? delayRender('Archivo Black') : null;
if (typeof window !== 'undefined') {
  new FontFace('Archivo Black', `url(${staticFile('fonts/ArchivoBlack.ttf')})`).load()
    .then((ff) => { (document as any).fonts.add(ff); if (fontHandle !== null) continueRender(fontHandle); })
    .catch(() => { if (fontHandle !== null) continueRender(fontHandle); });
}

export const FPS = 30;
export type Lbl = {t: string; x: number; y: number; at?: string; n?: number; c?: string; flecha?: 'arriba' | 'abajo' | 'izq' | 'der'};
export type Fx = {s: string; at?: string; n?: number; v?: number; off?: number};
export type Amb = 'dia' | 'noche' | 'rio' | 'lluvia' | 'canoa';
export type Plano = {
  a: string;                 // primeras palabras dichas en este plano
  img: string;               // ruta dentro de public/
  z?: [number, number];      // zoom inicial y final
  fx?: number; fy?: number;  // punto de foco (0–1): la cámara se acerca hacia ahí
  pan?: [number, number];    // desplazamiento horizontal en % (inicio, fin)
  card?: string;             // cartel grande ("HORA 14", "1971")
  sub?: string;              // línea chica bajo el cartel
  hora?: number;             // actualiza el reloj fijo de la esquina
  labels?: Lbl[];            // etiquetas enmarcadas (aparecen en la palabra "at")
  sepia?: boolean;           // flashback
  noche?: boolean;           // tinte azul nocturno
  lluvia?: boolean;          // lluvia dibujada encima
  shake?: string;            // palabra donde la cámara tiembla
  cuenta?: number;           // (obsoleto)
  cuentaIni?: boolean;       // arranca la cuenta regresiva global (0:59) en este plano
  cuentaFin?: boolean;       // la cuenta llega a 0 al empezar este plano
  amb?: Amb;                 // capa de sonido ambiente
  sfx?: Fx[];
};
type W = {w: string; s: number; e: number};
const C = {white: '#FFFFFF', yel: '#FFD60A', green: '#39FF14', red: '#FF4D4D'};
const FONT = 'Inter, sans-serif';
const TITLE = 'Archivo Black, Inter, sans-serif';
const XF = 10; // cuadros de fundido cruzado
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const norm = (w: string) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9$]/g, '');
const f = (s: number) => Math.round(s * FPS);

// contorno negro hecho con sombras en 24 direcciones (limpio en cualquier navegador)
const borde = (r: number, extra = '') => {
  const s: string[] = [];
  for (const rr of [r, r * 0.6]) for (let a = 0; a < 24; a++) { const t = (a / 24) * Math.PI * 2; s.push(`${(Math.cos(t) * rr).toFixed(2)}px ${(Math.sin(t) * rr).toFixed(2)}px 0 #000`); }
  return s.join(', ') + (extra ? ', ' + extra : '');
};

export const timeline = (plan: Plano[], words: W[], tail = 3.5) => {
  const tok = words.map((w) => norm(w.w));
  const end = words[words.length - 1].e;
  let cur = 0;
  const starts = plan.map((p, i) => {
    if (i === 0) return 0;
    const a = p.a.split(' ').map(norm);
    for (let k = cur; k < tok.length; k++) {
      if (a.every((t, j) => tok[k + j] === t)) { cur = k + a.length; return Math.max(0, words[k].s - 0.15); }
    }
    throw new Error('Ancla no encontrada: ' + p.a);
  });
  let hora: number | undefined;
  const scenes = plan.map((p, i) => {
    if (p.hora !== undefined) hora = p.hora;
    return {...p, start: starts[i], end: i + 1 < plan.length ? starts[i + 1] : end + tail, horaActual: hora};
  });
  return {scenes, frames: Math.round((end + tail) * FPS)};
};
type Sc = Plano & {start: number; end: number; horaActual?: number};

const Escena: React.FC<{sc: Sc; dur: number; words: W[]}> = ({sc, dur, words}) => {
  const fr = useCurrentFrame();
  const at = (w: string, n = 1) => { let k = 0; for (const x of words) if (x.s >= sc.start - 0.05 && norm(x.w) === norm(w) && ++k === n) return f(x.s - sc.start); return 8; };
  const [z0, z1] = sc.z ?? [1.04, 1.14];
  const z = interpolate(fr, [0, dur + XF], [z0, z1], {easing: Easing.inOut(Easing.sin)});
  const [p0, p1] = sc.pan ?? [0, 0];
  const px = interpolate(fr, [0, dur + XF], [p0, p1]);
  const op = interpolate(fr, [0, XF], [0, 1], clamp);
  let shake = 0;
  if (sc.shake) { const d = fr - at(sc.shake); if (d >= 0 && d < 14) shake = Math.sin(d * 2.3) * (14 - d) * 1.3; }
  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity: op}}>
      <Img src={staticFile(sc.img)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        transform: `translate(${px + shake * 0.05}%, ${shake * 0.04}%) scale(${z})`, transformOrigin: `${(sc.fx ?? 0.5) * 100}% ${(sc.fy ?? 0.5) * 100}%`,
        filter: sc.sepia ? 'sepia(0.75) contrast(1.05) brightness(0.92)' : sc.noche ? 'brightness(0.72) saturate(0.85)' : undefined}} />
      {sc.noche && <AbsoluteFill style={{background: 'rgba(20,40,110,0.28)', mixBlendMode: 'multiply'}} />}
      {sc.lluvia && <Lluvia />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 58%, rgba(0,0,0,0.5) 100%)'}} />
      {sc.sepia && <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 4px)'}} />}
      {sc.card && <Cartel text={sc.card} sub={sc.sub} />}
      {sc.cuenta !== undefined && <Cuenta desde={sc.cuenta} />}
      {sc.labels?.map((l, i) => <Etiqueta key={i} l={l} t0={l.at ? at(l.at, l.n) : 10} />)}
    </AbsoluteFill>
  );
};

const Lluvia: React.FC = () => {
  const fr = useCurrentFrame();
  const gotas = React.useMemo(() => Array.from({length: 140}, (_, i) => ({x: (i * 137.5) % 1920, v: 38 + (i % 7) * 6, o: (i * 53) % 1080, l: 40 + (i % 5) * 14})), []);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      {gotas.map((g, i) => { const y = (g.o + fr * g.v) % 1200 - 100; const x = g.x - (y * 0.18); return <line key={i} x1={x} y1={y} x2={x - g.l * 0.18} y2={y + g.l} stroke="rgba(210,230,255,0.55)" strokeWidth={3} strokeLinecap="round" />; })}
    </svg>
  );
};

const Cartel: React.FC<{text: string; sub?: string}> = ({text, sub}) => {
  const fr = useCurrentFrame();
  const s = fr < 7 ? interpolate(fr, [0, 7], [1.6, 0.95], {easing: Easing.out(Easing.cubic)}) : interpolate(fr, [7, 12], [0.95, 1], clamp);
  const op = interpolate(fr, [0, 4, 66, 80], [0, 1, 1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: op, transform: `scale(${s})`}}>
      <div style={{padding: '18px 54px 24px', borderRadius: 26, background: 'rgba(0,0,0,0.55)', border: `6px solid ${C.yel}`, boxShadow: '0 12px 40px rgba(0,0,0,0.5)'}}>
        <div style={{fontFamily: TITLE, fontSize: 132, lineHeight: 1, color: C.yel, textShadow: borde(7, '0 10px 0 #000'), letterSpacing: 2, textAlign: 'center'}}>{text}</div>
        {sub && <div style={{marginTop: 10, fontFamily: TITLE, fontSize: 42, color: C.white, textShadow: borde(4), textAlign: 'center', letterSpacing: 3}}>{sub}</div>}
      </div>
    </div>
  );
};

// reloj fijo arriba a la izquierda: "HORA 14"
const Reloj: React.FC<{hora: number; cambio: number}> = ({hora, cambio}) => {
  const fr = useCurrentFrame();
  const d = fr - cambio;
  const s = d >= 0 && d < 10 ? interpolate(d, [0, 4, 10], [1, 1.25, 1]) : 1;
  return (
    <div style={{position: 'absolute', left: 48, top: 40, display: 'flex', alignItems: 'center', gap: 14, padding: '10px 24px 10px 16px', borderRadius: 18,
      background: 'rgba(0,0,0,0.62)', border: `4px solid ${C.yel}`, transform: `scale(${s})`, transformOrigin: 'left top'}}>
      <svg width={44} height={44} viewBox="0 0 44 44"><circle cx={22} cy={22} r={18} fill="none" stroke={C.yel} strokeWidth={5} /><path d="M22 11 V22 L30 27" stroke={C.yel} strokeWidth={5} fill="none" strokeLinecap="round" /></svg>
      <div style={{fontFamily: TITLE, fontSize: 44, color: C.white, textShadow: borde(3), letterSpacing: 1}}>HORA <span style={{color: C.yel}}>{hora}</span></div>
    </div>
  );
};

const Cuenta: React.FC<{desde: number}> = ({desde}) => {
  const fr = useCurrentFrame();
  const left = Math.max(0, desde - fr / FPS);
  const ss = Math.ceil(left);
  const pulso = 1 + 0.06 * Math.max(0, Math.sin((fr / FPS) * Math.PI * 2));
  return (
    <div style={{position: 'absolute', right: 56, top: 40, padding: '6px 26px', borderRadius: 18, background: 'rgba(120,0,0,0.75)', border: `4px solid ${C.red}`, transform: `scale(${pulso})`, transformOrigin: 'right top'}}>
      <div style={{fontFamily: TITLE, fontSize: 64, color: C.white, textShadow: borde(3)}}>0:{String(ss).padStart(2, '0')}</div>
    </div>
  );
};

const CuentaGlobal: React.FC<{s: number}> = ({s}) => {
  const fr = useCurrentFrame();
  const pulso = 1 + 0.07 * Math.max(0, Math.sin((fr / FPS) * Math.PI * 2));
  return (
    <div style={{position: 'absolute', right: 56, top: 40, padding: '6px 26px', borderRadius: 18, background: 'rgba(120,0,0,0.78)', border: `4px solid ${C.red}`, transform: `scale(${pulso})`, transformOrigin: 'right top'}}>
      <div style={{fontFamily: TITLE, fontSize: 64, color: C.white, textShadow: borde(3)}}>0:{String(s).padStart(2, '0')}</div>
    </div>
  );
};

const Etiqueta: React.FC<{l: Lbl; t0: number}> = ({l, t0}) => {
  const fr = useCurrentFrame() - t0;
  if (fr < 0) return null;
  const s = fr < 6 ? interpolate(fr, [0, 6], [0.4, 1.1]) : interpolate(fr, [6, 10], [1.1, 1], clamp);
  const col = l.c ?? C.yel;
  const T = 22; // tamaño de la flecha
  const flecha = l.flecha;
  const tri: React.CSSProperties = {position: 'absolute', width: 0, height: 0};
  if (flecha === 'abajo') Object.assign(tri, {left: '50%', bottom: -T - 2, transform: 'translateX(-50%)', borderLeft: `${T}px solid transparent`, borderRight: `${T}px solid transparent`, borderTop: `${T}px solid ${col}`});
  if (flecha === 'arriba') Object.assign(tri, {left: '50%', top: -T - 2, transform: 'translateX(-50%)', borderLeft: `${T}px solid transparent`, borderRight: `${T}px solid transparent`, borderBottom: `${T}px solid ${col}`});
  if (flecha === 'izq') Object.assign(tri, {top: '50%', left: -T - 2, transform: 'translateY(-50%)', borderTop: `${T}px solid transparent`, borderBottom: `${T}px solid transparent`, borderRight: `${T}px solid ${col}`});
  if (flecha === 'der') Object.assign(tri, {top: '50%', right: -T - 2, transform: 'translateY(-50%)', borderTop: `${T}px solid transparent`, borderBottom: `${T}px solid transparent`, borderLeft: `${T}px solid ${col}`});
  return (
    <div style={{position: 'absolute', left: `${l.x * 100}%`, top: `${l.y * 100}%`, transform: `translate(-50%, -50%) scale(${s})`}}>
      <div style={{position: 'relative', padding: '8px 24px 10px', borderRadius: 14, background: 'rgba(0,0,0,0.78)', border: `5px solid ${col}`, boxShadow: '0 8px 24px rgba(0,0,0,0.45)'}}>
        <div style={{fontFamily: TITLE, fontSize: 46, color: C.white, whiteSpace: 'nowrap', letterSpacing: 1}}>{l.t}</div>
        {flecha && <div style={tri} />}
      </div>
    </div>
  );
};

const Subtitulos: React.FC<{words: W[]; scenes: Sc[]}> = ({words, scenes}) => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  const chunks = React.useMemo(() => {
    const sceneOf = (x: number) => scenes.findIndex((s) => x >= s.start && x < s.end);
    const raw = makeChunks(words, sceneOf).map((c) => ({words: c, s: c[0].s, e: c[c.length - 1].e}));
    return raw.map((c, i) => ({...c, e: Math.min(c.e + 0.45, raw[i + 1]?.s ?? c.e + 0.45)}));
  }, [words, scenes]);
  const ch = chunks.find((c) => t >= c.s - 0.05 && t < c.e);
  if (!ch) return null;
  const inOp = interpolate(t, [ch.s - 0.05, ch.s + 0.08], [0, 1], clamp);
  return (
    <>
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0) 26%)'}} />
      <div style={{position: 'absolute', bottom: 64, left: 170, right: 170, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 56, lineHeight: 1.18,
        color: C.white, textShadow: borde(4.5, '0 6px 8px rgba(0,0,0,0.6)'), opacity: inOp}}>
        {ch.words.map((w, i) => {
          const on = t >= w.s - 0.03 && t < (ch.words[i + 1]?.s ?? ch.e);
          const dt = (t - w.s) * FPS;
          const sc = on && dt < 6 ? interpolate(dt, [0, 3, 6], [1, 1.12, 1.06], clamp) : on ? 1.06 : 1;
          return <React.Fragment key={i}>{i ? ' ' : ''}<span style={{display: 'inline-block', color: on ? C.yel : C.white, transform: `scale(${sc})`}}>{w.w}</span></React.Fragment>;
        })}
      </div>
    </>
  );
};

// solo ambientes largos y sin cortes; día y río no tienen archivo largo todavía
const AMB: Partial<Record<Amb, string>> = {noche: 'uys-2/sfx/noche-larga.mp3', lluvia: 'uys-2/sfx/lluvia-larga.mp3'};

export const UysVideo: React.FC<{plan: Plano[]; words: W[]; voz: string; musica?: string; musicaVol?: number; ambVol?: number}> = ({plan, words, voz, musica, musicaVol = 0.07, ambVol = 0.16}) => {
  const {scenes, frames} = React.useMemo(() => timeline(plan, words), [plan, words]);
  const fr = useCurrentFrame();
  const at = (sc: Sc, w: string, n = 1) => { let k = 0; for (const x of words) if (x.s >= sc.start - 0.05 && norm(x.w) === norm(w) && ++k === n) return x.s; return sc.start + 0.2; };
  // reloj: hora vigente y cuándo cambió
  const cur = scenes.findIndex((s) => fr / FPS >= s.start && fr / FPS < s.end);
  const sc = scenes[Math.max(0, cur)];
  let cambio = 0; for (let i = Math.max(0, cur); i >= 0; i--) { if (scenes[i].hora !== undefined) { cambio = f(scenes[i].start); break; } }
  // grupos de ambiente contiguos
  const grupos: {amb: Amb; from: number; to: number}[] = [];
  for (const s of scenes) { if (!s.amb) continue; const g = grupos[grupos.length - 1]; if (g && g.amb === s.amb && Math.abs(g.to - s.start) < 0.01) g.to = s.end; else grupos.push({amb: s.amb, from: s.start, to: s.end}); }
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scenes.map((s, i) => { const from = f(s.start), dur = Math.max(1, f(s.end) - from); return <Sequence key={i} from={from} durationInFrames={dur + (i + 1 < scenes.length ? XF : 0)}><Escena sc={s} dur={dur} words={words} /></Sequence>; })}
      {sc?.horaActual !== undefined && !sc.sepia && <Reloj hora={sc.horaActual} cambio={cambio} />}
      {(() => { const ini = scenes.find((x) => x.cuentaIni), fin = scenes.find((x) => x.cuentaFin); const t = fr / FPS;
        if (!ini || !fin || t < ini.start || t >= fin.start + 1.2) return null;
        const left = Math.max(0, Math.ceil(59 * (fin.start - t) / (fin.start - ini.start)));
        return <CuentaGlobal s={left} />; })()}
      <Subtitulos words={words} scenes={scenes} />
      <Audio src={staticFile(voz)} />
      {musica && <Audio src={staticFile(musica)} loop volume={(x) => interpolate(x, [0, 20, frames - 60, frames], [0, musicaVol, musicaVol, 0], clamp)} />}
      {grupos.filter((g) => AMB[g.amb]).map((g, i) => { const d = f(g.to - g.from); return (
        <Sequence key={'amb' + i} from={f(g.from)} durationInFrames={d}>
          <Audio src={staticFile(AMB[g.amb] as string)} loop volume={(x) => interpolate(x, [0, 25, d - 25, d], [0, ambVol, ambVol, 0], clamp)} />
        </Sequence>); })}
      {scenes.flatMap((s, i) => {
        const out: React.ReactNode[] = [];
        const add = (t: number, file: string, v: number) => out.push(<Sequence key={`${i}-${out.length}`} from={Math.max(0, f(t))} durationInFrames={f(6)}><Audio src={staticFile(file)} volume={v} /></Sequence>);
        if (s.card) add(s.start, 'demo3/sfx-impact.mp3', 0.5);
        for (const x of s.sfx ?? []) add((x.at ? at(s, x.at, x.n) : s.start) + (x.off ?? 0), x.s, x.v ?? 0.45);
        return out;
      })}
    </AbsoluteFill>
  );
};
export const uysFrames = (plan: Plano[], words: W[]) => timeline(plan, words).frames;
