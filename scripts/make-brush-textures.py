import numpy as np, sys
from PIL import Image, ImageFilter
out = sys.argv[1]
def smooth_noise(n, scale, rng, octaves=4):
    r = np.zeros(n)
    for o in range(octaves):
        k = max(2, int(n / (scale / 2**o)))
        pts = rng.standard_normal(k + 2)
        r += np.interp(np.linspace(0, k, n), np.arange(k + 2), pts) / 2**o
    return r
def brush_mask(W, H, seed, inset=0.06, rough=0.016, streak=0.035):
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:H, 0:W]
    # left/right edges vary per row (bristle streaks), top/bottom per column
    def edge(n, along, base):
        e = base + np.clip(smooth_noise(n, n/2.5, rng), -1.6, 1.6) * rough * along
        bristle = rng.random(n)
        bristle = np.convolve(bristle, np.ones(3)/3, 'same')
        e += (bristle ** 6) * streak * along * 3   # occasional deep bristle gaps
        return e
    L = edge(H, W, inset*W); R = edge(H, W, inset*W)
    T = edge(W, H, inset*H*1.2); Bm = edge(W, H, inset*H*1.2)
    m = (x > L[:, None]) & (x < W - R[:, None]) & (y > T[None, :]) & (y < H - Bm[None, :])
    img = Image.fromarray((m * 255).astype(np.uint8))
    # dry-brush speckle near edges
    d = np.minimum.reduce([x - L[:, None], W - R[:, None] - x, y - T[None, :], H - Bm[None, :] - y]).astype(float)
    band = np.clip(1 - d / (0.05 * min(W, H)), 0, 1)
    speck = rng.random((H, W)) < band * 0.35
    a = np.array(img).astype(float)
    a[speck & m] = 0
    img = Image.fromarray(a.astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    return img
for name, (w, h, s) in {'brush-wide': (1600, 1000, 3), 'brush-tall': (1000, 1300, 7), 'brush-square': (1200, 1200, 11)}.items():
    m = brush_mask(w, h, s)
    rgba = Image.new('RGBA', (w, h), (0, 0, 0, 0)); rgba.putalpha(m)
    rgba.save(f'{out}/{name}.png', optimize=True)
# horizontal painted stroke (for underlines / dividers), white with alpha -> recolored by mask in CSS
def stroke(W, H, seed):
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:H, 0:W].astype(float)
    taperL = np.clip(x / (0.12*W), 0, 1) ** 0.6; taperR = np.clip((W - x) / (0.25*W), 0, 1) ** 0.9
    thick = H*0.38 * taperL * taperR
    center = H/2 + smooth_noise(W, W/2, rng, 2)[None, :] * H*0.05
    m = np.abs(y - center) < thick
    # bristle striations along the stroke
    rows = rng.random(H); rows = (rows > 0.22).astype(float)
    fade = np.clip((W - x) / (0.45*W), 0, 1)
    gaps = (rows[:, None] < 0.5) & (rng.random((1, W)) > fade)
    m &= ~gaps
    img = Image.fromarray((m*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    rgba = Image.new('RGBA', (W, H), (0,0,0,0)); rgba.putalpha(img); return rgba
stroke(900, 70, 5).save(f'{out}/stroke.png', optimize=True)
# deckled top edge: opaque below a rough, bristly line
def edge_strip(W, H, seed):
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:H, 0:W]
    line = H*0.6 + np.clip(smooth_noise(W, W/5, rng, 4), -2, 2) * H*0.09
    br = rng.random(W); br = np.convolve(br, np.ones(2)/2, 'same')
    line -= (br ** 10) * H * 0.16
    m = y > line[None, :]
    a = np.where(m, 255, 0).astype(np.uint8)
    speck = (rng.random((H, W)) < 0.25) & (np.abs(y - line[None, :]) < H*0.12)
    a[speck] = 0
    img = Image.fromarray(a).filter(ImageFilter.GaussianBlur(0.7))
    rgba = Image.new('RGBA', (W, H), (0,0,0,0)); rgba.putalpha(img); return rgba
edge_strip(1600, 48, 21).save(f'{out}/edge-top.png', optimize=True)
