#!/usr/bin/env bash
# Upload encoded media to the Cloudflare R2 bucket (needs `npx wrangler login` once).
# Usage: scripts/upload-media.sh <encoded-out-dir>   (contains site/ and archive/)
set -euo pipefail
OUT=$(realpath "$1"); BUCKET=signet-arts
upload() {
  local f="$1" key="$2" type
  case "$f" in *.avif) type=image/avif;; *.webp) type=image/webp;; *.mp4) type=video/mp4;; *) type=application/octet-stream;; esac
  npx --yes wrangler@4 r2 object put "$BUCKET/$key" --file "$f" --content-type "$type" \
    --cache-control "public, max-age=31536000, immutable" --remote >/dev/null && echo "ok $key" || echo "FAIL $key"
}
export -f upload; export BUCKET
cd "$OUT"
find site archive -type f \( -name '*.avif' -o -name '*.webp' -o -name '*.mp4' \) | xargs -P 8 -I{} bash -c 'upload "{}" "{}"'
