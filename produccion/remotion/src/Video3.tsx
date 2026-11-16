// Video 3 — "Por qué pagar con tarjeta te hace gastar más" (estilo Isaac, sin clips: movimiento por código)
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, Easing, random} from 'remotion';
import words from './words-v3.json';
import {PLAN3, Sc} from './plan3';

const FPS = 30;
const W_ = words as {w: string; s: number; e: number}[];
const VOICE_END = W_[W_.length - 1].e;
const END_CARD = 12;
export const V3_FRAMES = Math.round((VOICE_END + END_CARD) * FPS);
const f = (s: number) => Math.round(s * FPS);
const C = {bg: '#050608', green: '#3DDC84', yel: '#FFD60A', cyan: '#33E1FF', red: '#FF3B30', amber: '#FFB547', white: '#F5F3EE', pink: '#FF6FAE'};
const FONT = 'Inter, sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const norm = (w: string) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9$]/g, '');

// ---------- tiempos: cada escena empieza en su frase ancla ----------
const TOK = W_.map((w) => norm(w.w));
type Timed = Sc & {start: number; end: number};
const TIMED: Timed[] = (() => {
  let cur = 0;
  const starts = PLAN3.map((sc) => {
    if (sc.a === '@end') return VOICE_END + 0.4;
    const a = sc.a.split(' ').map(norm);
    for (let i = cur; i < TOK.length; i++) {
      if (a.every((t, k) => TOK[i + k] === t)) { cur = i + a.length; return Math.max(0, W_[i].s - 0.12); }
    }
    throw new Error('Ancla no encontrada: ' + sc.a);
  });
  return PLAN3.map((sc, i) => ({...sc, start: i === 0 ? 0 : starts[i], end: i + 1 < PLAN3.length ? starts[i + 1] : VOICE_END + END_CARD}));
})();
// segundo (relativo a la escena) en que se dice una palabra dentro de la escena
const wAt = (sc: Timed, w: string, nth = 1) => {
  let n = 0;
  for (const x of W_) if (x.s >= sc.start && norm(x.w) === norm(w) && ++n === nth) return x.s - sc.start;
  return 0.3;
};

// ---------- texto legible ----------
const tint = (c: string) => `color-mix(in srgb, ${c} 35%, white)`;
const neonText = (c: string): React.CSSProperties => ({color: tint(c), WebkitTextStroke: `2px ${c}`, paintOrder: 'stroke fill', textShadow: `0 0 6px ${c}aa, 0 0 18px ${c}55, 0 4px 14px #000`});
const glow = (c: string, r = 16) => `drop-shadow(0 0 ${r / 3}px ${c}) drop-shadow(0 0 ${r}px ${c})`;
const popScale = (fr: number) => fr < 0 ? 0 : fr < 7 ? interpolate(fr, [0, 7], [0.7, 1.1], {easing: Easing.out(Easing.quad)}) : interpolate(fr, [7, 12], [1.1, 1], clamp);
const Pop: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const fr = useCurrentFrame() - at;
  if (fr < 0) return null;
  return <div style={{transform: `scale(${popScale(fr)})`, opacity: interpolate(fr, [0, 3], [0, 1], clamp)}}>{children}</div>;
};
const BlurText: React.FC<{text: string; at: number; size: number; color?: string; weight?: number; stagger?: number; neon?: string}> = ({text, at, size, color = C.white, weight = 900, stagger = 1, neon}) => {
  const fr = useCurrentFrame() - at;
  return (
    <span style={{fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: -1, whiteSpace: 'pre-wrap', textAlign: 'center', ...(neon ? neonText(neon) : {textShadow: '0 3px 12px #000'})}}>
      {text.split('').map((ch, i) => {
        const p = interpolate(fr - i * stagger, [0, 8], [0, 1], clamp);
        return <span key={i} style={{opacity: p, filter: p < 1 ? `blur(${(1 - p) * 9}px)` : undefined, display: 'inline-block', whiteSpace: 'pre'}}>{ch}</span>;
      })}
    </span>
  );
};
const Stroke: React.FC<{d: string; at: number; dur: number; color: string; width?: number}> = ({d, at, dur, color, width = 7}) => {
  const p = interpolate(useCurrentFrame(), [at, at + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  if (p <= 0) return null;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, filter: glow(color), overflow: 'visible'}}>
      <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${p} 1`} />
    </svg>
  );
};
const box = (x: number, y: number, w: number, h: number, r = 24) =>
  `M ${x + w / 2} ${y} H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r} V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r} V ${y + r} Q ${x} ${y} ${x + r} ${y} H ${x + w / 2}`;
const Center: React.FC<{children: React.ReactNode; y?: number}> = ({children, y = 540}) => (
  <div style={{position: 'absolute', left: 120, right: 120, top: y, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center'}}>{children}</div>
);
const Dark: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #10131a, ${C.bg} 70%)`}}>{children}</AbsoluteFill>;
const Sphere: React.FC<{x: number; y: number; r: number; color: string; sx?: number; sy?: number; label?: string; op?: number}> = ({x, y, r, color, sx = 1, sy = 1, label, op = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, transform: `translate(-50%,-50%) scale(${sx},${sy})`, opacity: op}}>
    <div style={{width: '100%', height: '100%', borderRadius: '50%', background: `radial-gradient(circle at 40% 38%, #fff8 0%, ${color} 35%, ${color} 70%)`, boxShadow: `0 0 ${r * 0.5}px ${color}, 0 0 ${r * 1.2}px ${color}88`}} />
    {label && <div style={{position: 'absolute', top: '100%', width: 400, left: '50%', marginLeft: -200, marginTop: 30, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.white, letterSpacing: 2}}>{label}</div>}
  </div>
);

