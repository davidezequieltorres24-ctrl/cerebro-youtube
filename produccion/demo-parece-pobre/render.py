"""Demo 30 s - Tu Mente Gasta. Animacion 100% por codigo (PIL + ffmpeg).
Uso: python3 render.py  -> demo.mp4
"""
import json, math, subprocess, wave, os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
W, H, SS, FPS = 1280, 720, 2, 30
GAP, END = 0.22, 2.2
BG = (14, 15, 18); WHITE = (245, 243, 238); GREEN = (61, 220, 132); DGREEN = (42, 59, 51)
RED = (255, 59, 48); YEL = (255, 214, 10); PINK = (255, 111, 174); GREY = (140, 145, 150); BLK = (10, 10, 12)
FB = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
FC = "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"

meta = json.load(open(f"{HERE}/audio/durs.json"))
durs, caps = meta["durs"], meta["caps"]
starts, t = [], 0.0
for d in durs:
    starts.append(t); t += d + GAP
TOTAL = t + END
mascot = Image.open(f"{HERE}/../../canal/assets/logo-v2-800.png").convert("RGB")

def font(p, s): return ImageFont.truetype(p, int(s * SS))
def clamp(x): return max(0.0, min(1.0, x))
def ease(x): x = clamp(x); return 1 - (1 - x) ** 3
def back(x):
    x = clamp(x); c = 1.70158
    return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2

class Ctx:
    def __init__(s): s.im = Image.new("RGB", (W * SS, H * SS), BG); s.d = ImageDraw.Draw(s.im)
    def P(s, v): return int(v * SS)
    def line(s, a, b, c=WHITE, w=6): s.d.line([s.P(a[0]), s.P(a[1]), s.P(b[0]), s.P(b[1])], fill=c, width=s.P(w))
    def ell(s, cx, cy, r, fill=None, out=BLK, w=5):
        s.d.ellipse([s.P(cx - r), s.P(cy - r), s.P(cx + r), s.P(cy + r)], fill=fill, outline=out, width=s.P(w))
    def rr(s, x0, y0, x1, y1, r, fill, out=BLK, w=5):
        s.d.rounded_rectangle([s.P(x0), s.P(y0), s.P(x1), s.P(y1)], s.P(r), fill=fill, outline=out, width=s.P(w))
    def poly(s, pts, fill, out=BLK, w=5):
        s.d.polygon([(s.P(x), s.P(y)) for x, y in pts], fill=fill, outline=out, width=s.P(w))
    def text(s, x, y, txt, size, c=WHITE, fp=FB, anchor="mm", stroke=6, sc=BLK):
        s.d.text((s.P(x), s.P(y)), txt, font=font(fp, size), fill=c, anchor=anchor, stroke_width=s.P(stroke), stroke_fill=sc)

# ---------- personajes / objetos ----------
def person(c, x, y, k=1.0, hoodie=False, cool=False, smile=True, sad=False):
    hr = 34 * k; hy = y - 150 * k
    if hoodie:
        c.rr(x - 42 * k, hy + 28 * k, x + 42 * k, y - 50 * k, 22 * k, (128, 132, 138))
        c.ell(x, hy, hr + 9 * k, fill=(128, 132, 138))
    c.ell(x, hy, hr, fill=WHITE)
    if not hoodie: c.line((x, hy + hr), (x, y - 50 * k), WHITE, 7 * k)
    c.line((x, y - 50 * k), (x - 26 * k, y), WHITE, 7 * k); c.line((x, y - 50 * k), (x + 26 * k, y), WHITE, 7 * k)
    if not hoodie:
        c.line((x, hy + 60 * k), (x - 34 * k, hy + 105 * k), WHITE, 7 * k); c.line((x, hy + 60 * k), (x + 34 * k, hy + 100 * k), WHITE, 7 * k)
    if cool:
        c.rr(x - 26 * k, hy - 10 * k, x - 3 * k, hy + 6 * k, 5 * k, BLK); c.rr(x + 3 * k, hy - 10 * k, x + 26 * k, hy + 6 * k, 5 * k, BLK)
        for i in range(7):
            a = math.pi * (0.15 + 0.7 * i / 6)
            c.ell(x + math.cos(a) * 30 * k, hy + 52 * k + math.sin(a) * 20 * k, 6 * k, fill=YEL, w=2)
    else:
        c.ell(x - 11 * k, hy - 4 * k, 4 * k, fill=BLK, w=1); c.ell(x + 11 * k, hy - 4 * k, 4 * k, fill=BLK, w=1)
    if sad: c.d.arc([c.P(x - 12 * k), c.P(hy + 10 * k), c.P(x + 12 * k), c.P(hy + 28 * k)], 200, 340, fill=BLK, width=c.P(4 * k))
    elif smile: c.d.arc([c.P(x - 14 * k), c.P(hy + 2 * k), c.P(x + 14 * k), c.P(hy + 20 * k)], 20, 160, fill=BLK, width=c.P(4 * k))

