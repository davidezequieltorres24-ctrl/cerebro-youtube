from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops, ImageEnhance
import random, math
W,H=1280,720
AB='/home/user/cerebro-youtube/canal/assets/fuentes/ArchivoBlack.ttf'
IB='/usr/share/fonts/opentype/inter/Inter-Bold.otf'; IS='/usr/share/fonts/opentype/inter/Inter-SemiBold.otf'; IX='/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf'
RED=(255,59,48); GREEN=(61,220,132); YEL=(255,214,10); WHITE=(245,243,238)
F=lambda p,s: ImageFont.truetype(p,s)
def bg(tint=(14,16,22)):
    im=Image.new('RGBA',(W,H),tint+(255,)); d=ImageDraw.Draw(im)
    for x in range(0,W,56): d.line([(x,0),(x,H)],fill=(26,29,37,255))
    for y in range(0,H,56): d.line([(0,y),(W,y)],fill=(26,29,37,255))
    v=Image.new('L',(W,H),0); ImageDraw.Draw(v).ellipse([-260,-220,W+260,H+220],fill=255); v=v.filter(ImageFilter.GaussianBlur(170))
    return Image.composite(im,Image.new('RGBA',(W,H),(0,0,0,255)),v)
def finish(im,path):
    rgb=im.convert('RGB'); random.seed(1)
    n=Image.effect_noise((W,H),18).convert('RGB'); rgb=ImageChops.add(rgb,ImageChops.subtract(n,Image.new('RGB',(W,H),(128,128,128))),1,0) if False else Image.blend(rgb,ImageChops.overlay(rgb,n),0.06)
    rgb=ImageEnhance.Contrast(rgb).enhance(1.06); rgb=rgb.filter(ImageFilter.UnsharpMask(2,60,2)); rgb.save(path,quality=93)
def fit(t,font_path,maxw,start):
    s=start
    while s>40 and ImageDraw.Draw(Image.new('L',(1,1))).textlength(t,font=F(font_path,s))>maxw: s-=4
    return F(font_path,s)
def glowtext(im,xy,t,font,fill,glow,anchor='mm',stroke=9,blur=24,strength=1):
    for k in range(strength):
        g=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(g).text(xy,t,font=font,fill=glow+(255,),anchor=anchor,stroke_width=stroke+8,stroke_fill=glow+(255,))
        im.alpha_composite(g.filter(ImageFilter.GaussianBlur(blur)))
    ImageDraw.Draw(im).text(xy,t,font=font,fill=fill,anchor=anchor,stroke_width=stroke,stroke_fill=(0,0,0))
def shadow(im,box,r=30,a=210,blur=26):
    s=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(s).rounded_rectangle(box,r,fill=(0,0,0,a)); im.alpha_composite(s.filter(ImageFilter.GaussianBlur(blur)))
def curve_arrow(im,p0,p1,p2,color,w=18):
    pts=[((1-t)**2*p0[0]+2*(1-t)*t*p1[0]+t*t*p2[0],(1-t)**2*p0[1]+2*(1-t)*t*p1[1]+t*t*p2[1]) for t in [i/50 for i in range(51)]]
    l=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(l)
    a=math.atan2(pts[-1][1]-pts[-5][1],pts[-1][0]-pts[-5][0]); x,y=pts[-1]
    for col,ww,s in (((0,0,0),w+14,70),(color,w,56)):
        d.line(pts,fill=col+(255,),width=ww,joint='curve')
        d.polygon([(x+10*math.cos(a),y+10*math.sin(a)),(x-s*math.cos(a-0.55),y-s*math.sin(a-0.55)),(x-s*math.cos(a+0.55),y-s*math.sin(a+0.55))],fill=col+(255,))
    im.alpha_composite(l.filter(ImageFilter.GaussianBlur(10))); im.alpha_composite(l)
def screen(im,src,dst_box,crop=(0,0,1,1),hue=None):
    a=Image.open(src).convert('RGB'); w,h=a.size; a=a.crop((int(crop[0]*w),int(crop[1]*h),int(crop[2]*w),int(crop[3]*h))).resize((dst_box[2]-dst_box[0],dst_box[3]-dst_box[1]))
    if hue=='red':
        r,g,b=a.split(); a=Image.merge('RGB',(ImageEnhance.Brightness(r).enhance(1.15),g.point(lambda v:v*0.35),b.point(lambda v:v*0.3)))
    base=im.convert('RGB'); x0,y0=max(0,dst_box[0]),max(0,dst_box[1])
    reg=base.crop((x0,y0,x0+a.width,y0+a.height)); a=a.crop((0,0,reg.width,reg.height))
    base.paste(ImageChops.screen(reg,a),(x0,y0)); return base.convert('RGBA')