// ---------- movimiento por código sobre las ilustraciones ----------
const TINT: Record<string, string | undefined> = {amber: undefined, red: 'hue-rotate(-28deg) saturate(1.6)', green: 'hue-rotate(95deg) saturate(1.15) brightness(1.05)', cyan: 'hue-rotate(160deg) saturate(1.2)'};
const LineArt: React.FC<{src: string; dur: number; z: [number, number]; fx: number; fy: number; tint?: string; draw?: boolean; beats?: number[]}> = ({src, dur, z, fx, fy, tint = 'amber', draw = true, beats = []}) => {
  const fr = useCurrentFrame();
  const t = interpolate(fr, [0, dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  // 1) "se enciende": barrido diagonal con borde suave (el dibujo aparece como si se iluminara)
  const rev = draw ? interpolate(fr, [0, 16], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) : 1;
  const mask = rev >= 1 ? undefined : `linear-gradient(110deg, #000 ${rev * 130 - 30}%, transparent ${rev * 130}%)`;
  // 2) parpadeo de neón al encender + respiración suave del brillo
  const flick = fr < 10 ? (random('fl' + src + fr) > 0.35 ? 1 : 0.55) : 1;
  const breathe = 1 + Math.sin(fr / 18) * 0.06;
  const beat = beats.reduce((a, b) => a + Math.max(0, 1 - Math.abs(fr - b) / 5), 0);
  // 3) barrido de luz que recorre las líneas (una vez por escena)
  const sw = interpolate(fr, [Math.min(18, dur * 0.3), Math.min(18, dur * 0.3) + 26], [-40, 140], clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000', transform: `scale(${1 + beat * 0.02})`}}>
      <AbsoluteFill style={{WebkitMaskImage: mask, maskImage: mask}}>
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z[0] + (z[1] - z[0]) * t})`, transformOrigin: `${fx * 100}% ${fy * 100}%`,
          filter: [TINT[tint], `brightness(${flick * breathe})`].filter(Boolean).join(' ')}} />
        <AbsoluteFill style={{mixBlendMode: 'screen', background: `linear-gradient(110deg, transparent ${sw - 12}%, rgba(255,230,190,.28) ${sw}%, transparent ${sw + 12}%)`}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(${tint === 'red' ? '70,0,0' : '0,0,0'},${0.6 + beat * 0.3}) 100%)`}} />
    </AbsoluteFill>
  );
};
const Photo: React.FC<{src: string; dur: number}> = ({src, dur}) => {
  const fr = useCurrentFrame();
  const t = interpolate(fr, [0, dur], [0, 1], clamp);
  const x = interpolate(fr, [0, 8], [380, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{overflow: 'hidden', transform: `translateX(${x}px)`}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.15 + 0.15 * t})`, transformOrigin: '35% 60%', filter: 'contrast(1.1) saturate(1.1)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,.8) 100%)'}} />
    </AbsoluteFill>
  );
};
const Dust: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: 22}).map((_, i) => {
        const x = (random('x' + i) * 1920 + fr * (0.3 + random('v' + i))) % 1920;
        const y = (random('y' + i) * 1080 - fr * (0.2 + random('u' + i) * 0.6) + 4320) % 1080;
        const s = 2 + random('s' + i) * 4;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: `rgba(255,200,120,${0.2 + random('o' + i) * 0.4})`}} />;
      })}
    </AbsoluteFill>
  );
};
const LightLeak: React.FC<{at: number; hue?: string}> = ({at, hue = '255,150,60'}) => {
  const fr = useCurrentFrame() - at, dur = 9;
  if (fr < -1 || fr > dur) return null;
  const p = fr / dur, a = Math.sin(Math.PI * Math.min(1, Math.max(0, p)));
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: a}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 120% at ${-20 + p * 140}% 50%, rgba(${hue},1) 0%, rgba(255,90,140,.7) 35%, rgba(0,0,0,0) 70%)`}} />
      <AbsoluteFill style={{background: `rgba(255,240,220,${a * 0.45})`}} />
    </AbsoluteFill>
  );
};

