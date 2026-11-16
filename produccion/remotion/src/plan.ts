// Plan de escenas del video completo "Por qué la gente que parece pobre tiene más dinero que tú".
// img: archivo en public/ (escenas/xxx.jpg o s1/s2) | board: pizarra animada | kb: [zoomIni, zoomFin, focoX, focoY]
export type Overlay =
  | {t: 'label'; text: string; color?: string; bg?: string; x: number; y: number; size?: number; at?: number; rot?: number}
  | {t: 'stamp'; text: string; color?: string; x: number; y: number; at?: number}
  | {t: 'question'}
  | {t: 'arrowDown'; x: number; y: number}
  | {t: 'counter'; from: number; to: number; label: string}
  | {t: 'sparkles'; x: number; y: number}
  | {t: 'desaturate'};

export type Board =
  | {kind: 'formula'; step: number}
  | {kind: 'options'; active: number; crossed: number[]}
  | {kind: 'title'; text: string; sub?: string}
  | {kind: 'versus'; left: string; right: string}
  | {kind: 'final'}
  | {kind: 'comments'}
  | {kind: 'end'};

export type Scene = {id: string; img?: string; kb?: [number, number, number, number]; board?: Board; ov?: Overlay[]; sfx?: string; chapter?: string};

const E = (n: string) => `escenas/${n}.jpg`;
const Y = '#FFD60A', R = '#FF3B30', G = '#3DDC84', W = '#F5F3EE';

