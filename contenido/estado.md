# Estado del canal — dónde quedamos (actualizado 16/11/2026, tarde)

## Videos
| N.º | Título | Estado | Archivos clave |
|---|---|---|---|
| 1 | Por qué la gente que parece pobre tiene más dinero que tú | ✅ **Publicado** | guion `produccion/guiones/01-parece-pobre.md` · plan `produccion/remotion/src/plan.ts` + `FullVideo.tsx` · miniaturas `canal/assets/video1-parece-pobre-A-iceberg.jpg` (principal) y `-B-comparacion.jpg` · subida `contenido/01-parece-pobre-subida.md` |
| 2 | Tu vida en cada nivel de sueldo (y la trampa de cada uno) | ✅ **Listo para subir** (8:59, `out/video2-YOUTUBE.mp4` enviado al dueño; capítulos en la ficha) | guion `produccion/guiones/02-cada-nivel-de-sueldo.md` · plan `produccion/remotion/src/plan2.ts` + `Video2.tsx` · escenas `public/escenas2/` · miniatura `canal/assets/video2-niveles-sueldo-miniatura.jpg` ("SUBES… Y CAES") · subida `contenido/02-niveles-sueldo-subida.md` |
| 3 | Por qué gastas más cuando pagas con tarjeta | ✅ **Listo para subir** (4:53, corregido 16/11: títulos sin cortar palabras + subtítulos por frase; `out/video3-YOUTUBE.mp4` enviado al dueño; miniatura principal `canal/assets/video3-tarjeta-4-caras-87-174.jpg`) | guion `produccion/guiones/03-tarjeta.md` · plan `src/plan3.ts` + `src/Video3.tsx` · escenas `public/escenas3/` · voz `public/v3/voz-video3.mp3` · miniaturas `canal/assets/video3-tarjeta-1/2/3-*.jpg` · subida `contenido/03-tarjeta-subida.md` |

## En marcha ahora
- Nada. Videos 2 y 3 listos para subir (fichas en `contenido/02-…` y `contenido/03-tarjeta-subida.md`).
- Renders largos: hacerlos **en 3 partes** (`--frames=A-B --muted`), audio aparte con `--codec=wav`, unir con ffmpeg concat + loudnorm. Un comando en segundo plano corta a las 2 h.

## Estilo nuevo (desde el video 3)
- Estilo Isaac: neón sobre negro + dibujo de líneas brillantes (ámbar normal · rojo problema · verde solución). Análisis en `conocimiento/formatos-visuales.md`.
- **Sin clips de IA** (el dueño los vio caros): movimiento por código (encendido, parpadeo, barrido de luz, zoom).
- Texto siempre nítido: letra clara + borde del color + fondo oscuro detrás de las etiquetas.
- Miniaturas: vender el resultado (número grande, tarjeta de app, cara en shock). Checklist en `conocimiento/titulos-miniaturas.md`.

## Decisiones pendientes del dueño
- **Subtítulos:** propuesta = siempre visibles pero más chicos/discretos + texto grande solo en palabras clave (Isaac dice que tenerlos siempre cansa; pero en celular se mira sin sonido).
- Tema del video 3 (propuesto: tarjeta de crédito).

## Herramientas nuevas (16/11)
- Skill **`video-tu-mente-gasta`**: el proceso completo de un video (tema → guion → voz → escenas → montaje → render por partes → 3 miniaturas + 3 títulos → ficha).
- Scripts: `produccion/remotion/scripts/render-parte.sh`, `unir.sh`, `tiempos_whisper.py`. Subtítulos por frase: `src/captionChunks.ts`.
- Pendiente: el dueño pasa la info de su otro canal **UniversoYSI** → crear su skill propio.

## Próximos pasos
1. Recordarle al dueño: publicar el 2, después editar el video 1 (y el 2 al publicar el 3) → tarjeta + pantalla final hacia el siguiente.
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
