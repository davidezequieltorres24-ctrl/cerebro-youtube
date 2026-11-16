// Plan de planos del video 2 de Universo Y Si (48 h en el Amazonas). Guion: universo-y-si/guiones/02-48-horas-amazonas.md
import {Plano} from './UysMotor';
const P = (n: string) => `uys-2/planos/${n}.jpg`;
const S = (n: string) => `uys-2/sfx/${n}.mp3`;
const POP = 'n-sfx-pop.mp3', GOLPE = 'demo3/sfx-impact.mp3';

export const PLAN_UYS2: Plano[] = [
  // 1 · Gancho
  {a: '¿Y si', img: P('p01'), z: [1.0, 1.18], fx: 0.5, fy: 0.35, card: 'HORA 0', sub: 'SELVA AMAZÓNICA'},
  {a: 'con el celular', img: P('p02'), z: [1.45, 1.55], fx: 0.15, fy: 0.45, labels: [{t: '31 %', x: 0.72, y: 0.18, at: '31%', c: '#FF4D4D', flecha: 'abajo'}], sfx: [{s: POP, at: '31%', v: 0.4}]},
  {a: 'y a 150 metros', img: P('p03'), z: [1.35, 1.0], fx: 0.5, fy: 0.62, labels: [{t: '150 m DEL SENDERO', x: 0.5, y: 0.5, at: '150', flecha: 'abajo'}], sfx: [{s: POP, at: '150', v: 0.4}]},
  // 2 · La canoa (flashback)
  {a: 'dos horas antes', img: P('p04'), z: [1.0, 1.1], pan: [2, -2], card: '2 HORAS ANTES', amb: 'canoa'},
  {a: 'la guía', img: P('p05'), z: [1.05, 1.2], fx: 0.35, fy: 0.35, labels: [{t: 'DOÑA ROSA', x: 0.3, y: 0.1, at: 'rosa', flecha: 'abajo'}], sfx: [{s: POP, at: 'rosa', v: 0.4}, {s: S('silbato'), at: 'pitidos', v: 0.25}]},
  {a: 'después contó', img: P('p06'), z: [1.0, 1.15], fx: 0.45, fy: 0.35},
  {a: 'en 1971', img: P('p07'), z: [1.0, 1.2], fx: 0.45, fy: 0.4, sepia: true, card: '1971', sub: 'HISTORIA REAL', shake: 'avión', sfx: [{s: GOLPE, at: 'avión', v: 0.45}]},
  {a: 'cómo', img: P('p06'), z: [1.25, 1.35], fx: 0.75, fy: 0.35},
  {a: 'siguió el agua', img: P('p08'), z: [1.0, 1.12], fx: 0.35, fy: 0.55, labels: [{t: 'AGUA CHICA', x: 0.17, y: 0.66, at: 'chica', flecha: 'abajo'}, {t: 'AGUA GRANDE', x: 0.22, y: 0.4, at: 'grande', flecha: 'abajo'}]},
  {a: 'te pareció', img: P('p04'), z: [1.3, 1.45], fx: 0.42, fy: 0.42},
  {a: 'una hora después', img: P('p09'), z: [1.15, 1.28], fx: 0.6, fy: 0.4},
  {a: 'después te diste', img: P('p10'), z: [1.0, 1.25], fx: 0.5, fy: 0.4, shake: 'vuelta…', sfx: [{s: GOLPE, at: 'vuelta…', v: 0.5}]},
  // 3 · La selva de verdad
  {a: 'lo primero que notas', img: P('p11'), z: [1.0, 1.2], fx: 0.5, fy: 0.3, card: 'HORA 1', hora: 1, labels: [{t: 'SOLO LLEGA EL 1–2 % DE LA LUZ', x: 0.5, y: 0.82, at: 'sol.'}]},
  {a: 'son las 3', img: P('p12'), z: [1.25, 1.1], fx: 0.5, fy: 0.6},
  {a: 'lo segundo es', img: P('p13'), z: [1.05, 1.2], fx: 0.45, fy: 0.35, labels: [{t: '27 °C', x: 0.78, y: 0.2, at: '27', c: '#FF9F1C'}, {t: '100 % HUMEDAD', x: 0.78, y: 0.36, at: '100%', c: '#33C3FF'}], sfx: [{s: POP, at: '27', v: 0.35}, {s: POP, at: '100%', v: 0.35}]},
  {a: 'gritas', img: P('p14'), z: [1.05, 1.25], fx: 0.45, fy: 0.35, shake: 'gritas.'},
  {a: 'bueno alguien sí', img: P('p15'), z: [1.0, 1.2], fx: 0.45, fy: 0.4, labels: [{t: 'MONO CAPUCHINO', x: 0.47, y: 0.12, at: 'capuchino', flecha: 'abajo'}], sfx: [{s: POP, at: 'capuchino', v: 0.4}]},
  {a: 'baja en dos', img: P('p16'), z: [1.0, 1.15], fx: 0.6, fy: 0.4, shake: 'roba', sfx: [{s: 'n-sfx-whoosh.mp3', at: 'roba', v: 0.5}]},
  {a: 'ahora tienes cero', img: P('p17'), z: [1.1, 1.3], fx: 0.5, fy: 0.45, labels: [{t: '0 SÁNDWICHES', x: 0.5, y: 0.85, at: 'cero'}]},
  // 4 · Las reglas
  {a: 'te sientas', img: P('p18'), z: [1.0, 1.15], fx: 0.45, fy: 0.45, card: 'HORA 3', hora: 3},
  {a: 'regla 1', img: P('p19'), z: [1.1, 1.25], fx: 0.45, fy: 0.45, labels: [{t: 'REGLA 1 · NO GASTAR EL CELULAR', x: 0.5, y: 0.12, at: 'regla'}], sfx: [{s: POP, at: 'regla', v: 0.4}]},
  {a: 'regla 2', img: P('p20'), z: [1.05, 1.2], fx: 0.4, fy: 0.5, labels: [{t: 'REGLA 2 · NO GASTAR LA LINTERNA', x: 0.5, y: 0.12, at: 'regla'}], sfx: [{s: POP, at: 'regla', v: 0.4}]},
  {a: 'regla 3', img: P('p21'), z: [1.05, 1.25], fx: 0.5, fy: 0.35, labels: [{t: 'REGLA 3 · BUSCAR AGUA QUE SE MUEVA', x: 0.5, y: 0.12, at: 'regla'}], sfx: [{s: POP, at: 'regla', v: 0.4}]},
  {a: 'agua un arroyo', img: P('p22'), z: [1.0, 1.15], fx: 0.6, fy: 0.5},
  // 5 · La primera noche
  {a: 'pero antes de llegar', img: P('p23'), z: [1.0, 1.15], fx: 0.5, fy: 0.6, card: 'HORA 6', sub: '18:04 · SE HACE DE NOCHE', hora: 6},
  {a: 'cerca del ecuador', img: P('p23'), z: [1.3, 1.45], fx: 0.5, fy: 0.25},
  {a: 'te subes las rodillas', img: P('p24'), z: [1.05, 1.2], fx: 0.5, fy: 0.45, noche: true, amb: 'noche'},
  {a: 'ranas que suenan', img: P('p25'), z: [1.42, 1.55], fx: 0.5, fy: 0.5, noche: true, amb: 'noche'},
  {a: 'algo que camina', img: P('p26'), z: [1.0, 1.2], fx: 0.5, fy: 0.5, noche: true, amb: 'noche'},
  {a: 'un zumbido', img: P('p27'), z: [1.05, 1.2], fx: 0.35, fy: 0.45, noche: true, amb: 'noche'},
  {a: 'y entonces empieza', img: P('p28'), z: [1.0, 1.25], fx: 0.5, fy: 0.4, noche: true, amb: 'noche', shake: 'rugido', sfx: [{s: S('aulladores'), at: 'rugido', v: 0.8}, {s: S('aulladores'), at: 'rugido', v: 0.6, off: 0.9}]},
  {a: 'un jaguar', img: P('p29'), z: [1.0, 1.2], fx: 0.5, fy: 0.45, amb: 'noche', labels: [{t: '¿JAGUAR?', x: 0.5, y: 0.82, at: 'jaguar.', flecha: 'arriba'}], sfx: [{s: GOLPE, at: 'jaguar.', v: 0.5}]},
  {a: 'sabes que el jaguar', img: P('p30'), z: [1.15, 1.3], fx: 0.5, fy: 0.55, amb: 'noche'},
  {a: 'el rugido se repite', img: P('p28'), z: [1.25, 1.4], fx: 0.5, fy: 0.35, noche: true, amb: 'noche', shake: 'contesta.', sfx: [{s: S('aulladores'), at: 'repite', v: 0.8}, {s: S('aulladores'), at: 'contesta.', v: 0.9}]},
  {a: 'pasas la noche entera', img: P('p31'), z: [1.05, 1.2], fx: 0.55, fy: 0.5, noche: true, amb: 'noche'},
  // 6 · Eran monos
  {a: 'cuando sale la luz', img: P('p32'), z: [1.15, 1.0], fx: 0.5, fy: 0.3, card: 'HORA 13', sub: 'AMANECE', hora: 13},
  {a: 'y ahí está tu jaguar', img: P('p33'), z: [1.0, 1.12], fx: 0.5, fy: 0.45, labels: [{t: 'TU "JAGUAR"', x: 0.5, y: 0.15, at: 'monos', flecha: 'abajo'}], sfx: [{s: S('aulladores'), at: 'aullando', v: 0.7}]},
  {a: 'monos aulladores', img: P('p33'), z: [1.25, 1.4], fx: 0.6, fy: 0.45, labels: [{t: 'SE OYEN A ~5 KM', x: 0.5, y: 0.85, at: '5'}], sfx: [{s: POP, at: '5', v: 0.4}]},
  {a: 'pasaste 10 horas', img: P('p34'), z: [1.05, 1.25], fx: 0.5, fy: 0.35},
  {a: 'te levantas', img: P('p35'), z: [1.0, 1.12], pan: [-2, 2], fx: 0.5, fy: 0.5},
  // 7 · La hormiga 24
  {a: 'apoyas la mano', img: P('p36'), z: [1.0, 1.25], fx: 0.55, fy: 0.4, card: 'HORA 14', hora: 14},
  {a: 'y sientes como', img: P('p37'), z: [1.05, 1.2], fx: 0.4, fy: 0.4, shake: 'caliente.', sfx: [{s: GOLPE, at: 'caliente.', v: 0.6}]},
  {a: 'una hormiga bala', img: P('p38'), z: [1.0, 1.15], fx: 0.5, fy: 0.45, labels: [{t: 'HORMIGA BALA', x: 0.5, y: 0.12, at: 'bala.', c: '#FF4D4D'}, {t: 'DOLOR: HASTA 24 h', x: 0.5, y: 0.86, at: 'dolor'}], sfx: [{s: POP, at: 'bala.', v: 0.4}]},
  {a: 'un científico', img: P('p39'), z: [1.1, 1.25], fx: 0.45, fy: 0.4, labels: [{t: 'NIVEL DE DOLOR: MÁXIMO', x: 0.5, y: 0.86, at: 'puntaje', c: '#FF4D4D'}]},
  {a: 'tienes la mano', img: P('p40'), z: [1.05, 1.25], fx: 0.55, fy: 0.4, labels: [{t: 'FALTAN 34 h', x: 0.8, y: 0.15, at: '34'}]},
  {a: 'pero llegas al arroyo', img: P('p41'), z: [1.0, 1.15], fx: 0.4, fy: 0.45, labels: [{t: 'PLAN: SEGUIR EL AGUA', x: 0.62, y: 0.12, at: 'plan:', c: '#39FF14'}], sfx: [{s: POP, at: 'plan:', v: 0.4}]},
  // 8 · Seguir el agua
  {a: 'caminas por la orilla', img: P('p42'), z: [1.0, 1.12], pan: [-2, 2], card: 'HORA 16', hora: 16},
  {a: 'cruzas troncos', img: P('p43'), z: [1.05, 1.18], fx: 0.5, fy: 0.5},
  {a: 'te das cuenta', img: P('p44'), z: [1.25, 1.38], fx: 0.3, fy: 0.5, labels: [{t: '¡TU GORRA!', x: 0.24, y: 0.25, at: 'gorra.', c: '#FF4D4D', flecha: 'abajo'}], sfx: [{s: POP, at: 'gorra.', v: 0.45}]},
  {a: 'piensas en meterte', img: P('p45'), z: [1.05, 1.2], fx: 0.4, fy: 0.5},
  {a: 'que las pirañas', img: P('p46'), z: [1.0, 1.15], fx: 0.5, fy: 0.5, labels: [{t: 'PIRAÑAS: CASI NUNCA ATACAN', x: 0.5, y: 0.12, at: 'pirañas'}]},
  {a: 'como la anguila', img: P('p47'), z: [1.0, 1.2], fx: 0.5, fy: 0.5, shake: '860', labels: [{t: 'HASTA 860 VOLTIOS', x: 0.5, y: 0.85, at: '860', c: '#FFD60A'}], sfx: [{s: GOLPE, at: '860', v: 0.5}]},
  {a: 'te quedas en la orilla', img: P('p48'), z: [1.05, 1.2], fx: 0.45, fy: 0.45},
  {a: 'y entonces en medio', img: P('p49'), z: [1.0, 1.18], fx: 0.6, fy: 0.45},
  {a: 'brilla como si', img: P('p49'), z: [1.3, 1.45], fx: 0.75, fy: 0.4},
  {a: 'después pasa otra', img: P('p50'), z: [1.0, 1.15], fx: 0.5, fy: 0.45},
  {a: 'el mono también', img: P('p50'), z: [1.35, 1.5], fx: 0.85, fy: 0.35},
  // 9 · La lluvia y el error
  {a: 'hora 24', img: P('p51'), z: [1.05, 1.2], fx: 0.45, fy: 0.5, card: 'HORA 24', hora: 24},
  {a: 'pero esa agua', img: P('p51'), z: [1.3, 1.45], fx: 0.55, fy: 0.7, labels: [{t: 'AGUA MARRÓN', x: 0.5, y: 0.2, at: 'marrón,'}]},
  {a: 'entonces a las 3', img: P('p52'), z: [1.28, 1.42], fx: 0.5, fy: 0.35, shake: 'ruido', sfx: [{s: S('lluvia'), at: 'ruido', v: 0.8}]},
  {a: 'y llueve', img: P('p53'), z: [1.0, 1.15], fx: 0.5, fy: 0.45, lluvia: true, amb: 'lluvia'},
  {a: 'doblas una hoja', img: P('p54'), z: [1.05, 1.2], fx: 0.5, fy: 0.4, lluvia: true, amb: 'lluvia'},
  {a: 'y ahí empapado', img: P('p55'), z: [1.05, 1.2], fx: 0.5, fy: 0.4, lluvia: true, amb: 'lluvia', labels: [{t: '"SOBREVIVIENDO"', x: 0.7, y: 0.14, at: 'sobreviviendo'}]},
  {a: 'no hay señal', img: P('p56'), z: [1.1, 1.25], fx: 0.5, fy: 0.5, lluvia: true, amb: 'lluvia', labels: [{t: '31 % → 12 %', x: 0.75, y: 0.5, at: '12%', c: '#FF4D4D', flecha: 'izq'}], sfx: [{s: GOLPE, at: '12%', v: 0.45}]},
  {a: 'el mono desde una rama', img: P('p57'), z: [1.0, 1.15], fx: 0.5, fy: 0.45},
  // 10 · La segunda noche
  {a: 'la segunda noche', img: P('p58'), z: [1.0, 1.15], fx: 0.6, fy: 0.5, card: 'HORA 30', sub: 'SEGUNDA NOCHE', hora: 30, amb: 'noche'},
  {a: 'a medianoche', img: P('p59'), z: [1.05, 1.2], fx: 0.4, fy: 0.5, noche: true, amb: 'noche', sfx: [{s: S('aulladores'), at: 'aulladores', v: 0.6}]},
  {a: 'antes de dormir', img: P('p60'), z: [1.05, 1.22], fx: 0.45, fy: 0.4, noche: true, amb: 'noche', labels: [{t: '12 %', x: 0.2, y: 0.15, at: '12%', c: '#FF4D4D'}]},
  {a: 'ma estoy bien', img: P('p60'), z: [1.2, 1.32], fx: 0.42, fy: 0.3, noche: true, amb: 'noche', labels: [{t: 'AUDIO PARA MAMÁ', x: 0.75, y: 0.15, at: 'ma,'}]},
  {a: 'lo apagas', img: P('p60'), z: [1.35, 1.5], fx: 0.5, fy: 0.35, noche: true, amb: 'noche', labels: [{t: '9 %', x: 0.2, y: 0.15, at: '9%,', c: '#FF4D4D'}]},
  {a: 'y a las cuatro', img: P('p61'), z: [1.0, 1.15], fx: 0.45, fy: 0.5, card: 'HORA 38', sub: 'LA MANO DEJA DE DOLER', hora: 38},
  // 11 · La cuenta regresiva
  {a: 'hora 46', img: P('p62'), z: [1.2, 1.0], fx: 0.5, fy: 0.45, card: 'HORA 46', hora: 46},
  {a: 'y en el agua grande', img: P('p63'), z: [1.0, 1.25], fx: 0.5, fy: 0.5, labels: [{t: 'UNA LANCHA', x: 0.5, y: 0.3, at: 'lancha.', flecha: 'abajo'}], sfx: [{s: S('lancha'), at: 'motor.', v: 0.6}]},
  {a: 'en menos de un minuto', img: P('p63'), z: [1.25, 1.4], fx: 0.5, fy: 0.5, cuentaIni: true, sfx: [{s: S('lancha'), v: 0.45, off: 0.5}]},
  {a: 'gritas', img: P('p64'), z: [1.05, 1.2], fx: 0.45, fy: 0.45, shake: 'gritas.'},
  {a: 'haces señas', img: P('p65'), z: [1.05, 1.2], fx: 0.4, fy: 0.45},
  {a: 'tres pitidos es auxilio', img: P('p66'), z: [1.0, 1.15], fx: 0.4, fy: 0.45, shake: 'auxilio.', sfx: [{s: S('silbato'), at: 'auxilio.', v: 0.9, off: 0.3}]},
  {a: 'la lancha frena', img: P('p67'), z: [1.0, 1.15], fx: 0.5, fy: 0.5, cuentaFin: true, sfx: [{s: S('lancha'), v: 0.6}]},
  // 12 · La salida
  {a: 'en la proa', img: P('p68'), z: [1.0, 1.15], fx: 0.35, fy: 0.4, card: 'HORA 48', hora: 48, labels: [{t: 'DOÑA ROSA', x: 0.3, y: 0.12, at: 'rosa.', flecha: 'abajo'}]},
  {a: 'seguiste el agua', img: P('p69'), z: [1.05, 1.18], fx: 0.5, fy: 0.4},
  {a: 'señalas', img: P('p70'), z: [1.0, 1.2], fx: 0.5, fy: 0.4, labels: [{t: '¡TU GORRA!', x: 0.5, y: 0.12, at: 'gorra.', c: '#FF4D4D', flecha: 'abajo'}], sfx: [{s: POP, at: 'gorra.', v: 0.45}]},
  {a: 'la lancha arranca', img: P('p71'), z: [1.0, 1.15], fx: 0.6, fy: 0.5, labels: [{t: 'DELFÍN ROSADO', x: 0.68, y: 0.3, at: 'delfín.', c: '#FF8FC8', flecha: 'abajo'}], sfx: [{s: POP, at: 'delfín.', v: 0.4}]},
  {a: 'si lo ves', img: P('p72'), z: [1.15, 1.3], fx: 0.4, fy: 0.45},
  // 13 · Pregunta y cierre
  {a: 'ahora te toca a ti', img: P('p73'), z: [1.0, 1.12], fx: 0.5, fy: 0.45, labels: [{t: '¿SEGUIR EL AGUA O ESPERAR?', x: 0.5, y: 0.12, at: 'sigues'}]},
  {a: 'y suscríbete', img: P('p70'), z: [1.1, 1.25], fx: 0.5, fy: 0.4, labels: [{t: 'SUSCRÍBETE', x: 0.5, y: 0.12, at: 'suscríbete', c: '#FF4D4D'}], sfx: [{s: POP, at: 'suscríbete', v: 0.45}]},
];
