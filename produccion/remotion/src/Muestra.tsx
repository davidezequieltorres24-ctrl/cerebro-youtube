// Muestra: estadística animada, 100 % código. (La cita de libro animada se descartó: al dueño le pareció forzada.)
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';

const FPS = 30;
export const MUESTRA_FRAMES = 11 * FPS;
const C = {bg: '#050608', green: '#3DDC84', yel: '#FFD60A', cyan: '#33E1FF', red: '#FF3B30', amber: '#FFB547', white: '#F5F3EE', grey: '#9AA0AA'};
const FONT = 'Inter, sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const glow = (c: string, r = 16) => `drop-shadow(0 0 ${r / 3}px ${c}) drop-shadow(0 0 ${r}px ${c})`;
const tint = (c: string) => `color-mix(in srgb, ${c} 35%, white)`;
const neon = (c: string): React.CSSProperties => ({color: tint(c), WebkitTextStroke: `2px ${c}`, paintOrder: 'stroke fill', textShadow: `0 0 6px ${c}aa, 0 0 18px ${c}55, 0 4px 14px #000`});

// texto que se revela letra por letra, agrupado por palabra (nunca corta una palabra)
const Reveal: React.FC<{text: string; at: number; size: number; color?: string; weight?: number; stagger?: number; style?: React.CSSProperties}> = ({text, at, size, color = C.white, weight = 800, stagger = 0.8, style}) => {
  const fr = useCurrentFrame() - at;
  let k = 0;
  return (
    <div style={{fontFamily: FONT, fontWeight: weight, fontSize: size, color, lineHeight: 1.2, ...style}}>
      {text.split(' ').map((w, wi) => (
        <React.Fragment key={wi}>
          {wi > 0 && (k++, ' ')}
          <span style={{display: 'inline-block', whiteSpace: 'nowrap'}}>
            {w.split('').map((ch) => {
              const p = interpolate(fr - k++ * stagger, [0, 8], [0, 1], clamp);
              return <span key={k} style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 10}px)`}}>{ch}</span>;
            })}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};
const Draw: React.FC<{d: string; at: number; dur: number; color: string; w?: number; dash?: boolean}> = ({d, at, dur, color, w = 6, dash}) => {
  const p = interpolate(useCurrentFrame(), [at, at + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  if (p <= 0) return null;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, filter: glow(color, 12), overflow: 'visible'}}>
      <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash ? undefined : `${p} 1`} opacity={dash ? p : 1} style={dash ? {strokeDasharray: '14 14'} : undefined} />
    </svg>
  );
};
const box = (x: number, y: number, w: number, h: number, r = 22) =>
  `M ${x + r} ${y} H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r} V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r} V ${y + r} Q ${x} ${y} ${x + r} ${y}`;
const Chip: React.FC<{text: string; at: number; c: string; x: number; y: number}> = ({text, at, c, x, y}) => {
  const fr = useCurrentFrame() - at;
  const s = fr < 0 ? 0 : fr < 7 ? interpolate(fr, [0, 7], [0.7, 1.1]) : interpolate(fr, [7, 12], [1.1, 1], clamp);
  return <div style={{position: 'absolute', left: x, top: y, transform: `scale(${s})`, transformOrigin: 'left center', opacity: fr < 0 ? 0 : 1, padding: '8px 18px', borderRadius: 10, border: `3px solid ${c}`, boxShadow: `0 0 18px ${c}88`, fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 2, ...neon(c)}}>{text}</div>;
};

// ---------- Estadística animada (modelo aprobado por el dueño) ----------
const BASE = 860, SCALE = 8.2; // px por dólar
const Bar: React.FC<{x: number; value: number; at: number; c: string; label: string}> = ({x, value, at, c, label}) => {
  const fr = useCurrentFrame();
  const p = interpolate(fr, [at, at + 36], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const h = value * SCALE * p;
  const n = Math.round(value * p);
  return (
    <>
      {p > 0 && <div style={{position: 'absolute', left: x, top: BASE - h, width: 230, height: h, borderRadius: '14px 14px 0 0', border: `5px solid ${c}`, borderBottom: 'none', background: `linear-gradient(${c}55, ${c}10)`, boxShadow: `0 0 26px ${c}88, inset 0 0 30px ${c}44`}} />}
      <div style={{position: 'absolute', left: x - 60, width: 350, top: BASE - h - 120, textAlign: 'center', opacity: p > 0 ? 1 : 0, fontFamily: FONT, fontWeight: 900, fontSize: 96, ...neon(c)}}>${n}</div>
      <div style={{position: 'absolute', left: x - 60, width: 350, top: BASE + 22, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 3, color: C.white, opacity: interpolate(fr, [at - 10, at], [0, 1], clamp)}}>{label}</div>
    </>
  );
};
const Stats: React.FC = () => {
  const fr = useCurrentFrame();
  const xAt = 200;
  const s = fr < xAt ? 0 : fr < xAt + 7 ? interpolate(fr, [xAt, xAt + 7], [0.6, 1.15]) : interpolate(fr, [xAt + 7, xAt + 13], [1.15, 1], clamp);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #10131a, ${C.bg} 70%)`}}>
      <Chip text="ESTUDIO · MIT 2001" at={4} c={C.cyan} x={150} y={80} />
      <div style={{position: 'absolute', left: 150, top: 160, width: 1650}}>
        <Reveal text="Subasta real de entradas: ¿cuánto ofreció la gente?" at={12} size={50} weight={800} stagger={0.4} />
      </div>
      <Draw d={`M 330 ${BASE} H 1150`} at={30} dur={16} color={C.grey} w={4} />
      <Bar x={420} value={29} at={50} c={C.grey} label="EFECTIVO" />
      <Bar x={800} value={61} at={110} c={C.red} label="TARJETA" />
      {/* línea guía: el nivel del efectivo cruza hasta la barra de tarjeta */}
      <Draw d={`M 420 ${BASE - 29 * SCALE} H 1030`} at={165} dur={14} color={C.white} w={3} dash />
      <div style={{position: 'absolute', left: 1240, top: 380, transform: `scale(${s})`, opacity: fr < xAt ? 0 : 1, textAlign: 'center'}}>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 230, lineHeight: 1, ...neon(C.yel)}}>×2,1</div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 42, color: C.white, marginTop: 10}}>más con tarjeta</div>
      </div>
      <div style={{position: 'absolute', left: 150, right: 150, bottom: 46, fontFamily: FONT, fontWeight: 600, fontSize: 26, color: '#8a909a', opacity: interpolate(fr, [60, 80], [0, 1], clamp)}}>
        Prelec y Simester, Marketing Letters (2001) · promedio de las ofertas por entradas de los Boston Celtics (~$29 vs. ~$61)
      </div>
    </AbsoluteFill>
  );
};

