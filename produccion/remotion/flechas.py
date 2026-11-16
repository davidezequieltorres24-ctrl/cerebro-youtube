# Flecha de miniatura "dibujada a mano": una sola curva (Bézier cuadrática), trazo grueso,
# punta grande alineada con la curva, contorno negro y sombra. Uso:
#   flecha(img, inicio, control, punta, color, w=22)
# Reglas: arrancar SEPARADA de la etiqueta (~15 px) y terminar en el BORDE del objeto (nunca en el vacío ni encima de la cara).
import math
from PIL import Image, ImageDraw, ImageFilter
def _bez(p0,p1,p2,n=80):
    return [((1-t)**2*p0[0]+2*(1-t)*t*p1[0]+t*t*p2[0],(1-t)**2*p0[1]+2*(1-t)*t*p1[1]+t*t*p2[1]) for t in [i/n for i in range(n+1)]]
def flecha(im,p0,p1,p2,color,w=22):
    W,H=im.size
    pts=_bez(p0,p1,p2)
    tip=pts[-1]; a=math.atan2(tip[1]-pts[-8][1],tip[0]-pts[-8][0])
    hl,hw=w*2.6,w*2.0   # largo y medio ancho de la punta
    base=(tip[0]-hl*math.cos(a),tip[1]-hl*math.sin(a))
    # cortar la línea donde empieza la punta
    body=[p for p in pts if math.dist(p,tip)>hl*0.85]
    head=[tip,(base[0]+hw*math.sin(a),base[1]-hw*math.cos(a)),(base[0]-hw*math.sin(a),base[1]+hw*math.cos(a))]
    def draw(layer,col,extra,off=(0,0)):
        d=ImageDraw.Draw(layer); o=lambda p:(p[0]+off[0],p[1]+off[1])
        d.line([o(p) for p in body],fill=col,width=w+extra,joint='curve')
        r=(w+extra)/2
        for p in (body[0],):
            d.ellipse([o(p)[0]-r,o(p)[1]-r,o(p)[0]+r,o(p)[1]+r],fill=col)
        if extra:
            # punta agrandada para el contorno
            c=((head[0][0]+head[1][0]+head[2][0])/3,(head[0][1]+head[1][1]+head[2][1])/3)
            k=1+extra/(hw*1.3)
            d.polygon([o((c[0]+(x-c[0])*k,c[1]+(y-c[1])*k)) for x,y in head],fill=col)
        else:
            d.polygon([o(p) for p in head],fill=col)
    sh=Image.new('RGBA',(W,H),(0,0,0,0)); draw(sh,(0,0,0,150),12,(5,7)); im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(5)))
    l=Image.new('RGBA',(W,H),(0,0,0,0)); draw(l,(0,0,0,255),12); draw(l,tuple(color)+(255,),0); im.alpha_composite(l)
