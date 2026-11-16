import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import words from './words-full.json';
import lines from './lines-full.json';
import {PLAN, Scene, Overlay, Board} from './plan';

const FPS = 30;
const C = {bg: '#0E0F12', green: '#3DDC84', red: '#FF3B30', yel: '#FFD60A', white: '#F5F3EE', cream: '#FBF6E9'};
const FONT = 'Inter, "Inter Display", sans-serif';
const W_ = words as {w: string; s: number; e: number}[];
const VOICE_END = W_[W_.length - 1].e;
const END_CARD = 12; // espacio para la pantalla final de YouTube (5–20 s)
export const FULL_FRAMES = Math.round((VOICE_END + END_CARD) * FPS);

// tiempos de cada escena (en segundos), unificando escenas consecutivas con el mismo tablero final
type Timed = Scene & {start: number; end: number};
const TIMED: Timed[] = (() => {
  const L = lines as {id: string; s: number}[];
  const out: Timed[] = [];
  PLAN.forEach((sc, i) => {
    const start = Math.max(0, L[i].s - 0.12);
    const end = i + 1 < PLAN.length ? Math.max(0, L[i + 1].s - 0.12) : VOICE_END + END_CARD;
    const prev = out[out.length - 1];
    if (prev && prev.board?.kind === 'final' && sc.board?.kind === 'final') { prev.end = end; return; }
    out.push({...sc, start: i === 0 ? 0 : start, end});
  });
  return out;
})();

const useSpr = (delay = 0, damping = 12) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, mass: 0.6}});
};

const Label: React.FC<{text: string; color?: string; size?: number; bg?: string}> = ({text, color = C.white, size = 64, bg}) => (
  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, color, letterSpacing: -1, padding: bg ? '10px 26px' : 0, background: bg, borderRadius: 18,
    WebkitTextStroke: bg ? undefined : `${Math.max(3, size / 14)}px #111`, paintOrder: 'stroke fill', boxShadow: bg ? '0 10px 0 rgba(0,0,0,.35)' : undefined, whiteSpace: 'nowrap'}}>{text}</div>
);

const PopAt: React.FC<{delay: number; x: number; y: number; rot?: number; children: React.ReactNode}> = ({delay, x, y, rot = 0, children}) => {
  const p = useSpr(delay, 9);
  if (p <= 0.001) return null;
  return <div style={{position: 'absolute', left: x * 1920, top: y * 1080, transform: `translate(-50%,-50%) scale(${p}) rotate(${rot}deg)`}}>{children}</div>;
};

