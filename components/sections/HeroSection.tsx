'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundEngine } from '@/lib/audio';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onRequestDemo?: () => void;
}

export default function HeroSection({ onRequestDemo }: HeroSectionProps) {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLDivElement>(null);
  const monolithRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Monolith continuous floating & ambient rotation
      if (monolithRef.current) {
        gsap.to(monolithRef.current, {
          y: -18,
          rotation: 1.5,
          duration: 5.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        // Parallax depth on scroll
        gsap.to(monolithRef.current, {
          yPercent: 35,
          scale: 0.88,
          opacity: 0.25,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Cursor interaction on monolith
      const onMouseMove = (e: MouseEvent) => {
        if (!monolithRef.current) return;
        const { clientX, clientY } = e;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (clientX - cx) / cx;
        const dy = (clientY - cy) / cy;

        gsap.to(monolithRef.current, {
          x: dx * 24,
          y: dy * 16,
          rotateX: -dy * 8,
          rotateY: dx * 10,
          duration: 1.2,
          ease: 'power2.out',
        });
      };

      window.addEventListener('mousemove', onMouseMove);

      // Headline staggered reveal
      const lines = sectionRef.current?.querySelectorAll('.hero-headline-line');
      if (lines?.length) {
        gsap.fromTo(
          lines,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.14,
            duration: 1.3,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-between p-8 md:p-16 bg-[#060914] overflow-hidden"
    >
      {/* ── Background Architectural Portal Artwork ─────────────────────────── */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <Image
          src="/images/huuman_portal.jpg"
          alt="HUUMAN Cinematic Portal Background"
          fill
          className="object-cover filter contrast-125 brightness-90"
          priority
          sizes="100vw"
        />
        {/* Multilayered radial and vertical darkening vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060914] via-[#060914]/70 to-[#060914]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060914] via-[#060914]/60 to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 70% 50%, transparent 20%, #060914 80%)',
          }}
        />
      </div>

      {/* ── Floating HUUMAN Monolith Sculpture (Midground Artifact) ─────────── */}
      <div
        ref={monolithRef}
        className="absolute top-1/2 right-4 md:right-20 -translate-y-1/2 w-[340px] h-[500px] md:w-[540px] md:h-[720px] z-1 pointer-events-none opacity-90 filter drop-shadow-[0_30px_70px_rgba(0,0,0,0.9)]"
        style={{
          maskImage: 'radial-gradient(ellipse at center, black 62%, transparent 96%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 62%, transparent 96%)',
        }}
      >
        <Image
          src="/images/huuman_monolith.jpg"
          alt="The HUUMAN Obsidian Monolith Sculpture"
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 340px, 540px"
        />

        {/* Ambient Telemetry HUD Callouts */}
        <div
          ref={hudRef}
          className="hidden lg:block absolute inset-0 pointer-events-none text-[9px] font-mono text-white/40 select-none"
        >
          <div className="absolute top-16 left-4 border-l border-white/20 pl-2 space-y-0.5">
            <span className="text-[--accent-gold] block">ARTIFACT // STONE-01</span>
            <span>MASS: OBSIDIAN MONOLITH</span>
            <span>COORDINATES: 13.7563° N, 100.5018° E</span>
          </div>

          <div className="absolute bottom-20 right-4 border-r border-white/20 pr-2 text-right space-y-0.5">
            <span className="text-white/60 block">TRANSMISSION FREQ</span>
            <span>VOX: 432HZ SOVEREIGN</span>
            <span className="text-[#10B981]">SYSTEM STABLE // 99.99%</span>
          </div>
        </div>
      </div>

      {/* ── Top Spacer & Studio Metadata ───────────────────────────────────── */}
      <div className="pt-20 z-10">
        <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[--accent-gold] animate-pulse" />
          <span className="text-[10px] tracking-[0.25em] font-mono text-white/80 uppercase">
            CREATIVE TECHNOLOGY STUDIO // BANGKOK · STOCKHOLM
          </span>
        </div>
      </div>

      {/* ── Center Editorial Headline ──────────────────────────────────────── */}
      <div className="my-auto py-12 z-10 max-w-4xl">
        <h2 className="font-display text-display-xl text-[--text-primary] tracking-tight">
          <span className="block overflow-hidden">
            <span className="hero-headline-line block">{t('headline1')}</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-headline-line block">{t('headline2')}</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-headline-line block text-[--accent-gold]">
              {t('headline3')}
            </span>
          </span>
        </h2>

        <p className="mt-8 text-[--text-secondary] text-base md:text-xl max-w-xl leading-relaxed">
          {t('sub')}
        </p>

        {/* Action CTAs */}
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={() => {
              soundEngine?.playClick(0.05);
              onRequestDemo?.();
            }}
            className="px-8 py-4 rounded-full border border-white/20 bg-white/10 hover:bg-[--accent-gold] hover:text-[#060914] hover:border-[--accent-gold] transition-all duration-300 text-label font-medium tracking-widest backdrop-blur-md shadow-[0_0_30px_rgba(201,169,110,0.2)]"
            data-cursor="open"
          >
            {t('cta1')}
          </button>

          <a
            href="#services"
            onClick={() => soundEngine?.playClick(0.03)}
            className="px-6 py-4 text-label text-[--text-secondary] hover:text-[--text-primary] transition-colors flex items-center gap-2 group"
          >
            <span>{t('cta2')}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>

      {/* ── Bottom Bar Studio Metadata ─────────────────────────────────────── */}
      <div className="z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t border-white/10 text-label text-[--text-secondary]">
        <div>EST. 2024 — THAILAND · SWEDEN · WORLDWIDE CLIENTS</div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[--accent-gold] animate-pulse" />
          <span>AVAILABLE FOR SELECTIVE HIGH-IMPACT COMMISSIONS</span>
        </div>
      </div>
    </section>
  );
}
