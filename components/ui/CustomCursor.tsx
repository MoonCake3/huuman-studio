'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '@/lib/audio';

type CursorState = 'default' | 'view' | 'open' | 'drag' | 'explore' | 'link' | 'hidden';

interface CursorPosition {
  x: number;
  y: number;
}

interface RingConfig {
  size: number;
  label: string | null;
}

const RING_CONFIGS: Record<CursorState, RingConfig> = {
  default: { size: 36, label: null },
  view:    { size: 80, label: 'VIEW' },
  open:    { size: 80, label: 'OPEN' },
  drag:    { size: 80, label: 'DRAG' },
  explore: { size: 84, label: 'EXPLORE' },
  link:    { size: 54, label: null },
  hidden:  { size: 0,  label: null },
};

const LERP_FACTOR = 0.14;

function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mouse       = useRef<CursorPosition>({ x: -200, y: -200 });
  const ringPos     = useRef<CursorPosition>({ x: -200, y: -200 });
  const magneticRef = useRef<HTMLElement | null>(null);
  const isVisible   = useRef(false);

  const [cursorState, setCursorState] = useState<CursorState>('default');

  const config = RING_CONFIGS[cursorState] ?? RING_CONFIGS.default;

  useEffect(() => {
    // Only run on non-touch pointer devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return;

    document.body.classList.add('custom-cursor-active');

    let rafId: number;

    const tick = () => {
      const dot  = dotRef.current;
      const ring = ringRef.current;

      if (dot && ring) {
        let targetX = mouse.current.x;
        let targetY = mouse.current.y;

        // Magnetic pull toward element center if applicable
        if (magneticRef.current) {
          const rect   = magneticRef.current.getBoundingClientRect();
          const cx     = rect.left + rect.width  / 2;
          const cy     = rect.top  + rect.height / 2;
          const dx     = mouse.current.x - cx;
          const dy     = mouse.current.y - cy;
          const dist   = Math.sqrt(dx * dx + dy * dy);
          const radius = Math.max(rect.width, rect.height) * 0.8;

          if (dist < radius) {
            const pull = 0.38;
            targetX = cx + dx * pull;
            targetY = cy + dy * pull;
          }
        }

        // Dot: snaps to current cursor
        dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;

        // Ring: smoothly lerps to target
        ringPos.current.x = lerp(ringPos.current.x, targetX, LERP_FACTOR);
        ringPos.current.y = lerp(ringPos.current.y, targetY, LERP_FACTOR);
        ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible.current) {
        isVisible.current = true;
        dotRef.current?.classList.remove('opacity-0');
        ringRef.current?.classList.remove('opacity-0');
      }
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      dotRef.current?.classList.add('opacity-0');
      ringRef.current?.classList.add('opacity-0');
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const cursorEl   = target.closest('[data-cursor]') as HTMLElement | null;
      const magneticEl = target.closest('[data-magnetic]') as HTMLElement | null;

      magneticRef.current = magneticEl;

      if (cursorEl) {
        const val = cursorEl.getAttribute('data-cursor') as CursorState | null;
        if (val && val in RING_CONFIGS) {
          setCursorState(val);
          soundEngine?.playChime(1100, 0.02);
          return;
        }
      }

      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.getAttribute('role') === 'button';

      if (isInteractive) {
        setCursorState('link');
        soundEngine?.playChime(1250, 0.015);
      } else {
        setCursorState('default');
      }
    };

    const onMouseDown = () => {
      soundEngine?.playClick(0.04);
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mousedown', onMouseDown, { passive: true });

    rafId = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mousedown', onMouseDown);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Central pinpoint */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="
          pointer-events-none fixed left-0 top-0 z-[9999]
          hidden md:block
          opacity-0 transition-opacity duration-200
          will-change-transform
        "
        style={{ isolation: 'isolate' }}
      >
        <div
          className="rounded-full bg-[#C9A96E] shadow-[0_0_8px_rgba(201,169,110,0.8)]"
          style={{ width: 4, height: 4 }}
        />
      </div>

      {/* Floating magnetic ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="
          pointer-events-none fixed left-0 top-0 z-[9998]
          hidden md:flex items-center justify-center
          opacity-0 transition-opacity duration-200
          will-change-transform
        "
        style={{ isolation: 'isolate' }}
      >
        <motion.div
          animate={{
            width:   config.size,
            height:  config.size,
            opacity: cursorState === 'hidden' ? 0 : 1,
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 26, mass: 0.6 }}
          className="
            rounded-full border border-[#C9A96E]/50
            flex items-center justify-center
            relative backdrop-blur-[1px]
          "
          style={{ originX: '50%', originY: '50%' }}
        >
          <AnimatePresence mode="wait">
            {config.label && (
              <motion.span
                key={config.label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="
                  text-[#C9A96E] font-sans font-medium
                  tracking-[0.25em] leading-none select-none
                "
                style={{ fontSize: 9 }}
              >
                {config.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
