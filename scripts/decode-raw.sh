#!/usr/bin/env bash
# Decode every raw image (HEIC/HEIF via ffmpeg, everything else via ImageMagick) to lossless PNG.
# Usage: scripts/decode-raw.sh assets/raw /tmp/signet-decoded
set -euo pipefail
RAW=$(realpath "$1"); OUT=$(realpath -m "$2"); mkdir -p "$OUT"
cd "$RAW"
find . -type f \( -iname '*.heic' -o -iname '*.heif' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) \
  ! -name 'SignetArts_SCRIPTLOGO.png' -print0 | xargs -0 -P 8 -I{} bash -c '
  f="{}"; o="'"$OUT"'/${f#./}"; o="${o%.*}.png"; mkdir -p "$(dirname "$o")"
  case "${f,,}" in *.heic|*.heif) ffmpeg -v error -y -i "$f" -frames:v 1 "$o";; *) magick "$f" -auto-orient "$o";; esac'
