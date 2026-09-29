"""Find the owners' own photos of Rum mitt i stan in Internet Archive copies of rummittistan.se."""
import json, os, re, time, urllib.parse, urllib.request

OUT = ".github/rmis-scout"
os.makedirs(f"{OUT}/owner", exist_ok=True)
UA = "HuumanStudioScout/1.0 (https://github.com/MoonCake3/huuman-studio)"


def get(url, binary=False, tries=4):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                d = r.read()
            return d if binary else d.decode("utf-8", "replace")
        except Exception as e:
            print("retry", i, url[:120], e)
            time.sleep(4 * (i + 1))
    return b"" if binary else ""


cdx = get("https://web.archive.org/cdx/search/cdx?" + urllib.parse.urlencode({
    "url": "rummittistan.se", "matchType": "domain", "output": "json", "filter": "statuscode:200",
    "collapse": "urlkey", "limit": "200"}))
rows = json.loads(cdx)[1:] if cdx.strip().startswith("[") else []
print("captures:", len(rows))
pages = [(r[1], r[2]) for r in rows if "text/html" in r[3]]
imgs, seen = [], set()
for ts, original in pages[:25]:
    if "wp-login" in original or "favicon" in original:
        continue
    html = get(f"https://web.archive.org/web/{ts}id_/{original}")
    cands = re.findall(r'(?:src|href|data-src|content)="([^"]+\.(?:jpe?g|png|webp)[^"]*)"', html, re.I)
    cands += re.findall(r'(https?:)?//static\.wixstatic\.com/media/[^"\\\s)]+', html)
    cands += re.findall(r'"uri":"([A-Za-z0-9_]+~mv2[^"]*)"', html)
    for c in cands:
        c = c if isinstance(c, str) else c[0]
        if not c or c in seen:
            continue
        seen.add(c)
        if re.search(r"~mv2", c) and not c.startswith("http") and "wixstatic" not in c:
            c = "https://static.wixstatic.com/media/" + c
        full = urllib.parse.urljoin(original, c)
        if re.search(r"(logo|icon|sprite|avatar|spacer|pixel|gravatar|emoji|button|arrow|bg_|pattern)", full, re.I):
            continue
        imgs.append((ts, full))
    time.sleep(1)
print("image candidates:", len(imgs))
for ts, u in imgs[:120]:
    print("  cand", ts, u[:160])
found = []
for i, (ts, u) in enumerate(imgs[:80]):
    key = f"o{i:02d}"
    data = b""
    if "wixstatic.com/media/" in u:
        mid = re.search(r"media/([^/]+)", u).group(1)
        data = get(f"https://static.wixstatic.com/media/{mid}/v1/fit/w_700,h_700,q_80/t.jpg", binary=True, tries=2)
    if len(data) < 3000:
        data = get(f"https://web.archive.org/web/{ts}im_/{u}", binary=True, tries=2)
    if len(data) > 3000 and data[:3] in (b"\xff\xd8\xff",) or data[:8] == b"\x89PNG\r\n\x1a\n" or data[:4] == b"RIFF":
        ext = "png" if data[:4] == b"\x89PNG" else "jpg"
        open(f"{OUT}/owner/{key}.{ext}", "wb").write(data)
        found.append({"key": key, "url": u, "ts": ts, "bytes": len(data)})
    time.sleep(0.5)
json.dump({"pages": pages, "owner": found}, open(f"{OUT}/manifest.json", "w"), indent=1)
print("owner photos:", len(found))
