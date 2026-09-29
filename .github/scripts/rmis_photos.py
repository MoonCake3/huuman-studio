"""Download chosen Wikimedia Commons photos for Rum mitt i stan as optimised WebP (paced, with backoff)."""
import io, json, os, time, urllib.error, urllib.parse, urllib.request
from PIL import Image, ImageOps

OUT = "rum-mitt-i-stan/img"
os.makedirs(OUT, exist_ok=True)
UA = "HuumanStudioPhotos/1.0 (https://github.com/MoonCake3/huuman-studio; marketing site build)"

# Commons file -> [(output name, width)]
PHOTOS = {
    "Grebbestad - panoramio.jpg": [("town-2560", 2560)],
    "SYCanica-Grebbestad.JPG": [("g-sail", 1400)],
    "Ocean Surveyor moored in Grebbestad-Sweden 070612.JPG": [("g-church", 1400)],
    "Övre långgatan, Grebbestad.jpg": [("g-ovre", 1400)],
    "Nedre Långgatan, Grebbestad.jpg": [("g-nedre", 1400)],
    "Hus i Grebbestad.jpg": [("g-redhouse", 1400)],
    "Grebbestadsbrygga.jpg": [("g-jetty", 1400)],
    "Schweden Tanumshedge Strand (3).jpg": [("g-marina", 1400)],
    "Stugor, Tanumsstrand.jpg": [("g-cottages", 1400)],
}


def get(url):
    for attempt in range(8):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=90) as r:
                data = r.read()
            time.sleep(3)
            return data
        except urllib.error.HTTPError as e:
            if e.code not in (429, 503):
                raise
            wait = int(e.headers.get("Retry-After") or 0) or 10 * (attempt + 1)
            print(f"{e.code}, waiting {wait}s")
            time.sleep(wait)
    raise RuntimeError("gave up on " + url)


info = json.loads(get("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({
    "action": "query", "format": "json", "formatversion": "2", "prop": "imageinfo",
    "iiprop": "url", "iiurlwidth": "2560", "titles": "|".join("File:" + t for t in PHOTOS)})))
for page in info["query"]["pages"]:
    title = page["title"][5:]
    if "imageinfo" not in page:
        print("MISSING", title)
        continue
    ii = page["imageinfo"][0]
    img = ImageOps.exif_transpose(Image.open(io.BytesIO(get(ii.get("thumburl") or ii["url"])))).convert("RGB")
    for name, width in PHOTOS[title]:
        im = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS) if img.width > width else img
        im.save(f"{OUT}/{name}.webp", "WEBP", quality=80, method=6)
        print("ok", name, im.size)
