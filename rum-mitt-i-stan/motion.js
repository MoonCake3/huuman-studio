// Rum mitt i stan · motion layer (GSAP + ScrollTrigger + SplitText + Lenis)
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

  // Smooth scroll on the GSAP ticker, so every scroll animation stays in sync
  const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  window.rmisLenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  qa('a[href^="#"]:not([data-book-open])').forEach(a => a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    const target = id.length > 1 && q(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { duration: 1.8, easing: t => 1 - Math.pow(1 - t, 4) });
  }));
  new MutationObserver(() => q("#menu").classList.contains("open") ? lenis.stop() : lenis.start())
    .observe(q("#menu"), { attributes: true, attributeFilter: ["class"] });

  const fontsReady = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 1500))]);
  const splits = [];

  fontsReady.then(() => {
    const seen = root.classList.contains("intro-seen");
    const intro = gsap.timeline({ defaults: { ease: "expo.out" } });

    // Preloader: coordinates, the harbour line draws itself, the name rises, then the tide lifts
    if (loader && !seen) {
      try { sessionStorage.setItem("rmis-intro", "1"); } catch (e) {}
      lenis.stop();
      const word = SplitText.create(".loader-word", { type: "chars", mask: "chars" });
      const paths = qa(".loader-sky .draw");
      paths.forEach(p => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
      const count = q(".loader-count");
      const n = { v: 0 };
      intro
        .from(".loader-coords span", { opacity: 0, y: 12, duration: 1, stagger: 0.1 }, 0)
        .to(paths, { strokeDashoffset: 0, duration: 1.6, ease: "power3.inOut", stagger: 0.08 }, 0.1)
        .from(word.chars, { yPercent: 110, duration: 1.2, stagger: 0.03 }, 0.35)
        .to(n, { v: 100, duration: 2, ease: "power3.inOut", onUpdate: () => { count.textContent = String(Math.round(n.v)).padStart(3, "0"); } }, 0.1)
        .to(".loader-inner", { opacity: 0, y: -24, filter: "blur(6px)", duration: 0.7, ease: "power3.in" }, "+=0.3")
        .to(loader, { clipPath: "inset(0 0 100% 0)", duration: 1.3, ease: "expo.inOut" }, "-=0.15")
        .add(() => { loader.remove(); lenis.start(); });
    } else if (loader) {
      loader.remove();
    }

    // Hero: the image settles, the title rises line by line
    const heroSplit = SplitText.create(".hero-title > span", { type: "lines", mask: "lines", linesClass: "split-line" });
    splits.push(heroSplit);
    gsap.set([".hero-inner", ".hero-meta"], { opacity: 1 });
    intro
      .fromTo(".hero-img", { scale: 1.18 }, { scale: 1, duration: 2.6, ease: "expo.out" }, seen ? 0 : "-=1.1")
      .from(heroSplit.lines, { yPercent: 110, duration: 1.5, stagger: 0.12 }, "<0.15")
      .from([".hero-eyebrow", ".hero-sub", ".hero-book"], { opacity: 0, y: 24, duration: 1.2, stagger: 0.1 }, "<0.3")
      .from(".hero-meta", { opacity: 0, duration: 1 }, "<0.4");

    // Hero parallax as you leave it
    gsap.to(".hero-img", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero-inner", { yPercent: -18, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "40% top", end: "bottom top", scrub: true } });

    // Headings: masked line reveals
    qa(".split").forEach(el => {
      const s = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
      splits.push(s);
      gsap.from(s.lines, { yPercent: 110, duration: 1.4, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 86%" } });
    });

    // Manifesto: words surface as you read
    const man = q("[data-words]");
    if (man) {
      const s = SplitText.create(man, { type: "words", wordsClass: "w" });
      splits.push(s);
      gsap.to(s.words, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: man, start: "top 78%", end: "bottom 45%", scrub: true } });
    }

    // Soft reveals
    ScrollTrigger.batch(".reveal", {
      start: "top 90%",
      onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1.3, ease: "expo.out", stagger: 0.08, overwrite: true })
    });
    qa(".reveal-img").forEach(el => gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 82%" } }));

    // Counters
    qa("[data-count]").forEach(el => {
      const end = Number(el.dataset.count);
      const o = { v: 0 };
      gsap.to(o, { v: end, duration: 2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" }, onUpdate: () => { el.textContent = Math.round(o.v); } });
    });

    // Photo parallax
    qa("[data-parallax]:not(.hero-img)").forEach(img => {
      gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });
    qa(".spot-fig img").forEach(img => {
      gsap.fromTo(img, { scale: 1.14 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "center center", scrub: true } });
    });

    // Grebbestad title drifts wider as the harbour opens
    gsap.fromTo(".greb-title", { letterSpacing: "-0.04em" }, { letterSpacing: "0em", ease: "none", scrollTrigger: { trigger: ".greb-hero", start: "top bottom", end: "bottom center", scrub: true } });

    // Rooms: on desktop the gallery is pinned and scrolls sideways
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const pin = q(".rooms-pin");
      const track = q(".rooms-track");
      track.classList.add("pinned");
      track.scrollLeft = 0;
      const dist = () => Math.max(0, track.scrollWidth - track.clientWidth);
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: () => `top ${Math.max(0, (innerHeight - pin.offsetHeight) / 2)}px`,
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: self => gsap.set(".rooms-progress i", { scaleX: 0.1 + self.progress * 0.9 })
        }
      });
      return () => { track.classList.remove("pinned"); tween.kill(); gsap.set(track, { clearProps: "x" }); };
    });

    // Booking: a quiet brass glow when a request is sent
    document.addEventListener("rmis:sent", () => {
      gsap.fromTo(".thanks-mark", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "expo.out" });
      gsap.from(".book-thanks > *:not(.thanks-mark)", { opacity: 0, y: 16, duration: 1, stagger: 0.08, ease: "expo.out", delay: 0.2 });
      ScrollTrigger.refresh();
    });

    // Language switch: put the original markup back before the text changes, then refresh
    document.addEventListener("rmis:beforelang", () => { splits.forEach(s => s.revert()); splits.length = 0; });
    document.addEventListener("rmis:lang", () => {
      gsap.set(".reveal", { opacity: 1, y: 0 });
      ScrollTrigger.refresh();
    });

    addEventListener("load", () => ScrollTrigger.refresh());
  });
})();
