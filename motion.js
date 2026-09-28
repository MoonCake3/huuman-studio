// HUUMAN Studio cinematic motion layer (GSAP + ScrollTrigger + SplitText + Lenis, all free)
(() => {
  const root = document.documentElement;
  const loader = document.querySelector(".loader");
  if (!root.classList.contains("motion") || !window.gsap || !window.ScrollTrigger || !window.SplitText || !window.Lenis) {
    root.classList.remove("motion");
    loader && loader.remove();
    return;
  }
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const q = s => document.querySelector(s);
  const qa = s => [...document.querySelectorAll(s)];

  // Smooth scroll, driven by the GSAP ticker so every scroll animation stays in sync
  const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
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
    const strokes = ".loader-word .d:not(.you)";
    if (window.DrawSVGPlugin) {
      gsap.registerPlugin(DrawSVGPlugin);
      tl.from(strokes, { drawSVG: 0, duration: 1.3, ease: "power3.inOut", stagger: 0.07 })
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

  // Section headlines rise line by line from behind a mask
  qa(".h2").forEach(h => {
    h.classList.remove("reveal");
    SplitText.create(h, {
      type: "lines", mask: "lines", autoSplit: true,
      onSplit: self => gsap.from(self.lines, { yPercent: 105, duration: 1.4, ease: "expo.out", stagger: 0.09, scrollTrigger: { trigger: h, start: "top 88%", once: true } })
    });
  });

  // Service images open like an aperture and settle as they scroll
  qa(".service-media").filter(m => m.offsetParent !== null).forEach(m => {
    const st = { trigger: m, start: "top 95%", end: "top 30%", scrub: 1 };
    gsap.fromTo(m, { clipPath: "inset(16% 14% 16% 14% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", ease: "none", scrollTrigger: st });
    gsap.fromTo(m.querySelector("img"), { scale: 1.35 }, { scale: 1, ease: "none", scrollTrigger: { ...st, end: "bottom top" } });
  });
  gsap.fromTo(".principles-img", { clipPath: "inset(0% 0% 100% 0% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", ease: "expo.out", duration: 1.8, scrollTrigger: { trigger: ".principles-img", start: "top 80%", once: true } });

  // Marquee speeds up with scroll velocity, then glides back
  const mq = gsap.to(".marquee-track", { xPercent: -50, duration: 44, ease: "none", repeat: -1 });
  ScrollTrigger.create({
    onUpdate: self => {
      const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 7);
      gsap.to(mq, { timeScale: boost, duration: 0.25, overwrite: true, onComplete: () => gsap.to(mq, { timeScale: 1, duration: 1.6, ease: "power2.out" }) });
    }
  });

  // Studies: pinned horizontal film strip on large screens, native swipe on phones
  const mm = gsap.matchMedia();
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
      gsap.fromTo(fig.querySelector("img"), { xPercent: -7 }, { xPercent: 7, ease: "none", scrollTrigger: { trigger: fig, containerAnimation: strip, start: "left right", end: "right left", scrub: true } });
    });
    return () => track.classList.remove("h-pin");
  });

  // Services as pinned storytelling on desktop: the image wipes to the next as each service takes the stage
  mm.add("(min-width: 1024px)", () => {
    const imgs = qa(".story-img");
    const now = q(".story-now");
    let current = 0;
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
      gsap.fromTo(now, { yPercent: 100 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "expo.out" });
      now.textContent = String(i + 1).padStart(2, "0");
      current = i;
    };
    qa(".story-steps .service").forEach((s, i) => {
      s.classList.remove("reveal");
      ScrollTrigger.create({ trigger: s, start: "top center", end: "bottom center", onToggle: self => { if (self.isActive) show(i); } });
      gsap.from(s.querySelectorAll(".num, .h3, p, .ticks li"), { y: 32, opacity: 0, filter: "blur(6px)", duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: s, start: "top 70%", once: true } });
    });
    gsap.fromTo(".story-visual", { clipPath: "inset(12% 10% 12% 10% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", ease: "none", scrollTrigger: { trigger: ".story", start: "top 95%", end: "top 20%", scrub: 1 } });
  });

  // Text parallax band: rows slide in opposite directions as you scroll (Olivier Larose pattern)
  qa(".words-row").forEach(row => {
    const dir = +row.dataset.dir || -1;
    gsap.fromTo(row, { xPercent: dir < 0 ? 0 : -18 }, { xPercent: dir < 0 ? -18 : 0, ease: "none", scrollTrigger: { trigger: ".words", start: "top bottom", end: "bottom top", scrub: 1 } });
  });

  // Footer: the giant wordmark draws itself as the page lifts away
  if (window.DrawSVGPlugin) {
    gsap.registerPlugin(DrawSVGPlugin);
    gsap.from(".footer-mark .d", { drawSVG: 0, ease: "none", stagger: 0.05, scrollTrigger: { trigger: ".footer-reveal", start: "top 90%", end: "bottom bottom", scrub: 1 } });
  }
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

  // Cinema moment: a framed still expands to full screen, then the line appears
  const cinemaSplit = SplitText.create(".cinema-text", { type: "lines", mask: "lines" });
  gsap.timeline({ scrollTrigger: { trigger: ".cinema", start: "top top", end: "+=160%", pin: true, scrub: 1 } })
    .fromTo(".cinema-frame", { clipPath: "inset(24% 32% 24% 32% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 })
    .fromTo(".cinema-frame img", { scale: 1.45 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
    .from(cinemaSplit.lines, { yPercent: 110, stagger: 0.15, duration: 0.5, ease: "power3.out" }, 0.6)
    .to({}, { duration: 0.3 });

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
      const view = e.target.closest("[data-cursor]");
      const link = e.target.closest("a, button, summary");
      ring.classList.toggle("is-view", !!view);
      ring.classList.toggle("is-link", !view && !!link);
      label.textContent = view ? view.dataset.cursor : "";
    });
    document.addEventListener("pointerleave", () => gsap.to([ring, dot], { opacity: 0, duration: 0.3 }));
    document.addEventListener("pointerenter", () => gsap.to([ring, dot], { opacity: 1, duration: 0.3 }));
  }

  ScrollTrigger.sort();
  window.addEventListener("load", () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
})();