// ---------- tableros ----------
const MAP = ['NO VES EL PRECIO', 'NO VES LO QUE GASTASTE', 'NO VES QUÉ COMPRAS'];
const MapBoard: React.FC<{active: number}> = ({active}) => {
  const fr = useCurrentFrame();
  return (
    <Dark>
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center'}}><BlurText text="LO QUE TU CEREBRO DEJA DE VER" at={0} size={58} color="#cfd3da" weight={800} stagger={0.4} /></div>
      {MAP.map((m, i) => {
        const appear = active === 0 ? i * 10 + 6 : 0;
        const on = active === i + 1;
        const col = on ? (i === 2 ? C.red : C.yel) : '#5b6170';
        const pulse = on ? 1 + Math.sin(fr / 5) * 0.015 : 1;
        const y = 300 + i * 200;
        return (
          <React.Fragment key={i}>
            <Stroke d={box(460, y, 1000, 150, 22)} at={appear} dur={12} color={col} width={on ? 7 : 4} />
            <div style={{position: 'absolute', left: 460, top: y, width: 1000, height: 150, display: 'flex', alignItems: 'center', gap: 36, paddingLeft: 50, transform: `scale(${pulse})`, opacity: active === 0 || on ? 1 : 0.45}}>
              <Pop at={appear + 6}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 84, ...(on ? neonText(col) : {color: '#9aa0ab'})}}>{i + 1}</span></Pop>
              <BlurText text={m} at={appear + 8} size={58} color={on ? C.white : '#9aa0ab'} weight={800} stagger={0.4} />
            </div>
          </React.Fragment>
        );
      })}
    </Dark>
  );
};
const Bills: React.FC<{ts: number[]; green?: boolean}> = ({ts, green}) => {
  const fr = useCurrentFrame();
  const cols = green ? [C.green, C.green, C.green, C.green] : [C.green, C.yel, C.amber, C.red];
  const shake = !green && fr > ts[3] ? Math.sin(fr * 1.7) * interpolate(fr - ts[3], [0, 20], [6, 0], clamp) : 0;
  return (
    <Dark>
      <AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
        {ts.map((t, i) => (
          <React.Fragment key={i}>
            <Stroke d={box(250 + i * 370, 430, 320, 170, 18)} at={t} dur={9} color={cols[i]} />
            {fr >= t + 4 && <div style={{position: 'absolute', left: 250 + i * 370, top: 430, width: 320, height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Pop at={t + 4}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 96, ...neonText(cols[i])}}>{i + 1}</span></Pop></div>}
          </React.Fragment>
        ))}
      </AbsoluteFill>
    </Dark>
  );
};

