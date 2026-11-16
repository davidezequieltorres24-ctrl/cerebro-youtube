# Títulos y miniaturas

## Títulos
- Hablar del **viewer**, no del tema: "Por qué nunca querrías conocer a un cachalote" > "El cachalote".
- Base científica (efecto cóctel, Moray 1959): en un feed lleno de ruido, lo que corta es lo más parecido a tu nombre → **"vos"**.
- Repetir la fórmula de título que funcionó (Depth Theory: 4 de 5 videos con la misma frase).

## Diseño de miniatura
- **Regla de tercios**: dibujar 2 líneas verticales + 2 horizontales; ubicar los elementos sobre ellas.
- **Paleta fija del canal**: 1 color principal + negro + blanco + 1 intermedio + **1 color de resaltado que rota** por video (reconocible pero fresco).
- **Fuente**: básica, no sobreusada (ej. Eastman).
- **Texto**: número grande, afirmación opuesta a la creencia común, o título que represente el video. Si nada encaja → sin texto. Máx. ~3 palabras.
- Resaltar en color solo la palabra clave (Depth Theory: "TE CAZA", con "TE" en rojo).
- Ejemplo Depth Theory: animal gigante + buzo diminuto con linterna + 3 palabras.

## 10 tipos de miniatura (combinar 2–3)
1. **Shock**: algo que sorprenda al scrollear.
2. **Números grandes**: "$50M", "$900 por escuchar música".
3. **Simple**: un solo objeto raro / captura del video + una pregunta.
4. **Social hacking**: cara de alguien famoso del nicho (solo si el video es sobre esa persona).
5. **Creador junto a algo grande**.
6. **Header**: texto arriba que da contexto.
7. **Comparación**: antes/después, barato vs caro, A vs B.
8. **Blur**: difuminar el resultado final → hay que clickear.
9. **Objeto raro**.
10. **Branding**: logo/estilo propio.

## Reglas de uso
- Combinar 2–3 tipos y mantenerlos **~5 videos**, después variar (si se repite 100 veces, baja el CTR).
- **NO copiar las miniaturas de tu propio nicho**: si muchas se parecen, es cliché y competís contra canales de 100K. Inspirarse en **canales de otros nichos**.
- Mantener constantes colores, fuente y estilo → te reconocen más rápido en la home → sube el CTR.

## Proceso (Photoshop)
1. Concepto + boceto en papel.
2. Guías de tercios → personaje, texto, fondo, elementos.
3. Texto: color + inner/outer glow → guardar como estilo reutilizable.
4. Warp para doblar elementos; Gaussian blur / mosaico para fondos que distraen.
5. Oscurecer detrás del texto: pincel grande, suave, flow ~5%, en capa nueva.
6. Ajustar color: Imagen > Ajustes > Tono/Saturación. Agregar ruido.
7. Reflejos de luz: capa nueva, pincel con color, modo **Superponer (Overlay)**.
8. Retoque final de color en Lightroom (celular).
9. **Testear** en thumbsup.tv con el título, simulando la home de YouTube.

## Proceso real usado (video 1, v2)
1. 3 conceptos distintos sin texto (APIMart, Nano Banana 2, refs: hoja de personajes + miniatura con mejor score). ~US$0,04.
2. Descartar los confusos (más de 3 elementos o personajes donde no van).
3. **El texto lo pongo yo** con la fuente de marca (`canal/assets/fuentes/ArchivoBlack.ttf`), trazo negro grueso + sombra. La IA solo hace la imagen.
4. **La miniatura NO repite el título: lo completa** (título "parece pobre" → miniatura "LO QUE NO VES" / "$0 vs $$$").
5. El texto nunca tapa al personaje. Verificar a 320×180 (tamaño celular).
6. Probar en la vista previa de vidIQ (equivale a thumbsup.tv) y subir 2 versiones a "Probar y comparar" de YouTube.
7. Flechas: siempre deben UNIR el texto con el objeto que importa (curva, estilo dibujada a mano, con contorno negro). Nunca apuntar a un espacio vacío.

## Aprendido con el video 3 (estilo líneas brillantes)
- **Probar siempre en un feed simulado de celular (360×202)** antes de elegir: ahí se ve lo que falla.
- **Esquina inferior derecha prohibida**: ahí va la duración del video (4:52) y tapa el texto.
- Un personaje chiquito (tipo "Tú diminuto frente a objeto gigante") **desaparece a tamaño celular** si es de líneas finas → en estilo neón, las caras tienen que ser GRANDES.
- Lo que más se lee de lejos: **dos caras grandes con emociones opuestas + contraste rojo/verde** (comparación + emoción).
- Pedir a la IA **líneas más gruesas y brillantes** que en las escenas del video ("THICK bold glowing neon outlines").
- Texto: letra clara + borde negro grueso + brillo del color (igual que en el video). Fondo oscuro difuminado detrás.

## Referencias del dueño (16/11/2026): vender el RESULTADO, no el contenido
- **Número grande protagonista** ($0 → $21.607, 820K, $9.119): se entiende en medio segundo.
- **Elemento de interfaz real** (tarjeta blanca tipo YouTube Studio / app del banco) → parece una captura = credibilidad.
- **Antes → después con flecha**, rojo vs verde. **Línea de gráfico** que sube = emoción del resultado.
- Pocos elementos, fondo oscuro con grilla sutil, mucho contraste. Los números y la interfaz se hacen POR CÓDIGO (PIL), nunca con IA (deforma el texto).
- La miniatura no tiene que mostrar el contenido: tiene que dar un mensaje claro que genere el clic. La retención la gana el video.
- Script reutilizable: tarjeta de interfaz + número + flecha curva + capa de dibujo con fusión "screen" (el negro desaparece).
