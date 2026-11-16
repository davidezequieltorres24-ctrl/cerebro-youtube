# Une las 3 partes + audio (render aparte en WAV) + volumen a -14 LUFS + copia liviana para el repo.
# Uso: bash scripts/unir.sh <Composicion> <nombre>   ej: bash scripts/unir.sh Video3 video3
# Salida: out/<nombre>-YOUTUBE.mp4 (para subir) y out/<nombre>-repo.mp4 (~15 MB, va a GitHub)
cd "$(dirname "$0")/.."
C="$1"; N="$2"
npx remotion render src/index.ts "$C" "out/$C-audio.wav" --codec=wav \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell --overwrite || exit 1
printf "file '%s-part1.mp4'\nfile '%s-part2.mp4'\nfile '%s-part3.mp4'\n" "$C" "$C" "$C" > "out/$C-list.txt"
ffmpeg -y -loglevel error -f concat -safe 0 -i "out/$C-list.txt" -i "out/$C-audio.wav" -map 0:v -map 1:a -c:v copy \
  -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -movflags +faststart -shortest "out/$N-YOUTUBE.mp4" || exit 1
ffmpeg -y -loglevel error -i "out/$N-YOUTUBE.mp4" -c:v libx264 -preset medium -crf 30 -vf scale=1280:-2 \
  -c:a aac -b:a 96k -movflags +faststart "out/$N-repo.mp4" || exit 1
rm -f "out/$C-part1.mp4" "out/$C-part2.mp4" "out/$C-part3.mp4" "out/$C-audio.wav" "out/$C-list.txt"
echo JOIN-DONE
