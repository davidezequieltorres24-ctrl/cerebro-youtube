import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import words from './words-v2.json';
import lines from './lines-v2.json';
import {PLAN2} from './plan2';

// ---------- tipos ----------
export type Ov =
  | {t: 'label'; text: string; color?: string; bg?: string; x: number; y: number; size?: number; at?: number; rot?: number}
  | {t: 'stamp'; text: string; color?: string; x: number; y: number; at?: number}
  | {t: 'pstamp'; kind: 'P' | 'S'};
export type Bd =
  | {kind: 'stairs'; level: number}
  | {kind: 'countup'; from: number; to: number; label: string; sub?: string}
  | {kind: 'statement'}
  | {kind: 'options3'; active: number}
  | {kind: 'bars'}
  | {kind: 'quote'; text: string; author: string}
  | {kind: 'equation'}
  | {kind: 'title'; text: string; sub?: string}
  | {kind: 'comments'; q: string}
  | {kind: 'end'};
export type Scene2 = {id: string; img?: string; kb?: number[]; board?: Bd; ov?: Ov[]; sfx?: string};

const FPS = 30;
const C = {bg: '#0E0F12', green: '#3DDC84', red: '#FF3B30', yel: '#FFD60A', white: '#F5F3EE', dgreen: '#2A3B33'};
const FONT = 'Inter, "Inter Display", sans-serif';
const W_ = words as {w: string; s: number; e: number}[];
const VOICE_END = W_[W_.length - 1].e;
const END_CARD = 12;
export const V2_FRAMES = Math.round((VOICE_END + END_CARD) * FPS);

type Timed = Scene2 & {start: number; end: number};
const same = (a?: Bd, b?: Bd) => !!a && !!b && JSON.stringify(a) === JSON.stringify(b);
const TIMED: Timed[] = (() => {
  const L = lines as {id: string; s: number}[];
  const out: Timed[] = [];
  PLAN2.forEach((sc, i) => {
    const start = i === 0 ? 0 : Math.max(0, L[i].s - 0.12);
    const end = i + 1 < PLAN2.length ? Math.max(0, L[i + 1].s - 0.12) : VOICE_END + END_CARD;
    const prev = out[out.length - 1];
    if (prev && (same(prev.board, sc.board) || (prev.board?.kind === 'end' && sc.board?.kind === 'end'))) { prev.end = end; return; }
    out.push({...sc, start, end});
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
const KB: React.FC<{src: string; dur: number; kb: number[]}> = ({src, dur, kb}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, dur], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb[0] + (kb[1] - kb[0]) * t})`, transformOrigin: `${kb[2] * 100}% ${kb[3] * 100}%`}} />
    </AbsoluteFill>
  );
};
const Whip: React.FC<{children: React.ReactNode; dir: number}> = ({children, dir}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 8], [dir * 1920 * 0.25, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const op = interpolate(frame, [0, 4], [0, 1], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{transform: `translateX(${x}px)`, opacity: op}}>{children}</AbsoluteFill>;
};
const Paper: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #FFF9EA, #F1E6C8)'}}>
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(0,0,0,.05) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,.05) 2px, transparent 2px)', backgroundSize: '60px 60px'}} />
    {children}
  </AbsoluteFill>
);
const Dark: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, #1d2a22, ${C.bg})`}}>{children}</AbsoluteFill>
);

// ---------- overlays ----------
const OverlayView: React.FC<{o: Ov}> = ({o}) => {
  const at = 'at' in o && o.at !== undefined ? Math.round(o.at * FPS) : 6;
  const p = useSpr(o.t === 'pstamp' ? 2 : at, 8);
  if (o.t === 'label') return <PopAt delay={at} x={o.x} y={o.y} rot={o.rot}><Label text={o.text} color={o.color} bg={o.bg} size={o.size} /></PopAt>;
  if (o.t === 'stamp') {
    if (p < 0.01) return null;
    const col = o.color ?? C.red;
    return <div style={{position: 'absolute', left: o.x * 1920, top: o.y * 1080, transform: `translate(-50%,-50%) scale(${2.2 - 1.2 * p}) rotate(-12deg)`, opacity: p, fontFamily: FONT, fontWeight: 900,
      fontSize: 120, color: col, border: `12px solid ${col}`, borderRadius: 24, padding: '0 30px', background: 'rgba(255,255,255,.92)'}}>{o.text}</div>;
  }
  // sello PROBLEMA / SOLUCIÓN (arriba a la izquierda)
  const isP = o.kind === 'P';
  if (p < 0.01) return null;
  return <div style={{position: 'absolute', left: 60, top: 54, transform: `scale(${p}) rotate(-4deg)`, transformOrigin: 'left top', fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 2,
    color: isP ? C.white : '#111', background: isP ? C.red : C.green, padding: '12px 30px', borderRadius: 14, border: '5px solid #111', boxShadow: '0 8px 0 #111'}}>
    {isP ? '⚠ PROBLEMA' : '✓ SOLUCIÓN'}</div>;
};