type Ctx = {sc: Timed; dur: number};
const BoardView: React.FC<Ctx> = ({sc, dur}) => {
  const fr = useCurrentFrame();
  const at = (w: string, n = 1) => f(wAt(sc, w, n));
  const b = sc.b!;
  switch (b.k) {
    case 'title': return (
      <Dark>
        <Center y={b.sub ? 480 : 520}><BlurText text={b.text} at={2} size={b.size ?? 110} neon={b.c} stagger={0.6} /></Center>
        {b.sub && <Center y={640}><BlurText text={b.sub} at={10} size={52} color="#c9ced6" weight={600} stagger={0.4} /></Center>}
        {b.line && <Stroke d="M 420 610 C 800 640, 1200 590, 1500 615 S 1880 650, 2050 570" at={10} dur={18} color={b.c ?? C.yel} width={8} />}
      </Dark>);
    case 'big': {
      const t = b.at ? at(b.at, b.n) : 6;
      return (
        <Dark>
          {b.small && <Center y={360}><BlurText text={b.small} at={2} size={58} color="#c9ced6" weight={700} stagger={0.5} /></Center>}
          {fr >= t && <Center y={540}><Pop at={t}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: b.size ?? 150, letterSpacing: -3, ...(b.c ? neonText(b.c) : {color: C.white, textShadow: '0 4px 20px #000'})}}>{b.big}</span></Pop></Center>}
          {b.sub && <Center y={730}><BlurText text={b.sub} at={t + 12} size={50} color="#c9ced6" weight={600} stagger={0.4} /></Center>}
          {b.line && <Stroke d="M 330 660 C 700 690, 1200 640, 1590 665 S 1880 700, 2050 620" at={t + 8} dur={20} color={b.c ?? C.red} width={8} />}
        </Dark>);
    }
    case 'value': {
      const n = Math.round(interpolate(fr, [16, 34], [0, b.value], {...clamp, easing: Easing.out(Easing.cubic)}));
      return (
        <Dark>
          <Stroke d={box(660, 320, 600, 360)} at={0} dur={16} color={b.c} />
          <Center y={410}><BlurText text={b.label} at={10} size={54} color="#d0d0d0" weight={700} /></Center>
          {fr >= 16 && <Center y={540}><Pop at={16}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 180, ...neonText(b.c), fontVariantNumeric: 'tabular-nums'}}>${n}</span></Pop></Center>}
        </Dark>);
    }
    case 'bills': return <Bills ts={b.w.map((w, i) => at(w, i === 0 ? 1 : 1))} green={b.green} />;
    case 'map': return <MapBoard active={b.active} />;
    case 'year': return (
      <Dark>
        <Stroke d={box(560, 230, 800, 300)} at={0} dur={14} color={C.cyan} />
        <Center y={380}><BlurText text={b.year} at={8} size={190} neon={C.cyan} /></Center>
        <Center y={700}><BlurText text={b.sub} at={18} size={50} color={C.white} weight={700} stagger={0.5} /></Center>
      </Dark>);
    case 'spheres2x': {
      const des = at('desaparece'), doble = at('doble');
      const gone = interpolate(fr, [des, des + 14], [1, 0], {...clamp, easing: Easing.in(Easing.cubic)});
      const g = interpolate(fr, [doble - 8, doble + 6], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.8))});
      const st = fr > doble - 8 && fr < doble + 8 ? 1 + Math.sin(((fr - doble + 8) / 16) * Math.PI) * 0.25 : 1;
      return (
        <Dark>
          <Sphere x={960} y={250} r={60 * gone} color={C.red} op={gone} />
          {gone > 0.05 && <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', opacity: gone, fontFamily: FONT, fontWeight: 800, fontSize: 40, ...neonText(C.red), letterSpacing: 4}}>DOLOR</div>}
          <Sphere x={620} y={620} r={95} color={C.cyan} label="EFECTIVO" />
          <Sphere x={1300} y={620} r={95 * (1 + g)} sx={st} sy={1 / st} color={C.yel} label={g > 0.5 ? undefined : 'TARJETA'} />
          {g > 0.5 && <div style={{position: 'absolute', left: 1300, top: 620, transform: 'translate(-50%,-50%)'}}><Pop at={doble + 2}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 150, color: '#111'}}>×2</span></Pop></div>}
        </Dark>);
    }
    case 'notcard': {
      const cross = interpolate(fr, [at('tarjeta') + 2, at('tarjeta') + 12], [0, 1], clamp);
      return (
        <Dark>
          <Stroke d={box(760, 300, 400, 250, 22)} at={2} dur={14} color={C.yel} />
          <Stroke d="M 760 370 H 1160" at={10} dur={8} color={C.yel} width={5} />
          <Center y={700}><BlurText text="el problema NO es la tarjeta" at={4} size={60} color={C.white} weight={800} stagger={0.4} /></Center>
          {cross > 0 && <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, filter: glow(C.red, 12)}}><path d="M 720 270 L 1200 580" pathLength={1} stroke={C.red} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${cross} 1`} fill="none" /></svg>}
        </Dark>);
    }
    case 'brain': {
      const fade = b.fadeAt ? interpolate(fr, [at(b.fadeAt), at(b.fadeAt) + 16], [0, 1], clamp) : 0;
      return (
        <Dark>
          <Stroke d="M 960 300 A 240 240 0 1 1 959 300" at={2} dur={22} color={b.c ?? C.green} />
          <div style={{position: 'absolute', left: 960, top: 540, transform: 'translate(-50%,-50%)'}}><Pop at={4}><Img src={staticFile('logo.png')} style={{width: 380, height: 380, borderRadius: '50%'}} /></Pop></div>
          {(b.items ?? []).map((it, i) => {
            const pos = [[470, 300], [1450, 300], [430, 780], [1490, 780]][i];
            return <div key={i} style={{position: 'absolute', left: pos[0], top: pos[1], transform: 'translate(-50%,-50%)', opacity: 1 - fade * 0.9, filter: fade ? `blur(${fade * 14}px)` : undefined}}><BlurText text={it} at={6 + i * 4} size={58} color={C.white} weight={800} /></div>;
          })}
          {b.caption && <Center y={900}><BlurText text={b.caption} at={10} size={56} neon={b.c ?? C.green} stagger={0.5} /></Center>}
        </Dark>);
    }
    case 'rule': {
      const r = at(b.at);
      const p = interpolate(fr, [r, r + 18], [0, 1], clamp);
      return (
        <Dark>
          <Center y={250}><BlurText text="LA REGLA DE UNA LÍNEA" at={2} size={56} neon={C.green} stagger={0.4} /></Center>
          <Stroke d={box(210, 380, 1500, 330, 30)} at={4} dur={18} color={C.green} />
          <div style={{position: 'absolute', left: 260, right: 260, top: 545, transform: 'translateY(-50%)', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 74, lineHeight: 1.15, color: C.white,
            filter: p < 1 ? `blur(${(1 - p) * 18}px)` : undefined, opacity: 0.35 + p * 0.65}}>
            Si no lo pagarías <span style={neonText(C.green)}>contando los billetes</span>, no lo pagues con la tarjeta.
          </div>
        </Dark>);
    }
    case 'hours': {
      const p = interpolate(fr, [6, 40], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
      const n = Math.max(1, Math.round(p * 8));
      return (
        <Dark>
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, filter: glow(C.red)}}>
            <circle cx={960} cy={500} r={230} fill="none" stroke="#2a2f38" strokeWidth={14} />
            <circle cx={960} cy={500} r={230} fill="none" stroke={C.red} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${p * 0.8} 1`} transform="rotate(-90 960 500)" />
          </svg>
          <Center y={480}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 200, ...neonText(C.red), fontVariantNumeric: 'tabular-nums'}}>{n}</span></Center>
          <Center y={610}><span style={{fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.white, letterSpacing: 4}}>HORAS</span></Center>
          <Center y={860}><BlurText text="de tu vida" at={30} size={56} color="#c9ced6" weight={700} /></Center>
        </Dark>);
    }
    case 'delay': {
      const hoy = 4, d30 = at('30'), cien = at('100');
      return (
        <Dark>
          <Stroke d={box(260, 380, 420, 200)} at={hoy} dur={12} color={C.green} />
          <div style={{position: 'absolute', left: 260, top: 380, width: 420, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Pop at={hoy + 6}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 90, ...neonText(C.green)}}>HOY</span></Pop></div>
          <Stroke d="M 700 480 H 1200" at={d30 - 14} dur={14} color={C.white} width={5} />
          <Stroke d={box(1220, 380, 460, 200)} at={d30} dur={12} color={C.red} />
          <div style={{position: 'absolute', left: 1220, top: 380, width: 460, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Pop at={d30 + 6}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 80, ...neonText(C.red)}}>30 DÍAS</span></Pop></div>
          {Array.from({length: 14}).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: 1250 + random('cx' + i) * 380, top: 640 + random('cy' + i) * 220}}>
              <Pop at={cien + i * 2}><div style={{width: 120, height: 74, borderRadius: 10, border: `4px solid ${[C.yel, C.cyan, C.pink, C.amber][i % 4]}`, transform: `rotate(${random('cr' + i) * 40 - 20}deg)`}} /></Pop>
            </div>
          ))}
          {fr >= cien && <div style={{position: 'absolute', left: 260, top: 700}}><Pop at={cien + 8}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 80, ...neonText(C.yel)}}>+100 compras</span></Pop></div>}
        </Dark>);
    }
    case 'compare': {
      const r = at('tarjeta');
      return (
        <Dark>
          <Stroke d={box(220, 260, 660, 520)} at={2} dur={14} color={C.green} />
          <Center y={0}>{null}</Center>
          <div style={{position: 'absolute', left: 220, top: 260, width: 660, height: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24}}>
            <BlurText text="EFECTIVO" at={8} size={64} neon={C.green} />
            <Pop at={14}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 150, ...neonText(C.green)}}>✓</span></Pop>
            <BlurText text="lo recordaban" at={18} size={46} color="#d6dbe2" weight={700} stagger={0.4} />
          </div>
          {fr >= r - 4 && <Stroke d={box(1040, 260, 660, 520)} at={r - 4} dur={14} color={C.red} />}
          {fr >= r && <div style={{position: 'absolute', left: 1040, top: 260, width: 660, height: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24}}>
            <BlurText text="TARJETA" at={r + 2} size={64} neon={C.red} />
            <Pop at={r + 10}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 150, ...neonText(C.red)}}>?</span></Pop>
            <BlurText text="ni idea" at={at('idea')} size={46} color="#d6dbe2" weight={700} />
          </div>}
        </Dark>);
    }
    case 'sum': {
      const items = [['$2', '2'], ['$3', '3'], ['$5', '5']] as const;
      const tot = at('cientos');
      return (
        <Dark>
          {items.map(([t, w], i) => (
            <div key={i} style={{position: 'absolute', left: 420 + i * 420, top: 360, transform: 'translate(-50%,-50%)'}}><Pop at={at(w)}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 130, ...neonText(C.yel)}}>+{t}</span></Pop></div>
          ))}
          <Stroke d="M 300 520 H 1620" at={tot - 8} dur={10} color={C.white} width={4} />
          {fr >= tot && <Center y={680}><Pop at={tot}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 120, ...neonText(C.red)}}>= CIENTOS AL MES</span></Pop></Center>}
        </Dark>);
    }
    case 'pros': {
      const items = [['FRAUDES', 'fraudes', C.cyan], ['TIEMPO', 'tiempo', C.green], ['PUNTOS', 'puntos', C.yel]] as const;
      return (
        <Dark>
          <Center y={230}><BlurText text="Bien usada…" at={2} size={60} color="#c9ced6" weight={700} /></Center>
          {items.map(([t, w, c], i) => (
            <React.Fragment key={i}>
              <Stroke d={box(230 + i * 520, 420, 420, 220)} at={at(w) - 6} dur={12} color={c} />
              <div style={{position: 'absolute', left: 230 + i * 520, top: 420, width: 420, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Pop at={at(w)}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 72, ...neonText(c)}}>{t}</span></Pop></div>
            </React.Fragment>
          ))}
        </Dark>);
    }
    case 'rewind': {
      const shift = Math.sin(fr * 2.3) * 14;
      const t = interpolate(fr, [0, dur], [1, 0], clamp);
      return (
        <AbsoluteFill style={{background: '#0b0b10'}}>
          <Img src={staticFile('demo3/l01.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1 + t * 0.8})`, transformOrigin: '43% 66%', filter: `saturate(.4) contrast(1.2) brightness(.7) hue-rotate(${shift}deg)`}} />
          <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 2px, transparent 2px 5px)', transform: `translateY(${(fr * 9) % 10}px)`}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: (fr * 47) % 1080, height: 26, background: 'rgba(255,255,255,.18)'}} />
          <div style={{position: 'absolute', left: 90, top: 70, fontFamily: FONT, fontWeight: 900, fontSize: 92, color: C.white, opacity: fr % 10 < 6 ? 1 : 0.4}}>◀◀</div>
          <Center><BlurText text="REBOBINA" at={2} size={140} stagger={0.6} /></Center>
        </AbsoluteFill>);
    }
    case 'comments': return (
      <AbsoluteFill>
        <LineArt src="escenas3/i25.jpg" dur={dur} z={[1.0, 1.06]} fx={0.3} fy={0.4} />
        <div style={{position: 'absolute', left: 1000, top: 300, width: 800, transformOrigin: 'left center'}}><Pop at={20}>
          <div style={{background: '#fff', borderRadius: 30, padding: '32px 42px', boxShadow: '0 0 40px rgba(255,214,10,.35)'}}>
            <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 32, color: '#777'}}>💬 Comentarios</div>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 52, color: '#111', lineHeight: 1.12, marginTop: 10}}>¿Qué pagaste con tarjeta que jamás habrías pagado en efectivo?</div>
          </div></Pop></div>
      </AbsoluteFill>);
    case 'end': return (
      <Dark>
        <Img src={staticFile('logo.png')} style={{position: 'absolute', left: 830, top: 70, width: 260, height: 260, borderRadius: '50%', transform: `scale(${popScale(fr - 2)})`, boxShadow: '0 0 60px rgba(61,220,132,.5)'}} />
        <Center y={420}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 84, color: C.white}}>TU MENTE <span style={{color: C.green}}>GASTA</span></span></Center>
        <Center y={520}><BlurText text="Mira la próxima trampa 👇" at={10} size={40} color="#cfcfcf" weight={700} /></Center>
      </Dark>);
  }
  return null;
};

