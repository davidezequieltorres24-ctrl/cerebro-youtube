// Motor de video de Universo Y Si: dibujo 2D plano + movimiento por código.
// Cada escena empieza en su frase ancla (a) y muestra un plano (img) con zoom de cámara.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, Easing, continueRender, delayRender} from 'remotion';

// fuente de títulos (Archivo Black) cargada desde public/fonts
const fontHandle = typeof window !== 'undefined' ? delayRender('Archivo Black') : null;
if (typeof window !== 'undefined') {
  new FontFace('Archivo Black', `url(${staticFile('fonts/ArchivoBlack.ttf')})`).load()
    .then((f) => { (document as any).fonts.add(f); if (fontHandle !== null) continueRender(fontHandle); })
    .catch(() => { if (fontHandle !== null) continueRender(fontHandle); });
}
// contorno negro hecho con sombras (funciona en cualquier navegador)
const borde = (r: number, extra = '') => {
  const s: string[] = [];
  for (let a = 0; a < 16; a++) { const t = (a / 16) * Math.PI * 2; s.push(`${(Math.cos(t) * r).toFixed(1)}px ${(Math.sin(t) * r).toFixed(1)}px 0 #000`); }
  return s.join(', ') + (extra ? ', ' + extra : '');
};
import {makeChunks} from './captionChunks';

export const FPS = 30;
export type Lbl = {t: string; x: number; y: number; at?: string; n?: number; c?: string};
export type Fx = {s: string; at?: string; n?: number; v?: number; off?: number};
export type Plano = {
  a: string;                 // primeras palabras dichas en este plano
  img: string;               // ruta dentro de public/
  z?: [number, number];      // zoom inicial y final
  fx?: number; fy?: number;  // punto de foco (0–1)
  pan?: [number, number];    // desplazamiento horizontal en % (inicio, fin)
  card?: string;             // cartel grande tipo "HORA 0"
  sub?: string;              // línea chica bajo el cartel
  labels?: Lbl[];            // etiquetas con nombre (aparecen en la palabra "at")
  sepia?: boolean;           // flashback
  shake?: string;            // palabra donde la cámara tiembla
  sfx?: Fx[];
};
type W = {w: string; s: number; e: number};
const C = {white: '#FFFFFF', yel: '#FFD60A', green: '#39FF14', black: '#000000'};
const FONT = 'Inter, sans-serif';
const TITLE = 'Archivo Black, Inter, sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const norm = (w: string) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9$]/g, '');

export const timeline = (plan: Plano[], words: W[], tail = 3) => {
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
  return {
    scenes: plan.map((p, i) => ({...p, start: starts[i], end: i + 1 < plan.length ? starts[i + 1] : end + tail})),
    frames: Math.round((end + tail) * FPS),
  };
};
type Sc = Plano & {start: number; end: number};
const f = (s: number) => Math.round(s * FPS);

const Escena: React.FC<{sc: Sc; dur: number; words: W[]}> = ({sc, dur, words}) => {
  const fr = useCurrentFrame();
  const at = (w: string, n = 1) => { let k = 0; for (const x of words) if (x.s >= sc.start - 0.05 && norm(x.w) === norm(w) && ++k === n) return f(x.s - sc.start); return 8; };
  const [z0, z1] = sc.z ?? [1.04, 1.14];
  const z = interpolate(fr, [0, dur], [z0, z1], {easing: Easing.inOut(Easing.sin)});
  const [p0, p1] = sc.pan ?? [0, 0];
  const px = interpolate(fr, [0, dur], [p0, p1]);
  const inOp = interpolate(fr, [0, 6], [0, 1], clamp);
  const sIn = interpolate(fr, [0, 8], [1.06, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  let shake = 0;
  if (sc.shake) { const t0 = at(sc.shake); const d = fr - t0; if (d >= 0 && d < 12) shake = Math.sin(d * 2.4) * (12 - d) * 1.4; }
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Img src={staticFile(sc.img)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: inOp,
        transform: `translate(${px + shake * 0.05}%, ${shake * 0.04}%) scale(${z * sIn})`, transformOrigin: `${(sc.fx ?? 0.5) * 100}% ${(sc.fy ?? 0.5) * 100}%`,
        filter: sc.sepia ? 'sepia(0.75) contrast(1.05) brightness(0.92)' : undefined}} />
      {/* viñeta */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
      {sc.sepia && <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 4px)'}} />}
      {sc.card && <Cartel text={sc.card} sub={sc.sub} />}
      {sc.labels?.map((l, i) => <Etiqueta key={i} l={l} t0={l.at ? at(l.at, l.n) : 10} />)}
    </AbsoluteFill>
  );
};

const Cartel: React.FC<{text: string; sub?: string}> = ({text, sub}) => {
  const fr = useCurrentFrame();
  const s = fr < 7 ? interpolate(fr, [0, 7], [1.6, 0.95], {easing: Easing.out(Easing.cubic)}) : interpolate(fr, [7, 12], [0.95, 1], clamp);
  const op = interpolate(fr, [0, 4, 70, 84], [0, 1, 1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: op, transform: `scale(${s})`}}>
      <div style={{fontFamily: TITLE, fontSize: 120, color: C.yel, textShadow: borde(8, '0 12px 0 #000, 0 0 40px rgba(0,0,0,0.6)'), letterSpacing: 2}}>{text}</div>
      {sub && <div style={{marginTop: 4, fontFamily: TITLE, fontSize: 44, color: C.white, textShadow: borde(5, '0 6px 0 #000')}}>{sub}</div>}
    </div>
  );
};