// ---------- tableros ----------
const LEVELS = ['$500', '$1.000', '$2.500', '$5.000', '$10.000'];
const TRAPS = ['Escasez', 'Pago mínimo', 'La bata nueva', 'Cuotas', 'Esposas de oro'];
const Stairs: React.FC<{level: number}> = ({level}) => {
  const frame = useCurrentFrame();
  return (
    <Dark>
      <div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center'}}>
        {level > 0 ? <Label text={`NIVEL ${level}`} color={C.yel} size={110} /> : <Label text="5 NIVELES · 5 TRAMPAS" color={C.yel} size={90} />}
      </div>
      {LEVELS.map((lv, i) => {
        const on = level === 0 ? true : i + 1 === level;
        const past = level > 0 && i + 1 < level;
        const delay = level === 0 ? i * 8 : 0;
        const p = interpolate(frame, [delay, delay + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.6))});
        const x = 170 + i * 330, y = 860 - i * 120;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: 300, height: 1080 - y, transform: `translateY(${(1 - p) * 300}px)`, opacity: p}}>
            <div style={{height: 64, background: on ? C.green : past ? '#3a5446' : '#2a2f36', border: '6px solid #111', borderRadius: 10, boxShadow: on ? `0 0 40px ${C.green}` : undefined,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 44, color: on ? '#111' : '#9aa'}}>{lv}</div>
            <div style={{height: '100%', background: 'linear-gradient(#1b2a22, #0e1512)', borderLeft: '6px solid #111', borderRight: '6px solid #111'}} />
            {on && level > 0 && (
              <div style={{position: 'absolute', top: -120, left: 150, transform: 'translateX(-50%)', textAlign: 'center'}}>
                <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.red, background: '#111', padding: '8px 20px', borderRadius: 12, whiteSpace: 'nowrap'}}>TRAMPA: {TRAPS[i].toUpperCase()}</div>
              </div>
            )}
          </div>
        );
      })}
    </Dark>
  );
};

const CountUp: React.FC<{from: number; to: number; label: string; sub?: string; dur: number}> = ({from, to, label, sub, dur}) => {
  const frame = useCurrentFrame();
  const v = Math.round(interpolate(frame, [10, Math.max(20, dur - 20)], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const up = to >= from;
  return (
    <Paper>
      <div style={{position: 'absolute', top: 200, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 80, color: '#111'}}>{label}</div>
      <div style={{position: 'absolute', top: 340, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 230, color: up ? '#1FA463' : C.red,
        WebkitTextStroke: '10px #111', paintOrder: 'stroke fill', fontVariantNumeric: 'tabular-nums'}}>${v.toLocaleString('es-MX').replace(/,/g, '.')}</div>
      {sub && <div style={{position: 'absolute', top: 650, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 56, color: '#444'}}>{sub}</div>}
    </Paper>
  );
};

const Statement: React.FC = () => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [20, 45], [1, 1.35], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
  const p = useSpr(0, 11);
  return (
    <Dark>
      <div style={{position: 'absolute', left: 560, top: 140, width: 800, transform: `scale(${p})`, background: '#fff', borderRadius: 24, padding: '40px 56px', boxShadow: '0 20px 0 #000', fontFamily: FONT}}>
        <div style={{fontWeight: 900, fontSize: 44, color: '#111', borderBottom: '4px solid #ddd', paddingBottom: 16}}>💳 Estado de cuenta</div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 46, fontWeight: 700, color: '#444', marginTop: 34}}><span>Saldo</span><span>$1.000</span></div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 46, fontWeight: 700, color: '#444', marginTop: 20}}><span>Pago total</span><span>$1.000</span></div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 34, padding: '20px 26px', background: '#FFF3C4', borderRadius: 16,
          transform: `scale(${grow})`, transformOrigin: 'center', border: `6px solid ${C.red}`}}>
          <span style={{fontSize: 52, fontWeight: 900, color: '#111'}}>Pago mínimo</span><span style={{fontSize: 64, fontWeight: 900, color: C.red}}>$25</span>
        </div>
      </div>
      <PopAt delay={50} x={0.5} y={0.86}><Label text="EL ANCLA" color={C.red} size={90} /></PopAt>
    </Dark>
  );
};

