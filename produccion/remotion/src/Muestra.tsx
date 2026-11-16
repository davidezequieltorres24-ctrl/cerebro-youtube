// Muestra: cita de libro + estadística animada (todo por código, solo el libro es imagen IA).
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';

const FPS = 30;
export const MUESTRA_FRAMES = 21 * FPS;
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

// ---------- Escena 1: cita de libro (libro 3D 100 % código) ----------
const BW = 380, BH = 520; // tamaño del libro
const AMB = C.amber;
const neonBox = (c: string, w = 5): React.CSSProperties => ({border: `${w}px solid ${c}`, boxShadow: `0 0 14px ${c}, 0 0 40px ${c}66, inset 0 0 18px ${c}55`, borderRadius: 10});
const T = {on: 0, open: 34, riffle: 44, fly: 92, txt1: 118, txt2: 175, mark: 205}; // cuadros
const Libro: React.FC = () => {
  const fr = useCurrentFrame();
  // encendido de neón con parpadeo
  const flick = fr < 22 ? ([0, 1, 0.2, 1, 1, 0.3, 1][Math.floor(fr / 3)] ?? 1) : 1;
  const intro = interpolate(fr, [0, 18], [0.88, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
  const float = Math.sin(fr / 18) * 8;
  const cam = interpolate(fr, [0, 300], [1, 1.06]);
  const cover = interpolate(fr, [T.open, T.open + 16], [0, -158], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const light = interpolate(fr, [T.open + 6, T.open + 20, 120, 300], [0, 1, 0.55, 0.45], clamp);
  // la página que sale volando y se convierte en tarjeta
  const fp = interpolate(fr, [T.fly, T.fly + 26], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const mark = interpolate(fr, [T.mark, T.mark + 16], [0, 100], {...clamp, easing: Easing.out(Easing.quad)});
  const pages = [0, 1, 2, 3, 4, 5];
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 30% 50%, #1a1208, ${C.bg} 65%)`, transform: `scale(${cam})`}}>
      {/* chip y autor */}
      <Chip text="LIBRO · 2017" at={8} c={AMB} x={480} y={120} />
      <div style={{position: 'absolute', left: 410, width: 540, top: 890, textAlign: 'center', opacity: interpolate(fr, [20, 32], [0, 1], clamp)}}>
        <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 34, color: '#c9ced6'}}>Dan Ariely y Jeff Kreisler</div>
      </div>
      {/* libro en 3D */}
      <div style={{position: 'absolute', left: 560, top: 290 + float, width: BW, height: BH, perspective: 1800, opacity: flick, transform: `scale(${intro * 1.12})`}}>
        <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: 'rotateX(10deg) rotateY(-22deg)'}}>
          {/* contratapa + bloque de hojas */}
          <div style={{position: 'absolute', inset: 0, background: '#0d0905', ...neonBox(AMB)}}>
            {[0, 1, 2, 3, 4, 5, 6].map((l) => <div key={l} style={{position: 'absolute', left: 44, right: 44 + ((l + 1) % 3) * 30, top: 78 + l * 52, height: 4, borderRadius: 2, background: `${AMB}66`}} />)}
          </div>
          {[10, 20, 30].map((d) => <div key={d} style={{position: 'absolute', top: 12, bottom: 12, right: -6 + d / 10, width: 2, background: `${AMB}88`}} />)}
          {/* hojas que pasan */}
          {pages.map((i) => {
            const t0 = T.riffle + i * 6;
            const r = interpolate(fr, [t0, t0 + 12], [0, -150 + i * 3], {...clamp, easing: Easing.inOut(Easing.quad)});
            return <div key={i} style={{position: 'absolute', left: 6, top: 8, width: BW - 14, height: BH - 16, transformOrigin: 'left center', transform: `rotateY(${r}deg)`, background: '#140e07', border: `2px solid ${AMB}aa`, borderRadius: 6, boxShadow: `0 0 10px ${AMB}55`}}>
              {[0, 1, 2, 3, 4, 5, 6].map((l) => <div key={l} style={{position: 'absolute', left: 40, right: 40 + (l % 3) * 30, top: 70 + l * 52, height: 4, borderRadius: 2, background: `${AMB}55`}} />)}
            </div>;
          })}
          {/* tapa con el título */}
          <div style={{position: 'absolute', inset: 0, transformOrigin: 'left center', transform: `rotateY(${cover}deg)`, transformStyle: 'preserve-3d'}}>
            <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', background: '#120c06', ...neonBox(AMB, 6), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center'}}>
              <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 58, lineHeight: 1.05, ...neon(AMB)}}>DOLLARS<br />AND<br />SENSE</div>
              <div style={{width: 160, height: 4, margin: '26px 0', background: AMB, boxShadow: `0 0 12px ${AMB}`}} />
              <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 24, color: '#e9d7b8', letterSpacing: 2}}>ARIELY · KREISLER</div>
            </div>
            <div style={{position: 'absolute', inset: 0, transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', background: '#0d0905', ...neonBox(AMB)}} />
          </div>
        </div>
      </div>
      {/* luz que sale del libro */}
      <div style={{position: 'absolute', left: 440, top: 120, width: 640, height: 760, opacity: light * flick, background: `radial-gradient(ellipse at 50% 55%, ${AMB}aa, ${AMB}33 35%, transparent 70%)`, mixBlendMode: 'screen'}} />
      {/* partículas */}
      {Array.from({length: 22}).map((_, i) => {
        const t0 = T.open + 8 + i * 6;
        const q = (fr - t0) / 70;
        if (q < 0 || q > 1) return null;
        const x = 740 + Math.sin(i * 12.9898) * 120 + Math.sin(fr / 10 + i) * 14;
        const y = 560 - q * 420;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 8 + (i % 3) * 4, height: 8 + (i % 3) * 4, borderRadius: '50%', background: '#ffe2b0', boxShadow: `0 0 12px ${AMB}, 0 0 24px ${AMB}`, opacity: Math.sin(q * Math.PI)}} />;
      })}
      {/* página que vuela y se convierte en tarjeta con la idea */}
      {fp > 0 && (
        <div style={{position: 'absolute', left: interpolate(fp, [0, 1], [700, 1030]), top: interpolate(fp, [0, 1], [330, 280]) + Math.sin(fr / 22) * 4, width: 780, transformOrigin: 'left center',
          transform: `perspective(1600px) rotateY(${interpolate(fp, [0, 1], [-70, -6])}deg) rotateZ(${interpolate(fp, [0, 1], [-8, 1])}deg) scale(${interpolate(fp, [0, 1], [0.35, 1])})`,
          background: 'linear-gradient(160deg, #1a130a, #0b0805)', ...neonBox(C.yel, 4), padding: '46px 56px', boxSizing: 'border-box'}}>
          {/* esquina doblada */}
          <div style={{position: 'absolute', right: -4, top: -4, width: 0, height: 0, borderLeft: '46px solid #3a2a12', borderTop: `46px solid ${C.bg}`}} />
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: C.yel, opacity: interpolate(fr, [T.fly + 20, T.fly + 30], [0, 1], clamp)}}>LA IDEA DEL LIBRO</div>
          <Reveal text="La tarjeta separa el momento de disfrutar del momento de pagar." at={T.txt1} size={46} weight={400} stagger={0.5} style={{fontFamily: 'DejaVu Serif, serif', fontStyle: 'italic', marginTop: 22, color: '#f3ead8'}} />
          <div style={{marginTop: 34, fontFamily: FONT, fontWeight: 900, fontSize: 48, opacity: interpolate(fr, [T.txt2, T.txt2 + 10], [0, 1], clamp), transform: `translateY(${interpolate(fr, [T.txt2, T.txt2 + 10], [16, 0], clamp)}px)`, color: C.white}}>
            Por eso{' '}
            <span style={{position: 'relative', display: 'inline-block', whiteSpace: 'nowrap'}}>
              <span style={{position: 'absolute', left: -8, top: 6, bottom: 2, width: mark > 0 ? `calc(${mark}% + 16px)` : 0, background: C.yel, opacity: 0.9, borderRadius: 6, transform: 'skewX(-8deg)', boxShadow: `0 0 18px ${C.yel}aa`}} />
              <span style={{position: 'relative', color: mark > 50 ? '#141008' : C.white}}>duele menos</span>
            </span>
            <br />
            <span style={{...neon(C.red)}}>… y gastas más.</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- Escena 2: estadística animada ----------
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
  const S2 = 10 * FPS;
  const sfx = (t: number, s: string, v = 0.45) => <Sequence from={t} durationInFrames={FPS * 3}><Audio src={staticFile(s)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Sequence durationInFrames={S2}><Libro /></Sequence>
      <Sequence from={S2}><Stats /></Sequence>
      <Leak at={S2 - 4} />
      <Audio src={staticFile('n-musica.mp3')} volume={(f) => interpolate(f, [0, 15, MUESTRA_FRAMES - 30, MUESTRA_FRAMES], [0, 0.12, 0.12, 0], clamp)} />
      {sfx(2, 'demo3/sfx-beep.mp3', 0.25)}
      {sfx(34, 'n-sfx-whoosh.mp3', 0.4)}
      {sfx(46, 'n-sfx-whoosh.mp3', 0.2)}
      {sfx(56, 'n-sfx-whoosh.mp3', 0.2)}
      {sfx(88, 'n-sfx-whoosh.mp3', 0.45)}
      {sfx(175, 'n-sfx-pop.mp3', 0.4)}
      {sfx(205, 'demo3/sfx-impact.mp3', 0.45)}
      {sfx(S2 - 3, 'n-sfx-whoosh.mp3', 0.35)}
      {sfx(S2 + 50, 'n-sfx-pop.mp3', 0.4)}
      {sfx(S2 + 110, 'n-sfx-pop.mp3', 0.45)}
      {sfx(S2 + 175, 'demo3/sfx-riser.mp3', 0.5)}
      {sfx(S2 + 200, 'demo3/sfx-impact.mp3', 0.6)}
    </AbsoluteFill>
  );
};
