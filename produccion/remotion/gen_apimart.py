"""Genera escenas con Nano Banana 2 (APIMart) usando la hoja de personajes como referencia.
Uso: python3 gen_apimart.py escenas.json   (la clave la inyecta el proxy del entorno)
escenas.json = [{"id": "e13", "prompt": "..."}, ...]
"""
import json, sys, time, os, urllib.request

API = "https://api.apimart.ai/v1"
OUT = os.environ.get("OUT_DIR", os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "escenas"))
REFS = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "refs.json")))
STYLE = ("16:9 landscape scene in EXACTLY the same warm hand-drawn 2D cartoon style as the reference images "
         "(clean dark outlines, soft flat colors with gentle shading, detailed backgrounds). "
         "Characters must match the reference character sheet exactly: TÚ = young man, messy brown hair, plain grey hoodie, jeans, worn white sneakers; "
         "MARCOS = slicked black hair, black sunglasses, thin gold chain, colorful geometric patterned shirt, dark trousers, gold watch. "
         "No brand logos, no readable text unless specified, no watermark. Scene: ")


STYLE = os.environ.get("STYLE_OVERRIDE", STYLE)
if os.environ.get("REFS_URLS"): REFS = os.environ["REFS_URLS"].split(",")
if os.environ.get("REFS_N"): REFS = REFS[:int(os.environ["REFS_N"])]


def req(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(API + path, data=data, method=method, headers={"Content-Type": "application/json", "Authorization": "Bearer proxy-injected"})
    with urllib.request.urlopen(r, timeout=120) as resp:
        return json.loads(resp.read())


def submit(prompt):
    body = {"model": "gemini-3.1-flash-image-preview", "prompt": STYLE + prompt, "size": "16:9", "resolution": "2K", "n": 1, "image_urls": REFS}
    return req("POST", "/images/generations", body)["data"][0]["task_id"]


def find_url(obj):
    if isinstance(obj, str) and obj.startswith("http"):
        return obj
    if isinstance(obj, dict):
        for k in ("url", "urls", "image_url", "images", "result", "data", "output"):
            if k in obj:
                u = find_url(obj[k])
                if u: return u
        for v in obj.values():
            u = find_url(v)
            if u: return u
    if isinstance(obj, list):
        for v in obj:
            u = find_url(v)
            if u: return u
    return None


def main(path):
    os.makedirs(OUT, exist_ok=True)
    scenes = [s for s in json.load(open(path)) if not os.path.exists(os.path.join(OUT, s["id"] + ".png"))]
    tasks = {}
    for s in scenes:
        try:
            tasks[s["id"]] = submit(s["prompt"]); print("enviado", s["id"], flush=True)
        except Exception as e:
            print("ERROR envio", s["id"], e, flush=True)
        time.sleep(1.5)
    pending = dict(tasks)
    t0 = time.time()
    while pending and time.time() - t0 < 1500:
        time.sleep(8)
        for sid, tid in list(pending.items()):
            try:
                st = req("GET", f"/tasks/{tid}")
            except Exception as e:
                print("poll err", sid, e, flush=True); continue
            d = st.get("data", st)
            status = str(d.get("status", "")).lower()
            if status in ("completed", "succeeded", "success", "finished"):
                url = find_url(d.get("result", d))
                urllib.request.urlretrieve(url, os.path.join(OUT, sid + ".png"))
                print("listo", sid, flush=True); pending.pop(sid)
            elif status in ("failed", "error", "cancelled"):
                print("FALLÓ", sid, json.dumps(d)[:300], flush=True); pending.pop(sid)
    print("pendientes:", list(pending), flush=True)


if __name__ == "__main__":
    main(sys.argv[1])
