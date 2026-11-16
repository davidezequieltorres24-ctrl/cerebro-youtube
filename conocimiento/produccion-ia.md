# Producción con IA (Claude Code)

## Pipeline: videos animados 3D sin pagar generadores de video (~45 min por video)
1. En Claude Code: "Quiero crear videos animados 3D. Necesito **Three.js** (animaciones 3D) y **Remotion** (subtítulos, audio y render). Instalá y configurá todo."
2. Crear/instalar una **skill o plugin de estilo**: bajar videos de referencia del estilo, sacar capturas de escenas y armar una skill que reproduzca ese estilo cuadro por cuadro.
3. **Master prompt** → 10 ideas para el nicho → elegir 1 → pedir la duración (ej. 6 min) → guion.
4. **Voz en off** con ElevenLabs, con el guion dividido en ~3 partes.
5. Subir cada audio a Claude y pedir que genere la animación con la skill de estilo.
6. Iterar el estilo: "Sugerime diseños de personaje únicos y con más detalle, con ejemplos visuales" (stick figures, humanoides, etc.).
7. Unir las partes: animaciones, transiciones, motion graphics y efectos de sonido.

## Variante rápida (prueba con estilo Depth Theory)
- Darle a Claude el canal de referencia → elige un tema no cubierto → guion → **verifica los datos contra fuentes** → voz ElevenLabs en una toma → cada escena en código. Así salió 1 minuto de video en unos 15 minutos.

## Reglas
- Siempre verificar los datos (ver `guiones-retencion.md`).
- La IA no es la ventaja (todos la tienen). La ventaja son las decisiones de título, apertura, visuales, promesa y verificación.
- Canales que ya usan estilos 3D/animados: Rick's Clips, Ifverse, Capital Case (Shorts), Depth Theory (largos).

## ✅ Pipeline real usado en el canal (probado 16/11/2026) — `produccion/remotion/`
1. **Guion** con el formato (ver `guiones-retencion.md`) + datos verificados.
2. **Voz**: ElevenLabs v4, voz "Carlos – Español Neutro" (`Y4HwpMNrBWN5dFKi5Lw8`). ~490 créditos por 30 s.
3. **Personajes**: 1 hoja de personajes (Tú + Marcos) → referencia para TODAS las escenas (consistencia). `public/personajes.png`.
4. **Escenas**: 1 ilustración completa por frase (Gemini 3.1 Flash Image vía ElevenLabs, ~400–600 créditos c/u, conectada a la hoja).
5. **Stickers**: recortes de la hoja con fondo transparente (`tu-*.png`, `marcos-*.png`) para animar encima.
6. **Música** (ElevenLabs Music, ~900 créditos) + **SFX** (whoosh, pop, aplausos, caja, tuba triste; 50 créditos c/u).
7. **Tiempos por palabra**: Whisper local (`faster-whisper small`, `HF_HUB_DISABLE_XET=1`).
8. **Montaje en Remotion** (`src/ParecePobre.tsx`): Ken Burns, barridos, pantalla dividida, pizarras, contador de dinero, stickers con rebote, monedas 3D con Three.js, subtítulos palabra por palabra.
9. **Render**: `npx remotion render src/index.ts ParecePobre out/x.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell --gl=swangle`
10. **Audio a −14 LUFS**: `ffmpeg -i in.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 out.mp4`

### Límites encontrados
- ElevenLabs gratis: 10.000 créditos/mes y **solo 3 imágenes por día**. Un video de 12–15 min necesita ~60–80 escenas → hace falta plan pago (o repartir en días).
- Canva genera imágenes pero no deja bajarlas en alta resolución desde aquí.
- vidIQ: 150 créditos/mes (miniatura = 22).