const KB: React.FC<{src: string; dur: number; kb: [number, number, number, number]; filter?: string}> = ({src, dur, kb, filter}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, dur], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const s = kb[0] + (kb[1] - kb[0]) * t;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})`, transformOrigin: `${kb[2] * 100}% ${kb[3] * 100}%`, filter}} />
    </AbsoluteFill>
  );
};

const Whip: React.FC<{children: React.ReactNode; dir: number}> = ({children, dir}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 8], [dir * 1920 * 0.25, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const blur = interpolate(frame, [0, 8], [18, 0], {extrapolateRight: 'clamp'});
  const op = interpolate(frame, [0, 4], [0, 1], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{transform: `translateX(${x}px)`, opacity: op}}>{children}</AbsoluteFill>;
};

const Sparkles: React.FC<{x: number; y: number}> = ({x, y}) => {
  const frame = useCurrentFrame();
  return (<>{Array.from({length: 12}).map((_, i) => {
    const ph = (frame + i * 7) % 40; const sc = Math.sin((ph / 40) * Math.PI);
    return <div key={i} style={{position: 'absolute', left: x * 1920 + (random(`x${i}`) - 0.5) * 700, top: y * 1080 + (random(`y${i}`) - 0.5) * 300, width: 46, height: 46,
      transform: `translate(-50%,-50%) scale(${sc}) rotate(${frame * 3}deg)`, background: C.white, clipPath: 'polygon(50% 0,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0 50%,39% 39%)', filter: 'drop-shadow(0 0 10px #fff8b0)'}} />;
  })}</>);
};

const OverlayView: React.FC<{o: Overlay; dur: number}> = ({o, dur}) => {
  const frame = useCurrentFrame();
  const at = 'at' in o && o.at !== undefined ? Math.round(o.at * FPS) : 6;
  switch (o.t) {
    case 'label':
      return <PopAt delay={at} x={o.x} y={o.y} rot={o.rot}><Label text={o.text} color={o.color} bg={o.bg} size={o.size} /></PopAt>;
    case 'stamp': {
      const p = useSpr(at, 8);
      if (p < 0.01) return null;
      return <div style={{position: 'absolute', left: o.x * 1920, top: o.y * 1080, transform: `translate(-50%,-50%) scale(${2.2 - 1.2 * p}) rotate(-12deg)`, opacity: p, fontFamily: FONT, fontWeight: 900,
        fontSize: 130, color: o.color ?? C.red, border: `12px solid ${o.color ?? C.red}`, borderRadius: 24, padding: '0 30px', background: 'rgba(255,255,255,.92)'}}>{o.text}</div>;
    }
    case 'question': {
      const p = useSpr(8, 7);
      if (p < 0.01) return null;
      return <div style={{position: 'absolute', left: 960, top: 460, transform: `translate(-50%,-50%) scale(${p}) rotate(${Math.sin(frame / 5) * 6}deg)`, fontFamily: FONT, fontWeight: 900, fontSize: 400,
        color: C.yel, WebkitTextStroke: '22px #111', paintOrder: 'stroke fill', textShadow: '0 22px 0 rgba(0,0,0,.4)'}}>?</div>;
    }
    case 'arrowDown': {
      const y = interpolate(frame, [30, 45], [-200, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
      if (frame < 30) return null;
      return <div style={{position: 'absolute', left: o.x * 1920 - 75, top: o.y * 1080 + y}}><svg viewBox="0 0 100 150" width="150" height="230"><path d="M30 0h40v90h28L50 150 2 90h28z" fill={C.red} stroke="#111" strokeWidth="6" /></svg></div>;
    }
    case 'counter': {
      const v = Math.round(interpolate(frame, [12, dur - 15], [o.from, o.to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)}));
      const zero = v === o.to;
      return <PopAt delay={4} x={0.24} y={0.2}><div style={{background: '#111', borderRadius: 30, padding: '24px 44px', border: `6px solid ${zero ? C.red : C.green}`, boxShadow: '0 14px 0 rgba(0,0,0,.4)'}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 34, color: '#aaa'}}>{o.label}</div>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 110, color: zero ? C.red : C.green, fontVariantNumeric: 'tabular-nums'}}>${v.toLocaleString('es-MX')}</div></div></PopAt>;
    }
    case 'sparkles':
      return <Sparkles x={o.x} y={o.y} />;
    default:
      return null;
  }
};

// ---------- tableros (motion graphics) ----------
const Paper: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #FFF9EA, #F1E6C8)'}}>
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(0,0,0,.05) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,.05) 2px, transparent 2px)', backgroundSize: '60px 60px'}} />
    {children}
  </AbsoluteFill>
);

const Formula: React.FC<{step: number}> = ({step}) => {
  const a = useSpr(2, 11);
  const rows = [
    {t: 'EDAD × INGRESO ANUAL ÷ 10', c: '#111', bg: C.yel},
    {t: 'Tienes el DOBLE o más → gran acumulador', c: '#111', bg: C.green},
    {t: 'Tienes la MITAD o menos → acumulador bajo', c: C.white, bg: C.red},
  ];
  return (
    <Paper>
      <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 70, color: '#111'}}>Patrimonio esperado</div>
      {rows.slice(0, step).map((r, i) => {
        const isNew = i === step - 1;
        const s = isNew ? a : 1;
        return <div key={i} style={{position: 'absolute', left: '50%', top: 300 + i * 190, transform: `translateX(-50%) scale(${s})`, background: r.bg, color: r.c, fontFamily: FONT, fontWeight: 900,
          fontSize: i === 0 ? 92 : 62, padding: '20px 44px', borderRadius: 26, boxShadow: '0 12px 0 #222', whiteSpace: 'nowrap', opacity: isNew ? 1 : 0.9}}>{r.t}</div>;
      })}
      <div style={{position: 'absolute', bottom: 210, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 32, color: '#555'}}>Stanley & Danko, El millonario de al lado (1996)</div>
    </Paper>
  );
};

const Options: React.FC<{active: number; crossed: number[]}> = ({active, crossed}) => {
  const frame = useCurrentFrame();
  const items = [{t: 'AUTO NUEVO', i: 'escenas/e55.jpg'}, {t: 'MUDARTE', i: 'escenas/e57.jpg'}, {t: 'GUARDAR', i: 'escenas/e60.jpg'}];
  return (
    <Paper>
      <div style={{position: 'absolute', top: 70, width: '100%', display: 'flex', justifyContent: 'center'}}><Label text="¿QUÉ HARÍAS TÚ?" bg={C.yel} color="#111" size={84} /></div>
      {items.map((it, i) => {
        const on = i === active;
        const x = 120 + i * 580;
        const sc = on ? 1.04 + Math.sin(frame / 6) * 0.01 : 0.94;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: 260, width: 520, height: 560, transform: `scale(${sc})`, background: '#fff', borderRadius: 30, overflow: 'hidden',
            border: `10px solid ${on ? (i === 2 ? '#1FA463' : C.yel) : '#222'}`, boxShadow: `0 16px 0 #222${on ? `, 0 0 60px ${i === 2 ? C.green : C.yel}` : ''}`, opacity: crossed.includes(i) ? 0.55 : 1}}>
            <Img src={staticFile(it.i)} style={{width: '100%', height: 360, objectFit: 'cover'}} />
            <div style={{textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 60, color: '#111', marginTop: 40}}>{i + 1}. {it.t}</div>
            {crossed.includes(i) && <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 380, color: C.red, fontWeight: 900, fontFamily: FONT}}>✕</div>}
          </div>
        );
      })}
    </Paper>
  );
};

