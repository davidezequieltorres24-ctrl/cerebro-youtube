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