## ✅ Escala: APIMart para las imágenes (desde 16/11/2026)
- **Nano Banana 2** (`gemini-3.1-flash-image-preview`) vía `https://api.apimart.ai/v1/images/generations`, 2K, 16:9, con `image_urls` = hoja de personajes + 2 escenas de estilo.
- Costo real: **~US$0,014 por imagen** (62 escenas ≈ US$0,87). La clave está guardada en el entorno `cerebro-youtube` (la inyecta el proxy).
- Script: `produccion/remotion/gen_apimart.py escenas.json` (sube, espera y descarga a `public/escenas/`).
- Referencias: subir con `POST /v1/uploads/images?retention_days=3` (las URLs vencen a los 3 días → volver a subir).
- Voz: ElevenLabs v4 (gratis alcanza ~7 min/mes). Se procesa: `atempo=1.15` + compresor + `loudnorm I=-16`.
- **Mezcla aprobada**: voz −16 LUFS · efectos normalizados a −26 LUFS y al 45% · música −16 LUFS al 7%. Master final a −14 LUFS.
- Montaje del video completo: `src/plan.ts` (1 escena por frase, overlays y tableros) + `src/FullVideo.tsx`. Tiempos de frases alineados con Whisper (`src/lines-full.json`).
- Render: ~1 h 30 min para 7 min de video (4 CPU).

## ⚠️ Lecciones para videos largos (aprendidas con el video 1)
**Tiempos reales en este servidor (4 núcleos):** ~1.000 cuadros cada 8–10 min → 7 min de video ≈ 1 h 30 – 2 h de render. Un video de 12 min ≈ 3 h.
1. **Renderizar directo en la calidad final** (sin recodificar después): `npx remotion render ... --crf=18 --x264-preset=medium --audio-codec=aac` y aplicar `loudnorm` solo al audio (`-c:v copy`). Así sale un archivo de ~200–400 MB y no 700 MB.
2. **Límites de tamaño:** para mandar el archivo por el chat: **máx. 500 MB**. GitHub: **máx. 100 MB por archivo** → al repo va solo una copia liviana (~1,6 Mbps), la versión para YouTube se manda por el chat.
3. **Lanzar el render como proceso independiente** (`nohup setsid script.sh &`), nunca como tarea en segundo plano con límite de 2 h. Vigilar con un monitor que avise el progreso.
4. **Nada de `filter: blur()` en transiciones**: duplica el tiempo de render. Barridos con movimiento y opacidad solamente. El 3D (Three.js) solo en escenas cortas.
5. **Imágenes en JPG de ~2300 px** (no PNG de 2.7K) para que cada cuadro cargue rápido.
6. **Empezar el render apenas estén voz + escenas**, y escribir el guion del video siguiente mientras renderiza (render = tiempo muerto aprovechable). No correr dos renders a la vez.
7. **Voz:** ElevenLabs acepta ~3.500 caracteres por pedido → dividir el guion en partes, unirlas con 0,6 s de silencio y después acelerar 1.15.
8. **APIMart:** las referencias subidas vencen a los 3 días → volver a subir la hoja de personajes en cada video nuevo (`refs.json`).
9. **Escenas:** pedir "no readable text" porque igual a veces aparece texto en inglés; revisar la hoja de contactos antes de montar.
10. **Calendario realista para 3 videos/semana:** día 1 guion + voz + escenas (~2 h de trabajo) · día 1–2 render (~3 h) · día 2 subir + Shorts.

## Costos comparados por video (~9 min, 16/11/2026)
| Recurso | APIMart | ElevenLabs |
|---|---|---|
| Voz | gpt-4o-mini-tts (voces onyx/echo, con `instructions` en español): **~US$0,015 por 1.000 caracteres** → ~US$0,13 por video | v4 "Carlos": ~8.700 créditos por video; gratis = 10.000/mes (1 video). Necesita plan pago para 12 videos/mes |
| Imágenes | Nano Banana 2: ~US$0,014 c/u → ~US$1,20 por video (85 escenas) | 3 imágenes/día en el plan gratis (no sirve para volumen) |
| Música/SFX | — | ElevenLabs (ya generados; se reutilizan) |
- Endpoint voz APIMart: `POST https://api.apimart.ai/v1/audio/speech` {model: gpt-4o-mini-tts, voice, input (máx 4.096 caracteres), instructions, response_format: mp3}.
- Calidad: se entiende perfecto (Whisper: español 100%), pero menos expresiva que ElevenLabs v4 y sin las etiquetas de emoción.
