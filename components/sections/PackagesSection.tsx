'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundEngine } from '@/lib/audio';

gsap.registerPlugin(ScrollTrigger);

type Currency = 'THB' | 'USD' | 'EUR' | 'SEK';

interface PackageConfig {
  id: string;
  name: string;
  tier: string;
  setupTHB: number | 'Custom';
  monthlyTHB: number | string | 'Custom';
  description: string;
  features: string[];
  accent: string;
  highlight?: boolean;
}

const PACKAGES: PackageConfig[] = [
  {
    id: 'core',
    name: 'CORE',
    tier: 'FOUNDATION',
    setupTHB: 49000,
    monthlyTHB: 9900,
    description: 'Flagship web presence + AI client qualification. The digital foundation for businesses refusing to look ordinary.',
    features: [
      'Bespoke digital experience (Zero templates)',
      'Multilingual AI Concierge (Thai / Eng / Swe)',
      'Automated Lead Qualification & Intake',
      'Continuous Analytics & Conversion Monitoring',
      'Ongoing Technical Maintenance & Hosting',
    ],
    accent: '#94A3B8',
  },
  {
    id: 'growth',
    name: 'GROWTH',
    tier: 'ACCELERATION',
    setupTHB: 89000,
    monthlyTHB: 19900,
    description: 'Complete digital ecosystem with AI Business OS, customer follow-up pipelines and calendar automation.',
    features: [
      'Everything in Core',
      'Custom AI Business OS Integration',
      'Multi-Channel Ingestion (Web, IG, WhatsApp)',
      'Automated Booking, Invoicing & Payments',
      'Weekly Conversion Audits & Optimization',
      'Priority Engineering Support',
    ],
    accent: '#3B82F6',
    highlight: true,
  },
  {
    id: 'sovereign',
    name: 'SOVEREIGN',
    tier: 'SOVEREIGNTY',
    setupTHB: 149000,
    monthlyTHB: '29,900–49,900',
    description: 'Total operational autonomy. Custom multi-agent workflows, bespoke software, and managed intelligence.',
    features: [
      'Everything in Growth',
      'Custom Autonomous Agent Infrastructure',
      'Dedicated Studio Engineering Lead',
      'Bespoke Internal Tools & Staff Dashboards',
      '24/7 Managed Operations & Model Tuning',
      'Tailored Enterprise SLA',
    ],
    accent: '#C9A96E',
  },
  {
    id: 'custom',
    name: 'CUSTOM AI OS',
    tier: 'ENTERPRISE',
    setupTHB: 'Custom',
    monthlyTHB: 'Custom',
    description: 'Tailored enterprise architecture, multi-location systems, or private internal intelligence networks.',
    features: [
      'Custom Architectural Scope & Deployment',
      'Website + Business OS Core Bundle (฿79,000)',
      'Proprietary Fine-Tuned Local Models',
      'White-Label Operations Architecture',
      'On-Site Executive Strategy Sessions',
    ],
    accent: '#A78BFA',
  },
];

const CURRENCIES: { code: Currency; symbol: string; rate: number }[] = [
  { code: 'THB', symbol: '฿', rate: 1 },
  { code: 'USD', symbol: '$', rate: 1 / 35 },
  { code: 'EUR', symbol: '€', rate: 1 / 38 },
  { code: 'SEK', symbol: 'kr', rate: 1 / 3.3 },
];

interface PackagesSectionProps {
  onRequestDemo?: (pkg?: string) => void;
}

