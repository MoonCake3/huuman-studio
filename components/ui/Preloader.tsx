'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const LETTERS = 'HUUMAN'.split('');

export default function Preloader({ onComplete }: PreloaderProps) {
  const [mounted, setMounted] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Safety fallback timer: guarantee dismissal after 1.4s max
    const fallbackTimer = setTimeout(() => {
      setMounted(false);
      onCompleteRef.current();
    }, 1400);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          clearTimeout(fallbackTimer);
          setMounted(false);
          onCompleteRef.current();
        },
      });

      // Phase 1: Stagger character reveal
      tl.set(lettersRef.current, {
        yPercent: 100,
        opacity: 1,
      });

      tl.to(lettersRef.current, {
        yPercent: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.06,
      });

      // Phase 2: Hold briefly
      tl.to({}, { duration: 0.15 });

      // Phase 3: Horizontal line expands from center
      tl.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 1 },
        { scaleX: 1, duration: 0.35, ease: 'expo.out' }
      );

      // Phase 4: Letters + line fade out
      tl.to(
        [lettersRef.current, lineRef.current],
        {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
        },
        '+=0.05'
      );

      // Phase 5: Container slides up and out
      tl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.5,
          ease: 'expo.inOut',
        },
        '-=0.1'
      );
    }, containerRef);

    return () => {
      clearTimeout(fallbackTimer);
      ctx.revert();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="
        fixed inset-0 z-[9998]
        flex flex-col items-center justify-center
        bg-[#060914]
        pointer-events-none
        will-change-transform
      "
      style={{ isolation: 'isolate' }}
    >
      {/* Letter strip */}
      <div className="flex items-center overflow-hidden" aria-hidden="true">
        {LETTERS.map((char, i) => (
          <div
            key={i}
            className="overflow-hidden"
            style={{ display: 'inline-block' }}
          >
            <span
              ref={(el) => {
                lettersRef.current[i] = el;
              }}
              className="
                inline-block
                font-sans font-light tracking-[0.35em]
                text-[clamp(2.5rem,8vw,6rem)]
                text-[#F0EDE8]
                select-none
                will-change-transform
              "
              style={{
                lineHeight: 1.05,
                opacity: 1,
              }}
            >
              {char}
            </span>
          </div>
        ))}
      </div>

      {/* Expansion line */}
      <div
        ref={lineRef}
        className="absolute left-0 right-0 opacity-0"
        style={{
          top: '50%',
          transform: 'scaleX(0)',
          transformOrigin: 'center',
          height: '1px',
          background:
            'linear-gradient(90deg, transparent, #C9A96E 30%, #C9A96E 70%, transparent)',
        }}
      />
    </div>
  );
}
