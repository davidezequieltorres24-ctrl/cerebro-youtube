# Usa el TEXTO REAL del guion para los subtítulos y le pone los tiempos de Whisper.
# Así no salen palabras mal transcriptas ("Kopke", "a perrado"). Los números van en cifras.
# Uso: python3 scripts/alinear_guion.py guion_mostrar.txt words_whisper.json salida.json
import json, re, sys, unicodedata
from difflib import SequenceMatcher
def norm(w):
    w = unicodedata.normalize('NFD', w.lower())
    w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9$]', '', w)
txt = open(sys.argv[1]).read().split()
W = json.load(open(sys.argv[2]))
a = [norm(t) for t in txt]; b = [norm(w['w']) for w in W]
out = [None] * len(txt)
sm = SequenceMatcher(None, a, b, autojunk=False)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal':
        for k in range(i2 - i1): out[i1 + k] = (W[j1 + k]['s'], W[j1 + k]['e'])
    elif tag == 'replace' and i2 > i1:
        s, e = W[j1]['s'], W[j2 - 1]['e']; n = i2 - i1
        for k in range(n): out[i1 + k] = (s + (e - s) * k / n, s + (e - s) * (k + 1) / n)
# palabras sin par: repartir entre vecinos
for i in range(len(out)):
    if out[i] is None:
        p = next((out[j][1] for j in range(i - 1, -1, -1) if out[j]), 0.0)
        q = next((out[j][0] for j in range(i + 1, len(out)) if out[j]), p + 0.3)
        out[i] = (p, max(p + 0.05, min(q, p + 0.3)))
res = [{'w': t, 's': round(s, 2), 'e': round(e, 2)} for t, (s, e) in zip(txt, out)]
json.dump(res, open(sys.argv[3], 'w'), ensure_ascii=False)
eq = sum(i2 - i1 for t, i1, i2, _, _ in sm.get_opcodes() if t == 'equal')
print(f'{len(txt)} palabras del guion · {eq} alineadas exacto ({eq*100//len(txt)} %)')
