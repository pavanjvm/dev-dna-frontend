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
} from "lucide-react";

// Mock types based on the new consolidated JSON structure
type ProjectAnalysis = {
  analysis: {
    summary: string;
    keyAspects: string;
  };
  repository: {
    name: string;
    url: string;
  };
  team: {
    name: string;
    skills: string[];
    reasoning: string;
  }[];
  tasks: {
    task: string;
    assignee: string | null;
  }[];
  dailyUpdates: {
    developer: string;
    update: string;
    date: string;
  }[];
};

type Developer = ProjectAnalysis["team"][0];
type DailyUpdate = ProjectAnalysis["dailyUpdates"][0];
type Task = ProjectAnalysis["tasks"][0];

type PerformanceData = {
  name: string;
  contributionScore: number;
}[];

export function ProjectGenesisClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ProjectAnalysis | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData>([]);

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

  const calculatePerformanceMetrics = (
    developers: Developer[],
    tasks: Task[],
    updates: DailyUpdate[]
  ): PerformanceData => {
    const scores: { [key: string]: number } = {};

    developers.forEach(dev => {
      scores[dev.name] = 0;
    });

    // 2 points per task
    tasks.forEach(task => {
      if (task.assignee && scores[task.assignee] !== undefined) {
        scores[task.assignee] += 2;
      }
    });

    // 1 point per update
    updates.forEach(update => {
      if (scores[update.developer] !== undefined) {
        scores[update.developer] += 1;
      }
    });

    return Object.entries(scores)
      .map(([name, score]) => ({ name, contributionScore: score }))
      .sort((a, b) => b.contributionScore - a.contributionScore);
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

    // Mock response based on the defined JSON structure
    const result: ProjectAnalysis = {
      analysis: {
        summary: "The project is a new social media platform for pet owners, allowing them to share photos, connect with others, and find pet-friendly locations.",
        keyAspects: "User profiles, photo uploads, social feed, real-time chat, and a map integration for locations."
      },
      repository: {
        name: "project-genesis-app",
        url: "https://github.com/example/project-genesis-app"
      },
      team: [
        { name: 'Alice Johnson', skills: ['React', 'Next.js', 'TypeScript'], reasoning: 'Experienced in frontend development with a strong focus on building scalable React applications.' },
        { name: 'Bob Williams', skills: ['Node.js', 'GraphQL', 'PostgreSQL'], reasoning: 'Skilled in backend services and database management, perfect for the API and data layers.' },
        { name: 'Charlie Brown', skills: ['React Native', 'Firebase', 'Mobile UI/UX'], reasoning: 'Has a background in mobile development, which will be crucial for the native app version.' },
        { name: 'David Lee', skills: ['AWS', 'Docker', 'CI/CD'], reasoning: 'DevOps expert to ensure smooth deployment and scaling.' },
        { name: 'Eve Davis', skills: ['UI/UX Design', 'Figma', 'CSS'], reasoning: 'Specializes in creating intuitive and beautiful user interfaces.' },
      ],
      tasks: [
        { task: 'PROJ-1: Setup user authentication flow', assignee: 'Alice Johnson' },
        { task: 'PROJ-2: Design database schema for user profiles', assignee: 'Bob Williams' },
        { task: 'PROJ-3: Implement photo upload service', assignee: 'Alice Johnson' },
        { task: 'PROJ-4: Create API endpoint for social feed', assignee: 'Bob Williams' },
        { task: 'PROJ-5: Develop real-time chat feature', assignee: 'Charlie Brown' },
        { task: 'PROJ-6: Configure CI/CD pipeline', assignee: 'David Lee' },
        { task: 'PROJ-7: Design user profile page mockups', assignee: 'Eve Davis' },
        { task: 'PROJ-8: Write unit tests for authentication', assignee: 'Alice Johnson' },
      ],
      dailyUpdates: [
        { developer: 'Alice Johnson', update: 'Completed the basic layout for the user profile page and started working on the authentication logic.', date: '2024-07-31' },
        { developer: 'Bob Williams', update: 'Finalized the database schema for user profiles and posts. Began setting up the initial Express server.', date: '2024-07-31' },
        { developer: 'Charlie Brown', update: 'Investigated options for the real-time chat feature. Decided on using Socket.IO and created a basic prototype.', date: '2024-07-31' },
        { developer: 'Alice Johnson', update: 'Implemented JWT-based authentication and tested endpoints.', date: '2024-08-01' },
        { developer: 'David Lee', update: 'Set up initial GitHub Actions workflow for linting and testing.', date: '2024-08-01' },
        { developer: 'Eve Davis', update: 'Created wireframes and high-fidelity mockups for the main feed and profile pages.', date: '2024-08-01' },
      ]
    };

    setAnalysisResult(result);
    const performance = calculatePerformanceMetrics(result.team, result.tasks, result.dailyUpdates);
    setPerformanceData(performance);
    
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

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
             <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><Users className="w-6 h-6" />Project Team</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2 overflow-hidden">
                        {performanceData.slice(0, 5).map((dev) => (
                             <Avatar key={dev.name} className="inline-block border-2 border-background">
                                <AvatarImage src={`https://placehold.co/100x100.png`} alt={dev.name} data-ai-hint="person avatar"/>
                                <AvatarFallback>{dev.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                    <div className="text-sm">
                        <p className="font-semibold">{analysisResult.team.length} Developers</p>
                        <p className="text-muted-foreground">Top contributors shown</p>
                    </div>
                </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><FileText className="w-6 h-6"/>Task Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult.tasks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Assigned To</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysisResult.tasks.map((task, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{task.task}</TableCell>
                          <TableCell>
                            {task.assignee || (
                              <span className="text-muted-foreground">
                                Unassigned
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>No tasks have been assigned yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Activity className="w-6 h-6"/>Performance Metrics</CardTitle>
            <CardDescription>Developer contribution scores based on tasks and updates.</CardDescription>
          </CardHeader>
          <CardContent>
             {performanceData.length > 0 && performanceData.some(p => p.contributionScore > 0) ? (
              <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                      data={performanceData}
                      margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                      }}
                      >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                          contentStyle={{
                              backgroundColor: 'hsl(var(--background))',
                              borderColor: 'hsl(var(--border))'
                          }}
                      />
                      <Legend />
                      <Bar dataKey="contributionScore" fill="hsl(var(--primary))" name="Contribution Score" />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
             ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>No performance data available yet.</p>
              </div>
             )}
          </CardContent>
        </Card>

         <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><Newspaper className="w-6 h-6"/>Daily Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {analysisResult.dailyUpdates.length > 0 ? analysisResult.dailyUpdates.map((update, i) => (
                <div key={i} className="flex gap-4">
                    <Avatar>
                        <AvatarImage src={`https://placehold.co/100x100.png`} alt={update.developer} data-ai-hint="person icon"/>
                        <AvatarFallback>{update.developer.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">{update.developer}</p>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3"/>
                                {update.date}
                            </div>
                        </div>
                        <p className="text-muted-foreground mt-1">{update.update}</p>
                    </div>
                </div>
              )) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>No daily updates have been posted.</p>
                </div>
              )}
            </CardContent>
          </Card>
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