const Options3: React.FC<{active: number}> = ({active}) => {
  const frame = useCurrentFrame();
  const items = [{i: '💵', t: 'CONTADO'}, {i: '💳', t: '12 CUOTAS'}, {i: '⏳', t: 'ESPERAR 30 DÍAS'}];
  const cd = active === -1 ? Math.max(1, 3 - Math.floor(frame / 20)) : 0;
  return (
    <Paper>
      <div style={{position: 'absolute', top: 70, width: '100%', display: 'flex', justifyContent: 'center'}}><Label text="¿QUÉ HARÍAS TÚ?" bg={C.yel} color="#111" size={84} /></div>
      {items.map((it, k) => {
        const on = active === k || active === -1;
        const appear = active === -1 ? 1 : k <= active ? 1 : 0;
        const sc = (active === k ? 1.06 + Math.sin(frame / 6) * 0.01 : 0.95) * appear;
        return (
          <div key={k} style={{position: 'absolute', left: 140 + k * 570, top: 280, width: 500, height: 480, transform: `scale(${sc})`, background: '#fff', borderRadius: 30,
            border: `10px solid ${active === k ? C.yel : '#222'}`, boxShadow: `0 16px 0 #222${active === k ? `, 0 0 60px ${C.yel}` : ''}`, opacity: on ? 1 : 0.6,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30}}>
            <div style={{fontSize: 170}}>{it.i}</div>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 50, color: '#111', textAlign: 'center'}}>{k + 1}. {it.t}</div>
          </div>
        );
      })}
      {active === -1 && <div style={{position: 'absolute', left: 960, top: 900, transform: 'translate(-50%,-50%)', fontFamily: FONT, fontWeight: 900, fontSize: 140, color: C.red,
        WebkitTextStroke: '8px #111', paintOrder: 'stroke fill'}}>{cd}</div>}
    </Paper>
  );
};

const Bars: React.FC = () => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [10, 35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const b = interpolate(frame, [30, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.4))});
  const bar = (h: number, col: string, x: number, lab: string, icon: string) => (
    <div style={{position: 'absolute', left: x, bottom: 170, width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{width: 260, height: h, background: col, border: '8px solid #111', borderRadius: '14px 14px 0 0'}} />
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#111', marginTop: 16}}>{icon} {lab}</div>
    </div>
  );
  return (
    <Paper>
      <div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 70, color: '#111'}}>Lo que ofrecieron por la entrada</div>
      {bar(220 * a, '#9aa', 520, 'EFECTIVO', '💵')}
      {bar(440 * b, C.green, 1100, 'TARJETA', '💳')}
      <PopAt delay={70} x={0.74} y={0.22}><Label text="×2" color={C.red} size={150} /></PopAt>
      <div style={{position: 'absolute', bottom: 60, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 30, color: '#555'}}>Prelec y Simester, MIT (2001)</div>
    </Paper>
  );
};

const Quote: React.FC<{text: string; author: string}> = ({text, author}) => {
  const p = useSpr(0, 12);
  return (
    <Paper>
      <div style={{position: 'absolute', left: 200, right: 200, top: 300, transform: `scale(${p})`, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 92, color: '#111', lineHeight: 1.15}}>{text}</div>
      <div style={{position: 'absolute', top: 720, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 44, color: '#555'}}>— {author}</div>
    </Paper>
  );
};

const Equation: React.FC = () => {
  const a = useSpr(0, 11), b = useSpr(15, 11), c = useSpr(30, 11);
  return (
    <Dark>
      <div style={{position: 'absolute', top: 200, width: '100%', textAlign: 'center'}}><span style={{display: 'inline-block', transform: `scale(${a})`}}><Label text="TU NIVEL REAL =" color={C.yel} size={100} /></span></div>
      <div style={{position: 'absolute', top: 470, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40}}>
        <span style={{transform: `scale(${b})`}}><Label text="LO QUE GANAS" bg={C.green} color="#111" size={74} /></span>
        <span style={{transform: `scale(${b})`, fontFamily: FONT, fontWeight: 900, fontSize: 130, color: C.white}}>−</span>
        <span style={{transform: `scale(${c})`}}><Label text="LO QUE GASTAS" bg={C.red} color={C.white} size={74} /></span>
      </div>
    </Dark>
  );
};

