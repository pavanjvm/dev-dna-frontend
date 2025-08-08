import { use, useState } from 'react';
import { developers } from '@/lib/developers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Topbar } from '@/components/topbar';

// Define your types
type Developer = {
  github_username: string;
  skills_domains: string[];
  // Add other properties as needed
};

type PageParams = {
  params: Promise<{ username: string }>;
};

export default function DeveloperProfilePage({ params }: PageParams) {
    // Use React.use() to unwrap the params Promise
    const { username } = use(params);
    const [developer, setDeveloper] = useState<Developer | null>(null);
    const [activityScore, setActivityScore] = useState(0);

    // Rest of your component logic here...
    
    return (
        <div className="bg-background min-h-screen">
            <Topbar projectTitle={`Developer Profile - ${username}`} />
            <main className="container mx-auto py-8 px-4">
                {/* Your component JSX */}
            </main>
        </div>
    );
}