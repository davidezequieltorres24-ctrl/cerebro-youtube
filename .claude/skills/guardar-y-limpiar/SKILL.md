---
name: guardar-y-limpiar
description: Guarda el estado completo del canal Tu Mente Gasta en contenido/estado.md, lo sube a GitHub y deja todo listo para limpiar el chat con /clear sin perder el seguimiento. Usar cuando el dueño diga "guardar y limpiar", "clear", "limpiar el chat", "gastar menos tokens" o "cerrar sesión".
---

# Guardar y limpiar

Objetivo: que un chat nuevo pueda retomar el trabajo leyendo SOLO `contenido/estado.md` (y lo que ese archivo indique), sin la conversación anterior.

## Pasos
1. **Revisar procesos en marcha** (renders, generación de imágenes):
   - `pgrep -af "remotion render|gen_apimart|ffmpeg"` y el final del log de cada uno (`tail -c 200 <log>`).
   - Anotar en el estado: qué se está generando, ruta del log, ruta del archivo final y qué falta hacer cuando termine (normalizar audio, mandar al dueño, completar capítulos, subir a GitHub).
2. **Actualizar `contenido/estado.md`** (reescribirlo completo, corto y en viñetas) con estas secciones:
   - **Videos**: tabla con N.º, título, estado (publicado / renderizando / guion listo / idea), archivos clave (guion, plan, miniatura, datos de subida).
   - **En marcha ahora**: procesos y cómo verificarlos.
   - **Decisiones pendientes del dueño**.
   - **Próximos pasos** (ordenados).
   - **Saldo y créditos**: ElevenLabs (`account_get_usage`), APIMart (`curl -sS https://api.apimart.ai/v1/user/balance`), vidIQ si se usó.
   - **Decisiones ya tomadas** que no están en otros archivos (o enlazar dónde están).
3. **No duplicar** lo que ya vive en el cerebro: enlazar archivos (`canal/…`, `conocimiento/…`, `produccion/…`).
4. **Commit y push** de todo lo pendiente (`git status`, `git add`, commit con el formato del repo, `git push origin main`). Verificar que `git status` quede limpio. Nunca subir archivos de más de 100 MB (videos pesados están en `.gitignore`).
5. **Responder al dueño** en 3–5 líneas: qué quedó guardado, si hay un render corriendo (sigue aunque se limpie el chat) y: "Escribí `/clear` y en el chat nuevo decime **seguimos**".

## Al retomar (chat nuevo)
- Leer `CLAUDE.md` (se carga solo) y luego `contenido/estado.md`. Nada más hasta que la tarea lo pida.
- Si había un render en marcha: revisar su log y, si terminó, hacer los pasos pendientes anotados.