def app_card(im,box,label,value,vcol=(15,15,15),icon=RED,check=False,size=58):
    x0,y0,x1,y1=box; shadow(im,(x0-6,y0+10,x1+6,y1+18))
    c=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(c)
    d.rounded_rectangle(box,26,fill=(252,252,252,255))
    cy=(y0+y1)//2; d.ellipse([x0+24,cy-34,x0+92,cy+34],fill=icon+(255,))
    d.rounded_rectangle([x0+40,cy-14,x0+76,cy+12],5,outline='white',width=4); d.line([x0+40,cy-4,x0+76,cy-4],fill='white',width=4)
    d.text((x0+112,y0+20),label,font=F(IS,30),fill=(120,120,120))
    d.text((x0+110,y0+52),value,font=F(IB,size),fill=vcol)
    if check:
        tx=x0+112+d.textlength(label,font=F(IS,30))+12; d.ellipse([tx,y0+24,tx+30,y0+54],fill=GREEN); d.line([(tx+7,y0+40),(tx+13,y0+47),(tx+24,y0+32)],fill='white',width=4)
    im.alpha_composite(c)

# ===== D2: $87 → $174 (números que llenan el cuadro + pruebas de app) =====
d=bg(); dr=ImageDraw.Draw(d)
dr.text((270,72),'EFECTIVO',font=F(IX,52),fill=(200,204,212),anchor='mm'); dr.rounded_rectangle([180,104,360,112],4,fill=(150,150,150))
dr.text((905,72),'TARJETA',font=F(IX,52),fill=WHITE,anchor='mm'); dr.rounded_rectangle([800,104,1010,112],4,fill=RED)
glowtext(d,(270,300),'$87',fit('$87',AB,400,260),(236,236,236),(90,90,90),blur=16)
glowtext(d,(905,295),'$174',fit('$174',AB,640,320),(255,96,86),RED,strength=2)
curve_arrow(d,(300,450),(500,610),(690,470),RED)
app_card(d,(40,555,470,670),'Efectivo','-$87,00',icon=(120,120,120),size=54)
app_card(d,(590,555,1040,670),'Pago aprobado','-$174,00',vcol=RED,check=True,size=54)
finish(d,'D2-87-174.jpg')

# ===== E2: gastos que suben + Tú en shock (estilo "820K") =====
e=bg((16,12,14))
random.seed(11); pts=[]; y=650
for i,x in enumerate(range(-30,W+60,40)):
    y=max(30,y-random.uniform(-16,44)-i*0.5); pts.append((x,y))
area=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(area).polygon(pts+[(W+60,H),(-30,H)],fill=(255,59,48,46)); e.alpha_composite(area)
l=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(l).line(pts,fill=RED+(255,),width=13,joint='curve')
e.alpha_composite(l.filter(ImageFilter.GaussianBlur(16))); e.alpha_composite(l)
e=screen(e,'g1.png',(600,0,1280,720),(0.47,0.0,1.0,1.0))
shadow(e,(40,110,640,450),36)
c=Image.new('RGBA',(W,H),(0,0,0,0)); cd=ImageDraw.Draw(c)
cd.rounded_rectangle([40,110,630,440],36,fill=(252,252,252,255))
cd.text((88,140),'Gastos con tarjeta',font=F(IS,40),fill=(115,115,115))
cd.text((82,180),'$1.240',font=F(IB,140),fill=(12,12,12))
cd.ellipse([86,360-6,86+0,360],fill=RED)
cd.rounded_rectangle([88,370,330,422],26,fill=(255,232,230)); cd.polygon([(112,412),(126,382),(140,412)],fill=RED); cd.text((150,396),'este mes',font=F(IB,32),fill=RED,anchor='lm')
e.alpha_composite(c)
finish(e,'E2-gastos-shock.jpg')

# ===== F: estilo Isaac — cara grande + "GASTAS ×2" =====
f=bg((12,12,16))
f=screen(f,'g2.png',(250,120,1030,720),(0.2,0.12,0.8,1.0))
glowtext(f,(640,92),'GASTAS ×2',fit('GASTAS ×2',AB,1180,150),(255,236,150),(255,150,20),stroke=10,blur=26,strength=2)
app_card(f,(30,300,470,420),'Pago aprobado','-$174',vcol=RED,check=True,size=58)
# mini gráfico rojo a la derecha (lejos de la esquina de la duración)
shadow(f,(900,250,1240,520),26)
g=Image.new('RGBA',(W,H),(0,0,0,0)); gd=ImageDraw.Draw(g); gd.rounded_rectangle([900,250,1240,510],26,fill=(252,252,252,255))
gd.text((925,270),'Este mes',font=F(IS,30),fill=(120,120,120))
random.seed(3); pp=[]; yy=480
for i,x in enumerate(range(925,1220,22)): yy=max(330,yy-random.uniform(-6,22)); pp.append((x,yy))
gd.line(pp,fill=RED,width=8,joint='curve'); f.alpha_composite(g)
finish(f,'F-isaac-x2.jpg')
