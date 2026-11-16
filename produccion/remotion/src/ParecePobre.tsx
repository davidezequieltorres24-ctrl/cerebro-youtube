import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig, Easing, random,
} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import words from './words.json';

const FPS = 30;
export const TOTAL_FRAMES = Math.round(41 * FPS);
const f = (s: number) => Math.round(s * FPS);
const C = {bg: '#0E0F12', green: '#3DDC84', red: '#FF3B30', yel: '#FFD60A', white: '#F5F3EE', pink: '#FF6FAE', cream: '#FBF6E9'};
const FONT = 'Inter, "Inter Display", sans-serif';

// ---------- helpers ----------
const useSpring = (delay = 0, damping = 12) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, mass: 0.6}});
};

// Ken Burns: imagen que llena la pantalla con zoom/paneo hacia un punto focal
const KB: React.FC<{src: string; dur: number; from: [number, number, number]; to: [number, number, number]; style?: React.CSSProperties}> = ({src, dur, from, to, style}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, dur], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const s = from[0] + (to[0] - from[0]) * t;
  const x = from[1] + (to[1] - from[1]) * t;
  const y = from[2] + (to[2] - from[2]) * t;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})`, transformOrigin: `${x * 100}% ${y * 100}%`, ...style}} />
    </AbsoluteFill>
  );
};

// Texto con rebote (pop)
const Pop: React.FC<{delay: number; children: React.ReactNode; style?: React.CSSProperties; rot?: number}> = ({delay, children, style, rot = 0}) => {
  const p = useSpring(delay, 9);
  if (p <= 0.001) return null;
  return <div style={{position: 'absolute', transform: `scale(${p}) rotate(${rot * (1 - p) + rot * 0.15}deg)`, ...style}}>{children}</div>;
};

const Label: React.FC<{text: string; color?: string; size?: number; bg?: string}> = ({text, color = C.white, size = 64, bg}) => (
  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, color, letterSpacing: -1, padding: bg ? '10px 26px' : 0, background: bg, borderRadius: 18,
    WebkitTextStroke: bg ? undefined : `${Math.max(3, size / 14)}px #111`, paintOrder: 'stroke fill', boxShadow: bg ? '0 10px 0 rgba(0,0,0,.35)' : undefined, whiteSpace: 'nowrap'}}>
    {text}
  </div>
);

// Transición de barrido al entrar cada escena
const Whip: React.FC<{children: React.ReactNode; dir?: number}> = ({children, dir = 1}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 9], [dir * 1920 * 0.35, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const blur = interpolate(frame, [0, 9], [24, 0], {extrapolateRight: 'clamp'});
  const op = interpolate(frame, [0, 5], [0, 1], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{transform: `translateX(${x}px)`, filter: `blur(${blur}px)`, opacity: op}}>{children}</AbsoluteFill>;
};

