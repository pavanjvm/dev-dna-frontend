"use client";

import { useState, ChangeEvent } from "react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  UploadCloud,
  Loader2,
  Github,
  Users,
  LayoutDashboard,
  Newspaper,
  Puzzle,
  ArrowLeft,
  UserPlus,
  Search,
  PlusCircle,
  ChevronRight,
  Check,
  Ticket,
  Circle,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Badge } from "./ui/badge";

type JiraTaskStatus = 'To Do' | 'In Progress' | 'Done' | 'Blocked';

type JiraTask = {
    ticket: string;
    description: string;
    status: JiraTaskStatus;
};

type ProjectAnalysis = {
  analysis: {
    summary: string;
    keyAspects: string;
  };
  repository: {
    name: string;
    url: string;
  };
  projectBreakdown: {
    part: string;
    description: string;
    suggestedDeveloper: string;
    suggestionReasoning: string;
    tickets: JiraTask[];
  }[];
  team: {
    name: string;
    skills: string[];
    reasoning: string;
  }[];
  dailyUpdates: {
    developerName: string;
    update: string;
    date: string;
  }[];
};

type View = 'upload' | 'setup' | 'dashboard';
type SetupStep = 'repository' | 'breakdown';

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


export function ProjectGenesisClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ProjectAnalysis | null>(null);
  const [currentView, setCurrentView] = useState<View>('upload');
  const [setupStep, setSetupStep] = useState<SetupStep>('repository');
  const [searchQuery, setSearchQuery] = useState('');
  const [repoOption, setRepoOption] = useState('create');
  const [repoUrl, setRepoUrl] = useState('');
  const [repoName, setRepoName] = useState('project-genesis-app');
  const [assignedDevelopers, setAssignedDevelopers] = useState<Record<string, string[]>>({});

  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const pdfFile = files[0];
      if (pdfFile.type === "application/pdf") {
        setFile(pdfFile);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a PDF file.",
        });
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select a PDF file to analyze.",
      });
      return;
    }

    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const result: ProjectAnalysis = {
      analysis: {
        summary: "The project is a new social media platform for pet owners, allowing them to share photos, connect with others, and find pet-friendly locations.",
        keyAspects: "User profiles, photo uploads, social feed, real-time chat, and a map integration for locations."
      },
      repository: {
        name: "project-genesis-app",
        url: "https://github.com/example/project-genesis-app"
      },
      projectBreakdown: [
        { 
          part: 'Frontend Development', 
          description: 'Building the user interface and user experience.', 
          suggestedDeveloper: 'Alice Johnson',
          suggestionReasoning: 'Alice has strong experience in React and Next.js, making her ideal for the frontend work.',
          tickets: [
            { ticket: 'GEN-101', description: 'Implement user authentication and profile pages.', status: 'Done' },
            { ticket: 'GEN-102', description: 'Develop a responsive and dynamic social feed.', status: 'In Progress' },
          ],
        },
        { 
          part: 'Backend API', 
          description: 'Developing the server-side logic and data management.', 
          suggestedDeveloper: 'Bob Williams',
          suggestionReasoning: 'Bob\'s expertise in Node.js and databases is a perfect fit for building a robust API.',
          tickets: [
            { ticket: 'GEN-201', description: 'Design and build the database schema for users and posts.', status: 'Done' },
            { ticket: 'GEN-202', description: 'Create a GraphQL API for real-time chat functionality.', status: 'To Do' },
          ]
        },
        { 
          part: 'Mobile App', 
          description: 'Creating the native mobile application for iOS and Android.', 
          suggestedDeveloper: 'Charlie Brown',
          suggestionReasoning: 'Charlie\'s background in mobile development is crucial for the native app version.',
          tickets: [
            { ticket: 'GEN-301', description: 'Develop a native mobile app for iOS and Android.', status: 'Blocked' },
            { ticket: 'GEN-302', description: 'Integrate push notifications for new messages and interactions.', status: 'To Do' },
          ]
        },
        { 
          part: 'Deployment & Infrastructure', 
          description: 'Managing cloud infrastructure and CI/CD pipelines.', 
          suggestedDeveloper: 'David Lee',
          suggestionReasoning: 'David is a DevOps expert who can ensure smooth deployment and scaling.',
          tickets: [
             { ticket: 'GEN-401', description: 'Set up a CI/CD pipeline for automated testing and deployment.', status: 'In Progress' },
          ]
        },
      ],
      team: [
        { name: 'Alice Johnson', skills: ['React', 'Next.js', 'TypeScript'], reasoning: 'Experienced in frontend development with a strong focus on building scalable React applications.' },
        { name: 'Bob Williams', skills: ['Node.js', 'GraphQL', 'PostgreSQL'], reasoning: 'Skilled in backend services and database management, perfect for the API and data layers.' },
        { name: 'Charlie Brown', skills: ['React Native', 'Firebase', 'Mobile UI/UX'], reasoning: 'Has a background in mobile development, which will be crucial for the native app version.' },
        { name: 'David Lee', skills: ['AWS', 'Docker', 'CI/CD'], reasoning: 'DevOps expert to ensure smooth deployment and scaling.' },
        { name: 'Eve Davis', skills: ['UI/UX Design', 'Figma', 'CSS'], reasoning: 'Specializes in creating intuitive and beautiful user interfaces.' },
      ],
      dailyUpdates: [
        { developerName: 'Alice Johnson', update: 'Completed the basic layout for the user profile page.', date: '2024-07-31' },
        { developerName: 'Bob Williams', update: 'Finalized the database schema for user profiles and posts.', date: '2024-07-31' },
        { developerName: 'Charlie Brown', update: 'Started setting up the React Native environment.', date: '2024-07-31' },
        { developerName: 'Alice Johnson', update: 'Implemented the authentication logic with Firebase.', date: '2024-07-30' },
      ],
    };

    setAnalysisResult(result);
    setRepoName(result.repository.name);

    const initialAssignments: Record<string, string[]> = {};
    result.projectBreakdown.forEach(part => {
        initialAssignments[part.part] = [part.suggestedDeveloper];
    });
    setAssignedDevelopers(initialAssignments);

    setIsLoading(false);
    setCurrentView('setup');
  };

  const renderUploadStep = () => (
    <Card className="w-full max-w-lg text-center">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">
          Start Your Project
        </CardTitle>
        <CardDescription>
          Upload your project specification PDF to begin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-muted-foreground rounded-lg p-12 flex flex-col items-center justify-center space-y-4">
          <UploadCloud className="w-16 h-16 text-primary" />
          <p className="text-muted-foreground">
            {file ? file.name : "Drag & drop or click to upload"}
          </p>
          <Input
            id="pdf-upload"
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <Button asChild variant="outline">
            <Label htmlFor="pdf-upload">Choose File</Label>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button onClick={handleAnalyze} disabled={!file || isLoading} size="lg">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Analyzing..." : "Analyze Project"}
        </Button>
      </CardFooter>
    </Card>
  );

  const renderSetupStep = () => {
    if (!analysisResult) return null;

    const renderRepoStep = () => (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Repository Setup</CardTitle>
            <CardDescription>Create a new repository or link to an existing one.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={repoOption} onValueChange={setRepoOption} className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="create" id="r1" className="peer sr-only" />
                <Label htmlFor="r1" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  <Github className="mb-3 h-6 w-6" />
                  Create New
                </Label>
              </div>
              <div>
                <RadioGroupItem value="existing" id="r2" className="peer sr-only" />
                <Label htmlFor="r2" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  <UploadCloud className="mb-3 h-6 w-6" />
                  Use Existing
                </Label>
              </div>
            </RadioGroup>
            {repoOption === 'create' && (
              <div className="mt-4">
                <Label htmlFor="repo-name">Repository Name</Label>
                <Input id="repo-name" placeholder="my-awesome-project" value={repoName} onChange={(e) => setRepoName(e.target.value)} />
              </div>
            )}
            {repoOption === 'existing' && (
              <div className="mt-4">
                <Label htmlFor="repo-url">Repository URL</Label>
                <Input id="repo-url" placeholder="https://github.com/your/repo" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => setSetupStep('breakdown')} className="ml-auto">
                Next <ChevronRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
    );
    
    const renderBreakdownSetupStep = () => {
        if (!analysisResult) return null;
        const filteredDevelopers = analysisResult.team.filter(dev => 
            dev.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const handleAddDeveloper = (part: string, devName: string) => {
            setAssignedDevelopers(prev => ({
                ...prev,
                [part]: [...(prev[part] || []), devName]
            }));
        };

        const handleRemoveDeveloper = (part: string, devName: string) => {
            setAssignedDevelopers(prev => ({
                ...prev,
                [part]: prev[part].filter(d => d !== devName)
            }));
        };

        return (
            <Card className="w-full max-w-7xl animate-in fade-in-50">
                 <CardHeader>
                    <CardTitle>Project Breakdown & Assignments</CardTitle>
                    <CardDescription>Assign developers to each part of the project. Developers can be assigned to multiple parts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <TooltipProvider>
                    <ScrollArea className="w-full pb-4">
                        <div className="flex gap-6">
                            {analysisResult.projectBreakdown.map((part) => (
                                <Card key={part.part} className="w-[350px] shrink-0 bg-secondary/50">
                                    <CardHeader>
                                        <CardTitle className="text-xl">{part.part}</CardTitle>
                                        <CardDescription>{part.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-semibold mb-2">Assigned Developers</h4>
                                            <div className="space-y-2 min-h-[6rem]">
                                                {part.suggestedDeveloper && (assignedDevelopers[part.part] || []).includes(part.suggestedDeveloper) && (
                                                    <div className="flex items-center justify-between p-2 bg-background rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="w-8 h-8">
                                                                <AvatarImage src={`https://placehold.co/100x100.png`} alt={part.suggestedDeveloper} data-ai-hint="person avatar"/>
                                                                <AvatarFallback>{part.suggestedDeveloper.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <span className="font-medium text-sm">{part.suggestedDeveloper} <Badge variant="secondary" className="ml-1">Auto-assigned</Badge></span>
                                                                <p className="text-xs text-muted-foreground italic">"{part.suggestionReasoning}"</p>
                                                            </div>
                                                        </div>
                                                        <Button size="sm" variant="ghost" onClick={() => handleRemoveDeveloper(part.part, part.suggestedDeveloper)}>Remove</Button>
                                                    </div>
                                                )}
                                                {(assignedDevelopers[part.part] || []).filter(d => d !== part.suggestedDeveloper).map(devName => (
                                                    <div key={devName} className="flex items-center justify-between p-2 bg-background rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="w-8 h-8">
                                                                <AvatarImage src={`https://placehold.co/100x100.png`} alt={devName} data-ai-hint="person avatar"/>
                                                                <AvatarFallback>{devName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-medium text-sm">{devName}</span>
                                                        </div>
                                                        <Button size="sm" variant="ghost" onClick={() => handleRemoveDeveloper(part.part, devName)}>Remove</Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start">
                                              <PlusCircle className="mr-2 h-4 w-4" />
                                              Add developer
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-[300px] p-0" align="start">
                                            <div className="p-2">
                                              <div className="relative">
                                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                                                <Input 
                                                    placeholder="Search developers..." 
                                                    className="pl-8" 
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                              </div>
                                            </div>
                                            <ScrollArea className="h-48">
                                                <div className="space-y-1 p-2">
                                                {filteredDevelopers
                                                  .filter(dev => !(assignedDevelopers[part.part] || []).includes(dev.name))
                                                  .map(dev => (
                                                    <Tooltip key={dev.name} delayDuration={300}>
                                                      <TooltipTrigger asChild>
                                                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-secondary cursor-pointer" onClick={() => handleAddDeveloper(part.part, dev.name)}>
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="w-6 h-6">
                                                                    <AvatarImage src={`https://placehold.co/100x100.png`} alt={dev.name} data-ai-hint="person avatar small"/>
                                                                    <AvatarFallback>{dev.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                                                </Avatar>
                                                                <span className="text-sm font-medium">{dev.name}</span>
                                                            </div>
                                                            <Button variant="ghost" size="sm"><UserPlus className="h-4 w-4"/></Button>
                                                        </div>
                                                      </TooltipTrigger>
                                                      <TooltipContent side="right" align="center">
                                                        <p className="font-semibold">Top Skills</p>
                                                        <ul className="list-disc list-inside text-muted-foreground">
                                                          {dev.skills.slice(0, 3).map(skill => <li key={skill}>{skill}</li>)}
                                                        </ul>
                                                      </TooltipContent>
                                                    </Tooltip>
                                                ))}
                                                </div>
                                            </ScrollArea>
                                          </PopoverContent>
                                        </Popover>

                                        <div>
                                          <h4 className="text-sm font-semibold mb-2 mt-4">Associated Tickets</h4>
                                          <Button variant="outline" className="w-full justify-start" disabled>
                                              <PlusCircle className="mr-2 h-4 w-4" />
                                              Add & Assign Ticket
                                          </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </TooltipProvider>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setSetupStep('repository')}>
                      <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button onClick={() => setCurrentView('dashboard')} className="ml-auto">
                      Create Project <Check className="w-4 h-4" />
                  </Button>
              </CardFooter>
            </Card>
        );
    };

    switch(setupStep) {
        case 'breakdown':
            return renderBreakdownSetupStep();
        case 'repository':
        default:
            return renderRepoStep();
    }
  };


  const renderDashboardStep = () => {
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
             <Button variant="outline" onClick={() => { setCurrentView('setup'); setSetupStep('breakdown'); }}>View & Edit Assignments</Button>
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
    
  const renderBreakdownStep = () => {
    if (!analysisResult) return null;
    const filteredDevelopers = analysisResult.team.filter(dev => 
        dev.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddDeveloper = (part: string, devName: string) => {
        setAssignedDevelopers(prev => ({
            ...prev,
            [part]: [...(prev[part] || []), devName]
        }));
    };

    const handleRemoveDeveloper = (part: string, devName: string) => {
        setAssignedDevelopers(prev => ({
            ...prev,
            [part]: prev[part].filter(d => d !== devName)
        }));
    };

    return (
        <div className="w-full animate-in fade-in-50">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" onClick={() => setCurrentView('dashboard')}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h2 className="font-headline text-3xl">Project Breakdown & Assignments</h2>
                    <p className="text-muted-foreground">Assign developers to each part of the project.</p>
                </div>
            </div>
            
            <TooltipProvider>
              <ScrollArea className="w-full pb-4">
                  <div className="flex gap-6">
                      {analysisResult.projectBreakdown.map((part) => (
                          <Card key={part.part} className="w-[350px] shrink-0">
                              <CardHeader>
                                  <CardTitle>{part.part}</CardTitle>
                                  <CardDescription>{part.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                  <div>
                                      <h4 className="text-sm font-semibold mb-2">Assigned Developers</h4>
                                      <div className="space-y-2">
                                          {(assignedDevelopers[part.part] || []).map(devName => (
                                              <div key={devName} className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                                                  <div className="flex items-center gap-2">
                                                      <Avatar className="w-8 h-8">
                                                          <AvatarImage src={`https://placehold.co/100x100.png`} alt={devName} data-ai-hint="person avatar"/>
                                                          <AvatarFallback>{devName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                                      </Avatar>
                                                      <span className="font-medium text-sm">{devName}</span>
                                                  </div>
                                                  <Button size="sm" variant="ghost" onClick={() => handleRemoveDeveloper(part.part, devName)}>Remove</Button>
                                              </div>
                                          ))}
                                          {part.suggestedDeveloper && !(assignedDevelopers[part.part] || []).includes(part.suggestedDeveloper) && (
                                              <div className="flex items-center justify-between p-2 border-2 border-dashed rounded-lg">
                                                  <div className="flex items-center gap-2">
                                                      <Avatar className="w-8 h-8 opacity-70">
                                                          <AvatarImage src={`https://placehold.co/100x100.png`} alt={part.suggestedDeveloper} data-ai-hint="person avatar"/>
                                                          <AvatarFallback>{part.suggestedDeveloper.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                                      </Avatar>
                                                      <div>
                                                        <span className="font-medium text-sm">{part.suggestedDeveloper}</span>
                                                        <p className="text-xs text-muted-foreground">Suggested</p>
                                                      </div>
                                                  </div>
                                                  <Button size="sm" onClick={() => handleAddDeveloper(part.part, part.suggestedDeveloper)}>Assign</Button>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                                  
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" className="w-full justify-start">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add developer
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0" align="start">
                                      <div className="p-2">
                                        <div className="relative">
                                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                                          <Input 
                                              placeholder="Search developers..." 
                                              className="pl-8" 
                                              value={searchQuery}
                                              onChange={(e) => setSearchQuery(e.target.value)}
                                          />
                                        </div>
                                      </div>
                                      <ScrollArea className="h-48">
                                          <div className="space-y-1 p-2">
                                          {filteredDevelopers
                                            .filter(dev => !(assignedDevelopers[part.part] || []).includes(dev.name))
                                            .map(dev => (
                                              <Tooltip key={dev.name} delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-secondary cursor-pointer" onClick={() => handleAddDeveloper(part.part, dev.name)}>
                                                      <div className="flex items-center gap-2">
                                                          <Avatar className="w-6 h-6">
                                                              <AvatarImage src={`https://placehold.co/100x100.png`} alt={dev.name} data-ai-hint="person avatar small"/>
                                                              <AvatarFallback>{dev.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                                          </Avatar>
                                                          <span className="text-sm font-medium">{dev.name}</span>
                                                      </div>
                                                      <Button variant="ghost" size="sm"><UserPlus className="h-4 w-4"/></Button>
                                                  </div>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" align="center">
                                                  <p className="font-semibold">Top Skills</p>
                                                  <ul className="list-disc list-inside text-muted-foreground">
                                                    {dev.skills.slice(0, 3).map(skill => <li key={skill}>{skill}</li>)}
                                                  </ul>
                                                </TooltipContent>
                                              </Tooltip>
                                          ))}
                                          </div>
                                      </ScrollArea>
                                    </PopoverContent>
                                  </Popover>
                              </CardContent>
                          </Card>
                      ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </TooltipProvider>
        </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
            <p className="text-muted-foreground text-lg">Analyzing your project...</p>
            <p className="text-sm text-muted-foreground">This may take a moment. The agent is assembling your team and tasks.</p>
        </div>
      );
    }

    switch (currentView) {
        case 'setup':
            return renderSetupStep();
        case 'dashboard':
            return renderDashboardStep();
        case 'upload':
        default:
            return renderUploadStep();
    }
  };
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="font-headline text-5xl font-bold tracking-tighter">
          Project Genesis
        </h1>
        <p className="text-muted-foreground text-lg">
          {analysisResult 
            ? 'Your project dashboard is live.' 
            : 'Intelligently kickstart your software projects.'
          }
        </p>
      </div>
      
      <div className="flex items-start justify-center">
        {renderContent()}
      </div>
    </div>
  );
}
