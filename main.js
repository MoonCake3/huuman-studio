// HUUMAN Studio landing page
const CONTACT_EMAIL = "marketingwsean@gmail.com";
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Phones: let headlines wrap naturally instead of using the desktop line breaks
if (matchMedia("(max-width: 767px)").matches) {
  document.querySelectorAll(".hero-title br, .h2 br").forEach(br => br.remove());
}

// Hero film: silent loop, portrait cut on phones, still image for reduced motion or data saver
(() => {
  const v = document.querySelector(".hero-video");
  if (!v) return;
  const saveData = navigator.connection && navigator.connection.saveData;
  if (reduceMotion || saveData) return;
  v.src = matchMedia("(max-aspect-ratio: 1/1)").matches ? v.dataset.mobile : v.dataset.desktop;
  v.addEventListener("playing", () => v.classList.add("is-playing"), { once: true });
  const p = v.play();
  if (p && p.catch) p.catch(() => {});
})();

// Menu
const burger = document.querySelector(".burger");
const menu = document.getElementById("menu");
function setMenu(open) {
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menu.classList.toggle("open", open);
  menu.setAttribute("aria-hidden", String(!open));
  document.body.style.overflow = open ? "hidden" : "";
}
burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

// Scroll reveal (?still shows everything at once, used for QA screenshots)
if (location.search.includes("still")) document.documentElement.classList.add("still");
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => {
  const siblings = el.parentElement.querySelectorAll(":scope > .reveal");
  const idx = Array.prototype.indexOf.call(siblings, el);
  el.style.transitionDelay = `${Math.min(idx, 6) * 80}ms`;
  revealIO.observe(el);
});

// Nav state: glass darkens after hero, current section highlighted
const nav = document.querySelector(".nav");
new IntersectionObserver(([e]) => nav.classList.toggle("scrolled", !e.isIntersecting), { threshold: 0.9 })
  .observe(document.querySelector(".hero"));
const links = [...document.querySelectorAll(".nav-links a")];
const sectionIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === `#${e.target.id}`));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
links.forEach(l => { const s = document.querySelector(l.getAttribute("href")); if (s) sectionIO.observe(s); });

// Tagline: words light up one at a time; the last word gets the bronze U from the logo
const tagline = document.querySelector("[data-words]");
if (tagline) {
  const accent = new Set(["moment", "stay", "you."]);
  tagline.innerHTML = tagline.textContent.trim().split(/\n/)
    .map(line => line.trim().split(/\s+/)
      .map(w => `<span class="w${accent.has(w) ? " accent" : ""}">${w}</span>`).join(" "))
    .join("<br>");
  const words = tagline.querySelectorAll(".w");
  const last = words[words.length - 1];
  last.classList.add("w-you");
  last.insertAdjacentHTML("beforeend", '<svg class="you-u" viewBox="0 0 120 30" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M2 2 C 18 34, 102 34, 118 2"/></svg>');
  const wordIO = new IntersectionObserver(entries => {
    entries.forEach(e => e.target.classList.toggle("on", e.isIntersecting || e.boundingClientRect.top < 0));
  }, { rootMargin: "0px 0px -40% 0px", threshold: 1 });
  words.forEach(w => wordIO.observe(w));
}

// Services: booking calendar for December 2026 (starts on a Tuesday), then device copies for phones
const cal = document.querySelector(".book-cal");
if (cal) {
  let html = ["M", "T", "W", "T", "F", "S", "S"].map(d => `<b>${d}</b>`).join("") + "<i></i>";
  for (let d = 1; d <= 31; d++) html += `<span${d >= 20 && d <= 24 ? ' class="in"' : ""}>${d}</span>`;
  cal.innerHTML = html;
}
if (matchMedia("(max-width: 1023px)").matches) {
  const devs = document.querySelectorAll(".props .dev");
  document.querySelectorAll(".service-device").forEach(slot => {
    const src = devs[+slot.dataset.dev];
    if (!src) return;
    const copy = src.cloneNode(true);
    copy.classList.add("is-active");
    slot.appendChild(copy);
  });
}
// The concept homepage headline changes language: Thai, English, Chinese
(() => {
  const heads = [...document.querySelectorAll(".mini-head")];
  if (!heads.length || reduceMotion) return;
  let visible = false, n = 0;
  const io = new IntersectionObserver(es => { visible = es.some(e => e.isIntersecting) || heads.some(h => h.getBoundingClientRect().top < innerHeight && h.getBoundingClientRect().bottom > 0); });
  heads.forEach(h => io.observe(h));
  setInterval(() => {
    if (!visible || document.hidden) return;
    n = (n + 1) % 3;
    heads.forEach(h => h.querySelectorAll(".mini-lang").forEach((s, i) => s.classList.toggle("is-on", i === n)));
  }, 2600);
})();

