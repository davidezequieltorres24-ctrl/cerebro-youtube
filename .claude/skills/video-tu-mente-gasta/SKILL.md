---
name: video-tu-mente-gasta
description: Produce un video largo completo para el canal Tu Mente Gasta (psicología del dinero, español neutro con "tú", estilo neón de líneas brillantes): tema → guion verificado → voz → escenas IA → montaje en Remotion → render por partes → 3 miniaturas + 3 títulos → ficha de subida. Usar cuando el dueño diga "hacer el video N", "nuevo video", "producir video", "armar el video de <tema>" o pida cualquier paso de ese proceso para Tu Mente Gasta. NO usar para otros canales (cada canal tiene su propio skill).
---

# Video para Tu Mente Gasta (de la idea al archivo listo para subir)

Se trabaja en `produccion/remotion/`. El video modelo es el **video 3** ("Por qué gastas más cuando pagas con tarjeta"): copiar su estructura y cambiar solo el contenido.
Hablarle al dueño en español rioplatense, corto y sin tecnicismos. **Los guiones del canal van en español neutro con "tú".**

## 0. Ficha del canal (lo único que cambia si este skill se copia para otro canal)
| Dato | Valor |
|---|---|
| Canal | Tu Mente Gasta: psicología del dinero, faceless, hecho con IA |
| Idioma del guion | Español neutro, segunda persona "tú" |
| Duración | 5–10 min (el video 3 dura 4:53) |
| Personajes | **Tú** (joven, pelo castaño despeinado, buzo con capucha) · **mascota cerebro** rosado `#FF6FAE` · Marcos (anteojos negros, cadena dorada) |
| Hoja de personajes | `public/personajes.png` (referencia de TODAS las imágenes) |
| Estilo visual | Dibujo de **líneas de neón brillantes sobre negro**. Color según la emoción: **ámbar** normal · **rojo** problema · **verde** solución. Ver `conocimiento/formatos-visuales.md` |
| Paleta | verde `#3DDC84` · negro `#0E0F12` · blanco `#F5F3EE` · amarillo `#FFD60A` · rojo `#FF3B30` · cian `#33E1FF` · rosa `#FF6FAE` |
| Fuentes | Miniaturas: Archivo Black (`canal/assets/fuentes/ArchivoBlack.ttf`) · video: Inter |
| Voz | ElevenLabs v4 "Carlos" `Y4HwpMNrBWN5dFKi5Lw8` (o APIMart `gpt-4o-mini-tts` si no hay créditos) |
| Música y efectos | `public/n-musica.mp3` (7 %), `n-sfx-whoosh/pop`, `demo3/sfx-impact/riser/heart/beep/rewind` |
| Motor de montaje | `src/Video3.tsx` + `src/plan3.ts` + `src/captionChunks.ts` |

## 1. Tema y promesa (preguntar al dueño antes de seguir)
1. Leer `contenido/estado.md`, `canal/plan-contenido.md` y `canal/competencia.md`.
2. Proponer **3 temas** con título que hable de "tú" (regla de oro 1). Si un video anterior funcionó, repetir su promesa (formato).
3. Por cada tema: **problema superficial + problema profundo**, el hueco que no cubren otros videos y el dato estrella con su estudio.
4. Pensar la **miniatura antes del guion** (el guion tiene que cumplir esa promesa).
5. ⛔ **Esperar que el dueño elija.**

## 2. Guion → `produccion/guiones/0N-<tema>.md`
Seguir `conocimiento/guiones-retencion.md`. La estructura que funcionó en el video 3:
- **Gancho dentro de la escena** ("Imagina esto. Estás en…"), con un detalle que se paga al final. Nunca "En este video…".
- **Nombre del problema** + 1 estudio, y **promesa abierta**: "hoy te muestro 3 cosas… y al final, una regla de una sola línea".
- **Mapa de 3 partes** que vuelve entre secciones. Cada parte: **{P} problema** → estudio que lo agrava → **{S} solución** con números → **{G} gancho** a la siguiente. Usar "pero / por eso", no "y entonces".
- Re-enganche cada 60–90 s ("quédate hasta la tercera, porque…").
- **Giro** ("¿Entonces la tarjeta es el enemigo? No.") → **la regla de una línea** → **cierre circular** (vuelve a la escena del inicio, ahora resuelta) → pregunta para comentarios.
- **Verificar cada dato** contra la fuente real (autor, año, revista) y anotarla. Nunca exagerar ("hasta el doble", no "el doble").
- En el guion, al lado de cada frase: qué se ve en pantalla (regla de oro 3).
- ⛔ **Mostrar el guion al dueño y esperar su OK.**

