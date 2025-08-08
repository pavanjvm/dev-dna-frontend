import { DevDnaClient } from '@/components/dev-dna-client';
import { Suspense } from 'react';
import { DarkVeil } from '@/components/dark-veil';

function DevDnaPage() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
       <div className="absolute inset-0 z-0">
        <DarkVeil 
            hueShift={240} 
            noiseIntensity={0.03} 
            scanlineIntensity={0.05} 
            scanlineFrequency={1000}
            speed={0.2}
            warpAmount={0.5}
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>
      <div className='relative z-10'>
        <DevDnaClient />
      </div>
    </main>
  );
}

export default function ProjectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DevDnaPage />
    </Suspense>
  )
}