// Concierge demo
const scripts = {
  en: [
    ["guest", "Hi, is the three bedroom pool villa free from 20 to 24 December? We are two adults and three kids.", "02:14"],
    ["bot", "Good evening, and welcome. Yes, Villa Anda is free for all four nights. It has a private infinity pool and a fenced garden, which families love. Shall I hold it for you while you decide?", "02:14"],
    ["guest", "Yes please. Can you arrange an airport pickup too?", "02:15"],
    ["bot", "Of course. A private van from Phuket Airport takes about 40 minutes, with child seats ready. I have held the villa until 14:00 tomorrow and passed your details to Khun Nok in reservations. She will confirm your rate by email in the morning.", "02:15"]
  ],
  th: [
    ["guest", "สวัสดีค่ะ พูลวิลล่า 3 ห้องนอนว่างวันที่ 20 ถึง 24 ธันวาคมไหมคะ ผู้ใหญ่ 2 เด็ก 3 ค่ะ", "02:14"],
    ["bot", "สวัสดีค่ะ ยินดีต้อนรับนะคะ วิลล่าอันดาว่างครบทั้ง 4 คืนค่ะ มีสระอินฟินิตี้ส่วนตัวและสวนที่มีรั้วรอบ เหมาะกับครอบครัวมากค่ะ ให้กันวิลล่าไว้ให้ก่อนไหมคะ", "02:14"],
    ["guest", "ได้ค่ะ ช่วยจัดรถรับจากสนามบินให้ด้วยได้ไหมคะ", "02:15"],
    ["bot", "ได้เลยค่ะ รถตู้ส่วนตัวจากสนามบินภูเก็ตใช้เวลาประมาณ 40 นาที มีคาร์ซีทสำหรับเด็กเตรียมไว้ให้ค่ะ กันวิลล่าไว้ให้ถึง 14:00 น. พรุ่งนี้ และส่งรายละเอียดให้คุณนกฝ่ายสำรองห้องพักแล้วค่ะ พรุ่งนี้เช้าคุณนกจะยืนยันราคาทางอีเมลค่ะ", "02:15"]
  ],
  zh: [
    ["guest", "你好，三卧室泳池别墅12月20日到24日有空吗？我们是两个大人和三个小孩。", "02:14"],
    ["bot", "晚上好，欢迎您。Anda 别墅这四晚都可以入住。别墅有私人无边泳池和带围栏的花园，很适合家庭。需要我先为您保留吗？", "02:14"],
    ["guest", "好的，谢谢。可以安排机场接机吗？", "02:15"],
    ["bot", "当然可以。从普吉机场乘私人专车约40分钟，已备好儿童安全座椅。我已为您保留别墅至明天14:00，并将您的信息转给预订部的 Nok。她明天早上会通过邮件确认价格。", "02:15"]
  ]
};
const chat = document.getElementById("chat");
const phoneWrap = document.querySelector(".phone-wrap");
const handoff = document.querySelector(".handoff");
let run = 0;
const wait = ms => new Promise(r => setTimeout(r, ms));
function bubble(lang, who, text, time, instant) {
  const m = document.createElement("div");
  m.className = `msg ${who}${instant ? " instant" : ""}`;
  m.lang = lang === "zh" ? "zh-Hans" : lang;
  m.textContent = text;
  const tm = document.createElement("time"); tm.textContent = time; m.appendChild(tm);
  chat.appendChild(m);
}
// The first guest message is always on screen, so the phone is never an empty slab
function setFirst(lang) {
  chat.innerHTML = "";
  const [who, text, time] = scripts[lang][0];
  bubble(lang, who, text, time, true);
}
async function play(lang, keepFirst) {
  const id = ++run;
  handoff && handoff.classList.remove("is-in");
  const msgs = scripts[lang];
  if (keepFirst) setFirst(lang);
  else chat.innerHTML = "";
  for (let k = keepFirst ? 1 : 0; k < msgs.length; k++) {
    const [who, text, time] = msgs[k];
    if (id !== run) return;
    if (who === "bot") {
      const t = document.createElement("div");
      t.className = "typing"; t.innerHTML = "<span></span><span></span><span></span>";
      chat.appendChild(t);
      await wait(1300);
      t.remove();
      if (id !== run) return;
    } else {
      await wait(700);
    }
    bubble(lang, who, text, time, false);
    if (who === "bot" && phoneWrap) {
      phoneWrap.classList.add("glow");
      setTimeout(() => phoneWrap.classList.remove("glow"), 1600);
    }
    await wait(1100);
  }
  if (id === run && handoff) handoff.classList.add("is-in");
}
setFirst("en");
const langBtns = document.querySelectorAll(".lang button");
langBtns.forEach(b => b.addEventListener("click", () => {
  langBtns.forEach(x => x.setAttribute("aria-selected", String(x === b)));
  play(b.dataset.lang, false);
}));
new IntersectionObserver(([e], o) => { if (e.isIntersecting) { play("en", true); o.disconnect(); } }, { threshold: 0.4 })
  .observe(document.querySelector(".phone"));

