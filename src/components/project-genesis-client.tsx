"use client";

import { useState, ChangeEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UploadCloud,
  Loader2,
  FileText,
  Github,
  Users,
  LayoutDashboard,
  Calendar,
  Activity,
  Newspaper,
  Lightbulb,
  Puzzle,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

// Updated project analysis type
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
  }[];
  team: {
    name: string;
    skills: string[];
    reasoning: string;
    featureSuggestions: string[];
  }[];
};

type Developer = ProjectAnalysis["team"][0];

export function ProjectGenesisClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ProjectAnalysis | null>(null);

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

    // Mock AI call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock response based on the updated JSON structure
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
        { part: 'Frontend Development', description: 'Building the user interface and user experience.', suggestedDeveloper: 'Alice Johnson' },
        { part: 'Backend API', description: 'Developing the server-side logic and data management.', suggestedDeveloper: 'Bob Williams' },
        { part: 'Mobile App', description: 'Creating the native mobile application for iOS and Android.', suggestedDeveloper: 'Charlie Brown' },
        { part: 'Deployment & Infrastructure', description: 'Managing cloud infrastructure and CI/CD pipelines.', suggestedDeveloper: 'David Lee' },
      ],
      team: [
        { name: 'Alice Johnson', skills: ['React', 'Next.js', 'TypeScript'], reasoning: 'Experienced in frontend development with a strong focus on building scalable React applications.', featureSuggestions: ["Implement user authentication and profile pages.", "Develop a responsive and dynamic social feed."] },
        { name: 'Bob Williams', skills: ['Node.js', 'GraphQL', 'PostgreSQL'], reasoning: 'Skilled in backend services and database management, perfect for the API and data layers.', featureSuggestions: ["Design and build the database schema for users and posts.", "Create a GraphQL API for real-time chat functionality."] },
        { name: 'Charlie Brown', skills: ['React Native', 'Firebase', 'Mobile UI/UX'], reasoning: 'Has a background in mobile development, which will be crucial for the native app version.', featureSuggestions: ["Develop a native mobile app for iOS and Android.", "Integrate push notifications for new messages and interactions."] },
        { name: 'David Lee', skills: ['AWS', 'Docker', 'CI/CD'], reasoning: 'DevOps expert to ensure smooth deployment and scaling.', featureSuggestions: ["Set up a CI/CD pipeline for automated testing and deployment.", "Configure scalable cloud infrastructure on AWS."] },
        { name: 'Eve Davis', skills: ['UI/UX Design', 'Figma', 'CSS'], reasoning: 'Specializes in creating intuitive and beautiful user interfaces.', featureSuggestions: ["Create a complete design system and component library in Figma.", "Ensure the application is fully accessible (WCAG AA)."] },
      ],
    };

    setAnalysisResult(result);
    setIsLoading(false);
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

  const renderDashboardStep = () =>
    analysisResult && (
      <div className="w-full max-w-7xl grid gap-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <LayoutDashboard className="w-10 h-10 text-primary hidden md:block" />
              <div className="flex-grow">
                <CardTitle className="font-headline text-4xl">{analysisResult.repository.name}</CardTitle>
                <CardDescription className="text-base mt-1">{analysisResult.analysis.summary}</CardDescription>
                <a href={analysisResult.repository.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1 mt-2">
                    <Github className="w-4 h-4" />
                    {analysisResult.repository.url}
                </a>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Puzzle className="w-6 h-6" />
              Project Breakdown
            </CardTitle>
            <CardDescription>
              The project has been broken down into the following parts, with developers suggested based on their skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analysisResult.projectBreakdown.map((part) => (
                <Card key={part.part} className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle className="text-lg">{part.part}</CardTitle>
                    <CardDescription>{part.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="flex items-center gap-2 text-sm">
                        <Avatar className="w-6 h-6">
                            <AvatarImage src={`https://placehold.co/100x100.png`} alt={part.suggestedDeveloper} data-ai-hint="person avatar small"/>
                            <AvatarFallback>{part.suggestedDeveloper.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-muted-foreground">Suggested: <span className="text-foreground">{part.suggestedDeveloper}</span></span>
                      </div>
                  </CardContent>
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
              <CardTitle className="font-headline flex items-center gap-2"><Lightbulb className="w-6 h-6"/>Feature Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {analysisResult.team.map((developer, index) => (
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
                      {developer.featureSuggestions.length > 0 ? (
                        <ul className="space-y-3 pl-6">
                            {developer.featureSuggestions.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                                    <Lightbulb className="w-5 h-5 mt-1 text-primary shrink-0"/>
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground text-sm pl-6">No feature suggestions for this developer.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    );

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

    if (analysisResult) {
      return renderDashboardStep();
    }

    return renderUploadStep();
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
