# Tiempos por palabra con Whisper local. Uso: python3 scripts/tiempos_whisper.py voz.wav src/words-vN.json (wav 16 kHz mono)
import os,sys,json,wave,numpy as np
os.environ['HF_HUB_DISABLE_XET']='1'
from faster_whisper import WhisperModel
m=WhisperModel('small',device='cpu',compute_type='int8')
w=wave.open(sys.argv[1]);a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
segs,_=m.transcribe(a,language='es',word_timestamps=True,condition_on_previous_text=False)
out=[{'w':x.word.strip(),'s':round(x.start,2),'e':round(x.end,2)} for s in segs for x in s.words]
json.dump(out,open(sys.argv[2],'w'),ensure_ascii=False)
print(' '.join(f"{o['w']}@{o['s']}" for o in out))