export default function PackagesSection({ onRequestDemo }: PackagesSectionProps) {
  const t = useTranslations('packages');
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currency, setCurrency] = useState<Currency>('THB');

  const activeCurr = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  const formatPrice = (amount: number | string | 'Custom') => {
    if (typeof amount === 'string') {
      if (amount === 'Custom') return 'Custom Proposal';
      return `${activeCurr.symbol}${amount}`;
    }
    const converted = Math.round(amount * activeCurr.rate);
    return `${activeCurr.symbol}${converted.toLocaleString()}`;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('.package-cell');
      cards?.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="packages"
      className="relative py-32 px-6 sm:px-12 lg:px-20 bg-[--bg-deep] overflow-hidden"
      aria-label="HUUMAN Studio Investment and Packages"
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header and Currency Switcher */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-[--accent-gold]" />
              <p className="text-label text-[--accent-gold] tracking-[0.25em]">
                {t('label')} {'//'} SYSTEM ARCHITECTURE
              </p>
            </div>
            <h2 className="font-display text-display-lg text-[--text-primary] uppercase tracking-tight leading-none">
              {t('headline')}
            </h2>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-white/10 rounded-sm">
            <span className="text-[9px] font-mono text-[#6B7280] px-2 uppercase">CURRENCY:</span>
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setCurrency(c.code);
                  soundEngine?.playClick(0.02);
                }}
                className={`px-2.5 py-1 text-[10px] font-mono rounded-sm transition-all ${
                  currency === c.code
                    ? 'bg-[#C9A96E] text-[#060914] font-bold shadow-sm'
                    : 'text-[#9CA3AF] hover:text-[#F0EDE8]'
                }`}
              >
                {c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {PACKAGES.map((pkg) => {
            return (
              <div
                key={pkg.id}
                className={`package-cell relative p-8 flex flex-col justify-between bg-[#090D1D] group transition-colors duration-400 hover:bg-[#0C1128] ${
                  pkg.highlight ? 'ring-1 ring-[--accent-gold]/40' : ''
                }`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-8">
                    <span
                      className="text-[9px] font-mono tracking-[0.3em] uppercase"
                      style={{ color: pkg.accent }}
                    >
                      {pkg.tier}
                    </span>
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: pkg.accent }}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-2xl sm:text-3xl text-[#F0EDE8] tracking-tight mb-4">
                    {pkg.name}
                  </h3>

                  {/* Pricing Box */}
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-3xl sm:text-4xl font-display font-light"
                        style={{ color: pkg.accent }}
                      >
                        {formatPrice(pkg.setupTHB)}
                      </span>
                      {pkg.setupTHB !== 'Custom' && (
                        <span className="text-[10px] font-mono text-[#6B7280]">SETUP</span>
                      )}
                    </div>

                    <div className="text-xs font-mono text-[#9CA3AF] mt-1.5">
                      {pkg.monthlyTHB !== 'Custom' ? (
                        <>
                          <span>{formatPrice(pkg.monthlyTHB)}</span>
                          <span className="text-[#6B7280] ml-1">/ MONTHLY OPS</span>
                        </>
                      ) : (
                        <span>Enterprise Scope</span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#9CA3AF] leading-relaxed mb-8">
                    {pkg.description}
                  </p>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 mb-10">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#D1D5DB]">
                        <span style={{ color: pkg.accent }} className="shrink-0 mt-0.5">
                          ✦
                        </span>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine?.playClick(0.04);
                    onRequestDemo?.(pkg.name);
                  }}
                  className="
                    w-full py-3.5 text-label border transition-all duration-300 rounded-sm
                    hover:bg-[#F0EDE8] hover:text-[#060914] hover:border-[#F0EDE8]
                  "
                  style={{
                    borderColor: `${pkg.accent}66`,
                    color: pkg.accent,
                  }}
                  data-cursor="open"
                >
                  SELECT {pkg.name} DEMO →
                </button>
              </div>
            );
          })}
        </div>

        {/* Google Meet Kickoff Call Assurance Strip */}
        <div className="mt-8 p-4 bg-white/[0.02] border border-white/10 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[--accent-gold] shrink-0" />
            <span className="text-xs text-[#9CA3AF]">
              <strong className="text-[#F0EDE8]">Dedicated Onboarding:</strong> Upon selecting any package, an immediate 1-on-1 Google Meet strategy &amp; calibration session is booked directly with leadership.
            </span>
          </div>
          <a
            href="mailto:marketingwsean@gmail.com?subject=[HUUMAN Packages] Strategy Session Inquiry"
            className="text-xs font-mono text-[--accent-gold] hover:underline shrink-0"
          >
            marketingwsean@gmail.com →
          </a>
        </div>

        {/* Bundle Banner */}
        <div className="mt-6 p-8 border border-[#C9A96E]/30 bg-[#C9A96E]/5 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-label text-[--accent-gold] tracking-widest">
              EXCLUSIVE BUNDLE ARCHITECTURE
            </span>
            <h4 className="font-display text-xl text-[#F0EDE8]">
              Website + AI Business OS Core: <span className="text-[--accent-gold]">฿79,000 THB</span>
            </h4>
            <p className="text-xs text-[#9CA3AF]">
              Deploy your flagship website and central AI operations engine in a unified, synchronized launch.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine?.playClick(0.04);
              onRequestDemo?.('Website + OS Bundle');
            }}
            className="px-8 py-3.5 bg-[--accent-gold] text-[#060914] text-xs font-medium uppercase tracking-wider rounded-sm hover:bg-[#F0EDE8] transition-colors shrink-0 shadow-lg"
            data-cursor="open"
          >
            REQUEST BUNDLE DEMO
          </button>
        </div>
      </div>
    </section>
  );
}