// etiquetas sobre imágenes
const Labels: React.FC<{sc: Timed}> = ({sc}) => (
  <>
    {(sc.labels ?? []).map((l, i) => {
      const t = l.at ? f(wAt(sc, l.at, l.n)) : 6;
      return (
        <div key={i} style={{position: 'absolute', left: l.x * 1920, top: l.y * 1080, transform: 'translate(-50%,-50%)'}}>
          <Pop at={t}><span style={{display: 'inline-block', fontFamily: FONT, fontWeight: 900, fontSize: l.size ?? 76, whiteSpace: 'nowrap', ...neonText(l.c ?? C.yel), background: 'rgba(5,6,8,.74)', borderRadius: 18, padding: '4px 24px 8px', boxShadow: '0 0 30px 10px rgba(5,6,8,.55)'}}>{l.t}</span></Pop>
        </div>
      );
    })}
    {sc.check && (() => {
      const t = f(wAt(sc, sc.check!));
      return <div style={{position: 'absolute', left: 1180, top: 560, transform: 'translate(-50%,-50%)'}}><Pop at={t}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 130, ...neonText(C.green)}}>✓</span></Pop></div>;
    })()}
  </>
);
const Stamp: React.FC<{kind: 'P' | 'S'}> = ({kind}) => {
  const fr = useCurrentFrame();
  const isP = kind === 'P';
  return <div style={{position: 'absolute', left: 60, top: 54, transform: `scale(${popScale(fr - 4)}) rotate(-4deg)`, transformOrigin: 'left top', fontFamily: FONT, fontWeight: 900, fontSize: 46, letterSpacing: 2,
    color: isP ? C.white : '#0b0b0b', background: isP ? C.red : C.green, padding: '10px 26px', borderRadius: 12, boxShadow: `0 0 24px ${isP ? C.red : C.green}88`}}>{isP ? '⚠ PROBLEMA' : '✓ SOLUCIÓN'}</div>;
};

