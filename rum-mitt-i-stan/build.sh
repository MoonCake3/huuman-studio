#!/bin/sh
# Vercel build: copy the site into public/ and pull the scenery photos from Unsplash,
# so the live site serves its own optimised images instead of hotlinking.
set -u
OUT=public
rm -rf "$OUT"
mkdir -p "$OUT/img"
cp index.html style.css app.js motion.js favicon.svg "$OUT/"

missing=0
# Resolve an Unsplash photo id to its images.unsplash.com base URL
base_url() {
  loc=$(curl -sS -o /dev/null -w '%{redirect_url}' "https://unsplash.com/photos/$1/download?force=true")
  echo "${loc%%\?*}"
}
# fetch <id> <name> <width> [extra params]
fetch() {
  b=$(base_url "$1")
  if [ -z "$b" ]; then echo "MISSING $2 ($1): no redirect"; missing=$((missing + 1)); return; fi
  ext=webp; fmt="fm=webp"
  case "${4:-}" in *fm=jpg*) ext=jpg; fmt="" ;; esac
  url="$b?w=$3&q=78${fmt:+&$fmt}${4:+&$4}"
  if curl -fsSL "$url" -o "$OUT/img/$2.$ext"; then
    echo "ok $2.$ext $(wc -c < "$OUT/img/$2.$ext") bytes  <- $b"
  else
    echo "MISSING $2 ($1): download failed"; missing=$((missing + 1))
  fi
}

fetch tVqQSfXQ_SI hero-1080 1080
fetch tVqQSfXQ_SI hero-1920 1920
fetch tVqQSfXQ_SI hero-2800 2800
fetch tVqQSfXQ_SI og 1200 "h=630&fit=crop&fm=jpg"
fetch blUOsKcRk2Q house 1400
fetch Uxtsu5i_msE room-double 1200
fetch asXNM_n2jNM room-twin 1200
fetch B2RKwf2IaJU room-triple 1200
fetch KPjPeNFLVns room-bunk 1200
fetch 8qNuR1lIv_k room-four 1200
fetch M938IAHCX_k harbour 2400
fetch GZBImaVAQYc oysters 1200
fetch ca0iXBA7AZc boathouse 1200
fetch O79o-5hEO6g swim 1200
fetch eUeK1pD7fH0 sunset 1200
fetch uwbajDCODj4 pier 2400

echo "photos missing: $missing"
exit 0
