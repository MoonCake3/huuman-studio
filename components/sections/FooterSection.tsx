'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundEngine } from '@/lib/audio';

gsap.registerPlugin(ScrollTrigger);

interface FooterSectionProps {
  onRequestDemo?: () => void;
}

export default function FooterSection({ onRequestDemo }: FooterSectionProps) {
  const t = useTranslations('footer');
  const footerRef = useRef<HTMLElement>(null);
  const [times, setTimes] = useState({ bkk: '--:--', sto: '--:--' });

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      const bkk = now.toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Bangkok',
        hour: '2-digit',
        minute: '2-digit',
      });
      const sto = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/Stockholm',
        hour: '2-digit',
        minute: '2-digit',
      });
      setTimes({ bkk, sto });
    };

    updateClocks();
    const timer = setInterval(updateClocks, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        '.footer-line',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 1.1, ease: 'power3.out' }
      )
        .fromTo(
          '.footer-cta',
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          '.footer-meta',
          { opacity: 0 },
          { opacity: 1, stagger: 0.08, duration: 0.7 },
          '-=0.4'
        );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative bg-[--bg-void] overflow-hidden select-none"
      aria-label="HUUMAN Studio Footer and Contact"
    >
      {/* Calm Horizon Glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] opacity-[0.06]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, #C9A96E 0%, #3B82F6 40%, transparent 70%)',
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
      </div>

      <div className="relative z-10 px-6 sm:px-12 lg:px-20 pt-36 pb-16">
        {/* Main Headline */}
        <div className="max-w-4xl mb-16">
          <span className="text-label text-[--accent-gold] block mb-4 tracking-[0.3em]">
            THE HORIZON
          </span>
          <h2 className="font-display text-display-xl text-[--text-primary] tracking-tight uppercase leading-none overflow-hidden">
            <span className="footer-line block">{t('headline1')}</span>
            <span className="footer-line block">{t('headline2')}</span>
            <span className="footer-line block text-[--accent-gold]">{t('headline3')}</span>
          </h2>
        </div>

        {/* CTA: Request A Demo */}
        <div className="footer-cta mb-28 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <button
            type="button"
            onClick={() => {
              soundEngine?.playClick(0.05);
              onRequestDemo?.();
            }}
            className="
              group inline-flex items-center gap-6 px-10 py-5
              bg-[--accent-gold] text-[#060914] hover:bg-[#F0EDE8]
              rounded-sm transition-all duration-400 font-medium
              shadow-[0_0_40px_rgba(201,169,110,0.3)] hover:shadow-[0_0_50px_rgba(240,237,232,0.4)]
            "
            data-cursor="open"
          >
            <span className="text-sm font-sans tracking-[0.25em] uppercase font-bold">
              {t('cta')}
            </span>
            <span className="w-8 h-8 rounded-full bg-[#060914] text-[--accent-gold] flex items-center justify-center text-sm group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </button>

          <span className="text-xs text-[#6B7280] font-mono">
            Zero commitment · Bespoke concept demo created first.
          </span>
        </div>

        {/* World Clocks Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-y border-white/10 mb-12 text-xs font-mono text-[#9CA3AF]">
          <div>
            <span className="text-[#6B7280] block text-[9px] uppercase">BANGKOK (GMT+7)</span>
            <span className="text-[#F0EDE8] text-sm">{times.bkk}</span>
          </div>
          <div>
            <span className="text-[#6B7280] block text-[9px] uppercase">STOCKHOLM (GMT+1)</span>
            <span className="text-[#F0EDE8] text-sm">{times.sto}</span>
          </div>
          <div>
            <span className="text-[#6B7280] block text-[9px] uppercase">SYSTEM OPERATIONAL STATUS</span>
            <span className="text-[#10B981] text-sm">ALL SYSTEMS NORMAL</span>
          </div>
          <div>
            <span className="text-[#6B7280] block text-[9px] uppercase">DIRECT DISPATCH</span>
            <a
              href="mailto:marketingwsean@gmail.com"
              className="text-[--accent-gold] hover:underline text-sm font-mono"
            >
              marketingwsean@gmail.com
            </a>
          </div>
        </div>

        {/* Footer Meta Bottom Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-label text-[#6B7280]">
          {/* Wordmark */}
          <div className="footer-meta flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[--accent-gold]" />
            <span className="tracking-[0.35em] text-[#F0EDE8] font-bold">
              {t('copy')}
            </span>
            <span className="text-[10px] text-[#6B7280]">
              CREATIVE TECHNOLOGY &amp; AI
            </span>
          </div>

          {/* Social and Direct Links */}
          <div className="footer-meta flex items-center gap-6">
            <a
              href="https://www.instagram.com/huuman.essentials/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[--accent-gold] transition-colors"
              aria-label="HUUMAN Studio on Instagram"
            >
              Instagram (@huuman.essentials)
            </a>
            <span className="w-3 h-px bg-white/20" />
            <a
              href="mailto:marketingwsean@gmail.com"
              className="hover:text-[--accent-gold] transition-colors"
              aria-label="Email HUUMAN Studio"
            >
              marketingwsean@gmail.com
            </a>
            <span className="w-3 h-px bg-white/20" />
            <button
              type="button"
              onClick={() => {
                soundEngine?.playClick(0.04);
                onRequestDemo?.();
              }}
              className="hover:text-[--accent-gold] transition-colors text-left"
              aria-label="Schedule Google Meet Discovery Session"
            >
              Book Google Meet →
            </button>
          </div>

          {/* Locations */}
          <div className="footer-meta text-[10px] font-mono">
            {t('location')}
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-meta mt-8 text-[9px] font-mono text-[#6B7280]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} HUUMAN STUDIO. ALL RIGHTS RESERVED.</span>
          <span>CRAFTED WITH PRECISION · ZERO TEMPLATES</span>
        </div>
      </div>
    </footer>
  );
}
