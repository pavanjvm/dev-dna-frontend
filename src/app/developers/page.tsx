
import { developers } from '@/lib/developers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, User } from 'lucide-react';
import { Topbar } from '@/components/topbar';

export default function DevelopersPage() {
  return (
    <div className="bg-background min-h-screen">
      <Topbar projectTitle="Developers" />
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {developers.map((dev) => (
            <Card key={dev.github_username} className="bg-card/80 border-border/50 text-white">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-2 border-primary">
                    <AvatarImage src={`https://github.com/${dev.github_username}.png`} alt={dev.github_username} data-ai-hint="person avatar"/>
                    <AvatarFallback>{dev.github_username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="capitalize">{dev.github_username.replace(/[-_]/g, ' ')}</CardTitle>
                    <CardDescription>@{dev.github_username}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Top Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {dev.skills_domains.slice(0, 4).map(skill => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/developers/${dev.github_username}`} passHref className="w-full">
                  <Button variant="outline" className="w-full">
                    View Profile <ArrowRight />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