def car(c, x, y, k=1.0, col=GREEN, shine=0.0, used=False):
    c.poly([(x - 120 * k, y - 30 * k), (x - 70 * k, y - 85 * k), (x + 50 * k, y - 85 * k), (x + 100 * k, y - 30 * k)], col)
    c.rr(x - 150 * k, y - 40 * k, x + 150 * k, y + 10 * k, 18 * k, col)
    c.poly([(x - 60 * k, y - 75 * k), (x - 10 * k, y - 75 * k), (x - 10 * k, y - 38 * k), (x - 95 * k, y - 38 * k)], (170, 210, 235), w=3)
    c.poly([(x + 2 * k, y - 75 * k), (x + 45 * k, y - 75 * k), (x + 80 * k, y - 38 * k), (x + 2 * k, y - 38 * k)], (170, 210, 235), w=3)
    for wx in (-90, 90): c.ell(x + wx * k, y + 12 * k, 28 * k, fill=BLK, out=GREY, w=6)
    if used:
        c.line((x - 40 * k, y - 20 * k), (x - 20 * k, y - 5 * k), BLK, 3); c.line((x - 20 * k, y - 5 * k), (x - 30 * k, y + 5 * k), BLK, 3)
    if shine > 0:
        for i in range(5):
            a = i * 1.25 + shine * 3
            r0, r1 = 170 * k, (190 + 25 * math.sin(shine * 8 + i)) * k
            c.line((x + math.cos(a) * r0, y - 40 * k + math.sin(a) * r0 * 0.5), (x + math.cos(a) * r1, y - 40 * k + math.sin(a) * r1 * 0.5), YEL, 6)

def bus(c, x, y, k=1.0):
    c.rr(x - 170 * k, y - 120 * k, x + 170 * k, y + 5 * k, 20 * k, YEL)
    for i in range(4): c.rr(x - 150 * k + i * 78 * k, y - 100 * k, x - 90 * k + i * 78 * k, y - 55 * k, 6 * k, (170, 210, 235), w=3)
    for wx in (-110, 110): c.ell(x + wx * k, y + 8 * k, 26 * k, fill=BLK, out=GREY, w=6)

def vault(c, x, y, k=1.0, open_=1.0, fill_=1.0):
    c.rr(x - 150 * k, y - 300 * k, x + 150 * k, y, 16 * k, DGREEN, out=GREEN, w=8)
    rows = int(8 * fill_)
    for r in range(rows):
        for q in range(4):
            c.rr(x - 125 * k + q * 62 * k, y - 30 * k - r * 33 * k, x - 70 * k + q * 62 * k, y - 8 * k - r * 33 * k, 4 * k, GREEN, w=3)
    dx = 300 * k * (1 - open_) + 20 * k
    c.rr(x + 150 * k - dx, y - 305 * k, x + 150 * k - dx + 300 * k * (1 - open_) + 40 * k * open_, y + 5 * k, 14 * k, GREEN)

def house(c, x, y, k=1.0):
    c.poly([(x - 130 * k, y - 140 * k), (x, y - 240 * k), (x + 130 * k, y - 140 * k)], RED)
    c.rr(x - 110 * k, y - 145 * k, x + 110 * k, y, 6 * k, (230, 225, 210))
    c.rr(x - 25 * k, y - 80 * k, x + 25 * k, y, 4 * k, (120, 85, 60)); c.rr(x - 90 * k, y - 120 * k, x - 45 * k, y - 80 * k, 4 * k, (170, 210, 235), w=3)