const Vignette: React.FC<{strength?: number; color?: string}> = ({strength = 0.55, color = '0,0,0'}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at center, rgba(${color},0) 55%, rgba(${color},${strength}) 100%)`}} />
);

const Sparkles: React.FC<{start: number; cx: number; cy: number; n?: number; spread?: number}> = ({start, cx, cy, n = 10, spread = 380}) => {
  const frame = useCurrentFrame() - start;
  if (frame < 0) return null;
  return (
    <>
      {Array.from({length: n}).map((_, i) => {
        const ph = (frame + i * 7) % 40;
        const sc = Math.sin((ph / 40) * Math.PI);
        const x = cx + (random(`x${i}`) - 0.5) * spread;
        const y = cy + (random(`y${i}`) - 0.5) * spread * 0.5;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 46, height: 46, transform: `translate(-50%,-50%) scale(${sc}) rotate(${frame * 3}deg)`,
          background: C.white, clipPath: 'polygon(50% 0,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0 50%,39% 39%)', filter: 'drop-shadow(0 0 10px #fff8b0)'}} />;
      })}
    </>
  );
};

// ---------- subtítulos palabra por palabra ----------
const KEY = ['auto', 'brillante', 'autobús', 'sudadera', 'gris', 'perdiendo', 'dinero', 'verdad', 'tú', 'guardarlo', '1996', 'millonarios', 'usados', 'muestras', 'tienes', 'disfraz', 'gana'];
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const W = words as {w: string; s: number; e: number}[];
  // agrupar en frases de hasta 5 palabras o hasta un punto
  const groups: typeof W[] = [];
  let cur: typeof W = [];
  W.forEach((w, i) => {
    cur.push(w);
    const next = W[i + 1];
    if (cur.length >= 5 || /[.?,]$/.test(w.w) || !next || next.s - w.e > 0.5) { groups.push(cur); cur = []; }
  });
  const g = groups.find((gr) => t >= gr[0].s - 0.05 && t <= gr[gr.length - 1].e + 0.35);
  if (!g) return null;
  return (
    <div style={{position: 'absolute', bottom: 70, width: '100%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', padding: '0 140px'}}>
      {g.map((w, i) => {
        const active = t >= w.s && t <= w.e + 0.08;
        const said = t >= w.s;
        const clean = w.w.toLowerCase().replace(/[¿?¡!.,]/g, '');
        const isKey = KEY.some((k) => clean.includes(k));
        const pop = active ? 1.08 : 1;
        return (
          <span key={i} style={{fontFamily: FONT, fontWeight: 900, fontSize: 66, letterSpacing: -1, transform: `scale(${pop})`, transformOrigin: '50% 80%', display: 'inline-block', margin: '0 24px',
            color: active ? (isKey ? C.green : C.yel) : said ? C.white : 'rgba(245,243,238,.55)', WebkitTextStroke: '9px #000', paintOrder: 'stroke fill',
            textShadow: '0 6px 0 rgba(0,0,0,.45)'}}>{w.w.replace('Autonuevo', 'Auto nuevo')}</span>
        );
      })}
    </div>
  );
};

// ---------- 3D: monedas y billetes cayendo (Three.js) ----------
const Coins3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const items = Array.from({length: 26});
  return (
    <ThreeCanvas width={width} height={height} camera={{position: [0, 0, 10], fov: 50}} style={{position: 'absolute', inset: 0}}>
      <ambientLight intensity={1.6} />
      <directionalLight position={[3, 5, 6]} intensity={2.2} />
      <pointLight position={[-4, -2, 5]} intensity={20} color="#ffd36b" />
      {items.map((_, i) => {
        const isBill = i % 3 === 0;
        const speed = 0.045 + random(`s${i}`) * 0.05;
        const x = (random(`x${i}`) - 0.5) * 16;
        const y = 7 - ((frame * speed + random(`y${i}`) * 14) % 14);
        const z = -random(`z${i}`) * 4;
        const r = frame * (0.04 + random(`r${i}`) * 0.08);
        return isBill ? (
          <mesh key={i} position={[x, y, z]} rotation={[r, r * 0.7, Math.sin(r) * 0.5]}>
            <boxGeometry args={[1.5, 0.75, 0.02]} />
            <meshStandardMaterial color="#3DDC84" emissive="#0d5a30" emissiveIntensity={0.4} roughness={0.6} side={2} />
          </mesh>
        ) : (
          <mesh key={i} position={[x, y, z]} rotation={[r + Math.PI / 2, r * 1.3, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.08, 40]} />
            <meshStandardMaterial color="#F7C948" emissive="#8a6200" emissiveIntensity={0.5} metalness={0.3} roughness={0.35} />
          </mesh>
        );
      })}
    </ThreeCanvas>
  );
};

// ---------- escenas ----------
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const intro = interpolate(frame, [0, 6, 30, 40], [1, 1, 1, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <KB src="s1-estacionamiento.png" dur={f(5.9)} from={[1.7, 0.47, 0.32]} to={[1.08, 0.5, 0.5]} />
      <Sparkles start={f(3.0)} cx={760} cy={720} spread={700} n={12} />
      <Vignette strength={0.4} />
      <Pop delay={f(4.3)} style={{left: 140, top: 90}} rot={-8}><Label text="¡WOW!" color={C.yel} size={110} /></Pop>
      <Pop delay={f(4.5)} style={{right: 160, top: 120}} rot={8}><Label text="👏 👏" size={90} /></Pop>
      <AbsoluteFill style={{background: `rgba(14,15,18,${0.88 * intro})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{opacity: intro, transform: `scale(${1 + frame * 0.004})`, fontFamily: FONT, fontWeight: 900, fontSize: 130, color: C.white, letterSpacing: -3}}>
          Imagina esto<span style={{color: C.green}}>…</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const lose = f(11.0 - 5.9);
  const sat = interpolate(frame, [lose, lose + 12], [1, 0.25], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const red = interpolate(frame, [lose, lose + 12], [0, 0.45], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const shake = frame > lose && frame < lose + 10 ? Math.sin(frame * 3) * 8 : 0;
  const arrowY = interpolate(frame, [lose, lose + 15], [-200, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
  return (
    <AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
      <KB src="s2-autobus.png" dur={f(6.4)} from={[1.05, 0.55, 0.5]} to={[1.55, 0.67, 0.42]} style={{filter: `saturate(${sat})`}} />
      <Vignette strength={red + 0.35} color={red > 0 ? '120,0,0' : '0,0,0'} />
      {frame < lose && <Pop delay={f(8.2 - 5.9)} style={{left: 1180, top: 120}} rot={-6}><Label text="MISMA SUDADERA" bg={C.yel} color="#111" size={58} /></Pop>}
      {frame > lose && (
        <>
          <div style={{position: 'absolute', left: 1640, top: 330 + arrowY, width: 150, height: 230}}>
            <svg viewBox="0 0 100 150" width="150" height="230"><path d="M30 0h40v90h28L50 150 2 90h28z" fill={C.red} stroke="#111" strokeWidth="6" /></svg>
          </div>
          <Pop delay={lose + 4} style={{left: 1040, top: 130}} rot={-5}><Label text="PERDIENDO" color={C.red} size={120} /></Pop>
        </>
      )}
    </AbsoluteFill>
  );
};

const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const slideL = interpolate(frame, [0, 10], [-960, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const slideR = interpolate(frame, [0, 10], [960, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const qp = useSpring(f(0.5), 7);
  const wob = Math.sin(frame / 5) * 6;
  return (
    <AbsoluteFill style={{background: '#111'}}>
      <div style={{position: 'absolute', left: slideL, top: 0, width: 960, height: 1080, overflow: 'hidden', clipPath: 'polygon(0 0,100% 0,88% 100%,0 100%)'}}>
        <Img src={staticFile('s2-autobus.png')} style={{height: 1080, width: 1935, objectFit: 'cover', transform: 'scale(1.5)', transformOrigin: '68% 40%', marginLeft: -880}} />
      </div>
      <div style={{position: 'absolute', left: 960 + slideR - 110, top: 0, width: 1070, height: 1080, overflow: 'hidden', clipPath: 'polygon(12% 0,100% 0,100% 100%,0 100%)'}}>
        <Img src={staticFile('s1-estacionamiento.png')} style={{height: 1080, width: 1935, objectFit: 'cover', transform: 'scale(1.45)', transformOrigin: '60% 40%', marginLeft: -520}} />
      </div>
      <Pop delay={4} style={{left: 120, top: 70}}><Label text="TÚ" bg={C.white} color="#111" size={64} /></Pop>
      <Pop delay={7} style={{right: 120, top: 70}}><Label text="MARCOS" bg={C.yel} color="#111" size={64} /></Pop>
      {qp > 0.01 && (
        <div style={{position: 'absolute', left: 960, top: 470, transform: `translate(-50%,-50%) scale(${qp}) rotate(${wob}deg)`, fontFamily: FONT, fontWeight: 900, fontSize: 420,
          color: C.yel, WebkitTextStroke: '22px #111', paintOrder: 'stroke fill', textShadow: '0 22px 0 rgba(0,0,0,.4)'}}>?</div>
      )}
    </AbsoluteFill>
  );
};

const Card: React.FC<{delay: number; title: string; amount: string; color: string; children: React.ReactNode; hl: boolean; x: number}> = ({delay, title, amount, color, children, hl, x}) => {
  const p = useSpring(delay, 10);
  if (p < 0.01) return null;
  return (
    <div style={{position: 'absolute', left: x, top: 270, width: 640, height: 560, transform: `scale(${p * (hl ? 1.05 : 0.97)})`, background: '#fff', borderRadius: 36,
      border: `10px solid ${hl ? color : '#222'}`, boxShadow: `0 18px 0 #222, 0 0 ${hl ? 60 : 0}px ${color}`, overflow: 'hidden', transition: 'none'}}>
      <div style={{height: 340, overflow: 'hidden', position: 'relative', background: C.cream}}>{children}</div>
      <div style={{textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 64, color: '#111', marginTop: 18}}>{title}</div>
      <div style={{textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 56, color}}>{amount}</div>
    </div>
  );
};

const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + 15.5;
  const hlLeft = t > 16.85 && t < 17.9;
  const hlRight = t >= 18.0;
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, #FFF9EA, #F1E6C8)`}}>
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(0,0,0,.05) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,.05) 2px, transparent 2px)', backgroundSize: '60px 60px'}} />
      <Pop delay={2} style={{left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center'}}><Label text="¿QUÉ HARÍAS TÚ?" color="#111" bg={C.yel} size={96} /></Pop>
      <Card delay={f(16.3 - 15.5)} x={230} title="AUTO NUEVO" amount="−$25.000" color={C.red} hl={hlLeft}>
        <Img src={staticFile('s1-estacionamiento.png')} style={{position: 'absolute', width: 1300, left: -230, top: -280}} />
      </Card>
      <Card delay={f(17.4 - 15.5)} x={1050} title="GUARDARLO" amount="+$25.000" color="#1FA463" hl={hlRight}>
        <Img src={staticFile('tu-sonrisa.png')} style={{position: 'absolute', height: 300, left: 175, top: 25}} />
      </Card>
      <Pop delay={f(17.3 - 15.5)} style={{left: 920, top: 500}}><Label text="o" color="#111" size={90} /></Pop>
    </AbsoluteFill>
  );
};

const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const book = useSpring(4, 11);
  const stamp = useSpring(f(0.35), 8);
  const ty = interpolate(frame, [0, f(5.7)], [0, -20]);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #2B2F45, #11131c)'}}>
      <AbsoluteFill style={{opacity: 0.35}}>
        <KB src="s1-estacionamiento.png" dur={f(5.7)} from={[1.2, 0.5, 0.5]} to={[1.3, 0.5, 0.5]} style={{filter: 'blur(14px) saturate(.4)'}} />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 960, top: 520 + ty, transform: `translate(-50%,-50%) scale(${book}) rotate(${-4 * book}deg)`, width: 520, height: 700,
        background: 'linear-gradient(135deg,#1f3d7a,#122752)', borderRadius: 14, boxShadow: '30px 30px 0 rgba(0,0,0,.4), inset 18px 0 0 rgba(255,255,255,.08)', border: '6px solid #0b1530',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 38, color: '#cdd8f5'}}>EL</div>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 74, color: '#fff', lineHeight: 1}}>MILLONARIO</div>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.yel}}>DE AL LADO</div>
        <div style={{width: 300, height: 4, background: '#cdd8f5', margin: '24px 0'}} />
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 34, color: '#cdd8f5'}}>Stanley & Danko</div>
      </div>
      {stamp > 0.01 && (
        <div style={{position: 'absolute', left: 1330, top: 230, transform: `scale(${2.2 - 1.2 * stamp}) rotate(-12deg)`, opacity: stamp, fontFamily: FONT, fontWeight: 900, fontSize: 150,
          color: C.red, border: `12px solid ${C.red}`, borderRadius: 24, padding: '0 30px', background: 'rgba(255,255,255,.92)'}}>1996</div>
      )}
      <Pop delay={f(2.3)} style={{left: 150, top: 820}} rot={-4}><Label text="Estudiaron a millonarios" bg={C.white} color="#111" size={54} /></Pop>
    </AbsoluteFill>
  );
};

