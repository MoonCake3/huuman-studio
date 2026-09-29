// Rum mitt i stan · Grebbestad
// Booking requests arrive as an email. The owners reply with price and payment, and payment confirms the room.
(() => {
const BOOKING_EMAIL = "marketingwsean@gmail.com"; // Swap for the owners' inbox before launch
// Web3Forms access key (public form key, delivers straight to BOOKING_EMAIL). Empty = open a prepared email instead.
const WEB3FORMS_KEY = "";
const PHONE = "070-999 70 37";
const GEO = { lat: 58.6917, lng: 11.2525, tz: "Europe/Stockholm" };

const root = document.documentElement;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const q = (s, el = document) => el.querySelector(s);
const qa = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Language ---------- */
const EN = {
  "skip": "Skip to content",
  "nav.rooms": "Rooms", "nav.stay": "The stay", "nav.faq": "Questions", "nav.book": "Book", "nav.bookLong": "Choose dates and book",
  "hero.eyebrow": "Nedre Långgatan 39 · Grebbestad",
  "hero.title": "Summer lives<br><em>in the heart of town.</em>",
  "hero.sub": "Ten bright rooms in the middle of Grebbestad. A stone's throw from the pier, the oysters and the evening sun over the fjord.",
  "hero.cta": "Enquire",
  "book.arrive": "Arrival", "book.depart": "Departure", "book.pick": "Choose dates",
  "intro.eyebrow": "Come on in",
  "intro.text": "A small, family-run guesthouse in the middle of Grebbestad. Park the car, pocket the key and forget about it. The pier, the fish, the ice cream and the sunset over the fjord are all a few minutes' walk away.",
  "facts.rooms": "rooms, each with its own calm", "facts.in": "check-in, check-out 10:30", "facts.oyster": "of Sweden's oysters come from here and Tanum", "facts.car": "cars needed once you are here",
  "house.eyebrow": "The house", "house.title": "Simple, clean <em>and warm.</em>",
  "house.lead": "The rooms are light and bright, with made beds, towels and a TV. The bathrooms are shared, the kitchen is shared, and on the terrace guests happily share tips on tonight's best table on the pier.",
  "house.sign": "Personal service, every summer.",
  "rooms.eyebrow": "The rooms · 10 in all", "rooms.title": "Choose your <em>room in town.</em>",
  "rooms.lead": "From the room for two to the four-bed room for the whole crew. Tell us which one you want in your request and we will hold it for you.",
  "room.double.count": "2 rooms", "room.double.name": "The double room", "room.double.text": "One wide bed for two, morning light and sea air through the window. Our most requested room.", "room.double.beds": "1 double bed",
  "room.twin.count": "1 room", "room.twin.name": "The twin room", "room.twin.text": "Two single beds for friends, colleagues or siblings who each want their own pillow to land on.", "room.twin.beds": "2 single beds",
  "room.triple.count": "3 rooms", "room.triple.name": "The triple room", "room.triple.text": "Room for three, perfect for a small family or friends heading out to the restaurants on the pier.", "room.triple.beds": "3 beds",
  "room.bunk.count": "3 rooms", "room.bunk.name": "The bunk room", "room.bunk.text": "Smart and good value. The kids fight over the top bunk, the grown-ups win more time in the sun.", "room.bunk.beds": "Bunk bed",
  "room.four.count": "1 room", "room.four.name": "The four-bed room", "room.four.text": "Our largest room. The whole party under one roof, right in town.", "room.four.beds": "4 beds", "room.four.guests": "4 guests",
  "room.two": "2 guests", "room.three": "3 guests", "room.pick": "Choose this room",
  "rooms.group.eyebrow": "The whole house", "rooms.group.title": "Coming as <em>a crowd?</em>", "rooms.group.text": "A wedding, a family reunion or a sailing crew. Ask about several rooms or the whole house.", "rooms.group.cta": "Ask about groups",
  "inc.eyebrow": "Included in your stay", "inc.title": "Everything you need. <em>Nothing you don't.</em>",
  "inc.linen": "Made up and ready", "inc.linenT": "Bed linen and towels are included. Bring sunscreen, we take care of the rest.",
  "inc.kitchen": "Shared kitchen", "inc.kitchenT": "Cook the prawns from the fish shop or brew your morning coffee at your own pace.",
  "inc.terrace": "The terrace", "inc.terraceT": "The evening meeting place. A glass, a book, one last moment in the sun.",
  "inc.wifi": "Free wifi", "inc.wifiT": "Fast enough for the postcard on Instagram, if you really must.",
  "inc.tv": "TV and wardrobe", "inc.tvT": "In every room, for rainy afternoons and luggage that somehow grew.",
  "inc.parking": "Parking", "inc.parkingT": "Private parking can be arranged for a fee. Mention it in your request.",
  "inc.note": "Bathrooms are shared between rooms and kept spotless. Check-in from 14:00, check-out by 10:30. Let us know roughly when you expect to arrive.",
  "greb.eyebrow": "The town", "greb.title": "Grebbestad, <em>for real.</em>",
  "greb.lead": "The fishing village that became Sweden's oyster capital. The trawlers still lie in the harbour, the restaurants crowd along the pier and the granite rocks soak up the sun all afternoon.",
  "spot.oyster": "The oysters", "spot.oysterT": "About nine in ten Swedish oysters come from Grebbestad and Tanum. The Oyster Academy is based here, and the season is at its best in the months with an R.",
  "spot.pier": "The pier", "spot.pierT": "Grebbestad's long pier with seafood restaurants, boathouses and boats. All of it a short walk from Nedre Långgatan.",
  "spot.swim": "The morning swim", "spot.swimT": "Smooth rocks, swimming ladders and the sandy beach at Kolholmen a short bike ride away. The North Sea is cold, clear and completely irresistible.",
  "spot.taube": "Otterön and Taube", "spot.taubeT": "The troubadour Evert Taube loved to summer on Otterön, where the song \"Så länge skutan kan gå\" was written. Today the island is a nature reserve with shell banks and orchids.",
  "quote.text": "What do guests mention first? <em>The location.</em> Then the service. Then how clean it is.", "quote.by": "Recurring themes in guest reviews",
  "book.eyebrow": "Book your room", "book.title": "Choose your days. <em>We handle the rest.</em>",
  "step1": "Choose dates", "step1T": "Arrival and departure in the calendar.",
  "step2": "Send your request", "step2T": "It lands straight with us as an email.",
  "step3": "We confirm", "step3T": "We reply personally with price and payment. The room is yours once payment is made.",
  "step4": "Welcome", "step4T": "Check-in from 14:00 at Nedre Långgatan 39.",
  "book.call": "Rather call?",
  "f.guests": "Guests", "f.room": "Room", "opt.any": "No preference", "opt.group": "Several rooms or a group",
  "f.name": "Name", "f.email": "Email", "f.phone": "Phone", "f.optional": "optional", "f.msg": "Message", "f.msgPh": "Parking, late arrival, a question about the oysters…",
  "f.submit": "Send booking request", "f.fine": "The request is free and not binding. Your booking is confirmed once you have our reply and payment is made.", "f.again": "Change request",
  "faq.eyebrow": "Questions and answers", "faq.title": "Good to <em>know.</em>",
  "q1": "How does booking work?", "a1": "Choose your dates and send a request. We check availability and reply personally with the price and how to pay. Once payment is made the room is yours.",
  "q2": "When can I check in and out?", "a2": "Check-in from 14:00 and check-out by 10:30. Let us know roughly when you arrive and we will meet you.",
  "q3": "Do the rooms have a private bathroom?", "a3": "No, bathrooms are shared between rooms. They are cleaned and kept spotless all season, something guests often point out.",
  "q4": "Is there parking?", "a4": "Private parking can be arranged for an extra fee. Mention it in your request and we will reserve a space if one is available.",
  "q5": "Are bed linen and towels included?", "a5": "Yes, in every room. The beds are made when you arrive.",
  "q6": "Can we cook our own food?", "a6": "Absolutely. There is a shared kitchen for guests, and the fish shops in the harbour are a short walk away.",
  "ft.find": "Find us", "ft.map": "Open in maps", "ft.contact": "Contact", "ft.times": "Times", "ft.in": "Check-in 14:00", "ft.out": "Check-out 10:30", "ft.photo": "Photo credits", "ft.photoNote": "Photos from Wikimedia Commons, used under their respective licences. Images have been resized.",
  "dock.label": "Your dates"
};
const UI = {
  sv: {
    pickIn: "Välj ankomstdag", pickOut: "Välj avresedag", nights: n => (n === 1 ? "natt" : "nätter"),
    chosen: n => `${n} ${n === 1 ? "natt" : "nätter"} · klicka för att ändra`,
    prev: "Föregående månad", next: "Nästa månad", langBtn: "Byt språk till engelska",
    menuOpen: "Öppna menyn", menuClose: "Stäng menyn",
    errDates: "Välj både ankomst och avresa i kalendern.", errReq: "Fyll i det här.", errEmail: "Ange en giltig e-postadress.",
    thanksMail: ["Tack! Din förfrågan är på väg.", "Ditt mejlprogram öppnades med förfrågan ifylld. Tryck på skicka där, så svarar vi personligen med pris och betalning."],
    thanksSent: ["Tack! Vi har fått din förfrågan.", "Vi kollar tillgängligheten och svarar personligen med pris och betalning, oftast samma dag."],
    now: t => `${t} i Grebbestad`, sunset: t => `Solnedgång ${t}`,
    guests: n => `${n} ${n === 1 ? "gäst" : "gäster"}`
  },
  en: {
    pickIn: "Choose arrival day", pickOut: "Choose departure day", nights: n => (n === 1 ? "night" : "nights"),
    chosen: n => `${n} ${n === 1 ? "night" : "nights"} · click to change`,
    prev: "Previous month", next: "Next month", langBtn: "Switch language to Swedish",
    menuOpen: "Open menu", menuClose: "Close menu",
    errDates: "Choose both arrival and departure in the calendar.", errReq: "Please fill this in.", errEmail: "Please enter a valid email address.",
    thanksMail: ["Thank you! Your request is on its way.", "Your email app opened with the request filled in. Press send there and we will reply personally with price and payment."],
    thanksSent: ["Thank you! We have your request.", "We check availability and reply personally with price and payment, usually the same day."],
    now: t => `${t} in Grebbestad`, sunset: t => `Sunset ${t}`,
    guests: n => `${n} ${n === 1 ? "guest" : "guests"}`
  }
};
const SV = {};
qa("[data-i18n]").forEach(el => { SV[el.dataset.i18n] ??= el.textContent; });
qa("[data-i18n-html]").forEach(el => { SV[el.dataset.i18nHtml] ??= el.innerHTML; });
qa("[data-i18n-ph]").forEach(el => { SV[el.dataset.i18nPh] ??= el.placeholder; });

let lang = "sv";
try { if (localStorage.getItem("rmis-lang") === "en") lang = "en"; } catch (e) {}
const t = () => UI[lang];
const locale = () => (lang === "sv" ? "sv-SE" : "en-GB");

function applyLang(next, initial) {
  lang = next;
  root.lang = next;
  const dict = next === "en" ? EN : SV;
  if (!initial) document.dispatchEvent(new CustomEvent("rmis:beforelang"));
  qa("[data-i18n]").forEach(el => { const v = dict[el.dataset.i18n]; if (v != null) el.textContent = v; });
  qa("[data-i18n-html]").forEach(el => { const v = dict[el.dataset.i18nHtml]; if (v != null) el.innerHTML = v; });
  qa("[data-i18n-ph]").forEach(el => { const v = dict[el.dataset.i18nPh]; if (v != null) el.placeholder = v; });
  q("[data-lang-toggle]").setAttribute("aria-label", t().langBtn);
  q('[data-cal="prev"]').setAttribute("aria-label", t().prev);
  q('[data-cal="next"]').setAttribute("aria-label", t().next);
  try { localStorage.setItem("rmis-lang", next); } catch (e) {}
  renderCalendar();
  updateSummary();
  tickLive();
  if (!initial) document.dispatchEvent(new CustomEvent("rmis:lang"));
}
q("[data-lang-toggle]").addEventListener("click", () => applyLang(lang === "sv" ? "en" : "sv"));

/* ---------- Photos: fade out gracefully if a remote image fails ---------- */
qa(".ph img").forEach(img => {
  const miss = () => img.classList.add("img-missing");
  if (img.complete && img.naturalWidth === 0 && img.currentSrc) miss();
  img.addEventListener("error", miss);
});

/* ---------- Nav, menu, progress, dock ---------- */
const navWrap = q(".nav-wrap");
const nav = q(".nav");
const burger = q(".burger");
const menu = q("#menu");
const progress = q(".progress");
const dock = q(".dock");
const hero = q(".hero");
const bookSec = q("#boka");
const footer = q(".footer");

function setMenu(open) {
  menu.classList.toggle("open", open);
  menu.setAttribute("aria-hidden", String(!open));
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? t().menuClose : t().menuOpen);
  document.body.style.overflow = open ? "hidden" : "";
}
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
qa("#menu a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); burger.focus(); } });

let lastY = window.scrollY;
let ticking = false;
function onScroll() {
  const y = window.scrollY;
  const heroH = hero.offsetHeight;
  nav.classList.toggle("solid", y > heroH * 0.82);
  const goingDown = y > lastY + 4;
  const goingUp = y < lastY - 4;
  if (y > heroH && goingDown && !menu.classList.contains("open")) navWrap.classList.add("hide");
  else if (goingUp || y < heroH) navWrap.classList.remove("hide");
  lastY = y;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  const bookRect = bookSec.getBoundingClientRect();
  const footRect = footer.getBoundingClientRect();
  const inBook = bookRect.top < innerHeight * 0.85 && bookRect.bottom > innerHeight * 0.2;
  dock.classList.toggle("show", y > heroH * 0.7 && !inBook && footRect.top > innerHeight);
  ticking = false;
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

// Active section in the nav
const sections = ["rummen", "grebbestad", "ingar", "fragor"].map(id => document.getElementById(id));
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    qa(".nav-links a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${en.target.id}`));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach(s => s && sectionObserver.observe(s));

/* ---------- Live clock and tonight's sunset in Grebbestad ---------- */
function sunsetUTC(date) {
  // NOAA sunrise/sunset approximation, official zenith 90.833°
  const rad = Math.PI / 180;
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const N = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start) / 864e5);
  const lngHour = GEO.lng / 15;
  const tt = N + (18 - lngHour) / 24;
  const M = 0.9856 * tt - 3.289;
  let L = M + 1.916 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 282.634;
  L = (L + 360) % 360;
  let RA = Math.atan(0.91764 * Math.tan(L * rad)) / rad;
  RA = (RA + 360) % 360;
  RA += Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90;
  RA /= 15;
  const sinDec = 0.39782 * Math.sin(L * rad);
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.cos(90.833 * rad) - sinDec * Math.sin(GEO.lat * rad)) / (cosDec * Math.cos(GEO.lat * rad));
  if (cosH < -1 || cosH > 1) return null;
  const H = Math.acos(cosH) / rad / 15;
  const T = H + RA - 0.06571 * tt - 6.622;
  const UT = ((T - lngHour) % 24 + 24) % 24;
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) + UT * 36e5);
}
function tickLive() {
  const fmt = new Intl.DateTimeFormat(locale(), { hour: "2-digit", minute: "2-digit", timeZone: GEO.tz });
  const now = new Date();
  const timeEl = q("[data-live-time]");
  const sunEl = q("[data-sunset]");
  if (timeEl) timeEl.textContent = t().now(fmt.format(now));
  const ss = sunsetUTC(now);
  if (sunEl && ss) sunEl.textContent = t().sunset(fmt.format(ss));
}
setInterval(tickLive, 30000);

