---
name: video-universo-y-si
description: Produce un video completo para el canal Universo Y Si (@UniversoYSi): historias animadas «¿Y si…?» de ~10 min en segunda persona ("tú"), español neutro, animación 2D plana. Cubre idea → guion con la fórmula del canal → voz (Brian C.) → planos → montaje en Remotion → render por partes → miniatura + título + descripción con capítulos + etiquetas. Usar cuando el dueño diga "Hagamos el video: [idea]", "nuevo video de Universo Y Si / UniversoYSI / ¿Y si…?" o pida un paso de ese proceso. NO usar para Tu Mente Gasta.
---

# Video para Universo Y Si (de la idea al archivo listo para subir)

Leer primero `universo-y-si/guia.md` (fórmula, plantilla de 10 min, identidad, qué funciona). Guía original del dueño: https://claude.ai/artifact/Jfcq8TtxM9So6952PFbBT6
Hablarle al dueño en español rioplatense, corto. **El guion va en español neutro con "tú".**
Todo lo del canal vive en `universo-y-si/`: guiones en `universo-y-si/guiones/`, fichas de subida en `universo-y-si/videos/`, imágenes en `produccion/remotion/public/uys-N/`.

## 0. Ficha del canal
| Dato | Valor |
|---|---|
| Canal | Universo Y Si (@UniversoYSi): «¿Y si…?» animados, general (arrancó con crush + supervivencia) |
| Guion | Español neutro, "tú", ~1.400–1.650 palabras por 10 min |
| Duración | ~10–12 min |
| Personajes | **Tú** (protagonista) + **la crush con nombre** + 1 secundario gracioso (ej. Ramón el delfín). Nuevos por historia |
| Estilo del video | **2D plano**: contorno negro grueso, colores planos, personajes simples tipo muñequito, viñeta oscura |
| Estilo de miniatura | **Distinto al video**: cartoon muy saturado, caras exageradas, etiquetas "TÚ" / "TU CRUSH" con flechas verdes, texto corto amarillo arriba |
| Voz | ElevenLabs **Brian C. – Professional Latin Narrator** `uCQe5kObQIjtylU0HL3m`, Eleven v4, estabilidad 50, similitud 75 |
| Mascota/marca | Stickman doodle con corbata roja; crema + lila + "?" amarillo |
| Al subir | No es para niños · Cine y animación · Contenido sintético: Sí |

## 1. Idea (preguntar al dueño)
1. Leer `universo-y-si/guia.md` (ideas, qué funcionó, videos hechos) y, si hay datos, cómo le fue al último video.
2. Proponer **3 ideas** "tú + situación extrema" (con o sin crush) o "poder/fantasía personal". Nunca un "¿y si…?" genérico sin "tú".
3. Si el dueño ya dijo "Hagamos el video: [idea]", saltar a 2.
4. ⛔ Esperar que elija.

## 2. Guion → `universo-y-si/guiones/0N-<tema>.md`
- **Ficha primero**: personajes (edad, rasgo, secreto), lugar con nombre propio, **5–7 elementos plantados y dónde se paga cada uno** (uno resuelve el clímax).
- Seguir la **plantilla de 10 min** de la guía (gancho → desastre → crush → lugar → reglas → montaje con "Día X" → pelea → crisis con cuenta regresiva → salida → pregunta).
- Cada escena: `### Escena N — título (0:00–0:20)` + `Visual:` (planos a animar) + texto narrado; diálogos con raya (—).
- Alternar peligro / humor seco / ternura. Números concretos. Frases cortas. Romance lento (beso recién al final).
- Cierre: pregunta binaria + suscripción atada a la historia.
- Contar caracteres del texto narrado: ~9.800 = ~11:40 de voz.
- ⛔ Mostrar el guion al dueño y esperar su OK.

## 3. Voz
1. Solo el texto narrado, **un salto de línea entre párrafos** (los saltos cuestan créditos), en 2 partes (~3.400 y ~6.400 caracteres).
2. Generar con `creative_generate_speech` (voz `uCQe5kObQIjtylU0HL3m`) o pedirle al dueño los MP3 si lo hace él en ElevenLabs (bajar la Generation 1).
3. Unir con 0,6 s de silencio → `public/uys-N/voz.mp3` · `loudnorm I=-16`.
4. Tiempos por palabra: `python3 produccion/remotion/scripts/tiempos_whisper.py voz.wav src/words-uysN.json`.

