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
media, texts = [], []
for ts, original in pages[:25]:
    html = get(f"https://web.archive.org/web/{ts}id_/{original}")
    texts.append(f"===== {ts} {original}\n" + re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", html)))[:4000])
    for m in re.findall(r"static\.wixstatic\.com/media/([A-Za-z0-9_]+~mv2(?:_d_\d+_\d+_s_\d+_\d+)?\.(?:jpg|jpeg|png|webp))", html, re.I):
        if m not in media:
            media.append(m)
    for m in re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(?:se|com|nu)", html):
        texts.append("EMAIL " + m)
    time.sleep(1)
open(f"{OUT}/owner-site.txt", "w").write("\n\n".join(texts))
print("media:", len(media))
found = []
for i, m in enumerate(media[:80]):
    key = f"o{i:02d}"
    live = f"https://static.wixstatic.com/media/{m}/v1/fit/w_600,h_600,q_80/t.jpg"
    data = get(live, binary=True, tries=2)
    src = "live"
    if len(data) < 2000:
        data = get(f"https://web.archive.org/web/2024id_/https://static.wixstatic.com/media/{m}", binary=True, tries=2)
        src = "archive"
    if len(data) > 2000:
        open(f"{OUT}/owner/{key}.jpg", "wb").write(data)
        found.append({"key": key, "media": m, "source": src, "bytes": len(data)})
json.dump({"pages": pages, "owner": found}, open(f"{OUT}/manifest.json", "w"), indent=1)
print("owner photos:", len(found))
