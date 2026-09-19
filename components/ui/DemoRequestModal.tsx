'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '@/lib/audio';

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  defaultPackage?: string;
}

const INDUSTRIES = [
  { id: 'spa', label: 'Spa & Wellness' },
  { id: 'hotels', label: 'Hotels & Villas' },
  { id: 'clinic', label: 'Dental & Beauty Clinic' },
  { id: 'solar', label: 'Solar & Clean Energy' },
  { id: 'fitness', label: 'Gyms & Muay Thai' },
  { id: 'realestate', label: 'Real Estate' },
  { id: 'hospitality', label: 'Restaurants & Cafés' },
  { id: 'other', label: 'Other Premium Brand' },
];

const GOALS = [
  { id: 'website', label: 'Flagship Digital Experience' },
  { id: 'ai-os', label: 'AI Business OS & Automation' },
  { id: 'support', label: 'Autonomous AI Client Support' },
  { id: 'complete', label: 'Full Digital Ecosystem (Site + OS)' },
];

export default function DemoRequestModal({
  isOpen,
  onClose,
  defaultCategory = 'spa',
  defaultPackage,
}: DemoRequestModalProps) {
  const initialGoal = defaultPackage?.toLowerCase().includes('os')
    ? 'ai-os'
    : defaultPackage?.toLowerCase().includes('sovereign')
    ? 'complete'
    : 'website';

  const [selectedIndustry, setSelectedIndustry] = useState(defaultCategory);
  const [selectedGoal, setSelectedGoal] = useState(initialGoal);
  const [brandName, setBrandName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Lock body scroll and handle escape
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      soundEngine?.playChime(750, 0.05);
    } else {
      document.body.style.overflow = '';
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  // Generate mailto link
  const generateMailto = () => {
    const subject = encodeURIComponent(
      `[HUUMAN Inquiry] ${brandName || 'New Client'} — ${selectedIndustry.toUpperCase()} — Google Meet Request`
    );
    const body = encodeURIComponent(
      `Hello Sean & HUUMAN STUDIO,\n\n` +
      `We would like to book a Google Meet discovery session / concept demo for our business.\n\n` +
      `• Brand / Company: ${brandName || 'Not specified'}\n` +
      `• Industry: ${selectedIndustry}\n` +
      `• Package / Objective: ${selectedGoal}\n` +
      `• Contact Details: ${contactInfo || 'Follow up to this email'}\n` +
      `• Meeting Platform: Google Meet\n\n` +
      `Please send a Google Calendar invite for our Google Meet session.\n`
    );
    return `mailto:marketingwsean@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#060914]/85 backdrop-blur-xl"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="
              relative w-full max-w-2xl bg-[#090D1D]
              border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.8)]
              p-6 sm:p-10 rounded-sm z-10 my-auto
            "
          >
            {/* Ambient gold glow */}
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full pointer-events-none opacity-20 blur-3xl"
              style={{ background: '#C9A96E' }}
              aria-hidden="true"
            />

            {/* Header */}
            <div className="flex items-start justify-between pb-6 border-b border-white/10 mb-8">
              <div>
                <span className="text-label text-[--accent-gold] block mb-1">
                  ZERO-COMMITMENT CONCEPT
                </span>
                <h2
                  id="demo-modal-title"
                  className="font-display text-2xl sm:text-3xl text-[#F0EDE8] tracking-tight uppercase"
                >
                  REQUEST YOUR DEMO
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                  See what your business could look and operate like before committing.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="
                  p-2 text-[#6B7280] hover:text-[#F0EDE8]
                  transition-colors rounded-sm
                  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A96E]
                "
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* 1. Industry Selection */}
              <div>
                <label className="text-label text-[#6B7280] block mb-3">
                  01 / SELECT YOUR INDUSTRY
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {INDUSTRIES.map((ind) => {
                    const isSelected = selectedIndustry === ind.id;
                    return (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => {
                          setSelectedIndustry(ind.id);
                          soundEngine?.playClick(0.03);
                        }}
                        className={`
                          px-3 py-2 text-left text-xs rounded-sm transition-all duration-300
                          border ${
                            isSelected
                              ? 'border-[#C9A96E] bg-[#C9A96E]/10 text-[#F0EDE8]'
                              : 'border-white/10 bg-white/[0.02] text-[#6B7280] hover:border-white/30 hover:text-[#F0EDE8]'
                          }
                        `}
                      >
                        {ind.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Primary Objective */}
              <div>
                <label className="text-label text-[#6B7280] block mb-3">
                  02 / PRIMARY OBJECTIVE
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {GOALS.map((goal) => {
                    const isSelected = selectedGoal === goal.id;
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => {
                          setSelectedGoal(goal.id);
                          soundEngine?.playClick(0.03);
                        }}
                        className={`
                          px-3.5 py-2.5 text-left text-xs rounded-sm transition-all duration-300
                          border flex items-center justify-between ${
                            isSelected
                              ? 'border-[#C9A96E] bg-[#C9A96E]/10 text-[#F0EDE8]'
                              : 'border-white/10 bg-white/[0.02] text-[#6B7280] hover:border-white/30 hover:text-[#F0EDE8]'
                          }
                        `}
                      >
                        <span>{goal.label}</span>
                        {isSelected && <span className="text-[#C9A96E]">✦</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Brand Name & Contact input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="brand-input" className="text-label text-[#6B7280] block mb-2">
                    03 / BUSINESS / BRAND NAME
                  </label>
                  <input
                    id="brand-input"
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Aether Villas Phuket"
                    className="
                      w-full bg-white/[0.03] border border-white/10 px-3.5 py-2.5 text-sm text-[#F0EDE8]
                      placeholder:text-[#6B7280]/60 rounded-sm focus-visible:outline-none focus-visible:border-[#C9A96E]
                    "
                  />
                </div>
                <div>
                  <label htmlFor="contact-input" className="text-label text-[#6B7280] block mb-2">
                    04 / EMAIL OR INSTAGRAM HANDLE
                  </label>
                  <input
                    id="contact-input"
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="e.g. @aethervillas or info@aether.com"
                    className="
                      w-full bg-white/[0.03] border border-white/10 px-3.5 py-2.5 text-sm text-[#F0EDE8]
                      placeholder:text-[#6B7280]/60 rounded-sm focus-visible:outline-none focus-visible:border-[#C9A96E]
                    "
                  />
                </div>
              </div>

              {/* 4. Google Meet & Direct Channels */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="p-3 bg-white/[0.02] border border-[#C9A96E]/20 rounded-sm flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[--accent-gold] shrink-0 animate-pulse" />
                  <span className="text-[11px] text-[#9CA3AF] leading-relaxed">
                    <strong className="text-[#F0EDE8]">Google Meet Included:</strong> All client inquiries and package orders include a private 1-on-1 Google Meet strategy &amp; kickoff session.
                  </span>
                </div>

                <p className="text-label text-[#6B7280]">CHOOSE YOUR PREFERRED INITIATION CHANNEL</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a
                    href={generateMailto()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine?.playClick(0.05)}
                    className="
                      group flex flex-col items-center justify-center p-3.5 border border-[#C9A96E]/40
                      bg-[#C9A96E]/5 hover:bg-[#C9A96E] transition-all duration-300 rounded-sm
                    "
                  >
                    <span className="text-xs uppercase tracking-widest text-[#C9A96E] group-hover:text-[#060914] font-medium transition-colors text-center">
                      SEND VIA GMAIL
                    </span>
                    <span className="text-[9px] font-mono text-[#6B7280] group-hover:text-[#060914]/80 transition-colors mt-0.5 truncate max-w-full">
                      marketingwsean@gmail.com
                    </span>
                  </a>

                  <a
                    href="https://www.instagram.com/huuman.essentials/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine?.playClick(0.05)}
                    className="
                      group flex flex-col items-center justify-center p-3.5 border border-white/15
                      bg-white/[0.02] hover:bg-white/10 transition-all duration-300 rounded-sm
                    "
                  >
                    <span className="text-xs uppercase tracking-widest text-[#F0EDE8] font-medium">
                      DM ON INSTAGRAM
                    </span>
                    <span className="text-[10px] text-[#6B7280] mt-0.5 font-mono">
                      @huuman.essentials
                    </span>
                  </a>

                  <a
                    href={generateMailto()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine?.playClick(0.05)}
                    className="
                      group flex flex-col items-center justify-center p-3.5 border border-white/15
                      bg-white/[0.02] hover:bg-white/10 transition-all duration-300 rounded-sm
                    "
                  >
                    <span className="text-xs uppercase tracking-widest text-[#F0EDE8] font-medium">
                      GOOGLE MEET
                    </span>
                    <span className="text-[10px] text-[#6B7280] mt-0.5">
                      Book 20m Discovery
                    </span>
                  </a>
                </div>
              </div>

              <p className="text-[11px] text-[#6B7280] text-center pt-2">
                Thailand · Sweden · Worldwide · Direct founder access on Google Meet.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