def bill(c, x, y, k=1.0, rot=0):
    s = Image.new("RGBA", (c.P(90 * k), c.P(50 * k)), (0, 0, 0, 0)); d = ImageDraw.Draw(s)
    d.rounded_rectangle([0, 0, s.width - 1, s.height - 1], c.P(6 * k), fill=GREEN, outline=BLK, width=c.P(3))
    d.text((s.width // 2, s.height // 2), "$", font=font(FB, 30 * k), fill=DGREEN, anchor="mm")
    s = s.rotate(rot, expand=True, resample=Image.BICUBIC)
    c.im.paste(s, (c.P(x) - s.width // 2, c.P(y) - s.height // 2), s)

# ---------- escenas ----------
def scene(i, lt, c):
    p = lt / durs[i] if i < len(durs) else lt / END
    G = 520  # suelo
    if i == 0:
        a = ease(lt / 0.6)
        col = tuple(int(BG[j] + (WHITE[j] - BG[j]) * a) for j in range(3))
        c.text(640, 330, "Imagina esto…", 78, col, stroke=0)
        for j in range(14):
            ang = j * 0.45 + lt * 0.6; r = 260 + 30 * math.sin(lt * 2 + j)
            c.ell(640 + math.cos(ang) * r, 330 + math.sin(ang) * r * 0.45, 4, fill=GREEN if j % 2 else PINK, out=None)
    elif i == 1:
        cx = 1400 - 760 * ease(lt / 1.0)
        car(c, cx, G - 20, 1.3, shine=lt if lt > 0.9 else 0)
        person(c, 1000, G, 1.35, cool=True)
        if lt > 2.2:
            for j in range(6):
                a = -math.pi / 2 + (j - 2.5) * 0.35; r = 40 + 10 * math.sin(lt * 12 + j)
                c.line((1000 + math.cos(a) * 95, 250 + math.sin(a) * 95), (1000 + math.cos(a) * (95 + r), 250 + math.sin(a) * (95 + r)), YEL, 6)
            c.text(780, 120, "¡WOW!", 64, YEL, stroke=7)
    elif i in (2, 3, 4):
        car(c, 900, G - 20, 1.05); person(c, 1110, G, 1.3, cool=True)
        bx = -300 + 470 * ease(lt / 1.0) if i == 2 else 170
        bus(c, bx, G - 20, 0.9)
        person(c, 450, G, 1.35, hoodie=True, sad=(i == 3))
        if i == 2 and lt > 1.4:
            c.text(450, 160, "MISMA SUDADERA", 40, YEL, fp=FB, stroke=6)
            c.line((450, 185), (450, 250), YEL, 6)
        if i == 3:
            yy = 60 + 70 * ease(lt / 0.8)
            c.poly([(420, yy - 40), (480, yy - 40), (480, yy + 20), (510, yy + 20), (450, yy + 80), (390, yy + 20), (420, yy + 20)], RED)
            c.text(700, 110, "PERDIENDO", 64, RED, stroke=8)
        if i == 4:
            s = back(lt / 0.6)
            c.text(700, 270, "?", 260 * max(s, 0.01), YEL, stroke=12)
    elif i == 5:
        c.text(640, 95, "¿QUÉ HARÍAS TÚ?", 70, WHITE, stroke=8)
        for j, (lab, x) in enumerate((("AUTO NUEVO", 380), ("GUARDARLO", 900))):
            s = back((lt - 0.25 * j) / 0.5)
            if s <= 0: continue
            hl = (int(lt * 2.5) % 2 == j) and lt > 1.0
            c.rr(x - 200 * s, 360 - 170 * s, x + 200 * s, 360 + 170 * s, 26 * s, DGREEN if not hl else (60, 90, 75), out=GREEN if hl else WHITE, w=6)
            if s > 0.6:
                if j == 0: car(c, x, 370, 0.85 * s, col=GREEN)
                else: vault(c, x, 440, 0.5 * s, open_=1, fill_=1)
                c.text(x, 485, lab, 44, WHITE, stroke=6)
    elif i == 6:
        s = back(lt / 0.6)
        c.rr(640 - 150 * s, 330 - 190 * s, 640 + 150 * s, 330 + 190 * s, 14 * s, (60, 70, 140), out=WHITE, w=6)
        if s > 0.7:
            c.text(640, 250, "EL", 36, WHITE, stroke=0); c.text(640, 300, "MILLONARIO", 40, WHITE, stroke=0)
            c.text(640, 350, "DE AL LADO", 40, WHITE, stroke=0)
            c.text(640, 445, "Stanley & Danko", 26, (200, 205, 230), fp=FC, stroke=0)
        y = 140 if lt < 0.4 else 140
        c.text(640, y - 60 + 30 * ease(lt / 0.5), "1996", 90, YEL, stroke=8)
        for j, x in enumerate((330, 950)):
            if lt > 1.5 + 0.4 * j:
                c.ell(x, 350, 55, fill=None, out=WHITE, w=10); c.line((x + 40, 390), (x + 95, 445), WHITE, 14)
    elif i == 7:
        house(c, 260, G, 1.25 * ease(lt / 0.6))
        if lt > 0.5: car(c, 640, G - 20, 1.1, col=(150, 160, 150), used=True)
        if lt > 0.9:
            person(c, 1030, G, 1.35, hoodie=True)
            c.text(1030, 175 - 15 * back((lt - 0.9) / 0.5), "MILLONARIO", 56, GREEN, stroke=8)
    elif i == 8:
        car(c, 930, G - 20, 1.3, shine=lt)
        person(c, 260, G, 1.35, cool=True, smile=False)
        for j in range(7):
            q = clamp((lt - 0.25 * j) / 1.3)
            if q <= 0 or q >= 1: continue
            x = 300 + (880 - 300) * q; y = 330 - 200 * math.sin(math.pi * q)
            bill(c, x, y, 1.0, rot=q * 360 + j * 40)
        n = max(0, 5 - int(lt * 2))
        c.text(260, 120, "$" * n if n else "$0", 72, GREEN if n else RED, stroke=8)
    elif i == 9:
        o = ease((lt - 1.6) / 1.2)
        vault(c, 820, G, 1.35, open_=o, fill_=1)
        person(c, 380, G, 1.4, hoodie=True)
        if lt > 2.6: c.text(380, 120, "GANANDO", 68, GREEN, stroke=9)
    else:
        s = back(lt / 0.6)
        if s > 0:
            m = mascot.resize((c.P(280 * s), c.P(280 * s)))
            mk = Image.new("L", m.size, 0); ImageDraw.Draw(mk).ellipse([0, 0, m.width - 1, m.height - 1], fill=255)
            c.im.paste(m, (c.P(640) - m.width // 2, c.P(290) - m.height // 2), mk)
        if lt > 0.4:
            c.d.text((c.P(640), c.P(495)), "TU MENTE ", font=font(FB, 72), fill=WHITE, anchor="rm", stroke_width=c.P(7), stroke_fill=BLK)
            c.d.text((c.P(640), c.P(495)), "GASTA", font=font(FB, 72), fill=GREEN, anchor="lm", stroke_width=c.P(7), stroke_fill=BLK)
        if lt > 0.9: c.text(640, 585, "Suscríbete para no caer en la próxima trampa", 30, (200, 200, 200), fp=FC, stroke=0)

def caption(c, txt, lt):
    fnt = font(FC, 34); words = txt.split(); lines, cur = [], ""
    for w_ in words:
        tst = (cur + " " + w_).strip()
        if c.d.textlength(tst, font=fnt) > c.P(1050) and cur: lines.append(cur); cur = w_
        else: cur = tst
    lines.append(cur)
    y0 = 640 - (len(lines) - 1) * 22
    for k, ln in enumerate(lines):
        c.text(640, y0 + k * 44, ln, 34, WHITE, fp=FC, stroke=6)

def frame(t):
    c = Ctx()
    i = len(durs)
    for j, s in enumerate(starts):
        if t >= s: i = j
    if t >= starts[-1] + durs[-1] + GAP: i = len(durs)
    lt = t - (starts[i] if i < len(durs) else starts[-1] + durs[-1] + GAP)
    scene(i, lt, c)
    if i < len(durs): caption(c, caps[i], lt)
    return c.im.resize((W, H), Image.LANCZOS)

def build_audio(out):
    ws = [wave.open(f"{HERE}/audio/l{i:02d}.wav") for i in range(len(durs))]
    pr = ws[0].getparams(); o = wave.open(out, "wb"); o.setparams(pr)
    sil = b"\x00" * (pr.sampwidth * pr.nchannels) * int(pr.framerate * GAP)
    for w_ in ws: o.writeframes(w_.readframes(w_.getnframes())); o.writeframes(sil)
    o.writeframes(b"\x00" * (pr.sampwidth * pr.nchannels) * int(pr.framerate * END)); o.close()

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:  # preview: python3 render.py 3.5 out.png
        frame(float(sys.argv[1])).save(sys.argv[2]); sys.exit()
    build_audio(f"{HERE}/audio/full.wav")
    n = int(TOTAL * FPS)
    ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                           "-i", f"{HERE}/audio/full.wav", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "fast",
                           "-c:a", "aac", "-b:a", "160k", "-shortest", f"{HERE}/demo.mp4"], stdin=subprocess.PIPE)
    for f in range(n): ff.stdin.write(frame(f / FPS).tobytes())
    ff.stdin.close(); ff.wait(); print("ok", round(TOTAL, 1), "s")