const S6: React.FC = () => (
  <AbsoluteFill>
    <KB src="s1-estacionamiento.png" dur={f(2.9)} from={[3.0, 0.02, 0.47]} to={[3.5, 0.01, 0.47]} />
    <Vignette strength={0.5} />
    <Pop delay={4} style={{left: 120, top: 90}} rot={-6}><Label text="MILLONARIO" color={C.green} size={130} /></Pop>
    <Pop delay={f(1.1)} style={{left: 160, top: 290}} rot={4}><Label text="✓ Auto usado" bg={C.white} color="#111" size={70} /></Pop>
  </AbsoluteFill>
);

const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + 28.1;
  const val = Math.round(interpolate(t, [28.6, 31.0], [25000, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)}));
  const zero = val === 0;
  const sat = interpolate(t, [30.8, 31.3], [1, 0.3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <KB src="s1-estacionamiento.png" dur={f(3.9)} from={[1.25, 0.45, 0.45]} to={[1.6, 0.42, 0.4]} style={{filter: `saturate(${sat})`}} />
      <Vignette strength={zero ? 0.75 : 0.45} color={zero ? '90,0,0' : '0,0,0'} />
      <Pop delay={4} style={{left: 110, top: 110}}>
        <div style={{background: '#111', borderRadius: 30, padding: '26px 44px', border: `6px solid ${zero ? C.red : C.green}`, boxShadow: '0 14px 0 rgba(0,0,0,.4)'}}>
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 36, color: '#aaa'}}>Saldo de Marcos</div>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 120, color: zero ? C.red : C.green, fontVariantNumeric: 'tabular-nums'}}>${val.toLocaleString('es-MX')}</div>
        </div>
      </Pop>
      {zero && <Pop delay={f(31.05 - 28.1)} style={{left: 1210, top: 180}}><Img src={staticFile('marcos-serio.png')} style={{height: 320, filter: 'drop-shadow(0 12px 0 rgba(0,0,0,.4))'}} /></Pop>}
    </AbsoluteFill>
  );
};