const SceneView: React.FC<{sc: Timed; dur: number}> = ({sc, dur}) => {
  const fr = useCurrentFrame();
  const beats = (sc.beats ?? []).map((w) => f(wAt(sc, w)));
  return (
    <AbsoluteFill>
      {sc.b ? <BoardView sc={sc} dur={dur} /> : sc.photo ? <Photo src={sc.photo} dur={dur} /> :
        <LineArt src={sc.img!} dur={dur} z={sc.z ?? [1.0, 1.12]} fx={sc.fx ?? 0.5} fy={sc.fy ?? 0.5} tint={sc.tint} beats={beats} />}
      {sc.img && !sc.b && <Dust />}
      <Labels sc={sc} />
      {sc.stamp && <Stamp kind={sc.stamp} />}
      {/* entrada con barrido corto para las escenas que no "se encienden" */}
      {sc.b && fr < 3 && <AbsoluteFill style={{background: C.bg, opacity: 1 - fr / 3}} />}
    </AbsoluteFill>
  );
};

// ---------- subtítulos: chicos, solo sobre imágenes ----------
const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const sc = TIMED.find((s) => t >= s.start && t < s.end);
  if (!sc || sc.b || sc.noCap) return null;
  const line = W_.filter((w) => w.s >= sc.start - 0.05 && w.s <= t + 0.05 && w.e >= t - 1.3).slice(-6);
  if (!line.length) return null;
  return (
    <div style={{position: 'absolute', bottom: 64, left: 200, right: 200, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 42, color: C.white, textShadow: '0 2px 8px #000, 0 0 3px #000, 0 0 3px #000'}}>
      {line.map((w) => w.w).join(' ')}
    </div>
  );
};