export const PLAN: Scene[] = [
  {id: 'E01', img: E('e01'), kb: [1.25, 1.05, 0.5, 0.45], ov: [{t: 'label', text: 'Imagina esto…', x: 0.5, y: 0.42, size: 120}]},
  {id: 'E02', img: E('e02'), kb: [1.0, 1.2, 0.5, 0.45]},
  {id: 'E03', img: 's1-estacionamiento.jpg', kb: [1.6, 1.3, 0.48, 0.35], ov: [{t: 'sparkles', x: 0.42, y: 0.66}]},
  {id: 'E04', img: 's1-estacionamiento.jpg', kb: [1.25, 1.05, 0.5, 0.5], ov: [{t: 'label', text: '¡WOW!', color: Y, x: 0.16, y: 0.16, size: 110, rot: -8}], sfx: 'aplausos'},
  {id: 'E05', img: 's2-autobus.jpg', kb: [1.05, 1.45, 0.67, 0.42], ov: [{t: 'label', text: 'MISMA SUDADERA', bg: Y, color: '#111', x: 0.78, y: 0.14, size: 58, at: 1.2, rot: -5}]},
  {id: 'E06', img: E('e06'), kb: [1.1, 1.3, 0.5, 0.4], ov: [{t: 'desaturate'}, {t: 'label', text: 'PERDIENDO', color: R, x: 0.72, y: 0.16, size: 120, at: 1.0, rot: -5}, {t: 'arrowDown', x: 0.9, y: 0.32}], sfx: 'triste'},
  {id: 'E07', img: E('e07'), kb: [1.0, 1.15, 0.45, 0.5]},
  {id: 'E08', img: E('e08'), kb: [1.05, 1.15, 0.5, 0.5], ov: [{t: 'question'}]},
  {id: 'E09', img: E('e09'), kb: [1.3, 1.0, 0.5, 0.55]},
  {id: 'E10', img: E('e10'), kb: [1.0, 1.2, 0.5, 0.45]},
  {id: 'E11', img: E('e11'), kb: [1.0, 1.15, 0.5, 0.45], chapter: '1 · La paradoja del hombre en el auto'},
  {id: 'E12', img: E('e12'), kb: [1.0, 1.15, 0.5, 0.5], ov: [{t: 'label', text: 'Morgan Housel · La psicología del dinero', bg: W, color: '#111', x: 0.5, y: 0.14, size: 50}]},
  {id: 'E13', img: E('e13'), kb: [1.0, 1.2, 0.45, 0.5]},
  {id: 'E14', img: E('e14'), kb: [1.0, 1.25, 0.4, 0.35]},
  {id: 'E15', img: E('e15'), kb: [1.1, 1.3, 0.35, 0.3], ov: [{t: 'label', text: 'TE MIRAS A TI', color: Y, x: 0.75, y: 0.15, size: 90, at: 1.2, rot: -6}]},
  {id: 'E16', img: E('e16'), kb: [1.0, 1.15, 0.5, 0.45]},
  {id: 'E17', img: E('e17'), kb: [1.0, 1.2, 0.5, 0.5]},
  {id: 'E18', img: E('e18'), kb: [1.0, 1.25, 0.5, 0.55], ov: [{t: 'label', text: '¿DE DÓNDE SALIÓ?', color: Y, x: 0.5, y: 0.14, size: 90}]},
  {id: 'E19', img: E('e19'), kb: [1.0, 1.2, 0.55, 0.6], ov: [{t: 'label', text: '72 CUOTAS', bg: R, color: W, x: 0.8, y: 0.18, size: 64, at: 2.5, rot: 6}]},
  {id: 'E20', img: E('e20'), kb: [1.1, 1.3, 0.5, 0.5]},
  {id: 'E21', img: E('e21'), kb: [1.0, 1.3, 0.5, 0.5], ov: [{t: 'counter', from: 30000, to: 0, label: 'Saldo de Marcos'}], sfx: 'caja'},
  {id: 'E22', img: E('e22'), kb: [1.0, 1.15, 0.5, 0.5]},
  {id: 'E23', img: E('e23'), kb: [1.0, 1.2, 0.5, 0.5], chapter: '2 · Lo que descubrieron en 1996', ov: [{t: 'stamp', text: '1996', x: 0.82, y: 0.2, at: 0.8}]},
  {id: 'E24', img: E('e24'), kb: [1.0, 1.2, 0.5, 0.5], ov: [{t: 'label', text: 'El millonario de al lado', bg: W, color: '#111', x: 0.5, y: 0.13, size: 56}]},
  {id: 'E25', img: E('e24'), kb: [1.3, 1.5, 0.6, 0.45]},
  {id: 'E26', img: E('e26'), kb: [1.0, 1.2, 0.5, 0.5], ov: [{t: 'label', text: 'MILLONARIO', color: G, x: 0.75, y: 0.16, size: 110, at: 1.0, rot: -6}]},
  {id: 'E27', img: E('e27'), kb: [1.0, 1.2, 0.4, 0.5], ov: [{t: 'label', text: '✓ Auto usado', bg: W, color: '#111', x: 0.8, y: 0.16, size: 64, at: 0.8}]},
  {id: 'E28', img: E('e28'), kb: [1.0, 1.2, 0.5, 0.5]},
  {id: 'E29', img: E('e29'), kb: [1.0, 1.35, 0.62, 0.45], ov: [{t: 'label', text: 'PARECE RICO', color: R, x: 0.25, y: 0.16, size: 96, at: 1.5, rot: -6}]},
  {id: 'E30', img: E('e30'), kb: [1.0, 1.2, 0.5, 0.45], ov: [{t: 'label', text: '"Sombrero grande, sin ganado"', bg: Y, color: '#111', x: 0.5, y: 0.13, size: 60}]},
  {id: 'E31', img: E('e30'), kb: [1.3, 1.6, 0.5, 0.3]},
  {id: 'E32', img: E('e32'), kb: [1.0, 1.2, 0.5, 0.5]},
  {id: 'E33', board: {kind: 'formula', step: 1}, sfx: 'pop'},
  {id: 'E34', board: {kind: 'formula', step: 2}, sfx: 'pop'},
  {id: 'E35', board: {kind: 'formula', step: 3}, sfx: 'pop'},
  {id: 'E36', board: {kind: 'versus', left: 'LO QUE GANAS', right: 'LO QUE TIENES'}},
  {id: 'E37', img: E('e37'), kb: [1.0, 1.15, 0.5, 0.5]},
  {id: 'E38', img: 's1-estacionamiento.jpg', kb: [1.5, 1.7, 0.6, 0.4], ov: [{t: 'question'}]},
  {id: 'E39', img: E('e39'), kb: [1.0, 1.2, 0.5, 0.5], chapter: '3 · La trampa del espectador', ov: [{t: 'stamp', text: '1899', x: 0.82, y: 0.2, at: 1.0}]},
  {id: 'E40', img: E('e40'), kb: [1.0, 1.2, 0.5, 0.45], ov: [{t: 'label', text: 'Thorstein Veblen · "Consumo ostentoso"', bg: W, color: '#111', x: 0.5, y: 0.13, size: 52}]},
  {id: 'E41', img: E('e41'), kb: [1.0, 1.2, 0.5, 0.5]},
  {id: 'E42', img: E('e42'), kb: [1.3, 1.6, 0.45, 0.45]},
  {id: 'E43', img: E('e43'), kb: [1.0, 1.25, 0.3, 0.5], ov: [{t: 'label', text: 'CONTAGIO', color: R, x: 0.75, y: 0.15, size: 100, at: 1.0, rot: -5}]},
  {id: 'E44', img: E('e44'), kb: [1.0, 1.2, 0.5, 0.5], ov: [{t: 'label', text: 'Reserva Federal de Filadelfia', bg: W, color: '#111', x: 0.5, y: 0.13, size: 54}]},
  {id: 'E45', img: E('e45'), kb: [1.0, 1.2, 0.5, 0.5], ov: [{t: 'label', text: '↑ PREMIO = ↑ QUIEBRAS', bg: R, color: W, x: 0.5, y: 0.14, size: 64, at: 2.0}]},
  {id: 'E46', img: E('e45'), kb: [1.4, 1.7, 0.75, 0.55], ov: [{t: 'label', text: 'LOS VECINOS', color: Y, x: 0.3, y: 0.16, size: 110, rot: -6}]},
  {id: 'E47', img: E('e47'), kb: [1.0, 1.2, 0.5, 0.5]},
  {id: 'E48', img: E('e48'), kb: [1.0, 1.3, 0.5, 0.5]},
  {id: 'E49', img: E('e49'), kb: [1.0, 1.2, 0.5, 0.5], ov: [{t: 'label', text: 'TÚ = EL VECINO', color: Y, x: 0.25, y: 0.15, size: 90, at: 2.0, rot: -5}]},
  {id: 'E50', img: E('e50'), kb: [1.0, 1.2, 0.5, 0.5]},
  {id: 'E51', img: E('e51'), kb: [1.0, 1.3, 0.5, 0.5]},
  {id: 'E52', board: {kind: 'title', text: 'EJERCICIO', sub: 'Te suben el sueldo…'}},
  {id: 'E53', img: E('e53'), kb: [1.0, 1.2, 0.5, 0.45], chapter: '4 · ¿Qué harías tú?', ov: [{t: 'label', text: '¿QUÉ HARÍAS TÚ?', bg: Y, color: '#111', x: 0.5, y: 0.13, size: 80, at: 1.5}]},
  {id: 'E54', board: {kind: 'options', active: 0, crossed: []}, sfx: 'pop'},
  {id: 'E55', img: E('e55'), kb: [1.0, 1.25, 0.5, 0.5]},
  {id: 'E56', img: E('e56'), kb: [1.0, 1.2, 0.5, 0.5], ov: [{t: 'stamp', text: 'DESCARTADA', color: R, x: 0.5, y: 0.45, at: 2.6}], sfx: 'triste'},
  {id: 'E57', board: {kind: 'options', active: 1, crossed: [0]}, sfx: 'pop'},
  {id: 'E58', img: E('e58'), kb: [1.0, 1.25, 0.5, 0.5]},
  {id: 'E59', img: E('e58'), kb: [1.3, 1.4, 0.5, 0.45], ov: [{t: 'stamp', text: 'DESCARTADA', color: R, x: 0.5, y: 0.45, at: 0.2}], sfx: 'triste'},
  {id: 'E60', board: {kind: 'options', active: 2, crossed: [0, 1]}, sfx: 'pop'},
  {id: 'E61', img: E('e61'), kb: [1.0, 1.15, 0.5, 0.5]},
  {id: 'E62', img: E('e62'), kb: [1.0, 1.2, 0.5, 0.45], sfx: 'caja'},
  {id: 'E63', img: E('e63'), kb: [1.0, 1.25, 0.5, 0.5]},
  {id: 'E64', img: E('e64'), kb: [1.0, 1.2, 0.5, 0.5], chapter: '5 · La felicidad que se evapora', ov: [{t: 'stamp', text: '1978', x: 0.82, y: 0.2, at: 0.6}]},
  {id: 'E65', img: E('e64'), kb: [1.3, 1.5, 0.6, 0.5]},
  {id: 'E66', img: E('e66'), kb: [1.0, 1.2, 0.5, 0.5]},
  {id: 'E67', img: E('e67'), kb: [1.0, 1.2, 0.5, 0.5], ov: [{t: 'label', text: 'Adaptación hedónica', bg: W, color: '#111', x: 0.5, y: 0.13, size: 62}]},
  {id: 'E68', img: E('e68'), kb: [1.0, 1.2, 0.5, 0.5]},
  {id: 'E69', img: E('e69'), kb: [1.0, 1.25, 0.5, 0.5]},
  {id: 'E70', img: E('e70'), kb: [1.0, 1.2, 0.5, 0.5], ov: [{t: 'label', text: 'ALEGRÍA: semanas', bg: G, color: '#111', x: 0.25, y: 0.14, size: 54, at: 1.2}, {t: 'label', text: 'PAGO: años', bg: R, color: W, x: 0.75, y: 0.14, size: 54, at: 2.2}]},
  {id: 'E71', img: E('e71'), kb: [1.0, 1.2, 0.5, 0.5], ov: [{t: 'label', text: 'OPCIONES', color: G, x: 0.5, y: 0.14, size: 110, at: 3.0}]},
  {id: 'E72', img: E('e72'), kb: [1.0, 1.2, 0.5, 0.5], chapter: '6 · Cómo jugar el juego invisible'},
  {id: 'E73', img: E('e73'), kb: [1.0, 1.2, 0.5, 0.5], ov: [{t: 'label', text: '1 · Haz la cuenta', bg: Y, color: '#111', x: 0.22, y: 0.13, size: 56}]},
  {id: 'E74', img: E('e74'), kb: [1.0, 1.2, 0.5, 0.5], ov: [{t: 'label', text: '2 · ¿Lo comprarías si nadie se enterara?', bg: Y, color: '#111', x: 0.5, y: 0.13, size: 52}]},
  {id: 'E75', img: E('e75'), kb: [1.0, 1.2, 0.5, 0.5]},
  {id: 'E76', img: E('e76'), kb: [1.0, 1.2, 0.5, 0.5], ov: [{t: 'label', text: '3 · Sube primero tu ahorro', bg: Y, color: '#111', x: 0.5, y: 0.13, size: 56}]},
  {id: 'E77', img: E('e77'), kb: [1.0, 1.2, 0.5, 0.5], ov: [{t: 'label', text: '4 · Gana el juego invisible', bg: Y, color: '#111', x: 0.5, y: 0.13, size: 56}]},
  {id: 'E78', img: 's1-estacionamiento.jpg', kb: [1.0, 1.2, 0.5, 0.5], chapter: '7 · De vuelta al estacionamiento'},
  {id: 'E79', img: 's2-autobus.jpg', kb: [1.1, 1.4, 0.67, 0.42]},
  {id: 'E80', board: {kind: 'final'}, sfx: 'caja'},
  {id: 'E81', board: {kind: 'final'}},
  {id: 'E82', board: {kind: 'comments'}, sfx: 'pop'},
  {id: 'E83', board: {kind: 'end'}},
];
