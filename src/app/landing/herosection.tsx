// src/components/landing/HeroSection.tsx
'use client';

import React from 'react';
import { Spotlight } from '@/components/ui/spotlight-new';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { FlipWords } from '@/components/ui/flip-words';

export function HeroSection() {
  const words = ["Strategy", "Finance", "Marketing", "Operations"];

  const scrollToWaitlist = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* --- STYLED TEXT LOGO ADDED HERE --- */}
          <a href="/landing" className="text-2xl font-bold text-white tracking-tight">
            Caseforge
          </a>
          <a
            href="#waitlist"
            onClick={scrollToWaitlist}
            className="border border-white/30 text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors duration-300"
          >
            Sign up for Early Access
          </a>
        </div>
      </header>

      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full text-center">
        <TextGenerateEffect
          words="Business Cases, Reimagined."
          className="text-5xl md:text-7xl font-black tracking-tighter"
        />
        
        <div className="text-xl md:text-2xl text-neutral-300 mt-6">
          Master <FlipWords words={words} />
        </div>

        <div className="mt-10">
          <a
            href="#waitlist"
            onClick={scrollToWaitlist}
            className="bg-cyan-400 text-black rounded-full px-8 py-4 text-lg font-bold hover:bg-cyan-300 transition-colors duration-300 transform hover:scale-105 inline-block"
          >
            Sign up for Early Access
          </a>
        </div>
      </div>
    </div>
  );
}