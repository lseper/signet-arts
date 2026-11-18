"""Encode Signet raw assets.

Outputs (under OUT):
  archive/<slug>.avif            full resolution, q=88 4:4:4  (bucket only, for safekeeping)
  site/<slug>.avif               display, long edge <= 2400, q=82 4:4:4
  site/<slug>-sm.avif            thumbnail, long edge <= 720, q=78 4:4:4
  site/<slug>.mp4                H.264 video (<=1080p), plus site/<slug>-poster.avif
  manifest.json                  slug -> {w, h, kind}
"""
import json, subprocess, sys, pathlib, re
from concurrent.futures import ThreadPoolExecutor

RAW = pathlib.Path(sys.argv[1]); DEC = pathlib.Path(sys.argv[2]); OUT = pathlib.Path(sys.argv[3])
TMP = OUT / "_tmp"
for d in ("archive", "site", "_tmp"): (OUT / d).mkdir(parents=True, exist_ok=True)

def slug(rel):
    s = re.sub(r"^Copy of ", "", pathlib.Path(rel).stem)
    parent = pathlib.Path(rel).parent.name
    s = f"{parent}-{s}".lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

def run(*a): subprocess.run(a, check=True, capture_output=True)

def dims(p):
    o = subprocess.run(["magick", "identify", "-format", "%w %h", f"{p}[0]"], capture_output=True, text=True, check=True).stdout.split()
    return int(o[0]), int(o[1])

def avif(src, dst, q, alpha=False):
    run("avifenc", "-q", str(q), "-s", "4", "-y", "444", "-j", "4", *(["--qalpha", "90"] if alpha else []), str(src), str(dst))

def image(rel):
    s = slug(rel)
    src = DEC / pathlib.Path(rel).with_suffix(".png")
    if not src.exists(): src = RAW / rel
    w, h = dims(src)
    # normalise to 8-bit sRGB PNG once (drops odd grayscale ICC profiles)
    base = TMP / f"{s}.png"
    run("magick", str(src), "-colorspace", "sRGB", "-depth", "8", "-strip", str(base))
    avif(base, OUT / "archive" / f"{s}.avif", 88)
    for suffix, edge, q in (("", 2400, 82), ("-sm", 720, 78)):
        t = TMP / f"{s}{suffix}-r.png"
        run("magick", str(base), "-filter", "Lanczos", "-resize", f"{edge}x{edge}>", str(t))
        avif(t, OUT / "site" / f"{s}{suffix}.avif", q)
    dw, dh = dims(TMP / f"{s}-r.png")
    return s, {"kind": "image", "src": rel, "w": w, "h": h, "dw": dw, "dh": dh}

TRIMS = {"IMG_6020": ("0", "24")}  # 75s concert clip -> first 24s
def video(rel):
    s = slug(rel); src = RAW / rel; stem = pathlib.Path(rel).stem
    ss, t = TRIMS.get(stem, ("0", "60"))
    out = OUT / "site" / f"{s}.mp4"
    run("ffmpeg", "-v", "error", "-y", "-ss", ss, "-t", t, "-i", str(src), "-map", "0:v:0", "-map", "0:a:0?",
        "-vf", "scale='if(gt(iw,ih),min(1920,iw),-2)':'if(gt(iw,ih),-2,min(1920,ih))',format=yuv420p",
        "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-profile:v", "high", "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart", str(out))
    poster = TMP / f"{s}-poster.png"
    run("ffmpeg", "-v", "error", "-y", "-ss", "1", "-i", str(out), "-frames:v", "1", str(poster))
    run("magick", str(poster), "-resize", "1280x1280>", str(poster))
    avif(poster, OUT / "site" / f"{s}-poster.avif", 72)
    w, h = dims(poster)
    return s, {"kind": "video", "src": rel, "w": w, "h": h}

def logo():
    src = RAW / "SignetArts_SCRIPTLOGO.png"
    t = TMP / "logo.png"
    run("magick", str(src), "-trim", "+repage", "-filter", "Lanczos", "-resize", "1600x", str(t))
    avif(t, OUT / "site" / "signet-logo.avif", 85, alpha=True)
    run("magick", str(t), "-resize", "800x", "-quality", "92", str(OUT / "site" / "signet-logo.webp"))
    run("avifenc", "-q", "90", "-s", "4", "-y", "444", "--qalpha", "95", str(src), str(OUT / "archive" / "signet-logo.avif"))
    w, h = dims(t)
    return "signet-logo", {"kind": "image", "src": "SignetArts_SCRIPTLOGO.png", "w": w, "h": h}

if __name__ == "__main__":
    rels = [str(p.relative_to(RAW)) for p in sorted(RAW.rglob("*")) if p.is_file() and "PitchDecks" not in str(p) and p.name != "SignetArts_SCRIPTLOGO.png"]
    imgs = [r for r in rels if r.lower().endswith((".heic", ".heif", ".jpg", ".jpeg", ".png", ".webp"))]
    vids = [r for r in rels if r.lower().endswith(".mov")]
    manifest = {}
    with ThreadPoolExecutor(6) as ex:
        for s, m in ex.map(image, imgs): manifest[s] = m; print("img", s, flush=True)
    for r in vids:
        s, m = video(r); manifest[s] = m; print("vid", s, flush=True)
    s, m = logo(); manifest[s] = m
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1))
    print("done", len(manifest))
