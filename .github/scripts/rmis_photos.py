"""Download the chosen Wikimedia Commons photos for Rum mitt i stan and save optimised WebP files."""
import io, json, os, time, urllib.error, urllib.parse, urllib.request
from PIL import Image, ImageOps

OUT = "rum-mitt-i-stan/img"
os.makedirs(OUT, exist_ok=True)
UA = "HuumanStudioPhotos/1.0 (https://github.com/MoonCake3/huuman-studio; marketing site build)"

# Commons file -> list of (output name, width, crop ratio or None)
PHOTOS = {
    "Tanumstrand ved Grebbestad 2016 (3).jpg": [("hero-1080", 1080, None), ("hero-1920", 1920, None), ("hero-2560", 2560, None), ("og", 1200, (1200, 630))],
    "Grebbestad - hamnen.jpg": [("harbour", 2400, None)],
    "Grebbestad - panoramio.jpg": [("town", 1400, None)],
    "Oysters served on ice, with lemon and parsley.jpg": [("oysters", 1400, None)],
    "Schweden Tanumshedge Strand (4).jpg": [("pier", 1400, None)],
    "Schweden Tanumshedge Strand.jpg": [("swim", 1400, None)],
    "Tanumstrand ved Grebbestad 2016 (2).jpg": [("sunset", 1400, None)],
    "Tanumstrand ved Grebbestad 2016.jpg": [("dusk", 2400, None)],
}


def get(url):
    # Wikimedia asks bots to pace themselves: back off on 429 and honour Retry-After
    for attempt in range(8):
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                data = r.read()
            time.sleep(3)
            return data
        except urllib.error.HTTPError as e:
            if e.code not in (429, 503):
                raise
            wait = int(e.headers.get("Retry-After") or 0) or 10 * (attempt + 1)
            print(f"{e.code}, waiting {wait}s: {url[-60:]}")
            time.sleep(wait)
    raise RuntimeError("gave up on " + url)


api = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({
    "action": "query", "format": "json", "formatversion": "2", "prop": "imageinfo",
    "iiprop": "url|extmetadata", "iiurlwidth": "2560", "titles": "|".join("File:" + t for t in PHOTOS)})
info = json.loads(get(api))
credits = []
for page in info["query"]["pages"]:
    title = page["title"][5:]
    ii = page["imageinfo"][0]
    md = ii.get("extmetadata", {})
    img = ImageOps.exif_transpose(Image.open(io.BytesIO(get(ii.get("thumburl") or ii["url"])))).convert("RGB")
    for name, width, crop in PHOTOS[title]:
        im = img
        if crop:
            im = ImageOps.fit(img, crop, Image.LANCZOS, centering=(0.5, 0.55))
            im.save(f"{OUT}/{name}.jpg", "JPEG", quality=84, optimize=True, progressive=True)
        else:
            if im.width > width:
                im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
            im.save(f"{OUT}/{name}.webp", "WEBP", quality=80, method=6)
        print("ok", name, im.size)
    credits.append({"file": title, "page": ii.get("descriptionurl"), "artist": md.get("Artist", {}).get("value"), "license": md.get("LicenseShortName", {}).get("value")})
json.dump(credits, open(".github/rmis-credits.json", "w"), indent=1, ensure_ascii=False)