const BoardView: React.FC<{b: Bd; dur: number}> = ({b, dur}) => {
  const frame = useCurrentFrame();
  const p = useSpr(0, 10);
  switch (b.kind) {
    case 'stairs': return <Stairs level={b.level} />;
    case 'countup': return <CountUp {...b} dur={dur} />;
    case 'statement': return <Statement />;
    case 'options3': return <Options3 active={b.active} />;
    case 'bars': return <Bars />;
    case 'quote': return <Quote text={b.text} author={b.author} />;
    case 'equation': return <Equation />;
    case 'title': return (
      <Dark><AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: `scale(${p})`, fontFamily: FONT, fontWeight: 900, fontSize: 170, color: C.yel, letterSpacing: -4}}>{b.text}</div>
        {b.sub && <div style={{marginTop: 20, opacity: interpolate(frame, [10, 20], [0, 1], {extrapolateRight: 'clamp'}), fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.white}}>{b.sub}</div>}
      </AbsoluteFill></Dark>);
    case 'comments': return (
      <Dark>
        <Img src={staticFile('tu-sonrisa.png')} style={{position: 'absolute', left: 260, top: 300, height: 420, transform: `scale(${p})`}} />
        <div style={{position: 'absolute', left: 820, top: 330, width: 880, transform: `scale(${useSpr(8, 10)})`, transformOrigin: 'left center', background: '#fff', borderRadius: 34, padding: '36px 46px', boxShadow: '0 14px 0 #000'}}>
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 34, color: '#777'}}>💬 Comentarios</div>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 58, color: '#111', lineHeight: 1.1, marginTop: 10}}>{b.q}</div>
        </div>
      </Dark>);
    case 'end': return (
      // placa final de 12 s: logo arriba, zona libre abajo para los elementos de la pantalla final de YouTube
      <Dark>
        <Img src={staticFile('logo.png')} style={{position: 'absolute', left: 960 - 130, top: 70, width: 260, height: 260, borderRadius: '50%', transform: `scale(${p})`, boxShadow: '0 0 60px rgba(61,220,132,.5)'}} />
        <div style={{position: 'absolute', top: 360, width: '100%', textAlign: 'center', transform: `scale(${useSpr(8, 12)})`, fontFamily: FONT, fontWeight: 900, fontSize: 84, color: C.white}}>TU MENTE <span style={{color: C.green}}>GASTA</span></div>
        <div style={{position: 'absolute', top: 480, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 40, color: '#cfcfcf'}}>Mira la próxima trampa 👇</div>
      </Dark>);
  }
};

const SceneView: React.FC<{sc: Timed; dur: number}> = ({sc, dur}) => (
  <AbsoluteFill>
    {sc.board ? <BoardView b={sc.board} dur={dur} /> : <KB src={sc.img!} dur={dur} kb={sc.kb ?? [1, 1.15, 0.5, 0.5]} />}
    {!sc.board && <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,.35) 100%)'}} />}
    {sc.ov?.map((o, i) => <OverlayView key={i} o={o} />)}
  </AbsoluteFill>
);

// ---------- subtítulos ----------
const KEY = ['sueldo', 'nivel', 'trampa', 'dinero', 'escasez', 'mínimo', 'ancla', 'deuda', 'diderot', 'cuotas', 'tarjeta', 'doble', 'oro', 'gasto', 'guardas', 'frasco', 'aire', 'regla', 'libertad'];
const GROUPS = (() => {
  const g: typeof W_[] = []; let cur: typeof W_ = [];
  W_.forEach((w, i) => { cur.push(w); const n = W_[i + 1]; if (cur.length >= 5 || /[.?!,:]$/.test(w.w) || !n || n.s - w.e > 0.45) { g.push(cur); cur = []; } });
  return g;
})();
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t > VOICE_END + 0.5) return null;
  const g = GROUPS.find((gr) => t >= gr[0].s - 0.05 && t <= gr[gr.length - 1].e + 0.3);
  if (!g) return null;
  return (
    <div style={{position: 'absolute', bottom: 64, width: '100%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', padding: '0 140px'}}>
      {g.map((w, i) => {
        const active = t >= w.s && t <= w.e + 0.06;
        const clean = w.w.toLowerCase().replace(/[¿?¡!.,:"“”]/g, '');
        const key = KEY.some((k) => clean.startsWith(k));
        return <span key={i} style={{fontFamily: FONT, fontWeight: 900, fontSize: 62, letterSpacing: -1, margin: '0 13px', display: 'inline-block', transform: `scale(${active ? 1.08 : 1})`, transformOrigin: '50% 80%',
          color: active ? (key ? C.green : C.yel) : t >= w.s ? C.white : 'rgba(245,243,238,.55)', WebkitTextStroke: '9px #000', paintOrder: 'stroke fill', textShadow: '0 6px 0 rgba(0,0,0,.45)'}}>{w.w}</span>;
      })}
    </div>
  );
};

export const Video2: React.FC = () => {
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
      <Audio src={staticFile('voz-video2.mp3')} />
      <Audio src={staticFile('n-musica.mp3')} loop volume={(fr) => interpolate(fr, [0, 15, V2_FRAMES - 60, V2_FRAMES], [0, 0.07, 0.07, 0], {extrapolateRight: 'clamp'})} />
      {TIMED.map((sc) => sc.sfx ? (
        <Sequence key={'s' + sc.id} from={f(sc.start) + (sc.sfx === 'whoosh' ? 0 : 8)} durationInFrames={f(3)}>
          <Audio src={staticFile(`n-sfx-${sc.sfx}.mp3`)} volume={0.45} />
        </Sequence>
      ) : null)}
    </AbsoluteFill>
  );
};