const Coins3D: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <ThreeCanvas width={1920} height={1080} camera={{position: [0, 0, 10], fov: 50}} style={{position: 'absolute', inset: 0}}>
      <ambientLight intensity={1.6} />
      <directionalLight position={[3, 5, 6]} intensity={2.2} />
      {Array.from({length: 24}).map((_, i) => {
        const bill = i % 3 === 0;
        const y = 7 - ((frame * (0.045 + random(`s${i}`) * 0.05) + random(`y${i}`) * 14) % 14);
        const x = (random(`x${i}`) - 0.5) * 16; const z = -random(`z${i}`) * 4; const r = frame * (0.04 + random(`r${i}`) * 0.08);
        return bill
          ? <mesh key={i} position={[x, y, z]} rotation={[r, r * 0.7, Math.sin(r) * 0.5]}><boxGeometry args={[1.5, 0.75, 0.02]} /><meshStandardMaterial color="#3DDC84" emissive="#0d5a30" emissiveIntensity={0.4} side={2} /></mesh>
          : <mesh key={i} position={[x, y, z]} rotation={[r + Math.PI / 2, r * 1.3, 0]}><cylinderGeometry args={[0.42, 0.42, 0.08, 40]} /><meshStandardMaterial color="#F7C948" emissive="#8a6200" emissiveIntensity={0.5} metalness={0.3} roughness={0.35} /></mesh>;
      })}
    </ThreeCanvas>
  );
};

const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = useSpr(2, 14);
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, rgba(255,214,10,${0.6 + Math.sin(frame / 8) * 0.1}), #6b4a00 45%, #1a1200 100%)`}}>
      <AbsoluteFill style={{background: 'repeating-conic-gradient(from 0deg at 50% 60%, rgba(255,240,170,.13) 0deg 8deg, transparent 8deg 20deg)', transform: `rotate(${frame * 0.3}deg) scale(2)`}} />
      <Coins3D />
      <div style={{position: 'absolute', left: 960, top: 1040, transform: `translate(-50%,-100%) translateY(${(1 - rise) * 500}px)`}}>
        <Img src={staticFile('tu-cuerpo.png')} style={{height: 860, filter: 'drop-shadow(0 0 40px rgba(255,230,120,.9))'}} />
      </div>
      <PopAt delay={45} x={0.76} y={0.5} rot={-8}><Label text="SUDADERA GRIS" bg={C.white} color="#111" size={54} /></PopAt>
      <PopAt delay={110} x={0.3} y={0.22} rot={-10}><div style={{fontFamily: FONT, fontWeight: 900, fontSize: 140, color: C.green, border: `14px solid ${C.green}`, borderRadius: 28, padding: '0 34px', background: 'rgba(0,0,0,.55)'}}>GANANDO</div></PopAt>
    </AbsoluteFill>
  );
};