## 3. Voz
1. Texto para TTS en partes de ≤ 3.500 caracteres (`pN.txt`): **números en letras** ("ochenta y siete dólares"), pausas con "…".
2. Generar con la voz de la ficha. Unir las partes con 0,6 s de silencio → `public/vN/voz-videoN.mp3`. Procesar: `atempo` solo si hace falta, `loudnorm I=-16`.
3. Tiempos por palabra: pasar a WAV 16 kHz mono y correr `python3 scripts/tiempos_whisper.py voz.wav src/words-vN.json`.
4. Revisar que Whisper haya escrito bien los nombres y las cifras (corregir el JSON a mano si no).

## 4. Escenas (imágenes IA)
1. Lista `escenasN.json` con `[{"id":"i03","prompt":"…"}]`: **una imagen por idea** (no hace falta una por frase). Las escenas de texto, números y gráficos se hacen por código, no con IA.
2. Prompt de estilo (variable `STYLE_OVERRIDE`): *"16:9 image. Style: glowing NEON LINE ART on pure black, THICK bold glowing neon outlines (like a neon sign), no fill colors, no gradients, simple cartoon. Character must match the reference character sheet (TÚ = young man, messy brown hair, hoodie). No text, no letters, no numbers, no logos, no watermark. Scene: "*
3. Generar: `OUT_DIR=public/escenasN REFS_N=1 STYLE_OVERRIDE="…" python3 gen_apimart.py escenasN.json` (~US$0,014–0,04 por imagen). Las URL de `refs.json` vencen a los 3 días: si falla, volver a subir la hoja (`POST /v1/uploads/images?retention_days=3`).
4. Pasar a JPG de ~2300 px. Armar una **hoja de contactos** y revisarla: texto en inglés, personaje distinto o manos raras → regenerar esa sola.
5. Sin clips de video IA (el dueño los vio caros): el movimiento se hace por código.

## 5. Montaje en Remotion
1. Copiar `src/plan3.ts` → `src/planN.ts` y `src/Video3.tsx` → `src/VideoN.tsx` (cambiar imports: `words-vN.json`, `planN`, `vN/voz-videoN.mp3`). Registrar `VideoN` en `src/Root.tsx`.
2. En `planN.ts`, **una escena por frase ancla** (`a` = primeras palabras dichas, sin tildes). Tipos de escena del motor:
   - Imagen: `img` + `z` (zoom), `fx/fy` (foco), `tint` (`red`/`green`), `labels` que aparecen en la palabra `at`, `stamp` `'P'`/`'S'` (sello PROBLEMA/SOLUCIÓN), `leak` (destello de transición), `beats` (latidos).
   - Texto: `b:{k:'title'|'big'|'value'|'year'|'map'|'bills'|'brain'|'rule'|…}` → palabra gigante, número que cuenta, año, mapa de 3 partes, billetes contados, cerebro, regla final.
   - Sonido: `sfx` con `at` (palabra) → whoosh en cada imagen, **riser** antes de una revelación, **impact** en la palabra clave, pop en listas.
3. Reglas que ya se corrigieron (no repetirlas):
   - Textos animados letra por letra **agrupados por palabra** (nunca "CUERP/O"). Títulos ajustados a 1 renglón, con el subrayado debajo del texto y del mismo ancho.
   - Subtítulos **por frase completa** (`captionChunks.ts`): solo en escenas con imagen.
   - Cada imagen dura **≥ 2 s**. Nada de `blur` grande en transiciones (duplica el render).
