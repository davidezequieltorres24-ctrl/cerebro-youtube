// Demo estilo Isaac (apertura del video 3: tarjeta de crédito).
// Técnicas: neón sobre negro, líneas que se dibujan, texto borroso→nítido, pop 70→110→100,
// destellos de luz entre escenas, historia en dibujo de líneas brillantes que cambia de color con la emoción.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, Easing, random} from 'remotion';
import words from './words-demo3.json';

const FPS = 30;
const W_ = words as {w: string; s: number; e: number}[];
const VOICE_END = W_[W_.length - 1].e;
export const DEMO3_FRAMES = Math.round((VOICE_END + 2.2) * FPS);
const f = (s: number) => Math.round(s * FPS);
const C = {bg: '#050608', green: '#3DDC84', yel: '#FFD60A', cyan: '#33E1FF', red: '#FF3B30', amber: '#FFB547', white: '#F5F3EE'};
const FONT = 'Inter, sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const glow = (c: string, r = 18) => `drop-shadow(0 0 ${r / 3}px ${c}) drop-shadow(0 0 ${r}px ${c})`;

// ---------- piezas reutilizables ----------
// Pop de Isaac: 70% → 110% en 7 cuadros → 100% en 5 cuadros
const popScale = (fr: number) => fr < 0 ? 0 : fr < 7 ? interpolate(fr, [0, 7], [0.7, 1.1], {easing: Easing.out(Easing.quad)}) : interpolate(fr, [7, 12], [1.1, 1], clamp);

const Pop: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const fr = useCurrentFrame() - at;
  if (fr < 0) return null;
  return <div style={{transform: `scale(${popScale(fr)})`, opacity: interpolate(fr, [0, 3], [0, 1], clamp), ...style}}>{children}</div>;
};

// Texto que pasa de borroso a nítido letra por letra (~0,4 s)
const BlurText: React.FC<{text: string; at: number; size: number; color?: string; weight?: number; stagger?: number; glowC?: string}> = ({text, at, size, color = C.white, weight = 900, stagger = 1.2, glowC}) => {
  const fr = useCurrentFrame() - at;
  return (
    <span style={{fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: -1, whiteSpace: 'pre', filter: glowC ? glow(glowC, 14) : undefined}}>
      {text.split('').map((ch, i) => {
        const p = interpolate(fr - i * stagger, [0, 9], [0, 1], clamp);
        return <span key={i} style={{opacity: p, filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined, display: 'inline-block', transform: `translateY(${(1 - p) * 8}px)`}}>{ch}</span>;
      })}
    </span>
  );
};

// Trazo de neón que se dibuja (path SVG en un lienzo 1920x1080)
const Stroke: React.FC<{d: string; at: number; dur: number; color: string; width?: number; out?: number}> = ({d, at, dur, color, width = 7, out}) => {
  const fr = useCurrentFrame();
  const p = interpolate(fr, [at, at + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const q = out !== undefined ? interpolate(fr, [out, out + dur * 0.8], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)}) : 0;
  if (p <= 0) return null;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, filter: glow(color, 16), overflow: 'visible'}}>
      <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={`${p - q} 1`} strokeDashoffset={-q} />
    </svg>
  );
};
const box = (x: number, y: number, w: number, h: number, r = 26) =>
  `M ${x + w / 2} ${y} H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r} V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r} V ${y + r} Q ${x} ${y} ${x + r} ${y} H ${x + w / 2}`;

