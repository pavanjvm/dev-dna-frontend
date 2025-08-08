import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Github, UploadCloud, ChevronRight, Check, PlusCircle, Search, UserPlus, ArrowLeft } from 'lucide-react';
import { ProjectAnalysis, SetupStep } from '@/components/project-genesis-client';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';


type SetupViewProps = {
    analysisResult: ProjectAnalysis | null;
    setupStep: SetupStep;
    setSetupStep: (step: SetupStep) => void;
    repoOption: string;
    setRepoOption: (option: string) => void;
    repoName: string;
    setRepoName: (name: string) => void;
    repoUrl: string;
    setRepoUrl: (url: string) => void;
    assignedDevelopers: Record<string, string[]>;
    setAssignedDevelopers: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
    handleCreateProject: () => void;
};

export function SetupView({
    analysisResult,
    setupStep,
    setSetupStep,
    repoOption,
    setRepoOption,
    repoName,
    setRepoName,
    repoUrl,
    setRepoUrl,
    assignedDevelopers,
    setAssignedDevelopers,
    handleCreateProject,
}: SetupViewProps) {
    const [searchQuery, setSearchQuery] = useState('');

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
                    <CardTitle>Project Breakdown &amp; Assignments</CardTitle>
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
                  <Button onClick={handleCreateProject} className="ml-auto">
                      Create Project <Check className="w-4 h-4" />
                  </Button>
              </CardFooter>
            </Card>
        );
    };


    if (!analysisResult) return null;

    switch(setupStep) {
        case 'breakdown':
            return renderBreakdownSetupStep();
        case 'repository':
        default:
            return renderRepoStep();
    }
}

    