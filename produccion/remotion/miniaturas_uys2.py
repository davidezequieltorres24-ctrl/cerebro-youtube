# Miniaturas del video 2 de Universo Y Si (48 h en el Amazonas). Uso: python3 miniaturas_uys2.py
# Dibujos IA en public/uys-2 (mini-d, mini-e, mini-f); texto, etiquetas y flechas por código.
import os, sys
from PIL import Image, ImageDraw, ImageFilter
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from flechas import flecha
src = open(os.path.join(HERE, 'miniaturas_v3.py')).read()
exec(src[:src.index('# ===== D2')])  # bg, glowtext, fit, finish, F, AB, W, H, colores

D = os.path.join(HERE, 'public', 'uys-2')
LG = (57, 255, 20)   # verde flecha
AMA = (255, 214, 10)


def base(nombre):
    im = Image.open(os.path.join(D, nombre)).convert('RGBA').resize((W, int(W * 1536 / 2752)))
    m = Image.new('RGBA', (W, H), (4, 12, 14, 255)); m.alpha_composite(im, (0, (H - im.height) // 2))
    return m


def oscurecer(m, caja, a=190, blur=45):
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse(caja, fill=(0, 0, 0, a))
    m.alpha_composite(sh.filter(ImageFilter.GaussianBlur(blur)))


def vineta(m):
    v = Image.new('L', (W, H), 0); ImageDraw.Draw(v).ellipse([-200, -160, W + 200, H + 160], fill=255)
    return Image.composite(m, Image.new('RGBA', (W, H), (0, 0, 0, 255)), v.filter(ImageFilter.GaussianBlur(120)))


def etiqueta(m, xy, t, size):
    f = F(AB, size); d = ImageDraw.Draw(m)
    d.text((xy[0] + 5, xy[1] + 7), t, font=f, fill=(0, 0, 0, 200), anchor='mm', stroke_width=10, stroke_fill=(0, 0, 0, 200))
    d.text(xy, t, font=f, fill=WHITE, anchor='mm', stroke_width=10, stroke_fill=(0, 0, 0))


def titulo(m, cx, y, clave, resto, ancho, size, col_clave=AMA):
    """'clave' en amarillo + 'resto' en blanco, centrado en cx y ajustado a 'ancho'."""
    f = fit(clave + ' ' + resto, AB, ancho, size); d = ImageDraw.Draw(m)
    wc = d.textlength(clave + ' ', font=f); wr = d.textlength(resto, font=f); x0 = cx - (wc + wr) / 2
    glowtext(m, (x0, y), clave, f, col_clave, (255, 140, 0), anchor='lm', stroke=11, blur=22, strength=2)
    glowtext(m, (x0 + wc, y), resto, f, WHITE, (120, 120, 120), anchor='lm', stroke=11, blur=14)


# 1) Principal: "48 HORAS" + TÚ + ¿JAGUAR? (tercios, mirada hacia la amenaza)
m = base('mini-d.png'); oscurecer(m, [520, -120, 1380, 250]); m = vineta(m)
titulo(m, 900, 115, '48', 'HORAS', 680, 140)
etiqueta(m, (105, 625), 'TÚ', 96)
flecha(m, (120, 560), (105, 470), (176, 422), LG)
etiqueta(m, (905, 600), '¿JAGUAR?', 64)
flecha(m, (830, 555), (740, 525), (766, 432), LG)
finish(m, os.path.join(D, 'uys2-1-48h-jaguar.jpg'))

# 2) Comparación: HORA 1 (feliz, selfie) vs HORA 48 (destruido)
m = base('mini-e.png')
g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
for y in range(0, 150):
    gd.line([(0, y), (W, y)], fill=(0, 0, 0, int(200 * (1 - y / 150))))
m.alpha_composite(g); m = vineta(m)
titulo(m, 318, 62, 'HORA', '1', 400, 92, col_clave=WHITE)
titulo(m, 962, 62, 'HORA', '48', 420, 92, col_clave=WHITE)
# el número clave en color: re-pintar "48" en amarillo
f = fit('HORA 48', AB, 420, 92); d = ImageDraw.Draw(m)
x48 = 962 - d.textlength('HORA 48', font=f) / 2 + d.textlength('HORA ', font=f)
glowtext(m, (x48, 62), '48', f, AMA, (255, 140, 0), anchor='lm', stroke=11, blur=22, strength=2)
flecha(m, (548, 44), (645, 0), (738, 50), LG, w=16)
finish(m, os.path.join(D, 'uys2-2-hora1-hora48.jpg'))

# 3) Hormiga bala gigante + "24 H DE DOLOR" + TÚ
m = base('mini-f.png'); oscurecer(m, [560, -120, 1400, 250]); m = vineta(m)
titulo(m, 925, 105, '24 H', 'DE DOLOR', 660, 130)
etiqueta(m, (105, 625), 'TÚ', 96)
flecha(m, (120, 560), (100, 470), (160, 405), LG)
finish(m, os.path.join(D, 'uys2-3-hormiga-24h.jpg'))
print('ok')
