// src/app/landing/page.tsx
'use client';

import React from 'react';
import { Spotlight } from '@/components/ui/spotlight-new';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

export default function WaitlistPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const button = form.querySelector('button');
    if (button) {
      button.innerText = 'Thank You!';
      button.disabled = true;
    }
  };

  const features = [
    {
      title: "Gamified Learning",
      description: "Earn XP, unlock achievements, and build streaks. Learning has never been this fun.",
    },
    {
      title: "Real-World Cases",
      description: "Tackle challenges sourced from real companies, from market-entry to supply chain optimization.",
    },
    {
      title: "Build Your Portfolio",
      description: "Create a verifiable portfolio of your problem-solving skills to show to future employers.",
    },
    {
      title: "Compete & Rank Up",
      description: "See how you stack up against a global community of ambitious students on the leaderboard.",
    },
  ];

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="p-4 max-w-4xl mx-auto relative z-10 w-full text-center">
        <h1 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          The Practice Arena for Future Leaders.
        </h1>

        <p className="mt-6 text-base md:text-lg text-neutral-300 max-w-2xl mx-auto">
          Caseforge is coming. Join the waitlist to get early access to a new, gamified way to master business cases and launch your career.
        </p>

        {/* --- Auto-Scrolling Feature Carousel --- */}
        <div className="py-12">
          <InfiniteMovingCards
            items={features}
            direction="right"
            speed="slow"
          />
        </div>
        {/* --- End of Carousel --- */}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="w-full sm:w-auto flex-grow bg-neutral-900 border border-neutral-700 rounded-full px-6 py-3 text-center sm:text-left focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-neutral-50 text-black rounded-full px-8 py-3 text-base font-bold hover:bg-neutral-300 transition-colors duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign up for Early Access
          </button>
        </form>
      </div>
    </div>
  );
}