## 4. Planos (imágenes)
1. **Hoja de personajes del video** (1 imagen, APIMart): Tú + crush + secundario, de frente y perfil, en el estilo 2D plano. Subirla como referencia (`POST /v1/uploads/images?retention_days=3`) y usarla en TODOS los planos (consistencia).
2. Lista `planos.json` con `[{"id":"p01","prompt":"…"}]`: **~60–90 planos** (cambio cada 5–10 s), sacados de las líneas `Visual:`. Variar plano general / medio / primer plano de caras con expresión.
3. Estilo (`STYLE_OVERRIDE`): *"16:9 flat 2D cartoon illustration, thick black outlines, flat solid colors, simple rounded characters, soft dark vignette, clean background. Characters must match the reference sheet exactly. No text, no letters, no watermark. Scene: "*
4. `OUT_DIR=public/uys-N REFS_URLS=<url hoja> python3 gen_apimart.py planos.json` (~US$0,014–0,04 c/u → ~US$1–3 por video). Pasar a JPG ~2300 px. Hoja de contactos → regenerar solo los que fallen (texto, personaje distinto, manos raras).
5. Para parpadeos y gestos: pedir 2–3 variantes de la misma cara (ojos cerrados, boca abierta) y alternarlas por código.

## 5. Montaje en Remotion (`produccion/remotion/`)
- Copiar el motor de `src/Video3.tsx` + `src/planN.ts` → `src/UysN.tsx` + `src/plan-uysN.ts`; registrar en `src/Root.tsx`. Una escena por frase ancla.
- Recursos propios del canal (por código, no IA):
  - **Cartel "DÍA X"** (golpe de sonido) y **cuenta regresiva** en el clímax.
  - Zoom lento de cámara en cada plano, sacudida en golpes, parpadeos alternando variantes.
  - Lluvia, olas, destellos de flash y oscuridad como capas animadas.
  - Etiquetas con nombre la primera vez que aparece cada personaje.
- Subtítulos por frase (`src/captionChunks.ts`). Textos: nunca cortar palabras.
- Sonido: música según el clima (tensión / humor / ternura), **canción recurrente** si es elemento plantado, efectos (mar, lluvia, trueno, alarma, golpe, flash) bajo la voz.
- Revisar antes del render: texto hablado por escena vs. plano, y hoja de contactos con `npx remotion still`.

## 6. Render por partes
Igual que Tu Mente Gasta (`conocimiento/produccion-ia.md`): dividir en **4 partes** para ~12 min, cada una como tarea en segundo plano (`scripts/render-parte.sh UysN K desde hasta`) y al final `scripts/unir.sh UysN uys-N` (audio aparte, −14 LUFS, copia liviana). Nunca `nohup setsid`. Mandar el MP4 al dueño (SendUserFile) y commitear solo la copia liviana.

## 7. Miniatura, título, descripción, etiquetas (siempre las 4 cosas)
- **Miniatura** 1280×720 JPG, en estilo cartoon saturado (no el del video): Tú y la crush GRANDES con caras exageradas, etiquetas **"TÚ" / "TU CRUSH"** + flechas verdes que apuntan a cada uno (por código), texto corto amarillo arriba ("30 DÍAS A LA DERIVA") o "DÍA 1 / DÍA 30". La IA hace solo el dibujo; textos, etiquetas y flechas con la librería de `miniaturas_v3.py`. Nada en la esquina inferior derecha. Probar en feed de 360×202. Hacer 3 con ángulos distintos para "Probar y comparar".
- **Título**: "¿Y si [situación] con tu crush?" (o la fantasía), el mismo que la pregunta del gancho.
- **Descripción**: párrafo gancho (3 líneas, con números) → CAPÍTULOS con nombres intrigantes y **tiempos reales** → la pregunta → suscripción atada a la historia → disclaimer en chiste → **solo 3 hashtags** (#yquepasariasi + 2 del tema). Entregarla en un bloque listo para copiar.
- **Etiquetas**: la frase del título, variantes ("atrapado con mi crush"), qué pasaría si, y si, historia animada, animación, historia de amor, supervivencia, crush, historia pov, qué harías si.
- Guardar todo en `universo-y-si/videos/0N-<tema>.md` (+ miniaturas en `universo-y-si/assets/`).

## 8. Cerrar
- Actualizar la tabla de videos y los próximos pasos en `universo-y-si/guia.md`; si se aprendió algo, sumar la regla corta ahí.
- Commit + push (sin videos pesados); `git status` limpio. Anotar el gasto (ElevenLabs y APIMart).