const BoardView: React.FC<{b: Board}> = ({b}) => {
  const frame = useCurrentFrame();
  const p = useSpr(0, 10);
  switch (b.kind) {
    case 'formula': return <Formula step={b.step} />;
    case 'options': return <Options active={b.active} crossed={b.crossed} />;
    case 'title': return (
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, #1d2a22, ${C.bg})`, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: `scale(${p})`, fontFamily: FONT, fontWeight: 900, fontSize: 170, color: C.yel, letterSpacing: -4}}>{b.text}</div>
        {b.sub && <div style={{marginTop: 20, opacity: interpolate(frame, [10, 20], [0, 1], {extrapolateRight: 'clamp'}), fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.white}}>{b.sub}</div>}
      </AbsoluteFill>);
    case 'versus': return (
      <Paper>
        <div style={{position: 'absolute', left: 140, top: 380, transform: `scale(${p})`}}><Label text={b.left} bg={C.yel} color="#111" size={86} /></div>
        <div style={{position: 'absolute', left: 900, top: 340, fontFamily: FONT, fontWeight: 900, fontSize: 200, color: C.red}}>≠</div>
        <div style={{position: 'absolute', left: 1110, top: 380, transform: `scale(${useSpr(10, 10)})`}}><Label text={b.right} bg={C.green} color="#111" size={86} /></div>
      </Paper>);
    case 'final': return <Final />;
    case 'comments': return (
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, #1d2a22, ${C.bg})`}}>
        <Img src={staticFile('tu-sonrisa.png')} style={{position: 'absolute', left: 260, top: 300, height: 420, transform: `scale(${p})`}} />
        <div style={{position: 'absolute', left: 820, top: 330, width: 880, transform: `scale(${useSpr(8, 10)})`, transformOrigin: 'left center', background: '#fff', borderRadius: 34, padding: '36px 46px', boxShadow: '0 14px 0 #000'}}>
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 34, color: '#777'}}>💬 Comentarios</div>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 62, color: '#111', lineHeight: 1.1, marginTop: 10}}>¿Qué trampa de tu mente vemos en el próximo video?</div>
        </div>
      </AbsoluteFill>);
    case 'end': return (
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, #1d2a22, ${C.bg})`, alignItems: 'center', justifyContent: 'center'}}>
        <Img src={staticFile('logo.png')} style={{width: 400, height: 400, borderRadius: '50%', transform: `scale(${p}) rotate(${(1 - p) * -200}deg)`, marginTop: -170, boxShadow: '0 0 80px rgba(61,220,132,.5)'}} />
        <div style={{position: 'absolute', top: 680, transform: `scale(${useSpr(10, 12)})`, fontFamily: FONT, fontWeight: 900, fontSize: 120, color: C.white, letterSpacing: -3}}>TU MENTE <span style={{color: C.green}}>GASTA</span></div>
        <div style={{position: 'absolute', top: 840, opacity: interpolate(frame, [25, 40], [0, 1], {extrapolateRight: 'clamp'}), fontFamily: FONT, fontWeight: 700, fontSize: 44, color: '#cfcfcf'}}>Suscríbete para no caer en la próxima trampa</div>
      </AbsoluteFill>);
  }
};

const ChapterTag: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 10, 75, 85], [-900, 0, 0, -900], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return <div style={{position: 'absolute', left: 60 + x, top: 60, background: C.green, color: '#111', fontFamily: FONT, fontWeight: 900, fontSize: 42, padding: '14px 30px', borderRadius: 16, boxShadow: '0 8px 0 #111'}}>CAPÍTULO {text}</div>;
};