// Destello de luz (light leak) entre escenas: naranja/rosa, ~0,2 s
const LightLeak: React.FC<{at: number; dur?: number; hue?: string}> = ({at, dur = 9, hue = '255,140,60'}) => {
  const fr = useCurrentFrame() - at;
  if (fr < -1 || fr > dur) return null;
  const p = fr / dur;
  const a = Math.sin(Math.PI * Math.min(1, Math.max(0, p)));
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: a}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 120% at ${-20 + p * 140}% 50%, rgba(${hue},1) 0%, rgba(255,90,140,.7) 35%, rgba(0,0,0,0) 70%)`}} />
      <AbsoluteFill style={{background: `rgba(255,240,220,${a * 0.5})`}} />
    </AbsoluteFill>
  );
};

// Imagen con zoom lento hacia un punto de foco (Ken Burns) + entrada con barrido
const KB: React.FC<{src: string; from: number; dur: number; z: [number, number]; fx: number; fy: number; filter?: string; whip?: number}> = ({src, from, dur, z, fx, fy, filter, whip = 0}) => {
  const fr = useCurrentFrame() - from;
  const t = interpolate(fr, [0, dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const x = whip ? interpolate(fr, [0, 8], [whip * 380, 0], {...clamp, easing: Easing.out(Easing.cubic)}) : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', transform: `translateX(${x}px)`}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z[0] + (z[1] - z[0]) * t})`, transformOrigin: `${fx * 100}% ${fy * 100}%`, filter}} />
    </AbsoluteFill>
  );
};
const Vignette: React.FC<{k?: number; color?: string}> = ({k = 0.6, color = '0,0,0'}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at center, rgba(${color},0) 45%, rgba(${color},${k}) 100%)`}} />
);
// Polvo de luz flotando (overlay barato)
const Dust: React.FC<{n?: number; color?: string}> = ({n = 26, color = '255,200,120'}) => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: n}).map((_, i) => {
        const x = (random('x' + i) * 1920 + fr * (0.3 + random('v' + i))) % 1920;
        const y = (random('y' + i) * 1080 - fr * (0.2 + random('u' + i) * 0.6) + 1080 * 4) % 1080;
        const s = 2 + random('s' + i) * 4;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: `rgba(${color},${0.25 + random('o' + i) * 0.5})`, boxShadow: `0 0 ${s * 3}px rgba(${color},.8)`}} />;
      })}
    </AbsoluteFill>
  );
};
const Sphere: React.FC<{x: number; y: number; r: number; color: string; sx?: number; sy?: number; label?: string; op?: number}> = ({x, y, r, color, sx = 1, sy = 1, label, op = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, transform: `translate(-50%,-50%) scale(${sx},${sy})`, opacity: op}}>
    <div style={{width: '100%', height: '100%', borderRadius: '50%', background: `radial-gradient(circle at 40% 38%, #fff8 0%, ${color} 35%, ${color} 70%)`, boxShadow: `0 0 ${r * 0.5}px ${color}, 0 0 ${r * 1.2}px ${color}88`}} />
    {label && <div style={{position: 'absolute', top: '100%', width: '100%', marginTop: 36, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.white, letterSpacing: 2}}>{label}</div>}
  </div>
);
const Center: React.FC<{children: React.ReactNode; y?: number}> = ({children, y = 540}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>{children}</div>
);

// ---------- escenas (tiempos en segundos según la voz) ----------
const T = {imagina: 0, caja: 1.0, total: 2.7, tarjeta: 5.0, bip: 7.54, nada: 8.1, rebobina: 10.35, mismo: 11.9, efectivo: 14.6, cuentas: 15.7, pecho: 19.75, nombre: 21.5, dolor: 22.8, mit: 24.3, cuando: 28.05, pero: 31.6, cerebro: 33.6};
const word = (w: string, after = 0) => W_.find((x) => x.s >= after && x.w.toLowerCase().replace(/[^a-záéíóúñ0-9$]/g, '') === w)!.s;

const S1: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Center y={500}><BlurText text="Imagina esto…" at={1} size={120} /></Center>
    <Stroke d="M 640 600 C 900 620, 1150 585, 1300 600 S 1700 640, 2000 560" at={6} dur={18} color={C.yel} width={9} />
  </AbsoluteFill>
);

const S2: React.FC<{dur: number}> = ({dur}) => (
  <AbsoluteFill>
    <KB src="demo3/l01.jpg" from={0} dur={dur} z={[1.0, 1.12]} fx={0.42} fy={0.6} />
    <Dust />
    <Vignette k={0.7} />
  </AbsoluteFill>
);

const S3: React.FC = () => {
  const fr = useCurrentFrame();
  const n = Math.round(interpolate(fr, [18, 36], [0, 87], {...clamp, easing: Easing.out(Easing.cubic)}));
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Stroke d={box(660, 300, 600, 380)} at={0} dur={16} color={C.yel} />
      <Center y={400}><BlurText text="TOTAL" at={12} size={54} color="#cfcfcf" weight={700} /></Center>
      {fr >= 16 && <Center y={530}><Pop at={16}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 190, color: C.yel, filter: glow(C.yel, 22), fontVariantNumeric: 'tabular-nums'}}>${n}</span></Pop></Center>}
    </AbsoluteFill>
  );
};

