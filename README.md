# Signet Arts

Website for Signet Arts (Matt Utsunomiya & Jam Clostre): live fashion portraits and event montages in Los Angeles.

React + TypeScript single-page app built with Vite and deployed to GitHub Pages by `.github/workflows/deploy.yml`.

## Develop

```sh
npm install
npm run dev        # http://localhost:5173/signet-arts/
```

Media (art scans, artist photos, videos) is **not** in the repo. In production it is served from the
Cloudflare R2 bucket `signet-arts` (public URL in the workflow's `VITE_MEDIA_BASE`). For local work either set
`VITE_MEDIA_BASE` in `.env.local`, or regenerate the files into `public/media/` with the pipeline below.

## Media pipeline

Source files live in `assets/raw/` (git-ignored).

```sh
scripts/decode-raw.sh assets/raw /tmp/signet/dec                     # HEIC/JPG/PNG -> lossless PNG
python3 scripts/process-media.py assets/raw /tmp/signet/dec /tmp/signet/out
scripts/upload-media.sh /tmp/signet/out                              # -> R2 (site/ and archive/)
```

`process-media.py` writes:

| Output | Use | Settings |
| --- | --- | --- |
| `archive/<slug>.avif` | full-resolution copies, kept in the bucket | AVIF q88, 4:4:4 chroma |
| `site/<slug>.avif` | display (≤2400px) | AVIF q82, 4:4:4 |
| `site/<slug>-sm.avif` | thumbnails (≤720px) | AVIF q78, 4:4:4 |
| `site/<slug>.mp4` | video (≤1080p) | H.264 CRF 22, AAC |

4:4:4 chroma keeps thin colored ink lines crisp. Copy `out/manifest.json` (trimmed) to `src/data/media.json`
when assets change, and reference new slugs from `src/data/content.ts`.
