# Edición (fuente: Isaac, "How I Actually Edit Viral Videos", 802K vistas)

## Antes de editar
- Una edición genial no salva un guion o una idea malos → primero idea y guion.
- **Historia secundaria:** algo profundo, como un cortometraje que corre en paralelo al tema principal.
- Inspiración de **películas** (transiciones, montajes, ángulos) → originalidad que todavía no está en YouTube.
- **Colorear el guion por tipo de elemento** (imagen, video, animación, texto, grabación de pantalla…) y juntar todo por tipo antes de montar. (Nosotros: `plan.ts` cumple esta función.)

## Montaje
- Voz primero: cortar pausas incómodas. **Música temprano** (marca el clima; cortes al ritmo).
- Recurso simple que funciona: **texto solo sobre fondo negro**.
- Animaciones: **boceto → crear → animar**. Ej.: diagrama de cajas conectadas con flechas, títulos borrosos que se revelan al hacer zoom.
- Primer corte → volver a mirarlo → agregar lo que falta y **cortar lo que no sirve al objetivo**.
- **"La gente no tiene menos atención, tiene estándares más altos"**: no cortar todo el aire; que cada pausa valga la pena.

## Efectos
- El efecto acompaña lo que se dice; no usar todo lo que hay.
- Zoom con curvas suaves y **mismo punto de foco entre cortes** (regla de tercios) → el ojo no salta por la pantalla.
- **Texto, 3 tipos:** subtítulos (solo en lo importante, no todo el tiempo porque cansa), texto central (con color/brillo propio) y texto integrado en la escena (pared, pantalla).
- Animación "pop" del texto: escala 70% → 110% en 7 cuadros → 100% en 5 cuadros.
- Personaje/mascota: cabeza generada con IA sobre imágenes → animada con movimiento suave.
- **Overlays** (destellos de luz, polvo, electricidad) para transiciones y resaltar.
- **Sonido = la mitad del video.** 3 tipos base: **whoosh, riser (subida de tensión) e impact (golpe)**. Diseñarlo con la voz y la música silenciadas; después bajar el volumen para que no moleste.
- Corrección de color al final.

## Textos y subtítulos (errores corregidos en el video 3, 16/11/2026)
- **Nunca cortar una palabra en dos renglones** ("CUERP/O", "MAR/CA"): al animar letra por letra, agrupar cada palabra en un bloque que no se parta (`BlurText` en `Video3.tsx`).
- Título largo → **achicar para que entre en 1 renglón** (ancho útil ~1.600 px). El subrayado va **debajo del texto y del mismo ancho**, nunca una línea fija que se salga de pantalla.
- **Subtítulos por FRASE completa**, no ventana de palabras que se corren: cortar en la puntuación; frases cortas ("Ahora,") se juntan con la siguiente; frases largas (>50 letras) en mitades parejas, antes de "y / que / porque / pero / con / para"; nunca separar nombres propios ni listas de números; nunca cruzar de una escena a otra. Palabra que se dice en amarillo + fondo oscuro suave. Código: `produccion/remotion/src/captionChunks.ts`.
- Subtítulos solo en escenas con imagen; en escenas de texto grande no (ya está escrito).
- Cada imagen debe durar **≥ 2 s** (una de 0,9 s se ve como un parpadeo): si la frase es corta, mover el ancla de la escena siguiente.
- **Revisar antes de entregar:** hoja de contactos con 2 cuadros por escena (inicio y final) + cuadros sueltos (`npx remotion still … --frame=N --scale=0.5`) de cada título y subtítulo largo.

## Mentalidad
- **Probar algo nuevo en cada video** (los canales que repiten el mismo video 10 veces se estancan).
- Aprender una técnica nueva por video: la primera vez cuesta 3 h, después minutos.
- **Hecho es mejor que perfecto:** "es suficientemente bueno" → publicar.