const Etiqueta: React.FC<{l: Lbl; t0: number}> = ({l, t0}) => {
  const fr = useCurrentFrame() - t0;
  if (fr < 0) return null;
  const s = fr < 6 ? interpolate(fr, [0, 6], [0.5, 1.12]) : interpolate(fr, [6, 10], [1.12, 1], clamp);
  return (
    <div style={{position: 'absolute', left: `${l.x * 100}%`, top: `${l.y * 100}%`, transform: `translate(-50%, -50%) scale(${s})`,
      fontFamily: TITLE, fontSize: 58, color: l.c ?? C.white, textShadow: borde(6, '0 8px 0 #000'), whiteSpace: 'nowrap'}}>{l.t}</div>
  );
};

const Subtitulos: React.FC<{words: W[]; scenes: Sc[]}> = ({words, scenes}) => {
  const t = useCurrentFrame() / FPS;
  const sceneOf = (x: number) => scenes.findIndex((s) => x >= s.start && x < s.end);
  const chunks = React.useMemo(() => {
    const raw = makeChunks(words, sceneOf).map((c) => ({words: c, s: c[0].s, e: c[c.length - 1].e}));
    return raw.map((c, i) => ({...c, e: Math.min(c.e + 0.5, raw[i + 1]?.s ?? c.e + 0.5)}));
  }, [words]); // eslint-disable-line react-hooks/exhaustive-deps
  const ch = chunks.find((c) => t >= c.s - 0.05 && t < c.e);
  if (!ch) return null;
  return (
    <div style={{position: 'absolute', bottom: 60, left: 140, right: 140, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 50, lineHeight: 1.2,
      color: C.white, textShadow: borde(4, '0 5px 0 #000')}}>
      {ch.words.map((w, i) => {
        const on = t >= w.s - 0.03 && t < (ch.words[i + 1]?.s ?? ch.e);
        return <span key={i} style={{color: on ? C.yel : C.white}}>{(i ? ' ' : '') + w.w}</span>;
      })}
    </div>
  );
};

export const UysVideo: React.FC<{plan: Plano[]; words: W[]; voz: string; musica?: string; musicaVol?: number}> = ({plan, words, voz, musica, musicaVol = 0.08}) => {
  const {scenes, frames} = timeline(plan, words);
  const at = (sc: Sc, w: string, n = 1) => { let k = 0; for (const x of words) if (x.s >= sc.start - 0.05 && norm(x.w) === norm(w) && ++k === n) return x.s; return sc.start + 0.2; };
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scenes.map((sc, i) => { const from = f(sc.start), dur = Math.max(1, f(sc.end) - from); return <Sequence key={i} from={from} durationInFrames={dur}><Escena sc={sc} dur={dur} words={words} /></Sequence>; })}
      <Subtitulos words={words} scenes={scenes} />
      <Audio src={staticFile(voz)} />
      {musica && <Audio src={staticFile(musica)} loop volume={(fr) => interpolate(fr, [0, 20, frames - 60, frames], [0, musicaVol, musicaVol, 0], clamp)} />}
      {scenes.flatMap((sc, i) => {
        const out: React.ReactNode[] = [];
        const add = (t: number, s: string, v: number) => out.push(<Sequence key={`${i}-${out.length}`} from={Math.max(0, f(t))} durationInFrames={f(4)}><Audio src={staticFile(s)} volume={v} /></Sequence>);
        if (i > 0) add(sc.start - 0.05, 'n-sfx-whoosh.mp3', 0.25);
        if (sc.card) add(sc.start, 'demo3/sfx-impact.mp3', 0.5);
        for (const x of sc.sfx ?? []) add((x.at ? at(sc, x.at, x.n) : sc.start) + (x.off ?? 0), x.s, x.v ?? 0.45);
        return out;
      })}
    </AbsoluteFill>
  );
};
export const uysFrames = (plan: Plano[], words: W[]) => timeline(plan, words).frames;
