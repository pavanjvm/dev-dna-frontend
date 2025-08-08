import { developers } from '@/lib/developers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Topbar } from '@/components/topbar';

export default function DevelopersPage() {
    return (
        <div className="bg-background min-h-screen">
            <Topbar projectTitle="Developer Profiles" />
            <main className="container mx-auto py-8 px-4">
                <h1 className="text-4xl font-headline font-bold text-white mb-2">Developer Directory</h1>
                <p className="text-lg text-muted-foreground mb-8">Browse and discover the talent in your organization.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {developers.map((dev) => (
                        <Card key={dev.github_username} className="bg-card/80 backdrop-blur-sm text-white border-border/50 flex flex-col">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-16 h-16 border-2 border-primary">
                                        <AvatarImage src={`https://github.com/${dev.github_username}.png`} alt={dev.github_username} data-ai-hint="person avatar"/>
                                        <AvatarFallback>{dev.github_username.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-2xl capitalize">{dev.github_username.replace(/[-_]/g, ' ')}</CardTitle>
                                        <CardDescription className="text-white/70">@{dev.github_username}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Top Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {dev.skills_domains.slice(0, 5).map(skill => (
                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/developers/${dev.github_username}`} passHref className='w-full'>
                                    <Button variant="outline" className="w-full">
                                        View Profile <ArrowRight className="ml-2" />
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
