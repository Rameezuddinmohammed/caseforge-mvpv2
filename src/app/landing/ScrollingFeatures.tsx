// src/components/landing/ScrollingFeatures.tsx
'use client';

import React from 'react';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

// A simple icon component to avoid installing a full library for this page
const Icon = ({ path, className }: { path: string, className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  );

export function ScrollingFeatures() {
  const features = [
    {
      title: "Gamified Learning",
      description: "Earn XP, unlock achievements, and build streaks. Learning business has never been this fun.",
      iconPath: "M16 8.5l3.53 3.53a2.5 2.5 0 0 1 0 3.54l-3.53 3.53M8 8.5l-3.53 3.53a2.5 2.5 0 0 0 0 3.54l3.53 3.53"
    },
    {
      title: "Real-World Cases",
      description: "Tackle challenges sourced from real companies, from market-entry strategy to supply chain optimization.",
      iconPath: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
    },
    {
      title: "Build Your Portfolio",
      description: "Create a verifiable portfolio of your problem-solving skills to show to future employers.",
      iconPath: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
    },
    {
      title: "Compete & Rank Up",
      description: "See how you stack up against a global community of ambitious students on the leaderboard.",
      iconPath: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6"
    },
  ];

  return (
    <section className="bg-black py-20 md:py-32">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          A Better Way to Learn Business
        </h2>
        <p className="mt-4 text-lg text-neutral-400">
          Caseforge turns passive learning into an active, engaging experience.
        </p>
      </div>
      <InfiniteMovingCards
        items={features.map(feature => (
            <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 flex flex-col items-start w-[350px] h-[220px]">
              <div className="p-3 bg-cyan-400/10 rounded-lg mb-4">
                <Icon path={feature.iconPath} className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-neutral-400 flex-grow">{feature.description}</p>
            </div>
        ))}
        speed="slow"
      />
    </section>
  );
}