const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = useSpring(2, 14);
  const glow = 0.6 + Math.sin(frame / 8) * 0.1;
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, rgba(255,214,10,${glow}), #6b4a00 45%, #1a1200 100%)`}}>
      <AbsoluteFill style={{background: 'repeating-conic-gradient(from 0deg at 50% 60%, rgba(255,240,170,.13) 0deg 8deg, transparent 8deg 20deg)', transform: `rotate(${frame * 0.3}deg) scale(2)`}} />
      <Coins3D />
      <div style={{position: 'absolute', left: 960, top: 1040, transform: `translate(-50%, -100%) translateY(${(1 - rise) * 500}px)`}}>
        <Img src={staticFile('tu-cuerpo.png')} style={{height: 860, filter: 'drop-shadow(0 0 40px rgba(255,230,120,.9))'}} />
      </div>
      <Pop delay={f(33.0 - 32.0)} style={{left: 1230, top: 470}} rot={-8}><Label text="SUDADERA GRIS" bg={C.white} color="#111" size={54} /></Pop>
      <Pop delay={f(35.6 - 32.0)} style={{left: 130, top: 140}} rot={-10}>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 150, color: C.green, border: `14px solid ${C.green}`, borderRadius: 28, padding: '0 34px', background: 'rgba(0,0,0,.55)'}}>GANANDO</div>
      </Pop>
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(0, 10);
  const t2 = useSpring(10, 12);
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, #1d2a22, ${C.bg})`, alignItems: 'center', justifyContent: 'center'}}>
      <Img src={staticFile('logo.png')} style={{width: 420, height: 420, borderRadius: '50%', transform: `scale(${p}) rotate(${(1 - p) * -200}deg)`, marginTop: -160, boxShadow: '0 0 80px rgba(61,220,132,.5)'}} />
      <div style={{position: 'absolute', top: 690, transform: `scale(${t2})`, fontFamily: FONT, fontWeight: 900, fontSize: 120, color: C.white, letterSpacing: -3}}>
        TU MENTE <span style={{color: C.green}}>GASTA</span>
      </div>
      <div style={{position: 'absolute', top: 850, opacity: interpolate(frame, [25, 40], [0, 1], {extrapolateRight: 'clamp'}), fontFamily: FONT, fontWeight: 700, fontSize: 44, color: '#cfcfcf'}}>
        Suscríbete para no caer en la próxima trampa
      </div>
    </AbsoluteFill>
  );
};

