# Flecha de miniatura "dibujada a mano": una sola curva (Bézier cuadrática), trazo grueso y liso,
# punta grande alineada con el final de la curva, contorno negro y sombra suave.
#   flecha(img, inicio, control, punta, color, w=20)
# Reglas: arrancar SEPARADA de la etiqueta (~15 px) y terminar en el BORDE del objeto
# (nunca en el vacío ni encima de la cara).
import math
from PIL import Image, ImageDraw, ImageFilter

S = 4  # se dibuja a 4x y se achica: bordes lisos, sin "dientes"


def _bez(p0, p1, p2, n=400):
    return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
             (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]) for t in [i / n for i in range(n + 1)]]


def _trazo(d, pts, r, col):
    # trazo continuo: un círculo en cada punto (sin uniones visibles)
    for x, y in pts:
        d.ellipse([x - r, y - r, x + r, y + r], fill=col)


def flecha(im, p0, p1, p2, color, w=20, borde=7):
    W, H = im.size
    sc = lambda p: (p[0] * S, p[1] * S)
    pts = _bez(sc(p0), sc(p1), sc(p2))
    ww, bb = w * S, borde * S
    hl, hw = ww * 2.4, ww * 1.9          # largo y medio ancho de la punta
    tip = pts[-1]
    # punto de la curva a distancia hl de la punta → la punta apunta en esa dirección exacta
    base = next(p for p in reversed(pts) if math.dist(p, tip) >= hl)
    a = math.atan2(tip[1] - base[1], tip[0] - base[0])
    nx, ny = -math.sin(a), math.cos(a)
    head = [tip, (base[0] + hw * nx, base[1] + hw * ny), (base[0] - hw * nx, base[1] - hw * ny)]
    body = [p for p in pts if math.dist(p, tip) >= hl * 0.7]   # se mete un poco dentro de la punta

    def capa(col_borde, col_relleno, off=(0, 0)):
        L = Image.new('RGBA', (W * S, H * S), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
        o = lambda p: (p[0] + off[0] * S, p[1] + off[1] * S)
        b = [o(p) for p in body]; h = [o(p) for p in head]
        if col_borde:
            _trazo(d, b, ww / 2 + bb, col_borde)
            d.polygon(h, fill=col_borde)
            d.line(h + [h[0]], fill=col_borde, width=int(bb * 2), joint='curve')
            for x, y in h:
                d.ellipse([x - bb, y - bb, x + bb, y + bb], fill=col_borde)
        if col_relleno:
            _trazo(d, b, ww / 2, col_relleno)
            d.polygon(h, fill=col_relleno)
        return L.resize((W, H), Image.LANCZOS)

    sombra = capa((0, 0, 0, 140), None, (5, 7)).filter(ImageFilter.GaussianBlur(5))
    im.alpha_composite(sombra)
    im.alpha_composite(capa((0, 0, 0, 255), tuple(color) + (255,)))