const SceneView: React.FC<{sc: Timed; dur: number}> = ({sc, dur}) => {
  const desat = sc.ov?.some((o) => o.t === 'desaturate');
  const frame = useCurrentFrame();
  const sat = desat ? interpolate(frame, [20, 40], [1, 0.3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  return (
    <AbsoluteFill>
      {sc.board ? <BoardView b={sc.board} /> : <KB src={sc.img!} dur={dur} kb={sc.kb ?? [1, 1.15, 0.5, 0.5]} filter={desat ? `saturate(${sat})` : undefined} />}
      {!sc.board && <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,.35) 100%)'}} />}
      {sc.ov?.map((o, i) => <OverlayView key={i} o={o} dur={dur} />)}
      {sc.chapter && <ChapterTag text={sc.chapter} />}
    </AbsoluteFill>
  );
};

// ---------- subtítulos ----------
const KEY = ['auto', 'sudadera', 'gris', 'perdiendo', 'dinero', 'rico', 'millonario', 'usados', 'ostentoso', 'vecinos', 'bancarrota', 'cuota', 'deuda', 'opciones', 'ahorro', 'gana', 'ganando', 'housel', 'veblen', 'patrimonio'];
const GROUPS = (() => {
  const g: typeof W_[] = []; let cur: typeof W_ = [];
  W_.forEach((w, i) => { cur.push(w); const n = W_[i + 1]; if (cur.length >= 5 || /[.?!,:]$/.test(w.w) || !n || n.s - w.e > 0.45) { g.push(cur); cur = []; } });
  return g;
})();
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const g = GROUPS.find((gr) => t >= gr[0].s - 0.05 && t <= gr[gr.length - 1].e + 0.3);
  if (!g) return null;
  return (
    <div style={{position: 'absolute', bottom: 64, width: '100%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', padding: '0 140px'}}>
      {g.map((w, i) => {
        const active = t >= w.s && t <= w.e + 0.06;
        const clean = w.w.toLowerCase().replace(/[¿?¡!.,:"]/g, '');
        const key = KEY.some((k) => clean.startsWith(k));
        return <span key={i} style={{fontFamily: FONT, fontWeight: 900, fontSize: 62, letterSpacing: -1, margin: '0 13px', display: 'inline-block', transform: `scale(${active ? 1.08 : 1})`, transformOrigin: '50% 80%',
          color: active ? (key ? C.green : C.yel) : t >= w.s ? C.white : 'rgba(245,243,238,.55)', WebkitTextStroke: '9px #000', paintOrder: 'stroke fill', textShadow: '0 6px 0 rgba(0,0,0,.45)'}}>{w.w}</span>;
      })}
    </div>
  );
};

export const FullVideo: React.FC = () => {
  const f = (s: number) => Math.round(s * FPS);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {TIMED.map((sc, i) => {
        const from = f(sc.start), dur = Math.max(1, f(sc.end) - from);
        return (
          <Sequence key={sc.id} from={from} durationInFrames={dur}>
            {i === 0 ? <SceneView sc={sc} dur={dur} /> : <Whip dir={i % 2 ? 1 : -1}><SceneView sc={sc} dur={dur} /></Whip>}
          </Sequence>
        );
      })}
      <Captions />
      <Audio src={staticFile('voz-completa.mp3')} />
      <Audio src={staticFile('n-musica.mp3')} loop volume={(fr) => interpolate(fr, [0, 15, FULL_FRAMES - 60, FULL_FRAMES], [0, 0.07, 0.07, 0], {extrapolateRight: 'clamp'})} />
      {TIMED.map((sc, i) => (
        <React.Fragment key={'s' + sc.id}>
          {i > 0 && (sc.chapter || sc.board) && <Sequence from={f(sc.start)} durationInFrames={f(1.5)}><Audio src={staticFile('n-sfx-whoosh.mp3')} volume={0.45} /></Sequence>}
          {sc.sfx && <Sequence from={f(sc.start) + 8} durationInFrames={f(3)}><Audio src={staticFile(`n-sfx-${sc.sfx}.mp3`)} volume={0.45} /></Sequence>}
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
