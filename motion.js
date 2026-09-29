// HUUMAN Studio cinematic motion layer (GSAP + ScrollTrigger + SplitText + DrawSVG + Lenis, all free)
(() => {
  const root = document.documentElement;
  const loader = document.querySelector(".loader");
  if (!root.classList.contains("motion") || !window.gsap || !window.ScrollTrigger || !window.SplitText || !window.Lenis) {
    root.classList.remove("motion");
    loader && loader.remove();
    return;
  }
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const hasDraw = !!window.DrawSVGPlugin;
  if (hasDraw) gsap.registerPlugin(DrawSVGPlugin);
  const q = s => document.querySelector(s);
  const qa = s => [...document.querySelectorAll(s)];

  // Smooth scroll, driven by the GSAP ticker so every scroll animation stays in sync
  const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  window.hsLenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  qa('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    const target = id.length > 1 && q(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { duration: 1.8, easing: t => 1 - Math.pow(1 - t, 4) });
  }));
  new MutationObserver(() => q("#menu").classList.contains("open") ? lenis.stop() : lenis.start())
    .observe(q("#menu"), { attributes: true, attributeFilter: ["class"] });

  // Intro: preloader on first visit, then the hero opens like a film title
  const seen = root.classList.contains("intro-seen");
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  if (loader && !seen) {
    try { sessionStorage.setItem("hs-intro", "1"); } catch (e) {}
    lenis.stop();
    const count = q(".loader-count");
    const n = { v: 0 };
    if (hasDraw) {
      tl.from(".loader-word .d:not(.you)", { drawSVG: 0, duration: 1.3, ease: "power3.inOut", stagger: 0.07 })
        .from(".loader-word .you", { drawSVG: 0, duration: 1.1, ease: "power3.inOut" }, "-=0.55");
    } else {
      tl.from(".loader-word .logo", { opacity: 0, duration: 1.4 });
    }
    tl.to(".loader-line span", { scaleX: 1, duration: 2, ease: "power3.inOut" }, 0.1)
      .to(n, { v: 100, duration: 2, ease: "power3.inOut", onUpdate: () => { count.textContent = String(Math.round(n.v)).padStart(3, "0"); } }, 0.1)
      .to(".loader-word .logo", { opacity: 0, y: -16, filter: "blur(6px)", duration: 0.7, ease: "power3.in" }, "+=0.35")
      .to([".loader-line", ".loader-meta"], { opacity: 0, duration: 0.4 }, "<")
      // The black bars part like a cinema screen, pause as a letterbox, then open fully
      .to(".loader-top", { height: "11%", duration: 1.5, ease: "expo.inOut" }, "-=0.1")
      .to(".loader-bottom", { height: "11%", duration: 1.5, ease: "expo.inOut" }, "<")
      .to([".loader-top", ".loader-bottom"], { height: "0%", duration: 1.4, ease: "expo.inOut" }, "+=0.5")
      .add(() => { loader.remove(); lenis.start(); });
  } else if (loader) {
    loader.remove();
  }

  const title = q(".hero-title");
  const titleSplit = SplitText.create(title, { type: "lines", mask: "lines", linesClass: "split-line" });
  title.classList.add("is-split");
  tl.set(".hero-inner", { opacity: 1 }, seen ? 0 : "-=2.4")
    .fromTo(".hero-media", { scale: 1.3 }, { scale: 1, duration: 3.6, ease: "expo.out" }, "<")
    .from(titleSplit.lines, { yPercent: 115, duration: 1.8, stagger: 0.14, ease: "expo.out" }, "<0.6")
    .from([".hero-sub", ".hero-link"], { y: 32, opacity: 0, filter: "blur(8px)", duration: 1.4, stagger: 0.12 }, "<0.5")
    .from(".hero-meta > *", { opacity: 0, y: 16, duration: 1.2, stagger: 0.1 }, "<0.2")
    .fromTo(".nav", { y: -32, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4 }, "<")
    .add(() => {
      titleSplit.revert();
      title.classList.remove("is-split");
    });

  // Hero parallax as it leaves the screen
  gsap.to(".hero-media", { yPercent: 24, scale: 1.08, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.fromTo(".hero-inner", { yPercent: 0, opacity: 1 }, { yPercent: -18, opacity: 0, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".hero", start: "20% top", end: "bottom top", scrub: true } });

  // Nav tucks away on scroll down, returns on scroll up
  ScrollTrigger.create({
    start: 160,
    end: "max",
    onUpdate: self => gsap.to(".nav-wrap", { yPercent: self.direction === 1 ? -160 : 0, duration: 0.9, ease: "expo.out", overwrite: true }),
    onLeaveBack: () => gsap.to(".nav-wrap", { yPercent: 0, duration: 0.9, ease: "expo.out", overwrite: true })
  });

  // The quiet problem, shown: the villa shrinks from full screen into one tile of a marketplace grid.
  // The villa is its own full resolution layer that scales DOWN, so it stays sharp (no upscaled grid).
  const stage = q(".thumb-stage");
  if (stage) {
    const grid = q(".thumb-grid"), villa = q(".thumb-villa");
    const phone = matchMedia("(max-width: 767px)").matches;
    const cols = phone ? 3 : 6, rows = phone ? 5 : 4, you = phone ? 7 : 8;
    // Filler listings: small, cooled thumbnails so the marketplace feels full (the villa stays the only one in colour)
    const pics = ["t-lobby", "", "t-tier-growth", "t-study-tea", "", "t-spa", "t-penthouse", "t-study-beach", "", "t-tier-pro", "t-bedroom", "", "t-study-shophouse", "t-cove", "t-tier-start", "", "t-night", "t-lobby", "", "t-tier-growth", "t-spa", "t-study-tea", "", "t-penthouse"];
    grid.innerHTML = Array.from({ length: cols * rows }, (_, i) => {
      const p = i === you ? "" : pics[i % pics.length];
      const show = p && (!phone || i % 2 === 0);
      return `<div class="tile${i === you ? " you" : ""}"><div class="tile-img${show ? " has-pic" : ""}"${show ? ` style="background-image:url(img/${p}.webp)"` : ""}></div><span class="tile-line"></span><span class="tile-line short"></span></div>`;
    }).join("");
    const slot = grid.querySelector(".you .tile-img");
    const target = { x: 0, y: 0, scale: 1, clip: "inset(0px 0px 0px 0px round 0px)" };
    const measure = () => {
      gsap.set(villa, { clearProps: "transform,clipPath" });
      const s = stage.getBoundingClientRect(), t = slot.getBoundingClientRect();
      const W = s.width, H = s.height;
      const sc = Math.max(t.width / W, t.height / H);
      const cx = (W - t.width / sc) / 2, cy = (H - t.height / sc) / 2;
      target.x = t.left - s.left - cx * sc;
      target.y = t.top - s.top - cy * sc;
      target.scale = sc;
      target.clip = `inset(${cy}px ${cx}px ${cy}px ${cx}px round ${8 / sc}px)`;
    };
    measure();
    ScrollTrigger.addEventListener("refreshInit", measure);
    const others = grid.querySelectorAll(".tile:not(.you)");
    gsap.timeline({ scrollTrigger: { trigger: ".thumb", start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true } })
      .fromTo(villa, { x: 0, y: 0, scale: 1, clipPath: "inset(0px 0px 0px 0px round 0px)" },
        { x: () => target.x, y: () => target.y, scale: () => target.scale, clipPath: () => target.clip, ease: "power2.inOut", duration: 1 }, 0.1)
      .fromTo(others, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: { each: 0.018, from: you } }, 0.5)
      .to(".thumb-cool", { opacity: 1, duration: 0.25 }, 1.2)
      .to(stage, { "--dim": 1, duration: 0.3 }, 1.35)
      .fromTo(".thumb-caption", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, 1.4)
      .to({}, { duration: 0.35 });
  }

  // Section headlines rise line by line from behind a mask
  qa(".h2").forEach(h => {
    h.classList.remove("reveal");
    SplitText.create(h, {
      type: "lines", mask: "lines", autoSplit: true,
      onSplit: self => gsap.from(self.lines, { yPercent: 105, duration: 1.4, ease: "expo.out", stagger: 0.09, scrollTrigger: { trigger: h, start: "top 88%", once: true } })
    });
  });

  // Problem statements: the hairline draws, then the line of thought arrives
  qa(".statement").forEach(s => {
    gsap.timeline({ scrollTrigger: { trigger: s, start: "top 85%", once: true } })
      .fromTo(s, { "--s": 0 }, { "--s": 1, duration: 1.4, ease: "expo.out" })
      .from(s.children, { y: 24, autoAlpha: 0, filter: "blur(6px)", duration: 1.2, ease: "expo.out", stagger: 0.08 }, 0.15);
  });

  // Service images open like an aperture and settle as they scroll (phones and tablets)
  qa(".service-media").filter(m => m.offsetParent !== null).forEach(m => {
    const st = { trigger: m, start: "top 95%", end: "top 30%", scrub: 1 };
    gsap.fromTo(m, { clipPath: "inset(16% 14% 16% 14% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", ease: "none", scrollTrigger: st });
    gsap.fromTo(m.querySelector("img"), { scale: 1.35 }, { scale: 1, ease: "none", scrollTrigger: { ...st, end: "bottom top" } });
  });
  // Device copies on phones rise into place, and the concept homepage scrolls itself
  qa(".service-device .dev").forEach(d => {
    gsap.from(d, { yPercent: 16, rotateX: 12, autoAlpha: 0, transformPerspective: 1200, duration: 1.4, ease: "expo.out", clearProps: "transform", scrollTrigger: { trigger: d, start: "top 90%", once: true } });
    const mini = d.querySelector(".mini"), view = d.querySelector(".dev-view");
    if (mini && view) gsap.to(mini, { y: () => -(mini.scrollHeight - view.clientHeight), ease: "none", scrollTrigger: { trigger: d, start: "top 80%", end: "bottom 20%", scrub: 1, invalidateOnRefresh: true } });
  });

  const mm = gsap.matchMedia();

  // Studies: pinned horizontal film strip on large screens, native swipe on phones
  mm.add("(min-width: 1024px)", () => {
    const track = q(".studies");
    track.classList.add("h-pin");
    const dist = () => track.scrollWidth - window.innerWidth + 80;
    const strip = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: ".studies-pin", start: "center center", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
        snap: { snapTo: 1 / (qa(".study").length - 1), duration: { min: 0.3, max: 0.8 }, delay: 0.1, ease: "power3.inOut" }
      }
    });
    qa(".study").forEach(fig => {
      gsap.fromTo(fig.querySelector(".study-img img"), { xPercent: -7 }, { xPercent: 7, ease: "none", scrollTrigger: { trigger: fig, containerAnimation: strip, start: "left right", end: "right left", scrub: true } });
    });
    return () => track.classList.remove("h-pin");
  });

  // Services on desktop: the room wipes, and the product itself is placed in the room
  mm.add("(min-width: 1024px)", () => {
    const imgs = qa(".story-img");
    const devs = qa(".props .dev");
    const now = q(".story-now");
    let current = 0;
    gsap.set(devs.slice(1), { autoAlpha: 0 });
    const details = (i, d) => {
      if (i === 1) gsap.from(d.querySelectorAll(".b, .dev-chips span"), { y: 16, autoAlpha: 0, duration: 0.9, ease: "expo.out", stagger: 0.12, delay: 0.5 });
      if (i === 2) gsap.from(d.querySelectorAll(".book-cal .in"), { backgroundColor: "rgba(194, 162, 116, 0)", color: "rgba(26, 24, 18, 1)", duration: 0.5, ease: "power2.out", stagger: 0.09, delay: 0.7 });
    };
    const show = i => {
      if (i === current) return;
      const dir = i > current ? 1 : -1;
      const next = imgs[i], prev = imgs[current];
      gsap.set(imgs, { zIndex: 0 });
      gsap.set(prev, { zIndex: 1 });
      gsap.set(next, { zIndex: 2 });
      gsap.fromTo(next, { clipPath: dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut", overwrite: true });
      gsap.fromTo(next.querySelector("img"), { scale: 1.3 }, { scale: 1.12, duration: 1.8, ease: "expo.out", overwrite: true });
      gsap.to(prev.querySelector("img"), { scale: 1.02, duration: 1.3, ease: "expo.inOut", overwrite: true });
      gsap.to(devs[current], { yPercent: -8 * dir, autoAlpha: 0, duration: 0.7, ease: "expo.inOut", overwrite: true });
      gsap.fromTo(devs[i], { yPercent: 16 * dir, rotateX: 10 * dir, autoAlpha: 0, transformPerspective: 1400 }, { yPercent: 0, rotateX: 0, autoAlpha: 1, duration: 1.4, ease: "expo.out", delay: 0.25, overwrite: true });
      details(i, devs[i]);
      gsap.fromTo(now, { yPercent: 100 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "expo.out" });
      now.textContent = String(i + 1).padStart(2, "0");
      current = i;
    };
    qa(".story-steps .service").forEach((s, i) => {
      s.classList.remove("reveal");
      ScrollTrigger.create({ trigger: s, start: "top center", end: "bottom center", onToggle: self => { if (self.isActive) show(i); } });
      gsap.from(s.querySelectorAll(".num, .h3, p"), { y: 32, opacity: 0, filter: "blur(6px)", duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: s, start: "top 70%", once: true } });
    });
    gsap.fromTo(".story-visual", { clipPath: "inset(12% 10% 12% 10% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", ease: "none", scrollTrigger: { trigger: ".story", start: "top 95%", end: "top 20%", scrub: 1 } });
    gsap.from(devs[0], { yPercent: 18, rotateX: 14, autoAlpha: 0, transformPerspective: 1400, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".story", start: "top 60%", once: true } });
    // The concept homepage scrolls itself while the first service is read
    const mini = q(".props .mini"), view = q(".props .dev-view");
    if (mini && view) gsap.to(mini, { y: () => -(mini.scrollHeight - view.clientHeight), ease: "none", scrollTrigger: { trigger: ".story-steps .service", start: "top 25%", end: "bottom center", scrub: 1, invalidateOnRefresh: true } });
  });

  // Concierge at night: the room settles, the phone rises out of perspective
  gsap.fromTo(".night-bg img", { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "#concierge", start: "top bottom", end: "bottom top", scrub: true } });
  const phoneEl = q(".concierge-night .phone");
  if (phoneEl) {
    phoneEl.classList.remove("reveal");
    gsap.from(phoneEl, { rotateX: 18, y: 80, autoAlpha: 0, transformPerspective: 1200, duration: 1.6, ease: "expo.out", clearProps: "transform", scrollTrigger: { trigger: ".phone-wrap", start: "top 80%", once: true } });
  }

  // Text parallax band: rows slide in opposite directions as you scroll (Olivier Larose pattern)
  qa(".words-row").forEach(row => {
    const dir = +row.dataset.dir || -1;
    gsap.fromTo(row, { xPercent: dir < 0 ? 0 : -18 }, { xPercent: dir < 0 ? -18 : 0, ease: "none", scrollTrigger: { trigger: ".words", start: "top bottom", end: "bottom top", scrub: 1 } });
  });

  // Cinema moment: the frame expands, dissolves into a film loop, and offers the full film with sound
  const cv = q(".cinema-video");
  if (cv) {
    ScrollTrigger.create({
      trigger: ".cinema", start: "top 250%", once: true,
      onEnter: () => { if (!cv.getAttribute("src")) { cv.src = matchMedia("(max-aspect-ratio: 1/1)").matches ? cv.dataset.mobile : cv.dataset.desktop; cv.load(); } }
    });
  }
  const cinemaSplit = SplitText.create(".cinema-text", { type: "lines", mask: "lines" });
  gsap.timeline({
    scrollTrigger: {
      trigger: ".cinema", start: "top top", end: "+=170%", pin: true, scrub: 1,
      onUpdate: self => { if (!cv) return; if (self.progress > 0.6) { if (cv.paused) { const p = cv.play(); if (p && p.catch) p.catch(() => {}); } } else if (!cv.paused) cv.pause(); },
      onLeave: () => cv && cv.pause(),
      onLeaveBack: () => cv && cv.pause(),
      onEnterBack: () => { if (cv) { const p = cv.play(); if (p && p.catch) p.catch(() => {}); } }
    }
  })
    .fromTo(".cinema-frame", { clipPath: "inset(24% 32% 24% 32% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 })
    .fromTo(".cinema-frame picture img, .cinema-video", { scale: 1.45 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
    .to(".cinema-video", { opacity: 1, duration: 0.2, ease: "none" }, 0.85)
    .from(cinemaSplit.lines, { yPercent: 110, stagger: 0.15, duration: 0.5, ease: "power3.out" }, 0.7)
    .fromTo(".film-open", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }, 1.05)
    .to({}, { duration: 0.35 });

  // Process: a bronze thread draws through three objects; the design wipes over the wireframe
  if (hasDraw) gsap.from(".reel-line path", { drawSVG: 0, ease: "none", scrollTrigger: { trigger: ".reel", start: "top 75%", end: "bottom 65%", scrub: 1 } });
  qa(".object").forEach(o => {
    gsap.timeline({ scrollTrigger: { trigger: o, start: "top 80%", once: true } })
      .from(o.querySelector(".artifact"), { y: 64, autoAlpha: 0, duration: 1.4, ease: "expo.out" })
      .from(o.querySelectorAll(".num, h3, p"), { y: 24, autoAlpha: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }, 0.2);
  });
  gsap.from(".art-paper > i", { scaleX: 0, duration: 1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".art-paper", start: "top 75%", once: true } });
  const lap = q(".lap-screen");
  if (lap) {
    const st = { trigger: ".art-laptop", start: "top 70%", end: "top 30%", scrub: 1 };
    gsap.fromTo(".lap-final", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: st });
    gsap.fromTo(".lap-scan", { x: 0, opacity: 1 }, { x: () => lap.clientWidth, opacity: 0.2, ease: "none", scrollTrigger: { ...st, invalidateOnRefresh: true } });
  }

  // Commissions: four panels open like curtains
  gsap.from(".tier", { clipPath: "inset(100% 0% 0% 0% round 16px)", duration: 1.6, ease: "expo.out", stagger: 0.12, clearProps: "clipPath", scrollTrigger: { trigger: ".tiers", start: "top 80%", once: true } });

  // Consultation: the door pushes in, the ivory card is placed on the table, a bronze hairline traces it
  gsap.fromTo(".invite-bg img", { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "#consult", start: "top bottom", end: "bottom top", scrub: true } });
  const card = q(".invite-card");
  if (card) {
    card.classList.remove("reveal");
    const ctl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 85%", once: true } })
      .from(card, { y: 80, rotate: 1.2, autoAlpha: 0, duration: 1.4, ease: "expo.out", clearProps: "transform" });
    if (hasDraw) ctl.from(".card-line rect", { drawSVG: 0, duration: 2.2, ease: "expo.inOut" }, 0.2);
  }

  // Footer: the giant wordmark draws itself as the page lifts away
  if (hasDraw) gsap.from(".footer-mark .d", { drawSVG: 0, ease: "none", stagger: 0.05, scrollTrigger: { trigger: ".footer-reveal", start: "top 90%", end: "bottom bottom", scrub: 1 } });
  gsap.from(".footer-top > *", { y: 64, opacity: 0, ease: "none", stagger: 0.1, scrollTrigger: { trigger: ".footer-reveal", start: "top 80%", end: "top 20%", scrub: 1 } });

  // Reading progress line
  gsap.to(".progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

  // Page transitions between the site and the brand book
  const curtain = q(".curtain");
  if (curtain) {
    let arrived = false;
    try { arrived = sessionStorage.getItem("hs-curtain") === "1"; sessionStorage.removeItem("hs-curtain"); } catch (e) {}
    if (arrived) gsap.fromTo(curtain, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.2, ease: "expo.inOut", delay: 0.1 });
    qa('a[href$=".html"]').forEach(a => a.addEventListener("click", e => {
      if (e.metaKey || e.ctrlKey || a.target === "_blank") return;
      e.preventDefault();
      try { sessionStorage.setItem("hs-curtain", "1"); } catch (err) {}
      gsap.fromTo(curtain, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut", onComplete: () => { location.href = a.href; } });
    }));
  }

  // Magnetic buttons and a bronze cursor for mouse users
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    qa(".btn").forEach(b => {
      const xTo = gsap.quickTo(b, "x", { duration: 0.9, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(b, "y", { duration: 0.9, ease: "elastic.out(1, 0.4)" });
      b.addEventListener("pointermove", e => {
        const r = b.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.22);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      b.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });

    root.classList.add("has-cursor");
    const ring = q(".cursor"), dot = q(".cursor-dot"), label = q(".cursor-label");
    const rx = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3" });
    const dx = gsap.quickTo(dot, "x", { duration: 0.08 });
    const dy = gsap.quickTo(dot, "y", { duration: 0.08 });
    window.addEventListener("pointermove", e => { rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY); }, { passive: true });
    document.addEventListener("pointerover", e => {
      const link = e.target.closest("a, button, summary");
      const view = !link && e.target.closest("[data-cursor]");
      ring.classList.toggle("is-view", !!view);
      ring.classList.toggle("is-link", !!link);
      label.textContent = view ? view.dataset.cursor : "";
    });
    document.addEventListener("pointerleave", () => gsap.to([ring, dot], { opacity: 0, duration: 0.3 }));
    document.addEventListener("pointerenter", () => gsap.to([ring, dot], { opacity: 1, duration: 0.3 }));
  }

  ScrollTrigger.sort();
  window.addEventListener("load", () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
})();
