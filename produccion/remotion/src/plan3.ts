// Plan del video 3. Cada escena empieza en su frase ancla (a). Guion: produccion/guiones/03-tarjeta.md
export type Lbl = {t: string; x: number; y: number; at?: string; n?: number; c?: string; size?: number};
export type Fx = {s: string; at?: string; n?: number; v?: number; off?: number};
export type Bd =
  | {k: 'title'; text: string; sub?: string; c?: string; size?: number; line?: boolean}
  | {k: 'big'; small?: string; big: string; at?: string; n?: number; c?: string; sub?: string; size?: number; line?: boolean}
  | {k: 'value'; label: string; value: number; c: string}
  | {k: 'bills'; w: string[]; green?: boolean}
  | {k: 'map'; active: number}
  | {k: 'year'; year: string; sub: string}
  | {k: 'spheres2x'} | {k: 'notcard'} | {k: 'hours'} | {k: 'delay'} | {k: 'compare'} | {k: 'sum'} | {k: 'pros'} | {k: 'rewind'} | {k: 'comments'} | {k: 'end'}
  | {k: 'brain'; items?: string[]; fadeAt?: string; caption?: string; c?: string}
  | {k: 'rule'; at: string};
export type Sc = {a: string; img?: string; photo?: string; z?: [number, number]; fx?: number; fy?: number; tint?: 'amber' | 'red' | 'green' | 'cyan';
  b?: Bd; labels?: Lbl[]; check?: string; beats?: string[]; stamp?: 'P' | 'S'; leak?: boolean; sfx?: Fx[]; noCap?: boolean};

const Y = '#FFD60A', R = '#FF3B30', G = '#3DDC84', CY = '#33E1FF', A = '#FFB547';
const L1 = 'demo3/l01.jpg', L2 = 'demo3/l02.jpg', E = (n: string) => `escenas3/${n}.jpg`;

