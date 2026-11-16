# Estado del canal — dónde quedamos (actualizado 16/11/2026)

## Videos
| N.º | Título | Estado | Archivos clave |
|---|---|---|---|
| 1 | Por qué la gente que parece pobre tiene más dinero que tú | ✅ **Publicado** | guion `produccion/guiones/01-parece-pobre.md` · plan `produccion/remotion/src/plan.ts` + `FullVideo.tsx` · miniaturas `canal/assets/video1-parece-pobre-A-iceberg.jpg` (principal) y `-B-comparacion.jpg` · subida `contenido/01-parece-pobre-subida.md` |
| 2 | Tu vida en cada nivel de sueldo (y la trampa de cada uno) | 🔄 **Renderizando** (8:47) | guion `produccion/guiones/02-cada-nivel-de-sueldo.md` · plan `produccion/remotion/src/plan2.ts` + `Video2.tsx` · escenas `public/escenas2/` · miniatura `canal/assets/video2-niveles-sueldo-miniatura.jpg` ("SUBES… Y CAES") · subida `contenido/02-niveles-sueldo-subida.md` |
| 3 | Por qué pagar con tarjeta te hace gastar más (propuesto) | 💡 Idea | miniatura vieja `canal/assets/video1-miniatura.png` ("NO DUELE") |

## En marcha ahora
- **Render del video 2** (proceso independiente, sigue aunque se limpie el chat). Iba en 10.947/16.176 cuadros (~1 h 15 min restante).
  - Ver progreso: `tail -c 120 /tmp/claude-0/-home-user-cerebro-youtube/7da7cb3a-58e0-52fd-a95a-86b2766ffad0/scratchpad/render-v2.log` (al final dice `DONE`).
  - Script: `.../scratchpad/render-v2.sh` (render a 6 Mbps + `loudnorm` → `produccion/remotion/out/video2-YOUTUBE.mp4`).
- **Cuando termine:** 1) verificar duración (~9:00) y tamaño (<500 MB); 2) mandar `out/video2-YOUTUBE.mp4` al dueño; 3) completar capítulos en `contenido/02-niveles-sueldo-subida.md` con `src/lines-v2.json` (E01 apertura, E10 $500, E24 $1.000, E35 $2.500, E46 $5.000, E61 $10.000, E71 giro, E78 cierre); 4) copia liviana al repo (<50 MB, ~1,2 Mbps) y borrar `out/raw-v2.mp4`.

## Decisiones pendientes del dueño
- **Subtítulos:** propuesta = siempre visibles pero más chicos/discretos + texto grande solo en palabras clave (Isaac dice que tenerlos siempre cansa; pero en celular se mira sin sonido).
- Tema del video 3 (propuesto: tarjeta de crédito).

## Próximos pasos
1. Entregar video 2 (ver arriba) y recordarle al dueño: después de publicarlo, editar el video 1 → tarjeta + pantalla final hacia el video 2.
2. Video 3 aplicando lo nuevo de Isaac (`conocimiento/guiones-retencion.md` y `conocimiento/edicion.md`): problema profundo, viaje del héroe con Tú (Marcos = espejo, mascota = mentor), **frasco de Tú que se llena video a video** (historia que une la serie), "pero/por eso", generar SFX **riser** e **impact** en ElevenLabs, destellos de luz en transiciones.
3. Shorts diarios a partir de los videos largos.
4. Producto de bajo precio + planilla gratis (ver `canal/estrategia-monetizacion.md`).

## Saldo y créditos (16/11/2026)
- **ElevenLabs:** plan Creator, 8.773 / 121.080 créditos usados (≈ 13 videos más este mes). Voz: "Carlos" `Y4HwpMNrBWN5dFKi5Lw8`, modelo v4.
- **APIMart:** US$7,12 de saldo (~US$1,35 por video: imágenes + nada de voz). La clave está en el entorno `cerebro-youtube`.
- **vidIQ:** ~3 créditos (se renuevan el 15/12).

## Decisiones ya tomadas (resumen)
- Duración 5–10 min · 3 videos/semana (lun/mié/vie) + 1 Short/día · fecha límite YPP 1/2/2027 (`canal/estrategia-monetizacion.md`).
- Motor de retención problema → solución → gancho (`conocimiento/guiones-retencion.md`).
- Pipeline y lecciones de producción (`conocimiento/produccion-ia.md`). Miniaturas: texto propio con Archivo Black, flecha que une texto y objeto (`conocimiento/titulos-miniaturas.md`).
- Placa final de 12 s para la pantalla final de YouTube; tarjetas solo cuando hay otro video.
