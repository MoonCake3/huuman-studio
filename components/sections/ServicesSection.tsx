'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundEngine } from '@/lib/audio';

gsap.registerPlugin(ScrollTrigger);

const serviceKeys = ['01', '02', '03', '04'] as const;

interface ServiceDetail {
  src: string;
  alt: string;
  accent: string;
  badge: string;
  telemetry: string[];
}

const serviceImages: Record<string, ServiceDetail> = {
  '01': {
    src: '/images/service_websites.jpg',
    alt: 'HUUMAN Flagship Digital Worlds — Floating Optical Glass Blueprints',
    accent: '#C9A96E',
    badge: 'DISCIPLINE // FLAGSHIP DIGITAL EXP',
    telemetry: ['OPTICAL SILICA GLASS', 'SUB-SECOND EDGE LATENCY', 'NO TEMPLATES'],
  },
  '02': {
    src: '/images/service_ai_os.jpg',
    alt: 'HUUMAN AI Business OS — Spatial Command & Telemetry Center',
    accent: '#3B82F6',
    badge: 'DISCIPLINE // INTELLIGENT OS',
    telemetry: ['NEURAL ORCHESTRATION', '24/7 MULTI-AGENT INGESTION', 'AUTO DISPATCH'],
  },
  '03': {
    src: '/images/service_automation.jpg',
    alt: 'HUUMAN Autonomous Pipelines — Geometric Monolithic Alignment',
    accent: '#8B5CF6',
    badge: 'DISCIPLINE // WORKFLOW AUTONOMY',
    telemetry: ['ZERO OPERATIONAL LEAKAGE', 'CRM & PAYMENT PROTOCOLS', 'SELF-HEALING'],
  },
  '04': {
    src: '/images/service_operations.jpg',
    alt: 'HUUMAN Managed AI Operations — Deep Space Orbital Telemetry',
    accent: '#10B981',
    badge: 'DISCIPLINE // MANAGED INTELLIGENCE',
    telemetry: ['99.99% ORBITAL RELIABILITY', 'HUMANS IN THE LOOP', 'WEEKLY TUNING'],
  },
};

interface ServicesSectionProps {
  onRequestDemo?: (category?: string, pkg?: string) => void;
}

export default function ServicesSection({ onRequestDemo }: ServicesSectionProps) {
  const t = useTranslations('services');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const serviceEls = sectionRef.current?.querySelectorAll('.service-item');

      serviceEls?.forEach((el) => {
        const textCol = el.querySelector('.service-text');
        const imgWrapper = el.querySelector('.service-img-wrapper');
        const img = el.querySelector('.service-img');

        gsap.fromTo(
          textCol,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          imgWrapper,
          { opacity: 0, scale: 0.94 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -10, scale: 1.15 },
            {
              yPercent: 10,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative py-32 bg-[--bg-void] overflow-hidden">
      {/* Background atmospheric ambient light */}
      <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-[--bg-deep] rounded-full blur-[160px] pointer-events-none opacity-40" />

      {/* Section label & Title */}
      <div className="px-8 md:px-16 mb-20 max-w-4xl">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-2 h-2 rounded-full bg-[--accent-gold]" />
          <p className="text-label text-[--accent-gold] tracking-[0.25em]">
            {t('label')} {'//'} THE FOUR DISCIPLINES
          </p>
        </div>
        <h2 className="font-display text-display-lg text-[--text-primary] tracking-tight uppercase">
          ENGINEERED FOR SOVEREIGNTY.
        </h2>
      </div>

      <div className="space-y-0">
        {serviceKeys.map((key, i) => {
          const itemData = serviceImages[key];
          const isEven = i % 2 === 0;

          return (
            <div
              key={key}
              className="service-item relative border-t border-white/10 py-20 md:py-32 px-8 md:px-16 overflow-hidden group"
              onMouseEnter={() => soundEngine?.playHover(440 + i * 80, 0.02)}
            >
              <div
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-12 lg:gap-20 items-center`}
              >
                {/* Text content column */}
                <div className="service-text flex-1 space-y-6 z-10">
                  <div className="flex items-center gap-4">
                    <span className="text-label font-mono text-xs" style={{ color: itemData.accent }}>
                      {t(`${key}.number`)}
                    </span>
                    <span className="w-12 h-px bg-white/15" />
                    <span className="font-mono text-[10px] tracking-widest text-white/50 uppercase">
                      {itemData.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-display-md text-[--text-primary] group-hover:text-white transition-colors duration-300">
                    {t(`${key}.title`)}
                  </h3>

                  <p className="text-[--text-secondary] text-base md:text-lg max-w-xl leading-relaxed">
                    {t(`${key}.sub`)}
                  </p>

                  {/* Telemetry Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {itemData.telemetry.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-[10px] font-mono rounded-full bg-white/5 border border-white/10 text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Request Demo Trigger */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine?.playClick(0.05);
                        onRequestDemo?.('other', key === '01' ? 'core' : key === '02' ? 'growth' : 'sovereign');
                      }}
                      className="inline-flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-[--text-secondary] hover:text-[--accent-gold] transition-colors group/btn"
                    >
                      <span>INQUIRE ABOUT THIS SYSTEM</span>
                      <span className="group-hover/btn:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </button>
                  </div>
                </div>

                {/* Cinematic Artwork Frame */}
                <div className="service-img-wrapper flex-1 relative w-full h-[340px] md:h-[500px] rounded-sm overflow-hidden border border-white/15 group shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                  {/* Subtle glass gradient overlay */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#060914] via-transparent to-transparent opacity-60" />

                  <Image
                    src={itemData.src}
                    alt={itemData.alt}
                    fill
                    className="service-img object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={i === 0}
                  />

                  {/* Accent border glow on hover */}
                  <div
                    className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-2"
                    style={{ borderColor: itemData.accent }}
                  />

                  {/* Corner Coordinates HUD */}
                  <div className="absolute bottom-4 right-4 z-20 font-mono text-[9px] text-white/40 uppercase tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
                    SECTOR {key} {'//'} LAT: 0.00
                  </div>
                </div>
              </div>

              {/* Huge background index number */}
              <div className="absolute -bottom-6 right-8 md:right-16 text-[10rem] md:text-[18rem] font-display text-white/[0.015] leading-none select-none pointer-events-none">
                {t(`${key}.number`)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
