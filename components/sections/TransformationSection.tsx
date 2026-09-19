'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { soundEngine } from '@/lib/audio';

interface TransformationSectionProps {
  onRequestDemo?: () => void;
}

export default function TransformationSection({ onRequestDemo }: TransformationSectionProps) {
  const t = useTranslations('transformation');
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const beforePoints = [
    { title: 'Generic Web Presence', desc: 'Template layout identical to dozens of local and regional competitors.' },
    { title: 'Manual Lead Operations', desc: 'Staff bogged down answering repetitive inquiries, missing late-night bookings.' },
    { title: 'Disconnected Software', desc: 'Spreadsheets, loose WhatsApp messages, and forgotten customer follow-ups.' },
    { title: 'Low Perceived Value', desc: 'Outdated appearance forcing discounting against price-cutting competitors.' },
  ];

  const afterPoints = [
    { title: 'Sovereign Digital Experience', desc: 'Atmospheric, award-winning aesthetics that instantly command premium pricing.' },
    { title: 'Autonomous AI Business OS', desc: 'Intelligent multi-lingual concierge qualifying and dispatching clients 24/7.' },
    { title: 'One Unified Revenue Machine', desc: 'Inquiries, bookings, payments, and client records synced in real time.' },
    { title: 'Market Leadership Authority', desc: 'A digital landmark that makes your business the obvious, prestigious choice.' },
  ];

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(10, Math.min(90, (x / rect.width) * 100));
    setSliderPosition(pct);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
    soundEngine?.playClick(0.04);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      updatePosition(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      soundEngine?.playChime(850, 0.03);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      updatePosition(e.touches[0].clientX);
    }
  };

  return (
    <section
      id="transformation"
      className="relative w-full min-h-screen flex flex-col justify-center py-28 px-6 sm:px-12 lg:px-20 bg-[--bg-void] overflow-hidden select-none"
      aria-label="Business transformation before and after comparison"
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full pointer-events-none opacity-10 blur-[140px]"
        style={{ background: '#C9A96E' }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="max-w-3xl mb-14">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 rounded-full bg-[--accent-gold]" />
          <span className="text-label text-[--accent-gold] tracking-[0.3em]">
            {t('label')} {'//'} QUANTUM SHIFT
          </span>
        </div>
        <h2 className="font-display text-display-lg text-[--text-primary] uppercase tracking-tight leading-none mb-4">
          {t('headline')}
        </h2>
        <p className="text-sm sm:text-base text-[#9CA3AF] max-w-xl leading-relaxed">
          Most agencies hand over a static brochure. We re-engineer the entire digital layer of your business into an automated, living system.
        </p>
      </div>

      {/* ── Interactive Transformation Comparison Board ──────────────────── */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative w-full rounded-sm border border-white/15 bg-[#090D1D] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.8)]"
        style={{ minHeight: '520px' }}
      >
        {/* RIGHT LAYER: AFTER HUUMAN (Full width underneath) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C1128] via-[#090D1D] to-[#060914] p-8 sm:p-12 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#C9A96E]/20 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[--accent-gold] shadow-[0_0_10px_rgba(201,169,110,0.8)]" />
              <span className="font-mono text-xs tracking-widest text-[#F0EDE8] uppercase font-bold">
                AFTER HUUMAN // SOVEREIGN ENGINE
              </span>
            </div>
            <span className="text-[10px] text-[--accent-gold] font-mono tracking-widest uppercase">
              HIGH CONVERSION &amp; PRESTIGE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-auto py-8">
            {afterPoints.map((pt, i) => (
              <div
                key={i}
                className="p-5 bg-[#C9A96E]/5 border border-[#C9A96E]/20 rounded-sm space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[--accent-gold]">0{i + 1}</span>
                  <span className="text-[#10B981] text-xs">✦</span>
                </div>
                <h4 className="font-display text-base text-[#F0EDE8] tracking-tight">{pt.title}</h4>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">{pt.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280] border-t border-white/5 pt-4">
            <span>METRIC: REVENUE PREDICTABILITY</span>
            <span className="text-[#10B981]">STATUS: SCALEABLE &amp; AUTOMATED</span>
          </div>
        </div>

        {/* LEFT LAYER: BEFORE (Clipped by sliderPosition) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#121217] to-[#0A0A0F] p-8 sm:p-12 flex flex-col justify-between overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="font-mono text-xs tracking-widest text-[#EF4444] uppercase font-bold">
                BEFORE // THE MANUAL FRAGMENTATION
              </span>
            </div>
            <span className="text-[10px] text-[#6B7280] font-mono tracking-widest uppercase">
              REPETITIVE &amp; ORDINARY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-auto py-8">
            {beforePoints.map((pt, i) => (
              <div
                key={i}
                className="p-5 bg-white/[0.02] border border-white/5 rounded-sm space-y-2 opacity-60"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#6B7280]">0{i + 1}</span>
                  <span className="text-[#EF4444] text-xs">✕</span>
                </div>
                <h4 className="font-display text-base text-[#9CA3AF] line-through">{pt.title}</h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">{pt.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280] border-t border-white/5 pt-4">
            <span>METRIC: TIME LOSS &amp; FRICTION</span>
            <span className="text-[#EF4444]">STATUS: RESTRICTIVE</span>
          </div>
        </div>

        {/* DRAG HANDLE BAR */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 bottom-0 w-1 bg-[--accent-gold] cursor-ew-resize z-30"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#060914] border-2 border-[--accent-gold] flex items-center justify-center shadow-[0_0_20px_rgba(201,169,110,0.8)]">
            <span className="text-xs font-mono text-[--accent-gold]">↔</span>
          </div>
        </div>
      </div>

      {/* ── Call To Action ───────────────────────────────────────────────── */}
      <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-white/10">
        <div>
          <span className="font-display text-xl sm:text-2xl text-[#F0EDE8] block">
            SEE YOUR SPECIFIC TRANSFORMATION.
          </span>
          <span className="text-xs text-[#6B7280]">
            We build a tailored demo concept before any formal agreement. Zero friction.
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine?.playClick(0.05);
            onRequestDemo?.();
          }}
          className="
            group inline-flex items-center gap-3 px-8 py-4 text-label
            bg-[--accent-gold] text-[#060914] hover:bg-[#F0EDE8]
            rounded-sm transition-all duration-300 font-medium
            shadow-[0_0_25px_rgba(201,169,110,0.3)]
          "
          data-cursor="open"
        >
          <span>{t('cta')}</span>
          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </button>
      </div>
    </section>
  );
}
