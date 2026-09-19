'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Navigation from '@/components/ui/Navigation';
import Preloader from '@/components/ui/Preloader';
import CustomCursor from '@/components/ui/CustomCursor';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import WorkSection from '@/components/sections/WorkSection';
import TransformationSection from '@/components/sections/TransformationSection';
import PhilosophySection from '@/components/sections/PhilosophySection';
import PackagesSection from '@/components/sections/PackagesSection';
import ProcessSection from '@/components/sections/ProcessSection';
import FooterSection from '@/components/sections/FooterSection';
import DemoRequestModal from '@/components/ui/DemoRequestModal';

// Lazy-load WebGL World Canvas
const WorldCanvas = dynamic(() => import('@/components/scenes/WorldCanvas'), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Conversion Demo Modal State
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoCategory, setDemoCategory] = useState('spa');
  const [demoPackage, setDemoPackage] = useState<string | undefined>(undefined);

  const mainRef = useRef<HTMLDivElement>(null);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  // Track global scroll progress for 3D world canvas
  useEffect(() => {
    const globalTrigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      scrub: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      globalTrigger.kill();
    };
  }, []);

  const handleOpenDemo = useCallback((category?: string, pkg?: string) => {
    if (category) setDemoCategory(category);
    if (pkg) setDemoPackage(pkg);
    setIsDemoOpen(true);
  }, []);

  const handleCloseDemo = useCallback(() => {
    setIsDemoOpen(false);
  }, []);

  return (
    <>
      {/* Intro Preloader Animation (Non-blocking, dismisses cleanly) */}
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Custom magnetic cursor */}
      <CustomCursor />

      {/* Persistent Navigation */}
      <Navigation onRequestDemo={handleOpenDemo} />

      {/* Persistent 3D Living Cosmos (Stars, Rotating Gold Crystal Monolith, Stardust) */}
      <WorldCanvas scrollProgress={scrollProgress} />

      <SmoothScrollProvider>
        <main ref={mainRef} className="relative z-10">
          {/* 1. Hero Section — Immediate visual impact */}
          <HeroSection onRequestDemo={() => handleOpenDemo()} />

          {/* 2. Services / The Four Disciplines */}
          <ServicesSection onRequestDemo={handleOpenDemo} />

          {/* 3. Work / 8 Bespoke Concept Case Studies */}
          <WorkSection onRequestDemo={(cat) => handleOpenDemo(cat)} />

          {/* 4. Interactive Transformation Before/After Slider */}
          <TransformationSection onRequestDemo={() => handleOpenDemo()} />

          {/* 5. Philosophy Manifesto */}
          <PhilosophySection />

          {/* 6. Multi-Currency Investment Packages & Bundle */}
          <PackagesSection onRequestDemo={(pkg) => handleOpenDemo(undefined, pkg)} />

          {/* 7. High-Touch Process Methodology */}
          <ProcessSection onRequestDemo={() => handleOpenDemo()} />

          {/* 8. Footer Horizon & Live World Clocks */}
          <FooterSection onRequestDemo={() => handleOpenDemo()} />
        </main>
      </SmoothScrollProvider>

      {/* Interactive Conversion Demo Drawer */}
      <DemoRequestModal
        isOpen={isDemoOpen}
        onClose={handleCloseDemo}
        defaultCategory={demoCategory}
        defaultPackage={demoPackage}
      />
    </>
  );
}
