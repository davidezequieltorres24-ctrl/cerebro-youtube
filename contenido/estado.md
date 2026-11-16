# Estado del canal — dónde quedamos (actualizado 16/11/2026, tarde)

## Videos
| N.º | Título | Estado | Archivos clave |
|---|---|---|---|
| 1 | Por qué la gente que parece pobre tiene más dinero que tú | ✅ **Publicado** | guion `produccion/guiones/01-parece-pobre.md` · plan `produccion/remotion/src/plan.ts` + `FullVideo.tsx` · miniaturas `canal/assets/video1-parece-pobre-A-iceberg.jpg` (principal) y `-B-comparacion.jpg` · subida `contenido/01-parece-pobre-subida.md` |
| 2 | Tu vida en cada nivel de sueldo (y la trampa de cada uno) | ✅ **Listo para subir** (8:59, `out/video2-YOUTUBE.mp4` enviado al dueño; capítulos en la ficha) | guion `produccion/guiones/02-cada-nivel-de-sueldo.md` · plan `produccion/remotion/src/plan2.ts` + `Video2.tsx` · escenas `public/escenas2/` · miniatura `canal/assets/video2-niveles-sueldo-miniatura.jpg` ("SUBES… Y CAES") · subida `contenido/02-niveles-sueldo-subida.md` |
| 3 | Por qué gastas más cuando pagas con tarjeta | 🔄 **Renderizando** (4:52, estilo nuevo neón/líneas brillantes) | guion `produccion/guiones/03-tarjeta.md` · plan `src/plan3.ts` + `src/Video3.tsx` · escenas `public/escenas3/` · voz `public/v3/voz-video3.mp3` · miniaturas `canal/assets/video3-tarjeta-1/2/3-*.jpg` · subida `contenido/03-tarjeta-subida.md` |

## En marcha ahora
- **Render del video 3** (proceso independiente en el servidor de la nube; no depende de la compu del dueño).
  - Progreso: `tail -c 120 /tmp/claude-0/-home-user-cerebro-youtube/2ba71c2c-c89a-4b53-b96c-afa40003b78c/scratchpad/render-v3.log` (al final dice `DONE`).
  - **Si el servidor se reinició y el render se perdió**, relanzarlo desde `produccion/remotion`:
    `npx remotion render src/index.ts Video3 out/raw-v3.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell --gl=swangle --concurrency=4 --video-bitrate=6M --x264-preset=medium --overwrite`
    y después `ffmpeg -i out/raw-v3.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -movflags +faststart out/video3-YOUTUBE.mp4` (~2 h 45 min en total).
- **Cuando termine:** verificar duración (~4:52) y tamaño, mandarlo al dueño, copia liviana al repo y borrar `out/raw-v3.mp4`.

## Estilo nuevo (desde el video 3)
- Estilo Isaac: neón sobre negro + dibujo de líneas brillantes (ámbar normal · rojo problema · verde solución). Análisis en `conocimiento/formatos-visuales.md`.
- **Sin clips de IA** (el dueño los vio caros): movimiento por código (encendido, parpadeo, barrido de luz, zoom).
- Texto siempre nítido: letra clara + borde del color + fondo oscuro detrás de las etiquetas.
- Miniaturas: vender el resultado (número grande, tarjeta de app, cara en shock). Checklist en `conocimiento/titulos-miniaturas.md`.

## Decisiones pendientes del dueño
- **Subtítulos:** propuesta = siempre visibles pero más chicos/discretos + texto grande solo en palabras clave (Isaac dice que tenerlos siempre cansa; pero en celular se mira sin sonido).
- Tema del video 3 (propuesto: tarjeta de crédito).

## Próximos pasos
1. Entregar video 3 y recordarle al dueño: publicar el 2, después editar el video 1 (y el 2 al publicar el 3) → tarjeta + pantalla final hacia el siguiente.
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