const S4: React.FC<{dur: number}> = ({dur}) => {
  const fr = useCurrentFrame();
  const bip = f(T.bip - T.tarjeta);
  const punch = fr >= bip ? interpolate(fr - bip, [0, 4, 12], [1, 1.08, 1.04], clamp) : 1;
  const ring = interpolate(fr - bip, [0, 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${punch})`}}>
        <KB src="demo3/l01.jpg" from={0} dur={dur} z={[1.25, 1.9]} fx={0.43} fy={0.66} />
      </AbsoluteFill>
      <Vignette k={0.75} />
      {fr >= bip && (
        <>
          <div style={{position: 'absolute', left: 1180, top: 560, width: 260, height: 260, transform: `translate(-50%,-50%) scale(${0.4 + ring * 0.8})`, borderRadius: '50%', border: `8px solid ${C.green}`, opacity: 1 - ring * 0.6, filter: glow(C.green, 20)}} />
          <div style={{position: 'absolute', left: 1180, top: 560, transform: 'translate(-50%,-50%)'}}><Pop at={bip + 2}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 110, color: C.green, filter: glow(C.green, 18)}}>✓</span></Pop></div>
        </>
      )}
    </AbsoluteFill>
  );
};

const S5: React.FC = () => {
  const nada = f(word('nada') - T.nada);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Center y={360}><BlurText text="No sentiste" at={f(word('no', 8) - T.nada)} size={64} color="#bdbdbd" weight={700} /></Center>
      <Center y={560}><Pop at={nada}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 300, color: C.white, letterSpacing: -8}}>NADA.</span></Pop></Center>
    </AbsoluteFill>
  );
};

// Rebobinar: las escenas anteriores pasan al revés, rápido, con líneas de VHS
const S6: React.FC<{dur: number}> = ({dur}) => {
  const fr = useCurrentFrame();
  const shift = Math.sin(fr * 2.3) * 14;
  return (
    <AbsoluteFill style={{background: '#0b0b10'}}>
      <KB src="demo3/l01.jpg" from={0} dur={dur} z={[1.9, 1.0]} fx={0.43} fy={0.66} filter={`saturate(.4) contrast(1.2) brightness(.7) hue-rotate(${shift}deg)`} />
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 2px, transparent 2px 5px)', transform: `translateY(${(fr * 9) % 10}px)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: (fr * 47) % 1080, height: 26, background: 'rgba(255,255,255,.18)'}} />
      <div style={{position: 'absolute', left: 90, top: 70, fontFamily: FONT, fontWeight: 900, fontSize: 92, color: C.white, filter: glow('#fff', 10), opacity: fr % 10 < 6 ? 1 : 0.4}}>◀◀</div>
      <Center y={540}><BlurText text="REBOBINA" at={2} size={140} color={C.white} stagger={0.6} /></Center>
    </AbsoluteFill>
  );
};

const S7: React.FC<{dur: number}> = ({dur}) => (
  <AbsoluteFill>
    <KB src="demo3/l01.jpg" from={0} dur={dur} z={[1.05, 1.15]} fx={0.3} fy={0.5} whip={-1} />
    <Vignette k={0.7} />
    <div style={{position: 'absolute', left: 1180, top: 210}}><BlurText text="Mismo súper." at={2} size={70} glowC={C.amber} /></div>
    <div style={{position: 'absolute', left: 1180, top: 310}}><BlurText text="Mismo carrito." at={f(word('mismo', 12.5) - T.mismo)} size={70} glowC={C.amber} /></div>
  </AbsoluteFill>
);

const S7b: React.FC<{dur: number}> = ({dur}) => (
  <AbsoluteFill>
    <KB src="demo3/billetes.jpg" from={0} dur={dur} z={[1.15, 1.3]} fx={0.35} fy={0.6} whip={1} filter="contrast(1.1) saturate(1.1)" />
    <Vignette k={0.8} />
    <div style={{position: 'absolute', left: 1240, top: 470}}><Pop at={2}><span style={{fontFamily: FONT, fontWeight: 900, fontStyle: 'italic', fontSize: 120, color: C.yel, filter: glow(C.yel, 14)}}>efectivo</span></Pop></div>
    <Stroke d="M 1230 620 C 1400 640, 1560 600, 1700 615" at={6} dur={12} color={C.yel} />
  </AbsoluteFill>
);