// Studies: the palette sheet opens on click or keyboard, never on hover of a moving strip
document.querySelectorAll(".study").forEach(study => {
  const sheet = study.querySelector(".study-sheet");
  const img = study.querySelector(".study-img");
  if (sheet && img) img.appendChild(sheet);
  const btn = study.querySelector(".study-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const open = !study.classList.contains("is-open");
    study.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
  });
});

// Commissions: the touch carousel shows its position; a tier link carries the choice into the form
const tiers = document.querySelector(".tiers");
const tiersBar = document.querySelector(".tiers-progress i");
if (tiers && tiersBar) {
  const upd = () => {
    const max = tiers.scrollWidth - tiers.clientWidth;
    tiersBar.style.transform = `scaleX(${max > 0 ? 0.25 + 0.75 * (tiers.scrollLeft / max) : 1})`;
  };
  tiers.addEventListener("scroll", upd, { passive: true });
  upd();
}
const commission = document.getElementById("f-commission");
const formTier = document.getElementById("form-tier");
document.querySelectorAll(".tier-link").forEach(a => a.addEventListener("click", () => {
  if (!commission) return;
  commission.value = a.dataset.tier;
  formTier.textContent = `Commission of interest: ${a.dataset.tier}`;
  formTier.hidden = false;
}));

// Consultation card: the bronze hairline border follows the card size
const cardRect = document.querySelector(".card-line rect");
if (cardRect) {
  const card = cardRect.closest(".invite-card");
  const size = () => {
    cardRect.setAttribute("width", Math.max(0, card.offsetWidth - 1));
    cardRect.setAttribute("height", Math.max(0, card.offsetHeight - 1));
  };
  size();
  new ResizeObserver(size).observe(card);
}

