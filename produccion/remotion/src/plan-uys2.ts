// Plan de planos del video 2 de Universo Y Si (48 h en el Amazonas). Guion: universo-y-si/guiones/02-48-horas-amazonas.md
import {Plano} from './UysMotor';
const P = (n: string) => `uys-2/planos/${n}.jpg`;
export const PLAN_UYS2_MUESTRA: Plano[] = [
  // Escena 1 — gancho
  {a: '¿Y si', img: P('p01'), z: [1.0, 1.18], fx: 0.5, fy: 0.35, card: 'HORA 0', sub: 'SELVA AMAZÓNICA'},
  {a: 'con el celular', img: P('p02'), z: [1.45, 1.55], fx: 0.15, fy: 0.45, labels: [{t: '31 %', x: 0.72, y: 0.22, at: '31%', c: '#FF5A4E'}], sfx: [{s: 'n-sfx-pop.mp3', at: '31%', v: 0.4}]},
  {a: 'y a 150 metros', img: P('p03'), z: [1.35, 1.0], fx: 0.5, fy: 0.62, labels: [{t: '150 m', x: 0.5, y: 0.3, at: '150', c: '#FFD60A'}]},
  // Escena 2 — la canoa (flashback de 2 horas antes)
  {a: 'dos horas antes', img: P('p04'), z: [1.0, 1.1], pan: [2, -2], card: '2 HORAS ANTES'},
  {a: 'la guía', img: P('p05'), z: [1.05, 1.22], fx: 0.35, fy: 0.35, labels: [{t: 'DOÑA ROSA', x: 0.3, y: 0.09, at: 'rosa'}], sfx: [{s: 'n-sfx-pop.mp3', at: 'rosa', v: 0.4}]},
  {a: 'después contó', img: P('p06'), z: [1.0, 1.15], fx: 0.45, fy: 0.35},
  {a: 'en 1971', img: P('p07'), z: [1.0, 1.2], fx: 0.45, fy: 0.4, sepia: true, card: '1971', sub: 'HISTORIA REAL', shake: 'avión'},
  {a: 'cómo', img: P('p06'), z: [1.25, 1.35], fx: 0.75, fy: 0.35},
  {a: 'siguió el agua', img: P('p08'), z: [1.0, 1.15], fx: 0.35, fy: 0.55, labels: [{t: 'AGUA CHICA', x: 0.17, y: 0.74, at: 'chica'}, {t: 'AGUA GRANDE', x: 0.2, y: 0.47, at: 'grande'}]},
  {a: 'te pareció', img: P('p04'), z: [1.3, 1.45], fx: 0.42, fy: 0.42},
  {a: 'una hora después', img: P('p09'), z: [1.12, 1.25], fx: 0.6, fy: 0.4},
  {a: 'después te diste', img: P('p10'), z: [1.0, 1.25], fx: 0.5, fy: 0.4, shake: 'vuelta', sfx: [{s: 'demo3/sfx-impact.mp3', at: 'vuelta', v: 0.5}]},
];