const Leak: React.FC<{at: number}> = ({at}) => {
  const fr = useCurrentFrame() - at;
  const o = interpolate(fr, [0, 3, 8], [0, 0.85, 0], clamp);
  return o > 0 ? <AbsoluteFill style={{background: 'radial-gradient(circle at 30% 40%, rgba(255,150,60,1), rgba(255,80,140,0.5) 40%, transparent 70%)', opacity: o, mixBlendMode: 'screen'}} /> : null;
};

export const Muestra: React.FC = () => {
  const S2 = 0;
  const sfx = (t: number, s: string, v = 0.45) => <Sequence from={t} durationInFrames={FPS * 3}><Audio src={staticFile(s)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Stats />
      <Audio src={staticFile('n-musica.mp3')} volume={(f) => interpolate(f, [0, 15, MUESTRA_FRAMES - 30, MUESTRA_FRAMES], [0, 0.12, 0.12, 0], clamp)} />
      {sfx(0, 'n-sfx-whoosh.mp3', 0.35)}
      {sfx(S2 + 50, 'n-sfx-pop.mp3', 0.4)}
      {sfx(S2 + 110, 'n-sfx-pop.mp3', 0.45)}
      {sfx(S2 + 175, 'demo3/sfx-riser.mp3', 0.5)}
      {sfx(S2 + 200, 'demo3/sfx-impact.mp3', 0.6)}
    </AbsoluteFill>
  );
};