// Film: letterbox player with sound, opened from the cinema moment
(() => {
  const film = document.querySelector("dialog.film");
  const openBtn = document.querySelector(".film-open");
  if (!film || !openBtn || typeof film.showModal !== "function") return;
  const v = film.querySelector(".film-video");
  const bar = film.querySelector(".film-progress i");
  const sound = film.querySelector(".film-sound");
  const cta = film.querySelector(".film-cta");
  let closing = false;
  const open = () => {
    if (!v.getAttribute("src")) v.src = matchMedia("(max-aspect-ratio: 1/1)").matches ? v.dataset.mobile : v.dataset.desktop;
    closing = false;
    film.classList.remove("is-ended");
    film.showModal();
    window.hsLenis && window.hsLenis.stop();
    requestAnimationFrame(() => film.classList.add("is-open"));
    v.currentTime = 0;
    v.muted = false;
    sound.setAttribute("aria-pressed", "true");
    sound.textContent = "Sound on";
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  };
  const close = (then) => {
    if (closing) return;
    closing = true;
    film.classList.remove("is-open");
    v.pause();
    setTimeout(() => {
      film.close();
      window.hsLenis && window.hsLenis.start();
      if (typeof then === "function") then(); else openBtn.focus();
    }, 700);
  };
  openBtn.addEventListener("click", open);
  // The whole cinema frame is a play surface (the cursor already reads "Watch")
  const stageEl = document.querySelector(".cinema-stage");
  if (stageEl) stageEl.addEventListener("click", e => { if (!e.target.closest(".film-open")) open(); });
  film.querySelector(".film-close").addEventListener("click", () => close());
  film.addEventListener("cancel", e => { e.preventDefault(); close(); });
  sound.addEventListener("click", () => {
    v.muted = !v.muted;
    sound.setAttribute("aria-pressed", String(!v.muted));
    sound.textContent = v.muted ? "Sound off" : "Sound on";
  });
  v.addEventListener("timeupdate", () => { if (v.duration) bar.style.transform = `scaleX(${v.currentTime / v.duration})`; });
  v.addEventListener("ended", () => film.classList.add("is-ended"));
  cta.addEventListener("click", e => {
    e.preventDefault();
    close(() => {
      const target = document.getElementById("consult");
      if (window.hsLenis) window.hsLenis.scrollTo(target, { duration: 1.6 }); else target.scrollIntoView({ behavior: "smooth" });
    });
  });
})();

// Form: validate, then open a prepared email
const form = document.getElementById("form");
const note = document.getElementById("form-note");
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function check(field) {
  const input = field.querySelector("input, select");
  const err = field.querySelector(".err");
  let msg = "";
  if (input.required && !input.value.trim()) msg = "Please fill this in.";
  else if (input.type === "email" && input.value && !emailRe.test(input.value.trim())) msg = "Please enter a valid email address.";
  field.classList.toggle("invalid", !!msg);
  input.setAttribute("aria-invalid", String(!!msg));
  err.textContent = msg;
  return !msg;
}
form.querySelectorAll(".field").forEach(f => {
  const input = f.querySelector("input, select");
  input.addEventListener("blur", () => { if (input.value) check(f); });
  input.addEventListener("input", () => { if (f.classList.contains("invalid")) check(f); });
});
form.addEventListener("submit", e => {
  e.preventDefault();
  const fields = [...form.querySelectorAll(".field")];
  const ok = fields.map(check).every(Boolean);
  if (!ok) { fields.find(f => f.classList.contains("invalid")).querySelector("input, select").focus(); return; }
  const d = Object.fromEntries(new FormData(form));
  const body = `Name: ${d.name}\nProperty: ${d.property}\nType: ${d.type}\nCommission of interest: ${d.commission || "not chosen yet"}\nWebsite: ${d.website || "none"}\nEmail: ${d.email}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Private consultation: " + d.property)}&body=${encodeURIComponent(body)}`;
  // Honest confirmation: the email is prepared, not yet sent
  const fieldsBox = form.querySelector(".form-fields");
  const thanks = form.querySelector(".form-thanks");
  if (fieldsBox && thanks) {
    fieldsBox.hidden = true;
    thanks.hidden = false;
    if (window.gsap && window.DrawSVGPlugin && !reduceMotion) {
      gsap.from(".card-mono .d", { drawSVG: 0, duration: 1.4, stagger: 0.12, ease: "power3.inOut" });
      gsap.from(thanks.children, { y: 16, opacity: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", delay: 0.3 });
    }
  } else {
    note.textContent = "Your email app has opened with your request ready to send.";
    note.classList.add("ok");
  }
});