4. **Revisión antes del render** (obligatoria):
   - Listar el texto hablado de cada escena y ver que la imagen coincide con lo que se dice.
   - `npx remotion still src/index.ts VideoN out.jpg --frame=N --scale=0.5 --browser-executable=… --gl=swangle` en el inicio y el final de cada escena → hoja de contactos → revisar orden, textos cortados y superposiciones.

## 6. Render por partes (un comando en segundo plano se corta a las 2 h)
1. Total de cuadros: `npx remotion compositions src/index.ts` → dividir en 3 partes iguales.
2. Lanzar como tarea en segundo plano (`run_in_background`, timeout 7200000), una por vez:
   `bash scripts/render-parte.sh VideoN 1 0 <a>` → al avisar que terminó: parte 2 → parte 3 → `bash scripts/unir.sh VideoN videoN`.
   ⚠️ No usar `nohup setsid`: el proceso muere solo.
3. Verificar: duración, `-14 LUFS`, 2 cuadros en cada unión. Mandar `out/videoN-YOUTUBE.mp4` al dueño (SendUserFile) y commitear solo `out/videoN-repo.mp4` (~15 MB; GitHub no acepta archivos de más de 100 MB).
4. Mientras renderiza: hacer las miniaturas y la ficha (paso 7).

## 7. Miniaturas y títulos (3 + 3 para "Probar y comparar")
Leer `conocimiento/titulos-miniaturas.md`. Hacer **3 miniaturas con ángulos distintos**:
1. **Comparación + número + emoción** (ej. "$87 → $174", Tú rojo vs Tú verde).
2. **Shock + interfaz + header** (ej. "NO LO SENTISTE" + notificaciones del banco + cara agarrándose la cabeza).
3. **Mascota cerebro + objeto raro + interfaz** (ej. "LA TARJETA TE CIEGA", "TE" en el color de resaltado).
- La IA hace **solo el dibujo**, ya compuesto para el texto ("TOP THIRD completely EMPTY black", caras en los tercios). Texto, números, tarjetas de app y flechas, por código con la librería de `miniaturas_v3.py` (`bg`, `glowtext`, `fit`, `app_card`, `curve_arrow`, `screen`, `finish`).
- Checklist: máx. 3 palabras · la miniatura completa el título, no lo repite · caras GRANDES · flecha que une el texto con el objeto · **nada en la esquina inferior derecha** (duración) · probar en un feed simulado de 360×202.
- **3 títulos**: principal con "tú" + uno con número fiel al estudio + uno de curiosidad.
- Guardar en `canal/assets/videoN-<tema>-K-<idea>.jpg`.

## 8. Ficha de subida → `contenido/0N-<tema>-subida.md`
Copiar el formato de `contenido/03-tarjeta-subida.md`: 3 títulos, 3 miniaturas, descripción (gancho + promesa), **capítulos con los tiempos reales** (inicio de cada escena del mapa), fuentes completas, pregunta para comentarios, video anterior, aviso de IA, hashtags, etiquetas, pantalla final y tarjeta. Darle al dueño la descripción **en un bloque listo para copiar**.

## 9. Cerrar
- Actualizar `contenido/estado.md`, `contenido/publicados.md` (cuando se publique) y, si se aprendió algo nuevo, el archivo de `conocimiento/` que corresponda (regla corta "si X → hacer Y").
- `git add` (sin videos pesados) → commit → push. `git status` tiene que quedar limpio.
- Anotar el gasto: ElevenLabs (`account_get_usage`) y APIMart (`curl -sS https://api.apimart.ai/v1/user/balance`).

## Costos y tiempos de referencia (video 3, 4:53)
- Imágenes: 18 escenas + 2–3 de miniatura ≈ US$0,50. Voz: ~8.700 créditos de ElevenLabs.
- Trabajo: guion + voz + escenas ≈ 2 h · render ≈ 1–3 h (3 partes) · miniaturas ≈ 30 min.
