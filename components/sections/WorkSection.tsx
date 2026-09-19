'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundEngine } from '@/lib/audio';
import CaseStudyModal, { CaseStudyData } from '@/components/ui/CaseStudyModal';

gsap.registerPlugin(ScrollTrigger);

const CASE_STUDIES: CaseStudyData[] = [
  {
    id: 'serenity-spa',
    title: 'Serenity Thermal Sanctuary',
    category: 'Luxury Wellness & Thermal Baths',
    year: '2024',
    image: '/images/portfolio_serenity.jpg',
    accent: '#C9A96E',
    tagline: 'Transforming an Aman-inspired thermal bath into a high-conversion digital sanctuary.',
    client: 'Serenity Hot Springs & Private Retreat',
    duration: '6 Weeks',
    challenge:
      'International guests across 14 timezones struggled with business-hour phone booking and slow email inquiries, resulting in an estimated 35% loss of high-yield private suite bookings and heavy weekend front-desk congestion.',
    approach:
      'Engineered an atmospheric, brutalist thermal architecture web experience featuring ambient steam shaders, low-light photography, and tactile typography that conveys serenity before the guest ever sets foot on site.',
    aiSystemLayer:
      'Integrated an autonomous multilingual concierge (Thai, English, Japanese, Swedish) that qualifies guest preferences, offers tailored thermal rituals, and executes direct reservations with instant payment capture.',
    metrics: [
      { value: '+340%', label: 'Direct Online Reservations' },
      { value: '< 8s', label: 'Average Inquiry Response Time' },
      { value: '100%', label: 'Zero Lost Inquiries Across Timezones' },
    ],
    deliverables: [
      'Flagship 3D Thermal Sanctuary Web Experience',
      'Multilingual AI Concierge & Direct Booking Engine',
      'VIP Guest Profile & Dietary Memory Database',
      'Automated Calendar Balancing & PromptPay/Stripe Integration',
    ],
    techStack: ['Next.js 16', 'Three.js / WebGL', 'Custom LLM Orchestration', 'Tailwind CSS', 'Stripe Connect'],
  },
  {
    id: 'solaris-energy',
    title: 'Solaris Clean Energy Horizon',
    category: 'Clean Energy & Industrial Infrastructure',
    year: '2024',
    image: '/images/portfolio_solaris.jpg',
    accent: '#10B981',
    tagline: 'Monumental digital infrastructure for utility-scale solar installations.',
    client: 'Solaris Energy Group Southeast Asia',
    duration: '8 Weeks',
    challenge:
      'Commercial EPC clients ($100k+ contracts) were bogged down by opaque engineering PDFs, manual kilowatt estimations, and a 45-day sales cycle that bled momentum.',
    approach:
      'Built a dark monumental clean-tech experience with an interactive real-time solar yield simulator, cinematic desert horizon transitions, and architectural typography.',
    aiSystemLayer:
      'Created an enterprise solar intelligence pipeline that automatically analyzes commercial roof dimensions, computes projected 10-year IRR, and schedules qualified feasibility audits directly with senior engineers.',
    metrics: [
      { value: '8.4x', label: 'Commercial Inbound Pipeline Value' },
      { value: '11 Days', label: 'Reduced Sales Cycle (from 42 days)' },
      { value: '฿180M+', label: 'Attributed Enterprise Pipeline' },
    ],
    deliverables: [
      'Industrial-Grade Brand Experience',
      'Interactive Solar Yield & ROI Simulation Engine',
      'Autonomous Enterprise Proposal Dispatcher',
      'Hubspot & ERP AI Integration',
    ],
    techStack: ['Next.js 16', 'GSAP ScrollTrigger', 'Python / Fastify AI Backend', 'Mapbox GL', 'Edge Functions'],
  },
  {
    id: 'villa-aether',
    title: 'Villa Aether Private Residences',
    category: 'Ultra-Luxury Architecture & Estates',
    year: '2024',
    image: '/images/portfolio_villa.jpg',
    accent: '#60A5FA',
    tagline: 'Cantilevered brutalist sanctuary commanding premier international villa rentals.',
    client: 'Aether Estates Andaman Sea',
    duration: '5 Weeks',
    challenge:
      'Standard OTA listings flattened the architectural magnificence of the cliffside villa, forced 18% commission fees, and failed to attract discreet ultra-high-net-worth travelers.',
    approach:
      'Curated an intimate dusk-to-night sensory web portal with twilight horizons, reflection pool caustics, and cinematic editorial layouts that convey exclusivity.',
    aiSystemLayer:
      'Private AI Butler handling bespoke culinary requests, yacht charters, helicopter transfers, and discreet non-refundable crypto/wire escrow transactions.',
    metrics: [
      { value: '$2.4M', label: 'Direct Seasonal Bookings Captured' },
      { value: '0%', label: 'Third-Party OTA Commission Loss' },
      { value: '98%', label: 'Guest Pre-arrival Preference Accuracy' },
    ],
    deliverables: [
      'Bespoke Editorial Digital Landmark',
      'Private AI Butler & Concierge Terminal',
      'High-Value Escrow & Multi-Currency Gateway',
      'Dynamic Seasonal Yield & Availability Engine',
    ],
    techStack: ['React 19', 'Next.js Turbopack', 'Three.js Water Shaders', 'Vercel Edge', 'Multi-currency Stripe'],
  },
  {
    id: 'lumina-dental',
    title: 'Lumina Aesthetic & Longevity Sanctuary',
    category: 'Aesthetic Medicine & Facial Surgery',
    year: '2024',
    image: '/images/portfolio_lumina.jpg',
    accent: '#EC4899',
    tagline: 'Reimagining cosmetic surgery and longevity into couture medical art.',
    client: 'Lumina Longevity Clinic Bangkok',
    duration: '7 Weeks',
    challenge:
      'Clinical, sterile traditional medical websites caused patient anxiety, poorly explained complex surgical procedures, and suffered high consultation cancellation rates.',
    approach:
      'Introduced a museum-grade aesthetic with fluted frosted glass, dark marble textures, champagne brass accents, and serene before/after treatment visualizers.',
    aiSystemLayer:
      'Trained a compassionate, medically-grounded AI consultation advisor that answers nuanced procedure questions, gathers preliminary patient desires, and automates 3-touch reminder sequences.',
    metrics: [
      { value: '+290%', label: 'Private Surgical Consultations' },
      { value: '88%', label: 'Consultation Show-Up Rate' },
      { value: '4.8/5', label: 'Patient Experience Rating' },
    ],
    deliverables: [
      'Couture Aesthetic Medical Web Presence',
      'HIPAA-Compliant AI Consultation Advisor',
      'Automated Multi-Channel Patient Onboarding',
      'Interactive Treatment Visualizer & Pricing Engine',
    ],
    techStack: ['Next.js 16', 'Framer Motion', 'Encrypted Healthcare AI Pipeline', 'Tailwind CSS', 'PostgreSQL'],
  },
  {
    id: 'apex-performance',
    title: 'Apex Performance Laboratory',
    category: 'Elite Athletic Training & Human Optimization',
    year: '2024',
    image: '/images/service_ai_os.jpg',
    accent: '#F59E0B',
    tagline: 'High-tech athletic sanctuary powered by automated member telemetry.',
    client: 'Apex Athletic Performance Stockholm & Phuket',
    duration: '6 Weeks',
    challenge:
      'Paper-based fitness assessments, manual trainer dispatch, and generic gym member portals resulted in high churn and missed high-ticket coaching upsells.',
    approach:
      'Dark brutalist athletic aesthetic using raw basalt textures, stark rim lighting, kinetic metric tickers, and an elite command center feel.',
    aiSystemLayer:
      'Bespoke Athlete OS that takes inbound performance assessments, calculates baseline metrics, automatically pairs athletes with coaches, and manages recurring subscriptions.',
    metrics: [
      { value: '96%', label: '6-Month Member Retention' },
      { value: '+185%', label: 'Private Coaching Package Uptake' },
      { value: '14 hrs', label: 'Weekly Administrative Labor Saved' },
    ],
    deliverables: [
      'Flagship Athletic Digital Landmark',
      'Custom Member OS & Assessment Portal',
      'Automated Performance Scheduling Pipeline',
      'Subscription Billing & Locker Access Integration',
    ],
    techStack: ['Next.js 16', 'Supabase Auth & DB', 'Stripe Billing', 'GSAP', 'Web Audio API'],
  },
  {
    id: 'meridian-estates',
    title: 'Meridian Horizon Towers',
    category: 'Architectural Real Estate & Penthouses',
    year: '2024',
    image: '/images/huuman_architecture.jpg',
    accent: '#06B6D4',
    tagline: 'Monumental classical-futuristic spatial gallery for trophy penthouse acquisitions.',
    client: 'Meridian Development Consortium',
    duration: '8 Weeks',
    challenge:
      'Overseas luxury investors in London, Dubai, and Singapore could not attend physical viewings, delaying multimillion-dollar penthouse commitments.',
    approach:
      'Created a neoclassical-futuristic digital gallery with fluted stone colonnades under cosmic night skies, interactive 3D floorplates, and twilight lighting transitions.',
    aiSystemLayer:
      'VIP Acquisition Agent dispatching high-resolution floorplans, calculating international tax implications, and facilitating private virtual architectural walkthroughs.',
    metrics: [
      { value: '100%', label: 'Phase 1 Penthouses Reserved (4 Mos Early)' },
      { value: '62%', label: 'Sold Exclusively via Digital Platform' },
      { value: '฿420M', label: 'Total Transaction Volume Supported' },
    ],
    deliverables: [
      'Spatial Architectural Web Experience',
      'Interactive 3D Penthouse Floorplan Explorer',
      'VIP AI Investor Dispatch & Document Vault',
      'Multi-Currency Tokenized Reservation System',
    ],
    techStack: ['Next.js 16', 'Three.js / WebGL Colonnade', 'Tailwind CSS', 'Vercel Edge', 'Stripe'],
  },
  {
    id: 'ember-kitchen',
    title: 'Ember & Ash Haute Gastronomy',
    category: 'Haute Cuisine & Sensory Dining',
    year: '2024',
    image: '/images/service_automation.jpg',
    accent: '#F97316',
    tagline: 'Sensory nocturnal digital dining room that eliminated restaurant no-shows.',
    client: 'Ember & Ash Fine Dining Atelier',
    duration: '4 Weeks',
    challenge:
      'Last-minute reservation cancellations and no-shows cost over $18,000 monthly, while phone bookings constantly disrupted front-of-house hospitality during dinner service.',
    approach:
      'A dark, evocative dining aesthetic with ember reflections, warm candlelight glows, ambient kitchen soundscapes, and an editorial seasonal tasting menu narrative.',
    aiSystemLayer:
      'Autonomous reservation machine requiring pre-paid tasting menu tickets, automatically logging dietary restrictions and wine pairings, and dynamically managing a real-time waitlist.',
    metrics: [
      { value: '0%', label: 'Weekend Table No-Show Rate' },
      { value: '99.4%', label: 'Upfront Tasting Deposit Collection' },
      { value: '+22%', label: 'Wine Pairing Pre-orders' },
    ],
    deliverables: [
      'Sensory Fine-Dining Digital Atelier',
      'Pre-paid Ticketed Reservation Engine',
      'Automated Dietary & Allergy Concierge',
      'Table Capacity & Dynamic Waitlist Pipeline',
    ],
    techStack: ['Next.js 16', 'Tailwind CSS', 'SevenRooms / Stripe API', 'Framer Motion', 'Web Audio'],
  },
  {
    id: 'iron-temple',
    title: 'Iron Temple Muay Thai Academy',
    category: 'Muay Thai & Fight Camp Sanctuary',
    year: '2024',
    image: '/images/portfolio_muaythai.jpg',
    accent: '#EF4444',
    tagline: 'Raw athletic discipline meets seamless international fight camp enrollment.',
    client: 'Iron Temple Gym Phuket',
    duration: '5 Weeks',
    challenge:
      'International fight trainees were trapped in chaotic WhatsApp exchanges about camp accommodations, gear, visas, and training schedules, losing dozens of high-value multi-week bookings.',
    approach:
      'High-contrast industrial fight arena art direction capturing chalk dust, sharp shafts of morning sun, raw ring canvas, and authentic Muay Thai heritage.',
    aiSystemLayer:
      '24/7 International Fight Camp Concierge that assists with training regimens, villa accommodations, visa requirements, and instant multi-currency checkout (Wise, Stripe, PromptPay).',
    metrics: [
      { value: '+410%', label: 'Advance International Camp Bookings' },
      { value: '$85k', label: 'Multi-week Packages Booked in 60 Days' },
      { value: '24/7', label: 'Global Fighter Intake Without Staff Delay' },
    ],
    deliverables: [
      'Authentic High-Energy Camp Web Platform',
      '24/7 International Visa & Booking Concierge',
      'Accommodation & Meal Plan Bundling Engine',
      'Multi-Currency Trainee Portal',
    ],
    techStack: ['Next.js 16', 'Tailwind CSS', 'PromptPay / Stripe Connect', 'GSAP', 'Zustand'],
  },
];

