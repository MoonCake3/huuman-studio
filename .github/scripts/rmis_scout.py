"""Scout photos for the Rum mitt i stan site.

1. Crawl rummittistan.se (the owners' own site): page text, email addresses, Wix image URLs.
2. Query Wikimedia Commons for freely licensed Grebbestad photos.
Writes thumbnails, a manifest and the page text into .github/rmis-scout/.
"""
import html, json, os, re, sys, urllib.parse, urllib.request

OUT = ".github/rmis-scout"
os.makedirs(f"{OUT}/owner", exist_ok=True)
os.makedirs(f"{OUT}/commons", exist_ok=True)
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36"
BOT_UA = "HuumanStudioScout/1.0 (https://github.com/MoonCake3/huuman-studio; marketing site build)"


def get(url, ua=UA, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": ua, "Accept-Language": "sv,en;q=0.8"})
    with urllib.request.urlopen(req, timeout=40) as r:
        data = r.read()
        return data if binary else data.decode("utf-8", "replace")


def text_of(page):
    page = re.sub(r"(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>", " ", page)
    page = re.sub(r"(?i)<br\s*/?>|</(p|div|h\d|li|section|span)>", "\n", page)
    page = re.sub(r"<[^>]+>", " ", page)
    lines = [re.sub(r"\s+", " ", html.unescape(l)).strip() for l in page.split("\n")]
    out, seen = [], set()
    for l in lines:
        if l and l not in seen:
            seen.add(l)
            out.append(l)
    return "\n".join(out)


manifest = {"owner": [], "commons": [], "emails": [], "pages": []}

# 1. Owner site
site = "https://www.rummittistan.se/"
pages, queue = {}, [site, "https://rummittistan.se/", "http://www.rummittistan.se/", "https://www.rummittistan.se/rum", "https://www.rummittistan.se/kontakt"]
while queue and len(pages) < 20:
    u = queue.pop(0)
    if u in pages:
        continue
    try:
        pages[u] = get(u)
    except Exception as e:
        print("page failed", u, e)
        pages[u] = ""
        continue
    for href in re.findall(r'href="([^"#?]+)"', pages[u]):
        full = urllib.parse.urljoin(u, href)
        if full.startswith(("https://www.rummittistan.se", "https://rummittistan.se")) and not re.search(r"\.(jpg|png|css|js|xml|ico|svg)$", full) and full not in pages and full not in queue:
            queue.append(full)

imgs, texts = [], []
for u, p in pages.items():
    manifest["pages"].append(u)
    texts.append(f"===== {u}\n{text_of(p)}")
    manifest["emails"] += re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", p)
    for m in re.findall(r"https://static\.wixstatic\.com/media/([A-Za-z0-9_]+~mv2\.(?:jpg|jpeg|png|webp))", p, re.I):
        if m not in imgs:
            imgs.append(m)
manifest["emails"] = sorted(set(e for e in manifest["emails"] if not e.endswith((".png", ".jpg", "wixpress.com", "sentry.io"))))
open(f"{OUT}/owner-site.txt", "w").write("\n\n".join(texts))

for i, m in enumerate(imgs[:60]):
    url = f"https://static.wixstatic.com/media/{m}/v1/fit/w_480,h_480,q_80/t.jpg"
    try:
        open(f"{OUT}/owner/o{i:02d}.jpg", "wb").write(get(url, binary=True))
        manifest["owner"].append({"key": f"o{i:02d}", "media": m})
    except Exception as e:
        print("owner img failed", m, e)

# 2. Wikimedia Commons
api = "https://commons.wikimedia.org/w/api.php"


def api_get(params):
    params.update({"format": "json", "formatversion": "2"})
    return json.loads(get(api + "?" + urllib.parse.urlencode(params), ua=BOT_UA))


cats, files = ["Category:Grebbestad"], []
try:
    sub = api_get({"action": "query", "list": "categorymembers", "cmtitle": "Category:Grebbestad", "cmtype": "subcat", "cmlimit": "50"})
    cats += [c["title"] for c in sub["query"]["categorymembers"]]
except Exception as e:
    print("subcats failed", e)
for c in cats:
    try:
        r = api_get({"action": "query", "list": "categorymembers", "cmtitle": c, "cmtype": "file", "cmlimit": "100"})
        files += [m["title"] for m in r["query"]["categorymembers"] if m["title"] not in files]
    except Exception as e:
        print("cat failed", c, e)
print("commons files:", len(files), "cats:", cats)

k = 0
for i in range(0, len(files), 40):
    chunk = files[i:i + 40]
    try:
        r = api_get({"action": "query", "titles": "|".join(chunk), "prop": "imageinfo", "iiprop": "url|size|extmetadata|mime", "iiurlwidth": "480"})
    except Exception as e:
        print("imageinfo failed", e)
        continue
    for pg in r["query"]["pages"]:
        ii = (pg.get("imageinfo") or [{}])[0]
        if ii.get("mime") not in ("image/jpeg", "image/png", "image/webp") or ii.get("width", 0) < 1400:
            continue
        md = ii.get("extmetadata", {})
        entry = {
            "key": f"c{k:03d}", "title": pg["title"], "width": ii["width"], "height": ii["height"],
            "url": ii["url"], "page": ii.get("descriptionurl"),
            "license": md.get("LicenseShortName", {}).get("value"),
            "artist": re.sub(r"<[^>]+>", "", md.get("Artist", {}).get("value", "")).strip(),
            "desc": re.sub(r"<[^>]+>", "", md.get("ImageDescription", {}).get("value", ""))[:160],
        }
        try:
            open(f"{OUT}/commons/{entry['key']}.jpg", "wb").write(get(ii["thumburl"], ua=BOT_UA, binary=True))
            manifest["commons"].append(entry)
            k += 1
        except Exception as e:
            print("thumb failed", pg["title"], e)

json.dump(manifest, open(f"{OUT}/manifest.json", "w"), indent=1, ensure_ascii=False)
print("owner images:", len(manifest["owner"]), "commons images:", len(manifest["commons"]), "emails:", manifest["emails"])
