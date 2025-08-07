import { ProjectAnalysis, JiraTaskStatus, View, SetupStep } from '@/components/project-genesis-client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Github, Puzzle, Users, Ticket, Circle, CheckCircle2, XCircle, Clock, Newspaper, Star } from "lucide-react";

type DashboardViewProps = {
    analysisResult: ProjectAnalysis | null;
    repoOption: string;
    repoName: string;
    repoUrl: string;
    assignedDevelopers: Record<string, string[]>;
    setCurrentView: (view: View) => void;
    setSetupStep: (step: SetupStep) => void;
};

const statusIcons: Record<JiraTaskStatus, React.ElementType> = {
    'To Do': Circle,
    'In Progress': Clock,
    'Done': CheckCircle2,
    'Blocked': XCircle,
};

const statusColors: Record<JiraTaskStatus, string> = {
    'To Do': 'bg-gray-400',
    'In Progress': 'bg-blue-500',
    'Done': 'bg-green-500',
    'Blocked': 'bg-red-500',
};

export function DashboardView({
    analysisResult,
    repoOption,
    repoName,
    repoUrl,
    assignedDevelopers,
    setCurrentView,
    setSetupStep,
}: DashboardViewProps) {
    if (!analysisResult) return null;

    const performanceData = analysisResult.team.map(dev => {
        const assignedCount = Object.values(assignedDevelopers).flat().filter(d => d === dev.name).length;
        const updateCount = analysisResult.dailyUpdates.filter(u => u.developerName === dev.name).length;
        return {
            name: dev.name,
            score: (assignedCount * 5) + (updateCount * 2) 
        };
    }).sort((a, b) => b.score - a.score);


    const getJiraTasksForDeveloper = (devName: string) => {
        return analysisResult.projectBreakdown
            .filter(part => (assignedDevelopers[part.part] || []).includes(devName))
            .flatMap(part => part.tickets);
    };

    return (
        <div className="w-full max-w-7xl grid gap-8 animate-in fade-in-50">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <LayoutDashboard className="w-10 h-10 text-primary hidden md:block" />
              <div className="flex-grow">
                <CardTitle className="font-headline text-4xl">{repoOption === 'create' ? repoName : analysisResult.repository.name}</CardTitle>
                <CardDescription className="text-base mt-1">{analysisResult.analysis.summary}</CardDescription>
                <a href={repoOption === 'create' ? `https://github.com/example/${repoName}` : repoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1 mt-2">
                    <Github className="w-4 h-4" />
                    {repoOption === 'create' ? `https://github.com/example/${repoName}` : repoUrl}
                </a>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline flex items-center gap-2">
                <Puzzle className="w-6 h-6" />
                Project Breakdown
                </CardTitle>
                <CardDescription>
                The project has been broken down into parts with assigned developers.
                </CardDescription>
            </div>
             <Button variant="outline" onClick={() => { setCurrentView('setup'); setSetupStep('breakdown'); }}>View &amp; Edit Assignments</Button>
          </CardHeader>
          <CardContent>
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analysisResult.projectBreakdown.map((part) => (
                    <Card key={part.part} className="bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="text-lg truncate">{part.part}</CardTitle>
                        <CardDescription className="truncate">{part.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                            {(assignedDevelopers[part.part] || []).map(devName => (
                                <TooltipProvider key={devName}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={`https://placehold.co/100x100.png`} alt={devName} data-ai-hint="person avatar small"/>
                                                <AvatarFallback>{devName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                            </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{devName}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </CardFooter>
                    </Card>
                ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Users className="w-6 h-6" />Project Team</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2 overflow-hidden">
                            {analysisResult.team.slice(0, 5).map((dev) => (
                                <Avatar key={dev.name} className="inline-block border-2 border-background">
                                    <AvatarImage src={`https://placehold.co/100x100.png`} alt={dev.name} data-ai-hint="person avatar"/>
                                    <AvatarFallback>{dev.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold">{analysisResult.team.length} Developers</p>
                            <p className="text-muted-foreground">Team members suggested</p>
                        </div>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm">
                    {analysisResult.team.slice(0,3).map(dev => (
                        <li key={dev.name} className="flex items-start gap-2">
                        <Avatar className="w-5 h-5 mt-1">
                            <AvatarImage src={`https://placehold.co/100x100.png`} alt={dev.name} data-ai-hint="person avatar small"/>
                            <AvatarFallback>{dev.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                            <span className="font-medium">{dev.name}</span>
                            <p className="text-muted-foreground text-xs">{dev.skills.join(', ')}</p>
                        </div>
                        </li>
                    ))}
                    </ul>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Ticket className="w-6 h-6"/>Jira Board</CardTitle>
                    <CardDescription>Tasks assigned to developers for this project.</CardDescription>
                </CardHeader>
                <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {analysisResult.team.map((developer, index) => {
                      const jiraTasks = getJiraTasksForDeveloper(developer.name);
                      return (
                        <AccordionItem value={`item-${index}`} key={developer.name}>
                            <AccordionTrigger>
                            <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage src={`https://placehold.co/100x100.png`} alt={developer.name} data-ai-hint="person avatar small"/>
                                    <AvatarFallback>{developer.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{developer.name}</span>
                            </div>
                            </AccordionTrigger>
                            <AccordionContent>
                            {jiraTasks.length > 0 ? (
                                <div className="space-y-3 pl-6">
                                    {jiraTasks.map((task, i) => {
                                        const StatusIcon = statusIcons[task.status];
                                        const iconColor = statusColors[task.status];
                                        return (
                                            <div key={i} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                                                <StatusIcon className={`w-5 h-5 mt-1 text-white rounded-full p-0.5 ${iconColor} shrink-0`}/>
                                                <div>
                                                    <p className="font-medium text-sm">{task.ticket}: <span className="font-normal">{task.description}</span></p>
                                                    <Badge variant="outline" className="mt-1">{task.status}</Badge>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm pl-6">No tasks assigned to this developer.</p>
                            )}
                            </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                </Accordion>
                </CardContent>
            </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Newspaper className="w-6 h-6" />Daily Updates</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-72">
                        <div className="space-y-4">
                            {analysisResult.dailyUpdates.map((update, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <Avatar className="w-8 h-8 mt-1">
                                        <AvatarImage src={`https://placehold.co/100x100.png`} alt={update.developerName} data-ai-hint="person avatar small"/>
                                        <AvatarFallback>{update.developerName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{update.developerName}</p>
                                        <p className="text-sm text-muted-foreground">{update.update}</p>
                                        <p className="text-xs text-muted-foreground/70 mt-1">{new Date(update.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Star className="w-6 h-6" />Leaderboard</CardTitle>
                    <CardDescription>Top contributors based on project activity.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {performanceData.slice(0, 5).map((dev, index) => (
                            <li key={dev.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-9 h-9">
                                        <AvatarImage src={`https://placehold.co/100x100.png`} alt={dev.name} data-ai-hint="person avatar small"/>
                                        <AvatarFallback>{dev.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm">{dev.name}</p>
                                        <p className="text-xs text-muted-foreground">{analysisResult.team.find(d => d.name === dev.name)?.skills.slice(0, 2).join(', ')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <span className="font-bold text-sm">{Math.floor(dev.score / 5)}</span>
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    );
}