interface WorkSectionProps {
  onRequestDemo?: (category?: string) => void;
}

export default function WorkSection({ onRequestDemo }: WorkSectionProps) {
  const t = useTranslations('work');
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCase, setSelectedCase] = useState<CaseStudyData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = galleryRef.current?.querySelectorAll('.project-item');
      if (!items?.length) return;

      items.forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        });

        const imgWrapper = item.querySelector('.project-img-container');
        const img = item.querySelector('.project-img');

        gsap.fromTo(
          imgWrapper,
          { opacity: 0, scale: 1.05 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -12 },
            {
              yPercent: 12,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
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

  const handleOpenCase = (project: CaseStudyData) => {
    soundEngine?.playClick(0.05);
    setSelectedCase(project);
    setIsModalOpen(true);
  };

  const handleRequestConcept = (category: string) => {
    setIsModalOpen(false);
    onRequestDemo?.(category);
  };

  return (
    <section id="work" ref={sectionRef} className="relative bg-[--bg-void]">
      {/* Sticky Top Header Bar */}
      <div className="sticky top-0 z-30 px-8 md:px-16 py-6 glass border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[--accent-gold]" />
          <p className="text-label text-[--text-secondary] tracking-widest uppercase">
            {t('label')} {'//'} 8 SPECULATIVE BLUEPRINTS
          </p>
        </div>
        <p className="text-label text-[--text-secondary] font-mono">
          {String(activeIndex + 1).padStart(2, '0')} / {String(CASE_STUDIES.length).padStart(2, '0')}
        </p>
      </div>

      {/* Gallery Items */}
      <div ref={galleryRef} className="space-y-0">
        {CASE_STUDIES.map((project, i) => {
          return (
            <div
              key={project.id}
              onClick={() => handleOpenCase(project)}
              className="project-item relative min-h-screen flex items-center justify-center border-b border-white/10 overflow-hidden py-24 cursor-pointer group"
              data-cursor="explore"
            >
              {/* Cinematic Artwork Background Layer */}
              <div className="project-img-container absolute inset-0 z-0 opacity-0 transition-transform duration-1000 group-hover:scale-102">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="project-img object-cover opacity-50 filter brightness-90 contrast-115 transition-all duration-700 group-hover:opacity-75 group-hover:brightness-100"
                  sizes="100vw"
                />
                {/* Atmospheric gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060914] via-[#060914]/60 to-[#060914]/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#060914] via-[#060914]/50 to-transparent" />
              </div>

              {/* Foreground Content Card */}
              <div className="relative z-10 w-full max-w-7xl px-8 md:px-16">
                <div className="max-w-2xl space-y-6">
                  {/* Category & Badge */}
                  <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-black/40 border border-white/15 backdrop-blur-md">
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ background: project.accent }}
                    />
                    <span className="text-[10px] tracking-[0.2em] font-mono text-white/90 uppercase">
                      {project.category}
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3 className="font-display text-display-lg text-[--text-primary] tracking-tight leading-none group-hover:text-white transition-colors duration-300">
                    {project.title}
                  </h3>

                  {/* Tagline / Subtitle */}
                  <p className="text-base md:text-lg text-[--text-secondary] leading-relaxed max-w-xl group-hover:text-white/90 transition-colors">
                    {project.tagline}
                  </p>

                  {/* Key Metric Preview */}
                  <div className="flex items-center gap-8 py-2">
                    <div className="space-y-0.5">
                      <span className="font-display text-2xl md:text-3xl text-[--accent-gold]">
                        {project.metrics[0].value}
                      </span>
                      <span className="block font-mono text-[10px] text-white/60 uppercase tracking-wider">
                        {project.metrics[0].label}
                      </span>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="space-y-0.5">
                      <span className="font-display text-2xl md:text-3xl text-white">
                        {project.metrics[1].value}
                      </span>
                      <span className="block font-mono text-[10px] text-white/60 uppercase tracking-wider">
                        {project.metrics[1].label}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Button */}
                  <div className="pt-4 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCase(project);
                      }}
                      className="inline-flex items-center gap-4 text-label px-7 py-3.5 rounded-full border border-white/20 bg-white/10 hover:bg-[--accent-gold] hover:text-[#060914] hover:border-[--accent-gold] transition-all duration-300 group/btn shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                      aria-label={`${t('viewProject')}: ${project.title}`}
                    >
                      <span className="font-medium tracking-widest uppercase text-xs">
                        EXPLORE FULL CASE ARCHIVE
                      </span>
                      <span className="group-hover/btn:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </button>
                    <span className="text-xs font-mono text-white/40">
                      CLICK ANYWHERE TO EXPAND
                    </span>
                  </div>
                </div>
              </div>

              {/* Giant Background Index Number */}
              <div className="absolute bottom-4 right-8 md:right-16 text-[12rem] md:text-[22rem] font-display text-white/[0.025] leading-none select-none pointer-events-none z-0">
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Case Study Deep-Dive Exhibition Modal */}
      <CaseStudyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedCase}
        onRequestConcept={handleRequestConcept}
      />
    </section>
  );
}