export const PLAN3: Sc[] = [
  // ---------- GANCHO ----------
  {a: 'imagina esto', b: {k: 'title', text: 'Imagina esto…', line: true}},
  {a: 'estas en la caja', img: L1, fx: 0.42, fy: 0.6, leak: true},
  {a: 'total', b: {k: 'value', label: 'TOTAL', value: 87, c: Y}, sfx: [{s: 'demo3/sfx-impact.mp3', v: 0.5}]},
  {a: 'sacas la tarjeta', img: L1, z: [1.25, 1.8], fx: 0.43, fy: 0.66, check: 'bip', sfx: [{s: 'demo3/sfx-beep.mp3', at: 'bip', v: 0.8, off: -0.05}]},
  {a: 'listo', b: {k: 'big', small: 'No sentiste', big: 'NADA.', at: 'nada', size: 280}, sfx: [{s: 'demo3/sfx-impact.mp3', at: 'nada', v: 0.6}]},
  {a: 'ahora rebobina', b: {k: 'rewind'}, sfx: [{s: 'demo3/sfx-rewind.mp3', v: 0.9}]},
  {a: 'mismo super', img: L1, z: [1.05, 1.12], fx: 0.3, fy: 0.5, leak: true, labels: [{t: 'Mismo súper.', x: 0.72, y: 0.22, c: A, size: 70}, {t: 'Mismo carrito.', x: 0.72, y: 0.32, at: 'carrito', c: A, size: 70}]},
  {a: 'pero esta vez', photo: 'demo3/billetes.jpg', labels: [{t: 'efectivo', x: 0.76, y: 0.45, at: 'efectivo', c: Y, size: 120}]},
  {a: 'cuentas un billete', b: {k: 'bills', w: ['un', 'dos', 'tres', 'cuatro']}, sfx: [{s: 'pop', at: 'un', v: 0.35}, {s: 'pop', at: 'dos', v: 0.4}, {s: 'pop', at: 'tres', v: 0.45}, {s: 'pop', at: 'cuatro', v: 0.5}]},
  {a: 'y algo te aprieta', img: L2, tint: 'red', z: [1.05, 1.18], fx: 0.32, fy: 0.5, leak: true, beats: ['aprieta', 'pecho'], sfx: [{s: 'demo3/sfx-heart.mp3', at: 'aprieta', v: 1}, {s: 'demo3/sfx-heart.mp3', at: 'pecho', v: 1}]},
  {a: 'eso tiene nombre', b: {k: 'big', small: 'Eso tiene nombre:', big: 'EL DOLOR DE PAGAR', at: 'dolor', c: R, size: 140, line: true}, sfx: [{s: 'demo3/sfx-riser.mp3', at: 'nombre', v: 0.8}, {s: 'demo3/sfx-impact.mp3', at: 'dolor', v: 0.8}]},
  {a: 'en 2001', b: {k: 'year', year: '2001', sub: 'Prelec y Simester · MIT'}, leak: true},
  {a: 'cuando ese dolor desaparece', b: {k: 'spheres2x'}, sfx: [{s: 'demo3/sfx-impact.mp3', at: 'doble', v: 0.6, off: -0.1}]},
  {a: 'pero el problema no es', b: {k: 'notcard'}},
  {a: 'es lo que tu cerebro', b: {k: 'brain', items: ['$87', 'intereses', 'cuotas', 'pago mínimo'], fadeAt: 'deja'}, leak: true},
  // ---------- PROMESA + MAPA ----------
  {a: 'hoy te muestro', b: {k: 'map', active: 0}},
  {a: 'y al final una regla', b: {k: 'title', text: '1 REGLA', sub: 'de una sola línea que las arregla', c: G}},
  {a: 'quedate hasta la tercera', b: {k: 'map', active: 3}, sfx: [{s: 'demo3/sfx-riser.mp3', at: 'cuesta', v: 0.6, off: -0.6}]},
  // ---------- 1 · NO VES EL PRECIO ----------
  {a: 'la primera no ves', b: {k: 'map', active: 1}, leak: true, sfx: [{s: 'whoosh'}]},
  {a: 'bueno lo ves', b: {k: 'big', small: 'Lo ves…', big: 'PERO NO LO SIENTES', at: 'sientes', size: 120}},
  {a: 'en 2007', img: E('i03'), fx: 0.25, fy: 0.55, stamp: 'P', labels: [{t: '2007', x: 0.8, y: 0.18, c: CY, size: 110}]},
  {a: 'y les mostro', img: E('i04'), fx: 0.5, fy: 0.3, labels: [{t: '$$$', x: 0.68, y: 0.14, at: 'precio', c: Y, size: 90}]},
  {a: 'cuando el precio era', img: E('i05'), fx: 0.42, fy: 0.5, z: [1.0, 1.25], labels: [{t: 'ÍNSULA', x: 0.42, y: 0.78, at: 'insula', c: A, size: 96}]},
  {a: 'la misma que se activa', img: E('i05'), tint: 'red', fx: 0.42, fy: 0.5, z: [1.25, 1.4], labels: [{t: 'MALESTAR', x: 0.5, y: 0.82, at: 'malestar', c: R, size: 110}]},
  {a: 'y cuanto mas se encendia', img: E('i06'), fx: 0.3, fy: 0.4, labels: [{t: 'No, gracias.', x: 0.24, y: 0.16, at: 'gracias', c: G, size: 86}]},
  {a: 'o sea ese pequeno dolor', b: {k: 'big', small: 'Ese pequeño dolor no es tu enemigo.', big: 'ES TU FRENO.', at: 'freno', c: G, size: 170}, sfx: [{s: 'demo3/sfx-impact.mp3', at: 'freno', v: 0.5}]},
  {a: 'pero la tarjeta corta', img: E('i08'), tint: 'red', fx: 0.45, fy: 0.6, z: [1.0, 1.2], leak: true, labels: [{t: 'SIN FRENO', x: 0.75, y: 0.82, at: 'freno', c: R, size: 96}], sfx: [{s: 'demo3/sfx-impact.mp3', at: 'corta', v: 0.5}]},
  {a: 'pagas hoy', b: {k: 'delay'}},
  {a: 'y con el celular', img: E('i10'), fx: 0.4, fy: 0.55, labels: [{t: 'todavía peor', x: 0.75, y: 0.16, at: 'peor', c: R, size: 80}]},
  {a: 'la solucion devolverle', b: {k: 'title', text: 'DEVUÉLVELE EL PRECIO A TU CUERPO', c: G, size: 92, line: true}, stamp: 'S', leak: true, sfx: [{s: 'pop', v: 0.4}]},
  {a: 'antes de comprar algo', b: {k: 'big', small: 'Precio ÷ lo que ganas por hora =', big: 'HORAS DE TRABAJO', at: 'horas', c: Y, size: 130}},
  {a: 'si ganas 10', img: E('i11'), fx: 0.35, fy: 0.5, labels: [{t: '$10 / hora', x: 0.73, y: 0.18, at: '10', c: CY, size: 84}, {t: '$80', x: 0.62, y: 0.46, at: '80', c: Y, size: 130}]},
  {a: 'cuestan 8 horas', b: {k: 'hours'}, sfx: [{s: 'demo3/sfx-impact.mp3', v: 0.5, off: 0.6}]},
  {a: 'de repente vuelve', b: {k: 'big', small: 'De repente…', big: 'VUELVE A DOLER', at: 'doler', c: G, size: 150, sub: 'y eso es bueno.'}},
  // ---------- 2 · NO VES LO QUE GASTASTE ----------
  {a: 'pero aunque sientas', b: {k: 'brain', caption: '…después, en silencio.', c: CY}, leak: true},
  {a: 'la segunda no ves', b: {k: 'map', active: 2}, sfx: [{s: 'whoosh'}]},
  {a: 'un investigador llamado', img: E('i13'), fx: 0.4, fy: 0.45, stamp: 'P', labels: [{t: 'Dilip Soman', x: 0.24, y: 0.14, at: 'soman', c: CY, size: 80}]},
  {a: 'cuanto acabas de gastar', img: E('i13'), z: [1.2, 1.35], fx: 0.75, fy: 0.45, labels: [{t: '¿Cuánto gastaste?', x: 0.5, y: 0.14, c: Y, size: 90}]},
  {a: 'los que pagaron en efectivo', b: {k: 'compare'}},
  {a: 'piensalo', b: {k: 'big', small: 'Si no recuerdas lo que gastaste, tu cerebro cree que…', big: 'TODAVÍA LO TIENES', at: 'todavia', c: Y, size: 130}},
  {a: 'por eso llega fin de mes', img: E('i15'), fx: 0.45, fy: 0.5, labels: [{t: '"¿En qué se me fue?"', x: 0.5, y: 0.14, at: 'se', n: 2, c: R, size: 84}]},
  {a: 'la solucion es hacer', b: {k: 'title', text: 'QUE CADA GASTO DEJE UNA MARCA', c: G, size: 96, line: true}, stamp: 'S', leak: true, sfx: [{s: 'pop', v: 0.4}]},
  {a: 'activa la notificacion', img: E('i16'), tint: 'green', fx: 0.6, fy: 0.45, labels: [{t: '🔔 -$4,50', x: 0.25, y: 0.25, at: 'notificacion', c: G, size: 70}, {t: '🔔 -$12', x: 0.25, y: 0.38, at: 'compra', c: G, size: 70}, {t: '🔔 -$2,80', x: 0.25, y: 0.51, at: 'chica', c: G, size: 70}], sfx: [{s: 'pop', at: 'notificacion', v: 0.4}, {s: 'pop', at: 'compra', v: 0.4}, {s: 'pop', at: 'chica', v: 0.4}]},
  {a: 'y una vez por semana', img: E('i17'), tint: 'green', fx: 0.35, fy: 0.5, labels: [{t: '5 min / semana', x: 0.75, y: 0.16, at: 'minutos', c: G, size: 84}, {t: 'sin culpa', x: 0.75, y: 0.28, at: 'culpa', c: G, size: 70}]},
  {a: 'lo que se ve', b: {k: 'big', big: 'LO QUE SE VE, SE CONTROLA.', at: 've', c: G, size: 110}, sfx: [{s: 'demo3/sfx-impact.mp3', at: 'controla', v: 0.4}]},
  // ---------- 3 · NO VES QUÉ COMPRAS ----------
  {a: 'y ahora la tercera', b: {k: 'map', active: 3}, leak: true, sfx: [{s: 'demo3/sfx-riser.mp3', v: 0.6}]},
  {a: 'la tercera no ves', b: {k: 'big', big: 'NO VES QUÉ COMPRAS', at: 'ves', c: R, size: 140}, sfx: [{s: 'demo3/sfx-impact.mp3', at: 'ves', v: 0.6}]},
  {a: 'en 2011', img: E('i18'), fx: 0.6, fy: 0.5, stamp: 'P', labels: [{t: '2011', x: 0.2, y: 0.16, c: CY, size: 110}]},
  {a: 'cuando pagaban con tarjeta', img: E('i19'), z: [1.0, 1.15], fx: 0.25, fy: 0.5, labels: [{t: '+ golosinas', x: 0.7, y: 0.3, at: 'golosinas', c: Y, size: 80}, {t: '+ papas fritas', x: 0.7, y: 0.45, at: 'papas', c: Y, size: 80}, {t: '+ antojos', x: 0.7, y: 0.6, at: 'antojos', c: R, size: 80}], sfx: [{s: 'pop', at: 'golosinas', v: 0.4}, {s: 'pop', at: 'papas', v: 0.4}, {s: 'pop', at: 'antojos', v: 0.45}]},
  {a: 'no era hambre', b: {k: 'big', small: 'No era hambre.', big: 'NADA LOS FRENABA.', at: 'nada', c: R, size: 130}},
  {a: 'con billetes en la mano', img: E('i20'), tint: 'red', fx: 0.35, fy: 0.45, beats: ['pelear']},
  {a: 'con tarjeta gana', b: {k: 'big', small: 'Con tarjeta…', big: 'GANA SIEMPRE.', at: 'gana', c: R, size: 170}, sfx: [{s: 'demo3/sfx-impact.mp3', at: 'siempre', v: 0.5}]},
  {a: 'y esos antojos', b: {k: 'sum'}, sfx: [{s: 'pop', at: '2', v: 0.4}, {s: 'pop', at: '3', v: 0.4}, {s: 'pop', at: '5', v: 0.45}, {s: 'demo3/sfx-impact.mp3', at: 'cientos', v: 0.6}]},
  {a: 'la solucion decide', b: {k: 'title', text: 'DECIDE ANTES DE ENTRAR', c: G, size: 110, line: true}, stamp: 'S', leak: true, sfx: [{s: 'pop', v: 0.4}]},
  {a: 'haz la lista', img: E('i21'), tint: 'green', fx: 0.45, fy: 0.55},
  {a: 'como salidas', img: E('i22'), tint: 'green', fx: 0.5, fy: 0.6, labels: [{t: 'salidas', x: 0.2, y: 0.18, at: 'salidas', c: G, size: 74}, {t: 'delivery', x: 0.5, y: 0.12, at: 'delivery', c: G, size: 74}, {t: 'antojos', x: 0.8, y: 0.18, at: 'antojos', c: G, size: 74}], sfx: [{s: 'pop', at: 'salidas', v: 0.35}, {s: 'pop', at: 'delivery', v: 0.35}, {s: 'pop', at: 'antojos', v: 0.35}]},
  {a: 'cuando se termina', b: {k: 'big', small: 'Cuando se termina,', big: 'SE TERMINÓ.', at: 'termino', c: G, size: 170}},
  // ---------- GIRO + REGLA ----------
  {a: 'entonces la tarjeta', b: {k: 'big', small: '¿La tarjeta es el enemigo?', big: 'NO.', at: 'no', c: CY, size: 260}, leak: true, sfx: [{s: 'demo3/sfx-impact.mp3', at: 'no', v: 0.5}]},
  {a: 'bien usada', b: {k: 'pros'}, sfx: [{s: 'pop', at: 'fraudes', v: 0.35}, {s: 'pop', at: 'tiempo', v: 0.35}, {s: 'pop', at: 'puntos', v: 0.35}]},
  {a: 'el problema nunca fue', b: {k: 'big', small: 'El problema nunca fue el plástico.', big: 'ES PAGAR SIN SENTIR.', at: 'pagar', c: Y, size: 120, line: true}},
  {a: 'por eso la regla', b: {k: 'rule', at: 'si'}, leak: true, sfx: [{s: 'demo3/sfx-riser.mp3', at: 'linea', v: 0.7, off: -0.4}, {s: 'demo3/sfx-impact.mp3', at: 'si', v: 0.6}]},
  // ---------- CIERRE CIRCULAR ----------
  {a: 'volvamos a esa caja', img: L1, fx: 0.42, fy: 0.6, leak: true, labels: [{t: '$87', x: 0.78, y: 0.2, at: '87', c: Y, size: 130}]},
  {a: 'sacas la tarjeta y esta vez', img: E('i24'), fx: 0.35, fy: 0.45, z: [1.0, 1.2]},
  {a: 'uno dos', b: {k: 'bills', w: ['uno', 'dos', 'tres', 'cuatro'], green: true}, sfx: [{s: 'pop', at: 'uno', v: 0.35}, {s: 'pop', at: 'dos', v: 0.35}, {s: 'pop', at: 'tres', v: 0.35}, {s: 'pop', at: 'cuatro', v: 0.35}]},
  {a: 'y por primera vez', img: E('i24'), tint: 'green', fx: 0.35, fy: 0.4, z: [1.2, 1.35], labels: [{t: 'duele un poquito', x: 0.74, y: 0.18, at: 'duele', c: G, size: 80}]},
  {a: 'ese dolor es tu cerebro', b: {k: 'brain', caption: 'volviendo a ver.', c: G}},
  {a: 'cuentame en los comentarios', b: {k: 'comments'}, leak: true},
  {a: '@end', b: {k: 'end'}},
];
