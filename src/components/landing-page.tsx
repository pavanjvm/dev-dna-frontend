"use client";

import Link from 'next/link';
import { DarkVeil } from './dark-veil';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

export function LandingPage() {
  return (
    <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <DarkVeil 
            hueShift={240} 
            noiseIntensity={0.03} 
            scanlineIntensity={0.05} 
            scanlineFrequency={1000}
            speed={0.2}
            warpAmount={0.5}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center text-white">
        <h1 className="font-headline text-7xl md:text-8xl font-bold tracking-tighter">
          Dev DNA
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/80">
          An intelligent platform to kickstart your software projects. Analyze specifications, assemble your team, and manage your workflow, all in one place.
        </p>
        <Link href="/project" passHref>
          <Button size="lg" className="mt-8">
            Get Started <ArrowRight />
          </Button>
        </Link>
      </div>
    </main>
  );
}