// Contar billetes: cada billete de neón se dibuja con la voz; el color pasa de verde a rojo
const S8: React.FC = () => {
  const fr = useCurrentFrame();
  const ts = ['un', 'dos', 'tres', 'cuatro'].map((w, i) => f(word(w, i === 0 ? 15.5 : 16) - T.cuentas));
  const cols = [C.green, C.yel, C.amber, C.red];
  const shake = fr > ts[3] ? Math.sin(fr * 1.7) * interpolate(fr - ts[3], [0, 20], [6, 0], clamp) : 0;
  return (
    <AbsoluteFill style={{background: C.bg, transform: `translateX(${shake}px)`}}>
      {ts.map((t, i) => (
        <React.Fragment key={i}>
          <Stroke d={box(250 + i * 370, 380, 320, 170, 18)} at={t} dur={9} color={cols[i]} />
          {fr >= t + 4 && <div style={{position: 'absolute', left: 250 + i * 370, top: 380, width: 320, height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Pop at={t + 4}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 96, color: cols[i], filter: glow(cols[i], 12)}}>{i + 1}</span></Pop></div>}
        </React.Fragment>
      ))}
      <Center y={720}><BlurText text="cada billete que sale, lo ves" at={4} size={44} color="#9a9a9a" weight={600} stagger={0.5} /></Center>
    </AbsoluteFill>
  );
};

// Historia: mismo dibujo de líneas, ahora en ROJO (la emoción cambia el color) + latido
const S9: React.FC<{dur: number}> = ({dur}) => {
  const fr = useCurrentFrame();
  const beat = (b: number) => Math.max(0, 1 - Math.abs(fr - b) / 5);
  const pulse = beat(f(20.4 - T.pecho)) + beat(f(21.0 - T.pecho));
  return (
    <AbsoluteFill style={{transform: `scale(${1 + pulse * 0.025})`}}>
      <KB src="demo3/l02.jpg" from={0} dur={dur} z={[1.05, 1.18]} fx={0.32} fy={0.55} filter="hue-rotate(-28deg) saturate(1.6) brightness(1.05)" />
      <Vignette k={0.55 + pulse * 0.35} color="90,0,0" />
    </AbsoluteFill>
  );
};

const S10: React.FC = () => {
  const dolor = f(T.dolor - T.nombre);
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Center y={380}><BlurText text="Eso tiene nombre:" at={2} size={56} color="#bdbdbd" weight={600} /></Center>
      {fr >= dolor && <Center y={540}><Pop at={dolor}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 150, color: C.white, letterSpacing: -3}}>EL DOLOR DE <span style={{color: C.red, filter: glow(C.red, 16)}}>PAGAR</span></span></Pop></Center>}
      <Stroke d="M 330 660 C 700 690, 1200 640, 1590 665 S 1880 700, 2050 620" at={dolor + 8} dur={20} color={C.red} width={9} />
    </AbsoluteFill>
  );
};

const S11: React.FC = () => {
  const y2001 = f(word('2001') - T.mit);
  const mit = f(word('mit') - T.mit);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Stroke d={box(560, 250, 800, 300)} at={y2001 - 6} dur={14} color={C.cyan} />
      <Center y={400}><BlurText text="2001" at={y2001 + 4} size={190} color={C.white} glowC={C.cyan} /></Center>
      <Stroke d="M 760 550 V 700" at={mit - 4} dur={8} color={C.cyan} width={5} />
      <Stroke d="M 1160 550 V 700" at={mit - 2} dur={8} color={C.cyan} width={5} />
      <div style={{position: 'absolute', left: 760, top: 760, transform: 'translate(-50%,-50%)'}}><Pop at={mit + 2}><Sphere x={0} y={0} r={46} color={C.cyan} /></Pop></div>
      <div style={{position: 'absolute', left: 1160, top: 760, transform: 'translate(-50%,-50%)'}}><Pop at={mit + 5}><Sphere x={0} y={0} r={46} color={C.cyan} /></Pop></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, textAlign: 'center'}}><BlurText text="Prelec y Simester · MIT" at={mit + 6} size={46} color={C.white} weight={700} stagger={0.6} /></div>
    </AbsoluteFill>
  );
};

