'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '@/lib/audio';

export interface CaseStudyData {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  accent: string;
  tagline: string;
  client: string;
  duration: string;
  challenge: string;
  approach: string;
  aiSystemLayer: string;
  metrics: { value: string; label: string }[];
  deliverables: string[];
  techStack: string[];
}

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: CaseStudyData | null;
  onRequestConcept: (category: string) => void;
}

export default function CaseStudyModal({
  isOpen,
  onClose,
  project,
  onRequestConcept,
}: CaseStudyModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      soundEngine?.playChime(680, 0.05);
    } else {
      document.body.style.overflow = '';
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        soundEngine?.playClick(0.03);
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={`Case study: ${project.title}`}
        >
          {/* Backdrop blur & void overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => {
              soundEngine?.playClick(0.04);
              onClose();
            }}
            className="fixed inset-0 bg-[#060914]/90 backdrop-blur-xl z-0"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-5xl bg-[#090D1D] border border-white/15 rounded-none md:rounded-sm overflow-hidden shadow-[0_25px_90px_rgba(0,0,0,0.9)] max-h-screen md:max-h-[92vh] flex flex-col my-auto"
          >
            {/* Top Bar / Navigation */}
            <div className="sticky top-0 z-30 px-6 md:px-10 py-5 bg-[#090D1D]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ backgroundColor: project.accent }}
                />
                <span className="font-mono text-xs text-[--text-secondary] tracking-widest uppercase">
                  HUUMAN ARCHIVE // {project.category}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine?.playClick(0.04);
                  onClose();
                }}
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-colors"
                aria-label="Close case study"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-6 md:p-10 space-y-12">
              {/* Hero Banner with Artwork */}
              <div className="relative w-full h-[280px] md:h-[440px] rounded-sm overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  priority
                  className="object-cover filter contrast-110 brightness-95"
                  sizes="(max-width: 1024px) 100vw, 1000px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090D1D] via-[#090D1D]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#090D1D]/70 via-transparent to-transparent" />

                {/* Overlay Title */}
                <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 z-10 space-y-2">
                  <span
                    className="inline-block px-3 py-1 text-[10px] font-mono tracking-widest uppercase rounded-full bg-black/50 border border-white/15 backdrop-blur-md"
                    style={{ color: project.accent }}
                  >
                    SPECULATIVE CONCEPT CASE STUDY
                  </span>
                  <h2 className="font-display text-3xl md:text-5xl text-white tracking-tight leading-tight">
                    {project.title}
                  </h2>
                  <p className="text-white/80 text-sm md:text-base font-light max-w-2xl">
                    {project.tagline}
                  </p>
                </div>
              </div>

              {/* Meta Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-sm bg-white/[0.02] border border-white/5">
                <div>
                  <span className="block font-mono text-[10px] text-[--text-secondary] uppercase tracking-wider">
                    INDUSTRY
                  </span>
                  <span className="font-display text-sm md:text-base text-white mt-1 block">
                    {project.category}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-[--text-secondary] uppercase tracking-wider">
                    SYSTEM YEAR
                  </span>
                  <span className="font-display text-sm md:text-base text-white mt-1 block">
                    {project.year}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-[--text-secondary] uppercase tracking-wider">
                    DEPLOYMENT TIME
                  </span>
                  <span className="font-display text-sm md:text-base text-white mt-1 block">
                    {project.duration}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-[--text-secondary] uppercase tracking-wider">
                    CORE DISCIPLINE
                  </span>
                  <span className="font-display text-sm md:text-base text-[--accent-gold] mt-1 block">
                    Web + AI Operating System
                  </span>
                </div>
              </div>

              {/* Metrics Showcase */}
              <div className="space-y-4">
                <span className="font-mono text-xs text-[--accent-gold] tracking-[0.2em] uppercase block">
                  MEASURABLE BUSINESS IMPACT
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {project.metrics.map((m, i) => (
                    <div
                      key={i}
                      className="p-6 rounded-sm bg-[#060914] border border-white/10 space-y-1 relative overflow-hidden group"
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: project.accent }}
                      />
                      <span className="font-display text-3xl md:text-4xl text-white tracking-tight">
                        {m.value}
                      </span>
                      <p className="text-xs text-[--text-secondary] leading-relaxed pt-1">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deep Dive: The Challenge & The HUUMAN Shift */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="p-6 rounded-sm bg-white/[0.015] border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#EF4444] uppercase tracking-wider">
                    <span>✕</span> THE STATUS QUO / CHALLENGE
                  </div>
                  <p className="text-sm text-[--text-secondary] leading-relaxed">
                    {project.challenge}
                  </p>
                </div>

                <div className="p-6 rounded-sm bg-[#C9A96E]/5 border border-[#C9A96E]/20 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-[--accent-gold] uppercase tracking-wider">
                    <span>✦</span> THE HUUMAN ARCHITECTURAL SHIFT
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {project.approach}
                  </p>
                </div>
              </div>

              {/* The Autonomous AI System Layer */}
              <div className="p-8 rounded-sm bg-[#060914] border border-white/15 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                    <span className="font-mono text-xs text-[#3B82F6] uppercase tracking-widest">
                      AUTONOMOUS AI ENGINE &amp; OPERATIONAL LAYER
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/50">
                    24/7 MULTI-AGENT ARCHITECTURE
                  </span>
                </div>
                <p className="text-sm md:text-base text-white/80 leading-relaxed">
                  {project.aiSystemLayer}
                </p>
              </div>

              {/* Deliverables & Technology Stack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-8">
                <div>
                  <span className="font-mono text-xs text-white/60 tracking-widest uppercase block mb-4">
                    KEY DELIVERABLES
                  </span>
                  <ul className="space-y-2.5">
                    {project.deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[--text-secondary]">
                        <span className="text-[--accent-gold] font-mono text-xs mt-0.5">0{i + 1}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-mono text-xs text-white/60 tracking-widest uppercase block mb-4">
                    ENGINEERING &amp; MODEL STACK
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-mono rounded-full bg-white/5 border border-white/10 text-white/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Conversion CTA Strip */}
              <div className="p-8 rounded-sm bg-gradient-to-r from-[#0C1128] via-[#090D1D] to-[#060914] border border-[--accent-gold]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_50px_rgba(201,169,110,0.15)]">
                <div className="space-y-1">
                  <h4 className="font-display text-xl text-white tracking-tight">
                    COMMISSION A SIMILAR CONCEPT FOR YOUR BRAND.
                  </h4>
                  <p className="text-xs text-[--text-secondary]">
                    We will design and present a bespoke concept transformation with zero upfront commitment.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine?.playClick(0.05);
                    onRequestConcept(project.id);
                  }}
                  className="px-8 py-4 bg-[--accent-gold] text-[#060914] text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(201,169,110,0.3)] whitespace-nowrap"
                  data-cursor="open"
                >
                  REQUEST BESPOKE DEMO →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