export const Video3: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    {TIMED.map((sc, i) => {
      const from = f(sc.start), dur = Math.max(1, f(sc.end) - from);
      return <Sequence key={i} from={from} durationInFrames={dur}><SceneView sc={sc} dur={dur} /></Sequence>;
    })}
    {TIMED.filter((s) => s.leak).map((s, i) => <LightLeak key={'l' + i} at={f(s.start) - 4} hue={i % 2 ? '255,120,170' : '255,150,60'} />)}
    <Captions />
    <Audio src={staticFile('v3/voz-video3.mp3')} />
    <Audio src={staticFile('n-musica.mp3')} loop volume={(fr) => interpolate(fr, [0, 15, V3_FRAMES - 60, V3_FRAMES], [0, 0.07, 0.07, 0], clamp)} />
    {TIMED.flatMap((sc, i) => {
      const out: React.ReactNode[] = [];
      const add = (t: number, s: string, v = 0.45) => out.push(<Sequence key={`s${i}-${out.length}`} from={Math.max(0, f(t))} durationInFrames={f(3)}><Audio src={staticFile(s)} volume={v} /></Sequence>);
      if (sc.img || sc.photo) add(sc.start - 0.05, 'n-sfx-whoosh.mp3', 0.35);
      for (const x of sc.sfx ?? []) {
        const t = x.at ? sc.start + wAt(sc, x.at, x.n) : sc.start;
        add(t + (x.off ?? 0), x.s.includes('/') ? x.s : `n-sfx-${x.s}.mp3`, x.v ?? 0.45);
      }
      return out;
    })}
  </AbsoluteFill>
);