// Dolor que desaparece → la tarjeta se estira al doble (squash & stretch)
const S12: React.FC = () => {
  const fr = useCurrentFrame();
  const des = f(word('desaparece') - T.cuando);
  const doble = f(word('doble') - T.cuando);
  const gone = interpolate(fr, [des, des + 14], [1, 0], {...clamp, easing: Easing.in(Easing.cubic)});
  const g = interpolate(fr, [doble - 8, doble + 6], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.8))});
  const stretch = fr > doble - 8 && fr < doble + 8 ? 1 + Math.sin(((fr - doble + 8) / 16) * Math.PI) * 0.25 : 1;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Sphere x={960} y={250} r={60 * gone} color={C.red} op={gone} />
      {gone > 0.05 && <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', opacity: gone, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.red, letterSpacing: 4}}>DOLOR</div>}
      <Sphere x={620} y={600} r={95} color={C.cyan} label="EFECTIVO" />
      <Sphere x={1300} y={600} r={95 * (1 + g)} sx={stretch} sy={1 / stretch} color={C.yel} label={g > 0.5 ? undefined : 'TARJETA'} />
      {g > 0.5 && <div style={{position: 'absolute', left: 1300, top: 600, transform: 'translate(-50%,-50%)'}}><Pop at={doble + 2}><span style={{fontFamily: FONT, fontWeight: 900, fontSize: 150, color: '#111'}}>×2</span></Pop></div>}
    </AbsoluteFill>
  );
};

