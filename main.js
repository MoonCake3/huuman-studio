// HUUMAN Studio landing page
const CONTACT_EMAIL = "marketingwsean@gmail.com";

// Phones: let headlines wrap naturally instead of using the desktop line breaks
if (matchMedia("(max-width: 767px)").matches) {
  document.querySelectorAll(".hero-title br, .h2 br").forEach(br => br.remove());
}

// Hero film: silent loop, portrait cut on phones, still image for reduced motion or data saver
(() => {
  const v = document.querySelector(".hero-video");
  if (!v) return;
  const saveData = navigator.connection && navigator.connection.saveData;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || saveData) return;
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
document.querySelectorAll(".reveal").forEach((el, i) => {
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

// Tagline: words light up one at a time as they cross the trigger line
const tagline = document.querySelector("[data-words]");
if (tagline) {
  const accent = new Set(["moment", "stay", "you."]);
  tagline.innerHTML = tagline.textContent.trim().split(/\n/)
    .map(line => line.trim().split(/\s+/)
      .map(w => `<span class="w${accent.has(w) ? " accent" : ""}">${w}</span>`).join(" "))
    .join("<br>");
  const wordIO = new IntersectionObserver(entries => {
    entries.forEach(e => e.target.classList.toggle("on", e.isIntersecting || e.boundingClientRect.top < 0));
  }, { rootMargin: "0px 0px -40% 0px", threshold: 1 });
  tagline.querySelectorAll(".w").forEach(w => wordIO.observe(w));
}

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
let run = 0;
const wait = ms => new Promise(r => setTimeout(r, ms));
async function play(lang) {
  const id = ++run;
  chat.innerHTML = "";
  for (const [who, text, time] of scripts[lang]) {
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
    const m = document.createElement("div");
    m.className = `msg ${who}`;
    m.lang = lang === "zh" ? "zh-Hans" : lang;
    m.textContent = text;
    const tm = document.createElement("time"); tm.textContent = time; m.appendChild(tm);
    chat.appendChild(m);
    await wait(1100);
  }
}
const langBtns = document.querySelectorAll(".lang button");
langBtns.forEach(b => b.addEventListener("click", () => {
  langBtns.forEach(x => x.setAttribute("aria-selected", String(x === b)));
  play(b.dataset.lang);
}));
new IntersectionObserver(([e], o) => { if (e.isIntersecting) { play("en"); o.disconnect(); } }, { threshold: 0.4 })
  .observe(document.querySelector(".phone"));

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
  const body = `Name: ${d.name}\nProperty: ${d.property}\nType: ${d.type}\nWebsite: ${d.website || "none"}\nEmail: ${d.email}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Private consultation: " + d.property)}&body=${encodeURIComponent(body)}`;
  note.textContent = "Thank you. Your email app has opened with your request ready to send.";
  note.classList.add("ok");
});