// ---------- montaje ----------
const SCENES: [number, number, React.FC][] = [
  [0, 5.9, S1], [5.9, 12.3, S2], [12.3, 15.5, S3], [15.5, 19.5, S4], [19.5, 25.25, S5],
  [25.25, 28.15, S6], [28.15, 32.1, S7], [32.1, 37.8, S8], [37.8, 41, End],
];
const SFX: [number, string, number][] = [
  [0, 'sfx-whoosh.mp3', 0.5], [4.25, 'sfx-aplausos.mp3', 0.55], [5.85, 'sfx-whoosh.mp3', 0.6], [8.2, 'sfx-pop.mp3', 0.6],
  [11.05, 'sfx-triste.mp3', 0.7], [12.25, 'sfx-whoosh.mp3', 0.6], [12.75, 'sfx-pop.mp3', 0.7], [15.45, 'sfx-whoosh.mp3', 0.6],
  [16.85, 'sfx-pop.mp3', 0.6], [18.0, 'sfx-pop.mp3', 0.6], [19.45, 'sfx-whoosh.mp3', 0.6], [19.85, 'sfx-pop.mp3', 0.7],
  [25.2, 'sfx-whoosh.mp3', 0.6], [25.4, 'sfx-pop.mp3', 0.6], [28.1, 'sfx-whoosh.mp3', 0.6], [28.6, 'sfx-caja.mp3', 0.45],
  [31.0, 'sfx-triste.mp3', 0.7], [32.05, 'sfx-whoosh.mp3', 0.6], [35.5, 'sfx-caja.mp3', 0.6], [37.75, 'sfx-whoosh.mp3', 0.6],
];

export const ParecePobre: React.FC = () => {
  const frame = useCurrentFrame();
  const musicVol = interpolate(frame, [0, 15, TOTAL_FRAMES - 45, TOTAL_FRAMES], [0, 0.13, 0.13, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {SCENES.map(([s, e, Comp], i) => (
        <Sequence key={i} from={f(s)} durationInFrames={f(e) - f(s)}>
          {i === 0 ? <Comp /> : <Whip dir={i % 2 ? 1 : -1}><Comp /></Whip>}
        </Sequence>
      ))}
      <Captions />
      <Audio src={staticFile('voz.mp3')} />
      <Audio src={staticFile('musica.mp3')} volume={() => musicVol} />
      {SFX.map(([s, file, vol], i) => (
        <Sequence key={`sfx${i}`} from={f(s)} durationInFrames={f(3)}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
