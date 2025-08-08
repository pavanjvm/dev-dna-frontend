import { DevDnaClient } from '@/components/dev-dna-client';
import { Suspense } from 'react';

function DevDnaPage() {
  return (
    <main className="bg-background min-h-screen">
      <DevDnaClient />
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