const S13: React.FC = () => {
  const tarjeta = f(word('tarjeta', 32) - T.pero);
  const fr = useCurrentFrame();
  const cross = interpolate(fr, [tarjeta + 2, tarjeta + 12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Stroke d={box(760, 330, 400, 250, 22)} at={4} dur={14} color={C.yel} />
      <Stroke d="M 760 400 H 1160" at={12} dur={8} color={C.yel} width={5} />
      <Center y={700}><BlurText text="el problema NO es la tarjeta" at={4} size={58} color={C.white} weight={700} stagger={0.5} /></Center>
      {cross > 0 && <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, filter: glow(C.red, 14)}}><path d="M 720 300 L 1200 610" pathLength={1} stroke={C.red} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${cross} 1`} fill="none" /></svg>}
    </AbsoluteFill>
  );
};

// Cerebro al centro; lo que deja de ver se desenfoca y se apaga
const S14: React.FC = () => {
  const fr = useCurrentFrame();
  const deja = f(word('deja') - T.cerebro);
  const items = [{t: '$87', x: 470, y: 300}, {t: 'intereses', x: 1470, y: 300}, {t: 'cuotas', x: 430, y: 780}, {t: 'pago mínimo', x: 1490, y: 780}];
  const fade = interpolate(fr, [deja, deja + 16], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Stroke d="M 960 300 A 240 240 0 1 1 959 300" at={2} dur={22} color={C.green} />
      <div style={{position: 'absolute', left: 960, top: 540, transform: 'translate(-50%,-50%)'}}><Pop at={4}><Img src={staticFile('logo.png')} style={{width: 380, height: 380, borderRadius: '50%'}} /></Pop></div>
      {items.map((it, i) => (
        <div key={i} style={{position: 'absolute', left: it.x, top: it.y, transform: 'translate(-50%,-50%)', opacity: 1 - fade * 0.85, filter: `blur(${fade * 14}px)`}}>
          <BlurText text={it.t} at={6 + i * 4} size={58} color={C.white} weight={800} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ---------- subtítulos chicos, solo donde no hay texto grande ----------
const CAP_RANGES: [number, number][] = [[T.caja, T.total], [T.tarjeta, T.nada], [T.cuentas - 0.01, -1], [T.pecho, T.nombre], [T.mit, T.cuando], [T.cuando, T.pero], [T.cerebro, VOICE_END + 1]];
const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const r = CAP_RANGES.find(([a, b]) => b > 0 && t >= a && t < b);
  if (!r) return null;
  const line = W_.filter((w) => w.s >= r[0] - 0.05 && w.s <= t + 0.05 && w.e >= t - 1.2).slice(-5);
  if (!line.length) return null;
  return (
    <div style={{position: 'absolute', bottom: 70, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 40, color: C.white, textShadow: '0 2px 8px #000, 0 0 2px #000'}}>
      {line.map((w) => w.w).join(' ')}
    </div>
  );
};

// ---------- montaje ----------
const SCENES: {from: number; to: number; C: React.FC<{dur: number}>}[] = [
  {from: T.imagina, to: T.caja, C: S1},
  {from: T.caja, to: T.total, C: S2},
  {from: T.total, to: T.tarjeta, C: S3},
  {from: T.tarjeta, to: T.nada, C: S4},
  {from: T.nada, to: T.rebobina, C: S5},
  {from: T.rebobina, to: T.mismo, C: S6},
  {from: T.mismo, to: T.efectivo, C: S7},
  {from: T.efectivo, to: T.cuentas, C: S7b},
  {from: T.cuentas, to: T.pecho, C: S8},
  {from: T.pecho, to: T.nombre, C: S9},
  {from: T.nombre, to: T.mit, C: S10},
  {from: T.mit, to: T.cuando, C: S11},
  {from: T.cuando, to: T.pero, C: S12},
  {from: T.pero, to: T.cerebro, C: S13},
  {from: T.cerebro, to: VOICE_END + 2.2, C: S14},
];
const LEAKS = [T.caja, T.tarjeta, T.mismo, T.pecho, T.mit, T.cerebro];
const SFX: {at: number; s: string; v?: number}[] = [
  {at: T.caja - 0.1, s: 'n-sfx-whoosh.mp3'}, {at: T.total, s: 'demo3/sfx-impact.mp3', v: 0.5}, {at: T.tarjeta - 0.1, s: 'n-sfx-whoosh.mp3'},
  {at: T.bip - 0.05, s: 'demo3/sfx-beep.mp3', v: 0.8}, {at: word('nada'), s: 'demo3/sfx-impact.mp3', v: 0.6},
  {at: T.rebobina, s: 'demo3/sfx-rewind.mp3', v: 0.9}, {at: T.mismo - 0.1, s: 'n-sfx-whoosh.mp3'}, {at: T.efectivo - 0.1, s: 'n-sfx-whoosh.mp3'},
  ...['un', 'dos', 'tres', 'cuatro'].map((w, i) => ({at: word(w, i === 0 ? 15.5 : 16), s: 'n-sfx-pop.mp3', v: 0.35 + i * 0.08})),
  {at: 20.35, s: 'demo3/sfx-heart.mp3', v: 1}, {at: 20.95, s: 'demo3/sfx-heart.mp3', v: 1},
  {at: T.dolor - 1.05, s: 'demo3/sfx-riser.mp3', v: 0.9}, {at: T.dolor, s: 'demo3/sfx-impact.mp3', v: 0.8},
  {at: T.mit, s: 'n-sfx-whoosh.mp3'}, {at: word('doble') - 0.1, s: 'demo3/sfx-impact.mp3', v: 0.6}, {at: T.cerebro, s: 'n-sfx-whoosh.mp3'},
];

export const Demo3: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    {SCENES.map((sc, i) => {
      const from = f(sc.from), dur = Math.max(1, f(sc.to) - from);
      return <Sequence key={i} from={from} durationInFrames={dur}><sc.C dur={dur} /></Sequence>;
    })}
    {LEAKS.map((t, i) => <LightLeak key={i} at={f(t) - 4} hue={i % 2 ? '255,120,170' : '255,150,60'} />)}
    <Captions />
    <Audio src={staticFile('demo3/vozA.mp3')} />
    <Audio src={staticFile('n-musica.mp3')} volume={(fr) => interpolate(fr, [0, 15, DEMO3_FRAMES - 45, DEMO3_FRAMES], [0, 0.07, 0.07, 0], clamp)} />
    {SFX.map((x, i) => (
      <Sequence key={'s' + i} from={Math.max(0, f(x.at))} durationInFrames={f(3)}><Audio src={staticFile(x.s)} volume={x.v ?? 0.45} /></Sequence>
    ))}
  </AbsoluteFill>
);
