'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PhilosophySection() {
  const t = useTranslations('philosophy');
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1.2,
      });

      // Background image scale & zoom effect
      if (bgImgRef.current) {
        gsap.fromTo(
          bgImgRef.current,
          { scale: 1, opacity: 0.15 },
          {
            scale: 1.15,
            opacity: 0.35,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=100%',
              scrub: true,
            },
          }
        );
      }

      // Timeline for text reveals inside pinned section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: 1.2,
        },
      });

      tl.fromTo(
        '.philo-group-1 .philo-line',
        { opacity: 0.1, y: 30 },
        { opacity: 1, y: 0, stagger: 0.15, ease: 'power2.out' }
      )
        .fromTo(
          '.philo-divider',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.4, ease: 'power2.inOut' },
          '-=0.2'
        )
        .fromTo(
          '.philo-group-2 .philo-line',
          { opacity: 0.1, y: 30 },
          { opacity: 1, y: 0, stagger: 0.15, ease: 'power2.out' }
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[--bg-void] flex items-center justify-center overflow-hidden"
    >
      {/* Background Architectural Artwork Layer */}
      <div ref={bgImgRef} className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <Image
          src="/images/huuman_architecture.jpg"
          alt="HUUMAN Impossible Architecture Background"
          fill
          className="object-cover filter contrast-125"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060914] via-transparent to-[#060914]" />
      </div>

      {/* Horizontal divider line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 z-0" />

      {/* Text Container */}
      <div className="relative z-10 w-full max-w-7xl px-8 md:px-16 py-20 flex flex-col justify-between min-h-[70vh]">
        {/* Top group */}
        <div className="philo-group-1 max-w-4xl space-y-2">
          <p className="philo-line font-display text-display-lg text-[--text-primary] tracking-tight">
            {t('line1')}
          </p>
          <p className="philo-line font-display text-display-lg text-[--text-primary] tracking-tight">
            {t('line2')}
          </p>
          <p className="philo-line font-display text-display-lg text-[--text-primary] tracking-tight">
            {t('line3')}
          </p>
        </div>

        {/* Gold accent line divider */}
        <div className="my-12">
          <div className="philo-divider w-32 h-px bg-[--accent-gold] origin-left" />
        </div>

        {/* Bottom group — indented right */}
        <div className="philo-group-2 max-w-4xl space-y-2 self-end md:pl-[15vw]">
          <p className="philo-line font-display text-display-lg text-[--accent-gold] tracking-tight">
            {t('line4')}
          </p>
          <p className="philo-line font-display text-display-lg text-[--accent-gold] tracking-tight">
            {t('line5')}
          </p>
          <p className="philo-line font-display text-display-lg text-[--accent-gold] tracking-tight">
            {t('line6')}
          </p>
        </div>

        {/* Footer label */}
        <div className="absolute bottom-6 right-8 md:right-16 text-label text-[--text-secondary] font-mono">
          HUUMAN PHILOSOPHY — 2024
        </div>
      </div>
    </section>
  );
}
