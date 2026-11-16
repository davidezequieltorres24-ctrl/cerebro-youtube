# Renderiza UNA parte (sin audio) de una composición. Cada parte < 2 h.
# Uso: bash scripts/render-parte.sh <Composicion> <N> <desde> <hasta>
#   ej: bash scripts/render-parte.sh Video3 1 0 2927
# Total de cuadros: npx remotion compositions src/index.ts  (dividir en 3 partes iguales)
cd "$(dirname "$0")/.."
npx remotion render src/index.ts "$1" "out/$1-part$2.mp4" --frames="$3-$4" --muted \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell \
  --gl=swangle --concurrency=4 --video-bitrate=6M --x264-preset=medium --overwrite && echo "PART$2-DONE"