/* ---------- Calendar ---------- */
const cal = { start: null, end: null, hover: null, view: null };
const today = new Date(); today.setHours(0, 0, 0, 0);
const maxDate = new Date(today.getFullYear(), today.getMonth() + 18, 0);
cal.view = new Date(today.getFullYear(), today.getMonth(), 1);
const monthsEl = q("[data-cal-months]");
const hintEl = q("[data-cal-hint]");
const prevBtn = q('[data-cal="prev"]');
const nextBtn = q('[data-cal="next"]');
const twoUp = matchMedia("(min-width: 768px)");

const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fromIso = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const nightsBetween = (a, b) => Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 864e5);
const same = (a, b) => a && b && a.getTime() === b.getTime();

function renderCalendar() {
  const months = twoUp.matches ? 2 : 1;
  const fmtMonth = new Intl.DateTimeFormat(locale(), { month: "long", year: "numeric" });
  const fmtLabel = new Intl.DateTimeFormat(locale(), { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  // 1 January 2024 was a Monday, so these are Swedish week order
  const fmtDow = new Intl.DateTimeFormat(locale(), { weekday: "short" });
  const dow = Array.from({ length: 7 }, (_, i) => fmtDow.format(new Date(2024, 0, 1 + i)).replace(".", "").slice(0, 2));
  const focused = document.activeElement && document.activeElement.dataset && document.activeElement.dataset.date;
  let html = "";
  for (let m = 0; m < months; m++) {
    const first = new Date(cal.view.getFullYear(), cal.view.getMonth() + m, 1);
    const daysIn = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7;
    html += `<div class="cal-month"><p class="cal-month-name">${fmtMonth.format(first)}</p><div class="cal-grid" role="grid">`;
    html += dow.map(d => `<span class="cal-dow" aria-hidden="true">${d}</span>`).join("");
    for (let i = 0; i < lead; i++) html += `<span class="cal-blank"></span>`;
    for (let d = 1; d <= daysIn; d++) {
      const date = new Date(first.getFullYear(), first.getMonth(), d);
      const disabled = date < today || date > maxDate;
      const cls = ["cal-day"];
      if (same(date, today)) cls.push("today");
      if (same(date, cal.start)) cls.push("start");
      if (same(date, cal.end)) cls.push("end");
      if (cal.start && cal.end && date > cal.start && date < cal.end) cls.push("in-range");
      const pressed = same(date, cal.start) || same(date, cal.end);
      html += `<button type="button" class="${cls.join(" ")}" data-date="${iso(date)}" aria-label="${fmtLabel.format(date)}" aria-pressed="${pressed}"${disabled ? " disabled" : ""} tabindex="-1"><span>${d}</span></button>`;
    }
    html += `</div></div>`;
  }
  monthsEl.innerHTML = html;
  prevBtn.disabled = cal.view <= new Date(today.getFullYear(), today.getMonth(), 1);
  nextBtn.disabled = new Date(cal.view.getFullYear(), cal.view.getMonth() + months, 1) > maxDate;
  // One day in the grid takes focus with Tab; arrows move from there
  const tabTarget = q(".cal-day.start:not(:disabled)", monthsEl) || q(".cal-day.today:not(:disabled)", monthsEl) || q(".cal-day:not(:disabled)", monthsEl);
  if (tabTarget) tabTarget.tabIndex = 0;
  if (focused) { const f = q(`[data-date="${focused}"]`, monthsEl); if (f) { f.tabIndex = 0; f.focus({ preventScroll: true }); } }
  paintPreview();
  hintEl.textContent = !cal.start ? t().pickIn : !cal.end ? t().pickOut : t().chosen(nightsBetween(cal.start, cal.end));
}

function paintPreview() {
  qa(".cal-day.preview", monthsEl).forEach(b => b.classList.remove("preview"));
  if (!cal.start || cal.end || !cal.hover || cal.hover <= cal.start) return;
  qa(".cal-day", monthsEl).forEach(b => {
    const d = fromIso(b.dataset.date);
    if (d > cal.start && d <= cal.hover) b.classList.add("preview");
  });
}

function pickDate(d) {
  if (!cal.start || cal.end || d <= cal.start) { cal.start = d; cal.end = null; }
  else cal.end = d;
  cal.hover = null;
  renderCalendar();
  updateSummary();
  if (cal.start && cal.end) q("[data-err=dates]").textContent = "";
}

monthsEl.addEventListener("click", e => {
  const b = e.target.closest(".cal-day");
  if (!b || b.disabled) return;
  pickDate(fromIso(b.dataset.date));
});
monthsEl.addEventListener("mouseover", e => {
  const b = e.target.closest(".cal-day");
  if (!b || b.disabled) return;
  cal.hover = fromIso(b.dataset.date);
  paintPreview();
});
monthsEl.addEventListener("mouseleave", () => { cal.hover = null; paintPreview(); });
monthsEl.addEventListener("keydown", e => {
  const b = e.target.closest(".cal-day");
  if (!b) return;
  const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
  if (!(e.key in moves)) return;
  e.preventDefault();
  const d = fromIso(b.dataset.date);
  d.setDate(d.getDate() + moves[e.key]);
  if (d < today || d > maxDate) return;
  const months = twoUp.matches ? 2 : 1;
  const lastShown = new Date(cal.view.getFullYear(), cal.view.getMonth() + months, 0);
  if (d < cal.view || d > lastShown) {
    cal.view = new Date(d.getFullYear(), d.getMonth() - (d > lastShown ? months - 1 : 0), 1);
    renderCalendar();
  }
  const target = q(`[data-date="${iso(d)}"]`, monthsEl);
  if (target) { qa(".cal-day", monthsEl).forEach(x => (x.tabIndex = -1)); target.tabIndex = 0; target.focus(); cal.hover = d; paintPreview(); }
});
prevBtn.addEventListener("click", () => { cal.view = new Date(cal.view.getFullYear(), cal.view.getMonth() - 1, 1); renderCalendar(); });
nextBtn.addEventListener("click", () => { cal.view = new Date(cal.view.getFullYear(), cal.view.getMonth() + 1, 1); renderCalendar(); });
twoUp.addEventListener("change", renderCalendar);

function updateSummary() {
  const short = new Intl.DateTimeFormat(locale(), { weekday: "short", day: "numeric", month: "short" });
  const compact = new Intl.DateTimeFormat(locale(), { day: "numeric", month: "short" });
  const pick = lang === "en" ? EN["book.pick"] : SV["book.pick"];
  const n = cal.start && cal.end ? nightsBetween(cal.start, cal.end) : 0;
  qa('[data-sum="in"]').forEach(el => { el.textContent = cal.start ? (el.closest(".hero-book") ? compact : short).format(cal.start).replace(".", "") : el.closest(".hero-book") ? pick : "—"; });
  qa('[data-sum="out"]').forEach(el => { el.textContent = cal.end ? (el.closest(".hero-book") ? compact : short).format(cal.end).replace(".", "") : "—"; });
  qa('[data-sum="nights"]').forEach(el => (el.textContent = n));
  qa('[data-sum="nightsLabel"]').forEach(el => (el.textContent = t().nights(n)));
  qa('[data-sum="range"]').forEach(el => {
    el.textContent = cal.start && cal.end ? `${compact.format(cal.start)} – ${compact.format(cal.end)}`.replace(/\./g, "") : cal.start ? `${compact.format(cal.start)} – …`.replace(/\./g, "") : pick;
  });
}

/* ---------- Rooms gallery progress (native sideways scroll on phones and tablets) ---------- */
const roomsTrack = q(".rooms-track");
const roomsBar = q(".rooms-progress i");
roomsTrack.addEventListener("scroll", () => {
  if (roomsTrack.classList.contains("pinned")) return;
  const max = roomsTrack.scrollWidth - roomsTrack.clientWidth;
  roomsBar.style.transform = `scaleX(${0.1 + (max > 0 ? roomsTrack.scrollLeft / max : 0) * 0.9})`;
}, { passive: true });

/* ---------- Room choice shortcuts ---------- */
const roomSel = q("#f-room");
const guestsIn = q("#f-guests");
const capacity = { double: 2, twin: 2, triple: 3, bunk: 2, four: 4, group: 6 };
function goToBooking(focusCalendar) {
  const lenis = window.rmisLenis;
  if (lenis) lenis.scrollTo(bookSec, { duration: 1.8, offset: -40, easing: x => 1 - Math.pow(1 - x, 4) });
  else bookSec.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  if (focusCalendar) setTimeout(() => { const d = q(".cal-day[tabindex='0']", monthsEl); d && d.focus({ preventScroll: true }); }, reduceMotion ? 50 : 1300);
}
qa("[data-room]").forEach(b => b.addEventListener("click", () => {
  roomSel.value = b.dataset.room;
  guestsIn.value = capacity[b.dataset.room] || guestsIn.value;
  roomSel.closest(".field").animate?.([{ transform: "scale(1)" }, { transform: "scale(1.03)" }, { transform: "scale(1)" }], { duration: 700, delay: 900, easing: "cubic-bezier(0.32,0.72,0,1)" });
  goToBooking(true);
}));
qa("[data-book-open]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); goToBooking(true); }));
qa("[data-step]").forEach(b => b.addEventListener("click", () => {
  const v = Math.min(20, Math.max(1, (parseInt(guestsIn.value, 10) || 1) + Number(b.dataset.step)));
  guestsIn.value = v;
}));

/* ---------- Booking request ---------- */
const form = q("#book-form");
const fieldsBox = q(".book-fields", form);
const thanks = q(".book-thanks", form);
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function check(field) {
  const input = q("input, select, textarea", field);
  const err = q(".err", field);
  if (!err) return true;
  let msg = "";
  if (input.required && !input.value.trim()) msg = t().errReq;
  else if (input.type === "email" && input.value && !emailRe.test(input.value.trim())) msg = t().errEmail;
  field.classList.toggle("invalid", !!msg);
  input.setAttribute("aria-invalid", String(!!msg));
  err.textContent = msg;
  return !msg;
}
qa(".field", form).forEach(f => {
  const input = q("input, select, textarea", f);
  input.addEventListener("blur", () => { if (input.value) check(f); });
  input.addEventListener("input", () => { if (f.classList.contains("invalid")) check(f); });
});

form.addEventListener("submit", async e => {
  e.preventDefault();
  const datesOk = !!(cal.start && cal.end);
  q("[data-err=dates]").textContent = datesOk ? "" : t().errDates;
  const fields = qa(".field", form);
  const ok = fields.map(check).every(Boolean);
  if (!datesOk) { const d = q(".cal-day[tabindex='0']", monthsEl); d && d.focus(); return; }
  if (!ok) { q("input, select, textarea", fields.find(f => f.classList.contains("invalid"))).focus(); return; }

  const d = Object.fromEntries(new FormData(form));
  const n = nightsBetween(cal.start, cal.end);
  const long = new Intl.DateTimeFormat("sv-SE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const shortSv = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short" });
  const roomName = q(`option[value="${d.room}"]`, roomSel);
  const roomSv = { any: "Spelar ingen roll", double: "Dubbelrummet", twin: "Tvåbäddsrummet", triple: "Trebäddsrummet", bunk: "Våningssängsrummet", four: "Fyrbäddsrummet", group: "Flera rum eller grupp" }[d.room] || (roomName && roomName.textContent);
  const guests = parseInt(d.guests, 10) || 1;
  const sameMonth = cal.start.getMonth() === cal.end.getMonth() && cal.start.getFullYear() === cal.end.getFullYear();
  const span = sameMonth ? `${cal.start.getDate()}–${shortSv.format(cal.end)}` : `${shortSv.format(cal.start)}–${shortSv.format(cal.end)}`;
  const subject = `Bokningsförfrågan · ${span} ${cal.end.getFullYear()} · ${guests} ${guests === 1 ? "gäst" : "gäster"}`.replace(/\./g, "");
  const body = [
    "Hej! Jag vill gärna boka hos Rum mitt i stan.",
    "",
    `Ankomst: ${long.format(cal.start)} (från 14:00)`,
    `Avresa: ${long.format(cal.end)} (senast 10:30)`,
    `Nätter: ${n}`,
    `Gäster: ${guests}`,
    `Rum: ${roomSv}`,
    "",
    `Namn: ${d.name.trim()}`,
    `E-post: ${d.email.trim()}`,
    `Telefon: ${d.phone.trim() || "ej angivet"}`,
    `Språk: ${lang === "sv" ? "svenska" : "engelska"}`,
    "",
    `Meddelande: ${d.message.trim() || "inget"}`,
    "",
    "Skicka gärna pris och betalningsinstruktioner, så bekräftar jag med betalningen."
  ].join("\n");

  const btn = q("button[type=submit]", form);
  let sent = false;
  if (WEB3FORMS_KEY) {
    btn.disabled = true;
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject, from_name: "Rum mitt i stan · bokning", replyto: d.email.trim(), message: body })
      });
      sent = (await res.json()).success === true;
    } catch (err) { sent = false; }
    btn.disabled = false;
  }
  // No key or the service failed: prepare the email in the guest's own mail app
  if (!sent) window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const [title, text] = sent ? t().thanksSent : t().thanksMail;
  q("[data-thanks-title]", thanks).textContent = title;
  q("[data-thanks-text]", thanks).textContent = text;
  const nice = new Intl.DateTimeFormat(locale(), { day: "numeric", month: "long" });
  q("[data-thanks-sum]", thanks).textContent = `${nice.format(cal.start)} – ${nice.format(cal.end)} · ${t().guests(guests)}`;
  fieldsBox.hidden = true;
  thanks.hidden = false;
  thanks.focus({ preventScroll: true });
  document.dispatchEvent(new CustomEvent("rmis:sent"));
});
q("[data-again]", thanks).addEventListener("click", () => {
  thanks.hidden = true;
  fieldsBox.hidden = false;
  q(".cal-day[tabindex='0']", monthsEl)?.focus();
});

/* ---------- Boot ---------- */
q("[data-year]").textContent = new Date().getFullYear();
applyLang(lang, true);
})();
