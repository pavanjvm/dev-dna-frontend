import { ProjectGenesisClient } from '@/components/project-genesis-client';
import { Suspense } from 'react';

function ProjectGenesisPage() {
  return (
    <main className="bg-background min-h-screen">
      <ProjectGenesisClient />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectGenesisPage />
    </Suspense>
  )
}
