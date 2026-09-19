'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundEngine } from '@/lib/audio';

gsap.registerPlugin(ScrollTrigger);

interface ProcessSectionProps {
  onRequestDemo?: () => void;
}

export default function ProcessSection({ onRequestDemo }: ProcessSectionProps) {
  const t = useTranslations('process');
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(1);
  const steps = t.raw('steps') as Array<{ number: string; title: string; desc: string }>;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const stepEls = stepsRef.current?.querySelectorAll('.process-step');

      stepEls?.forEach((step, i) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      gsap.fromTo(
        '.process-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.8,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative py-32 px-6 sm:px-12 lg:px-20 bg-[--bg-void] overflow-hidden"
      aria-label="HUUMAN Studio Process Methodology"
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full opacity-5 blur-[120px] pointer-events-none"
        style={{ background: '#C9A96E' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20 max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-[--accent-gold]" />
            <p className="text-label text-[--accent-gold] tracking-[0.25em]">
              {t('label')} {'//'} METHODOLOGY
            </p>
          </div>
          <h2 className="font-display text-display-lg text-[--text-primary] uppercase tracking-tight leading-none mb-4">
            {t('headline')}
          </h2>
          <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed">
            High-touch, personal, and remarkably low-friction. We prove our capability before you commit.
          </p>
        </div>

        {/* Steps Grid with Connector */}
        <div ref={stepsRef} className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-white/10">
            <div
              className="process-line absolute inset-0 bg-gradient-to-r from-[#C9A96E] via-white/30 to-[#C9A96E] origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-4">
            {steps.map((step, i) => {
              const isSelected = activeStep === i;
              return (
                <div
                  key={i}
                  onClick={() => {
                    setActiveStep(i);
                    soundEngine?.playClick(0.03);
                  }}
                  className={`
                    process-step relative p-5 rounded-sm border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-white/[0.04] border-[#C9A96E]/60 shadow-[0_0_20px_rgba(201,169,110,0.15)]'
                        : 'bg-white/[0.01] border-white/5 hover:border-white/20'
                    }
                  `}
                >
                  {/* Node */}
                  <div className="relative w-12 h-12 mb-6">
                    <div className="absolute inset-0 rounded-full border border-white/15" />
                    <div
                      className={`absolute inset-1.5 rounded-full border transition-all duration-300 ${
                        isSelected
                          ? 'border-[#C9A96E] bg-[#C9A96E]/20'
                          : 'border-white/10'
                      }`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-mono text-xs font-bold text-[#F0EDE8]">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="font-display text-lg text-[#F0EDE8] mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact and Direct Initiation Strip */}
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <span className="font-display text-lg text-[#F0EDE8] block">
              READY TO COMMENCE THE DISCOVERY PHASE?
            </span>
            <span className="text-xs text-[#6B7280]">
              Direct communication with studio leadership via Instagram (@huuman.essentials), Email (marketingwsean@gmail.com) or Google Meet.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                soundEngine?.playClick(0.05);
                onRequestDemo?.();
              }}
              className="px-7 py-3.5 bg-[--accent-gold] text-[#060914] text-xs font-medium uppercase tracking-wider rounded-sm hover:bg-[#F0EDE8] transition-colors"
              data-cursor="open"
            >
              START WITH A DEMO →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
