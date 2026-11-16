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
