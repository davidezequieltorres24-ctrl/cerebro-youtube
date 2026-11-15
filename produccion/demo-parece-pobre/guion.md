# Demo 30 s: "Por qué la gente que parece pobre tiene más dinero que tú"

Formato aplicado (de `conocimiento/guiones-retencion.md`):
- ✅ Apertura dentro de la escena ("Imagina esto")
- ✅ Detalle plantado (la sudadera gris) → pagado al final (cierre circular)
- ✅ Pregunta que tira hacia adelante
- ✅ "¿Qué harías tú?" (el viewer juega)
- ✅ Giro con dato verificado
- ✅ Cada línea tiene su propia imagen

| # | Narración | Imagen en pantalla |
|---|---|---|
| 1 | Imagina esto. | Fondo oscuro, "Imagina esto…" |
| 2 | Tu compañero estrena auto. Brillante. Todos lo aplauden. | Compañero con lentes y cadena + auto nuevo que entra brillando |
| 3 | Tú llegas en autobús, con la misma sudadera gris de siempre. | Tú (sudadera gris) + autobús |
| 4 | Y sientes que vas perdiendo. | Flecha roja hacia abajo sobre ti |
| 5 | Pero… ¿quién tiene más dinero de verdad? | Gran "?" entre los dos |
| 6 | ¿Qué harías tú? ¿Auto nuevo… o guardarlo? | Dos tarjetas de opción: AUTO NUEVO / GUARDARLO |
| 7 | En 1996, dos investigadores estudiaron a millonarios estadounidenses. | Libro + "1996" |
| 8 | La mayoría manejaba autos usados. | Casa común + auto usado + "MILLONARIO" |
| 9 | Porque el dinero que muestras… es dinero que ya no tienes. | Billetes que salen volando hacia el auto del compañero |
| 10 | Esa sudadera gris no es de alguien que pierde. Es el disfraz de alguien que gana. | Tú + bóveda verde llena que se abre detrás (pago del detalle) |
| 11 | — | Placa final: mascota + "TU MENTE GASTA" |

## Verificación de datos
- Líneas 7–8: Thomas J. Stanley y William D. Danko, *The Millionaire Next Door* (1996; en español "El millonario de al lado"). Hallazgo central: la mayoría de los millonarios estudiados vivía por debajo de sus posibilidades, con casas modestas y autos usados o no lujosos. ✅ (sin porcentajes, para no afirmar cifras sin chequear)
- Línea 9: idea de Morgan Housel, *The Psychology of Money* (2020): la riqueza es lo que no ves. ✅ (frase propia, no cita textual)

## Producción del demo
- Voz: Piper `es_MX-claude-high` (gratis, offline; velocidad 0.86). Para el canal real: ElevenLabs, siempre la misma voz.
- Animación: `render.py` (Python + PIL + ffmpeg), 100% por código: cada línea = su escena. Para el canal real: Three.js + Remotion (ver `conocimiento/produccion-ia.md`).
- Duración: 34,7 s · 1280×720 · 30 fps → `demo.mp4`
- Regenerar: `python3 render.py` (necesita los .wav de `audio/`, que se generan con Piper).
