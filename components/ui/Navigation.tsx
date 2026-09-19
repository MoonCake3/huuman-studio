'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import AudioToggle from '@/components/ui/AudioToggle';
import { soundEngine } from '@/lib/audio';

type Locale = 'en' | 'th' | 'sv';

interface NavLink {
  labelKey: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { labelKey: 'work', href: '#work' },
  { labelKey: 'services', href: '#services' },
  { labelKey: 'transformation', href: '#transformation' },
  { labelKey: 'packages', href: '#packages' },
  { labelKey: 'process', href: '#process' },
];

const LOCALES: Locale[] = ['en', 'th', 'sv'];

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  th: 'TH',
  sv: 'SV',
};

// ── Animation variants ────────────────────────────────────────────────────────
const overlayVariants: Variants = {
  closed: {
    opacity: 0,
    clipPath: 'inset(0 0 100% 0)',
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  },
  open: {
    opacity: 1,
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  },
};

const overlayLinkVariants: Variants = {
  closed: { y: '100%', opacity: 0 },
  open: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.1 + i * 0.06,
      duration: 0.55,
      ease: [0.33, 1, 0.68, 1],
    },
  }),
};

interface NavigationProps {
  onRequestDemo?: (category?: string, pkg?: string) => void;
}

export default function Navigation({ onRequestDemo }: NavigationProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const activeLocale = useLocale() as Locale;

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // ── Scroll glass effect ──────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Lock body scroll when menu open ──────────────────────────────────────
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // ── Keyboard close ───────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // ── Language switcher ────────────────────────────────────────────────────
  const cycleLocale = useCallback(() => {
    soundEngine?.playClick(0.04);
    const idx = LOCALES.indexOf(activeLocale);
    const next = LOCALES[(idx + 1) % LOCALES.length];

    try {
      localStorage.setItem('huuman_locale', next);
    } catch {
      // ignore
    }

    const segments = pathname.split('/').filter(Boolean);
    const isLocaleSegment = LOCALES.includes(segments[0] as Locale);
    const rest = isLocaleSegment ? segments.slice(1) : segments;
    router.replace(`/${next}/${rest.join('/')}`);
  }, [activeLocale, pathname, router]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleDemoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    soundEngine?.playClick(0.05);
    closeMenu();
    if (onRequestDemo) {
      onRequestDemo();
    } else {
      router.push('#contact');
    }
  };

  return (
    <>
      {/* ── Global Header ─────────────────────────────────────────────── */}
      <header
        role="banner"
        className={`
          fixed top-0 left-0 right-0 z-50
          px-6 sm:px-10 md:px-16 h-20
          flex items-center justify-between
          transition-all duration-500
          ${
            scrolled
              ? 'bg-[#060914]/80 backdrop-blur-md border-b border-white/[0.06]'
              : 'bg-transparent'
          }
        `}
      >
        {/* Wordmark */}
        <Link
          href="/"
          className="
            group flex items-center gap-2.5
            text-[#F0EDE8] tracking-[0.35em] uppercase font-light text-xs
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A96E]
            rounded-sm select-none
          "
          aria-label="HUUMAN STUDIO – Home"
          data-cursor="explore"
        >
          <span className="w-2 h-2 rounded-full bg-[--accent-gold] shadow-[0_0_8px_rgba(201,169,110,0.8)]" />
          <span className="group-hover:text-[--accent-gold] transition-colors duration-300 font-sans tracking-[0.3em]">
            HUUMAN
          </span>
          <span className="text-[9px] text-[#6B7280] tracking-[0.4em] hidden sm:inline">
            STUDIO
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-8"
        >
          {NAV_LINKS.map(({ labelKey, href }) => (
            <a
              key={href}
              href={href}
              className="
                group relative text-[10px] tracking-[0.25em] uppercase font-light
                text-[#F0EDE8]/70 hover:text-[#F0EDE8] transition-colors duration-300
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A96E]
                rounded-sm py-1
              "
              data-cursor="link"
            >
              <span>{t(labelKey)}</span>
              <span
                className="
                  absolute -bottom-0.5 left-0 h-px w-0 bg-[#C9A96E]
                  transition-all duration-300 ease-out group-hover:w-full
                "
              />
            </a>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Audio atmosphere toggle */}
          <AudioToggle />

          {/* Locale switcher */}
          <button
            type="button"
            onClick={cycleLocale}
            aria-label={`Switch language. Current: ${LOCALE_LABELS[activeLocale]}`}
            className="
              text-[10px] tracking-widest uppercase font-light
              text-[#F0EDE8]/60 hover:text-[#C9A96E]
              border border-white/10 hover:border-[#C9A96E]/50
              transition-all duration-300
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A96E]
              rounded-sm px-2 py-1 select-none
            "
            data-cursor="link"
          >
            {LOCALE_LABELS[activeLocale]}
          </button>

          {/* CTA: Request Demo */}
          <button
            type="button"
            onClick={handleDemoClick}
            className="
              hidden md:inline-flex items-center gap-2
              text-[10px] tracking-[0.2em] uppercase font-medium
              text-[#060914] bg-[#C9A96E] hover:bg-[#F0EDE8]
              rounded-full px-5 py-2.5
              transition-all duration-300 shadow-[0_0_20px_rgba(201,169,110,0.25)]
              hover:shadow-[0_0_25px_rgba(240,237,232,0.3)]
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A96E]
            "
            data-cursor="open"
          >
            <span>{t('requestDemo')}</span>
            <span className="text-xs">→</span>
          </button>

          {/* Hamburger (mobile / tablet) */}
          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => {
              soundEngine?.playClick(0.04);
              setMenuOpen((v) => !v);
            }}
            aria-expanded={menuOpen}
            aria-controls="fullscreen-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="
              lg:hidden relative flex flex-col justify-center items-center
              w-9 h-9 border border-white/10 rounded-sm
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A96E]
            "
          >
            <span
              className={`
                block absolute h-px w-5 bg-[#F0EDE8] transition-all duration-300
                ${menuOpen ? 'rotate-45' : '-translate-y-[4px]'}
              `}
            />
            <span
              className={`
                block absolute h-px bg-[#F0EDE8] transition-all duration-300
                ${menuOpen ? 'w-0 opacity-0' : 'w-5 opacity-100'}
              `}
            />
            <span
              className={`
                block absolute h-px w-5 bg-[#F0EDE8] transition-all duration-300
                ${menuOpen ? '-rotate-45' : 'translate-y-[4px]'}
              `}
            />
          </button>
        </div>
      </header>

      {/* ── Fullscreen Cinematic Overlay ────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="fullscreen-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="
              fixed inset-0 z-40
              bg-[#060914]/95 backdrop-blur-2xl
              flex flex-col justify-between
              px-8 sm:px-16 pt-28 pb-12
            "
          >
            {/* Background ambient lighting */}
            <div
              className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none opacity-10 blur-[120px]"
              style={{ background: '#C9A96E' }}
              aria-hidden="true"
            />

            {/* Links list */}
            <nav
              aria-label="Mobile primary navigation"
              className="flex-1 flex flex-col justify-center gap-3 sm:gap-5"
            >
              {NAV_LINKS.map(({ labelKey, href }, i) => (
                <div key={href} className="overflow-hidden">
                  <motion.div
                    custom={i}
                    variants={overlayLinkVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <a
                      href={href}
                      onClick={() => {
                        soundEngine?.playClick(0.04);
                        closeMenu();
                      }}
                      className="
                        group inline-flex items-baseline gap-4
                        font-display font-light text-[clamp(2.5rem,8vw,5.5rem)]
                        tracking-tight leading-none
                        text-[#F0EDE8]/80 hover:text-[#C9A96E]
                        transition-colors duration-300
                      "
                    >
                      <span className="text-xs font-sans text-[#6B7280] tracking-widest">
                        0{i + 1}
                      </span>
                      <span className="relative">
                        {t(labelKey)}
                      </span>
                    </a>
                  </motion.div>
                </div>
              ))}
            </nav>

            {/* Bottom row */}
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <button
                type="button"
                onClick={handleDemoClick}
                className="
                  inline-flex items-center gap-3
                  text-xs tracking-[0.25em] uppercase font-medium
                  text-[#060914] bg-[#C9A96E] hover:bg-[#F0EDE8]
                  rounded-full px-8 py-3.5
                  transition-all duration-300 shadow-[0_0_30px_rgba(201,169,110,0.3)]
                "
              >
                <span>{t('requestDemo')}</span>
                <span>→</span>
              </button>

              <div className="flex items-center gap-6 text-[11px] text-[#6B7280] tracking-widest uppercase">
                <span>THAILAND</span>
                <span className="w-1 h-1 rounded-full bg-[#C9A96E]" />
                <span>SWEDEN</span>
                <span className="w-1 h-1 rounded-full bg-[#C9A96E]" />
                <span>WORLDWIDE</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
