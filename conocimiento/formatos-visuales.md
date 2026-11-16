# Formatos visuales de los canales de referencia (storyboards, 16/11/2026)

## NicoFinanzas (nuestro modelo directo, 3,6M vistas)
- **1 ilustración completa por frase** (cambia cada 2–4 s).
- **Personaje recurrente**: muñeco blanco de cabeza redonda, expresivo, con ropa normal.
- **Escenas detalladas y cotidianas**: concesionaria, oficina, casa, banco, calle, cafetería. Estilo cartoon dibujado a mano, colores cálidos.
- **Pizarras / carteles** con el dato o la cuenta ("$20.000 − $50 = $19.950?", "IMPUESTO DE APARIENCIA").
- **Primeros planos de objetos**: celular con saldo, recibos, relojes, llaves.
- **Subtítulo abajo** con palabra clave resaltada en color.
- Producción: voz IA + imágenes IA + edición (según su propia descripción).

## Depth Theory (vía BigStepsMedia)
- Fondo oscuro verde/azul, personaje de **línea de neón**, tarjetas tipo interfaz que aparecen.
- Escenas submarinas planas, con buzo y animal, y cámara que se mueve.
- Texto clave en rojo ("IT HEARS YOU").

## Grow With Kaz (pipeline con Claude Code)
- Motion graphics limpios (íconos, tarjetas, números grandes) con entradas animadas.
- Three.js para 3D + Remotion para subtítulos, audio y render.

## Reglas para Tu Mente Gasta
1. **Nunca** usar dibujos geométricos simples: cada frase = **ilustración de escena completa** con fondo detallado.
2. Personaje propio y consistente: "Tú" (sudadera gris) + la mascota cerebro rosado como narrador/gag.
3. Movimiento siempre: zoom/paneo lento (Ken Burns), transiciones con barrido, texto que entra con rebote.
4. Subtítulo palabra por palabra con la palabra clave en verde billete.
5. Efectos de sonido en cada cambio (whoosh, pop, caja registradora) + música de fondo baja.
6. Pizarras/carteles para números y datos.

## Isaac ("How I Actually Edit Viral Videos", 22 min) — analizado cuadro a cuadro (16/11/2026)
**Ritmo:** 290 cortes → 1 cada **2,7 s** (mediana). Pero dentro de cada plano **nada está quieto**: líneas que se dibujan, textos que se revelan, cámara que se mueve.

**Look general**
- **Fondo negro + elementos de neón con brillo** (amarillo y celeste principales; verde, magenta, rojo de apoyo). Casi todo lo explicativo pasa sobre negro.
- **Avatar presentador**: él mismo como personaje IA (pelirrojo de traje), **recortado** junto a grabaciones de pantalla, con poses distintas (laptop, libro, señala, se agarra la cabeza, se encoge de hombros). Entra deslizándose con desenfoque de movimiento.
- **Grabaciones de pantalla inclinadas en 3D** (perspectiva), con el avatar delante.
- **Mapa de secciones recurrente**: bloques de colores en perspectiva 3D tipo línea de tiempo ("The Editing Guide": 1. Qué querés · 2. Preparar · 3. Corte bruto · 4. Animaciones…). Vuelve entre secciones y la cámara vuela sobre él → el espectador siempre sabe dónde está.
- **Historia secundaria** al inicio y al final: cortometraje en **dibujo de líneas brillantes** (estilo rotoscopia, monocromo) de un editor en su escritorio. **El color cambia con la emoción**: ámbar (normal) → rojo (frustración) → verde lima (resolución). Subtítulos chicos en serif cursiva. Ritmo lento.
- Clips de películas con texto integrado manuscrito (ej. "wasn't good"). ⚠️ Nosotros NO (derechos).

**Animaciones (tiempos medidos a 60 cps)**
- **Línea de luz que se dibuja** (~0,5 s) y se convierte en otra cosa: caja, flecha, subrayado, garabato que sigue su camino.
- **Caja de neón que se dibuja lado por lado** (~0,6 s) → recién después aparece el contenido.
- **Texto que se revela desenfocado → nítido** letra por letra (~0,4 s).
- **Frase blanca + subrayado manuscrito amarillo** que crece con la voz y después se escapa en un rulo hacia la siguiente escena.
- **Conceptos = esferas de neón** (amarillo vs. celeste = dos estilos). Para dividirse se **estiran como goma** (squash & stretch, ~0,3 s).
- **Anillo de progreso** que se dibuja alrededor de un dato ("3 HOURS" → "1 HOUR" → "10 MIN"), y una curva celeste que los une.
- **Círculos-etiqueta** que entran rebotando alrededor de una caja central (mapa de ideas).
- **Palabra sola gigante sobre negro** como puntuación ("WHERE", "PLAIN", "COOL", "ENOUGH").

**Transiciones**
- **Destello de luz** (light leak naranja/rosa, 0,1–0,2 s) → negro → arranca la animación siguiente. (El "fuego" de la miniatura era esto.)
- **Barrido con desenfoque de movimiento** y zoom que atraviesa la imagen.
- **Corte a negro con pausa** antes de una idea importante (0,5–1 s de negro total).

**Subtítulos:** chicos, blancos, abajo, frase corta y **no siempre** (solo cuando suma). Lo importante va como texto grande central o integrado.

### Cómo lo adaptamos a Tu Mente Gasta (todo se puede en Remotion)
- Avatar = **"Tú" y la mascota cerebro** recortados (ya tenemos `tu-*.png`).
- Neón y brillos: trazos SVG que se dibujan + `drop-shadow` del color (verde billete `#3DDC84`, amarillo `#FFD60A`, rojo `#FF3B30`).
- Mapa de secciones = la **escalera de niveles** o un "mapa de trampas" que vuelve entre partes.
- Historia secundaria en **dibujo de líneas brillantes** generado con IA (Nano Banana, mismo personaje "Tú"), con el color según la emoción.
- Stock libre (Openverse CC0) solo como "evidencia" (billetes, posnet, súper).
- ⚠️ Desenfoque solo en textos chicos y por pocos cuadros (el `blur` grande duplica el tiempo de render).

