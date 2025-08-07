"use client";

import { useState, useCallback, useMemo, ChangeEvent } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

import {
  UploadCloud,
  Loader2,
  FileText,
  BrainCircuit,
  Github,
  Users,
  Rocket,
  LayoutDashboard,
  CheckCircle,
} from "lucide-react";

// Mock types that were previously imported from AI flows
type AnalyzeProjectRequirementsOutput = {
  summary: string;
  keyAspects: string;
};

type RecommendDevelopersOutput = {
  name: string;
  skills: string[];
  reasoning: string;
}[];

type CreateJiraTasksOutput = {
  jiraTaskDetails: string[];
};

type Step = "UPLOAD" | "SETUP" | "TEAM" | "JIRA" | "DASHBOARD";
type Developer = RecommendDevelopersOutput[0];

const stepConfig: Record<Step, { value: number; label: string }> = {
  UPLOAD: { value: 0, label: "Upload" },
  SETUP: { value: 25, label: "Analyze & Setup" },
  TEAM: { value: 50, label: "Assemble Team" },
  JIRA: { value: 75, label: "Generate Tasks" },
  DASHBOARD: { value: 100, label: "Dashboard" },
};

export function ProjectGenesisClient() {
  const [step, setStep] = useState<Step>("UPLOAD");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] =
    useState<AnalyzeProjectRequirementsOutput | null>(null);
  const [repoName, setRepoName] = useState("");
  const [recommendedDevs, setRecommendedDevs] =
    useState<RecommendDevelopersOutput | null>(null);
  const [selectedDevs, setSelectedDevs] = useState<Developer[]>([]);
  const [jiraTasks, setJiraTasks] = useState<CreateJiraTasksOutput | null>(
    null
  );

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
    setLoadingMessage("Analyzing project requirements...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAnalysis({
      summary: "The project is a new social media platform for pet owners, allowing them to share photos, connect with others, and find pet-friendly locations.",
      keyAspects: "User profiles, photo uploads, social feed, real-time chat, and a map integration for locations."
    });
    setStep("SETUP");
    setIsLoading(false);
  };

  const handleRecommendDevelopers = async () => {
    if (!analysis) return;
    setIsLoading(true);
    setLoadingMessage("Recommending suitable developers...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRecommendedDevs([
      { name: 'Alice Johnson', skills: ['React', 'Next.js', 'TypeScript'], reasoning: 'Experienced in frontend development with a strong focus on building scalable React applications.' },
      { name: 'Bob Williams', skills: ['Node.js', 'GraphQL', 'PostgreSQL'], reasoning: 'Skilled in backend services and database management, perfect for the API and data layers.' },
      { name: 'Charlie Brown', skills: ['React Native', 'Firebase', 'Mobile UI/UX'], reasoning: 'Has a background in mobile development, which will be crucial for the native app version.' },
    ]);
    setStep("TEAM");
    setIsLoading(false);
  };

  const handleCreateJira = async () => {
    if (!analysis || !repoName || selectedDevs.length === 0) return;
    setIsLoading(true);
    setLoadingMessage("Creating Jira board and assigning tasks...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    setJiraTasks({
      jiraTaskDetails: [
        'PROJ-1: Setup user authentication flow - Assigned to Alice Johnson',
        'PROJ-2: Design database schema for user profiles - Assigned to Bob Williams',
        'PROJ-3: Implement photo upload service - Assigned to Alice Johnson',
        'PROJ-4: Create API endpoint for social feed - Assigned to Bob Williams',
        'PROJ-5: Develop real-time chat feature - Assigned to Charlie Brown',
      ]
    });
    setStep("DASHBOARD");
    setIsLoading(false);
  };

  const toggleDeveloperSelection = (dev: Developer, isSelected: boolean) => {
    if (isSelected) {
      setSelectedDevs((prev) => [...prev, dev]);
    } else {
      setSelectedDevs((prev) => prev.filter((d) => d.name !== dev.name));
    }
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
        <Button onClick={handleAnalyze} disabled={!file} size="lg">
          Analyze Project
        </Button>
      </CardFooter>
    </Card>
  );

  const renderSetupStep = () =>
    analysis && (
      <div className="w-full max-w-4xl grid gap-8">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="font-headline text-3xl">Analysis Complete</h2>
          <p className="text-muted-foreground">
            Here is a summary of your project. Next, let's set up the
            repository.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex-row items-center gap-4">
              <FileText className="w-8 h-8 text-primary" />
              <CardTitle className="font-headline">Project Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysis.summary}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-4">
              <BrainCircuit className="w-8 h-8 text-primary" />
              <CardTitle className="font-headline">Key Aspects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysis.keyAspects}</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="flex-row items-center gap-4">
            <Github className="w-8 h-8 text-primary" />
            <CardTitle className="font-headline">Create Repository</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="repo-name">Repository Name</Label>
            <Input
              id="repo-name"
              placeholder="e.g., project-genesis-app"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleRecommendDevelopers}
              disabled={!repoName}
              size="lg"
            >
              Create & Find Team
            </Button>
          </CardFooter>
        </Card>
      </div>
    );

  const renderTeamStep = () => (
    <div className="w-full max-w-6xl grid gap-8">
      <div className="text-center">
        <Users className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="font-headline text-3xl">Assemble Your Team</h2>
        <p className="text-muted-foreground">
          Here are the recommended developers based on your project needs.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedDevs ? (
          recommendedDevs.map((dev, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={`https://placehold.co/100x100.png`}
                        alt={dev.name}
                        data-ai-hint="person portrait"
                      />
                      <AvatarFallback>
                        {dev.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{dev.name}</CardTitle>
                      <CardDescription>Developer</CardDescription>
                    </div>
                  </div>
                  <Checkbox
                    className="w-5 h-5"
                    onCheckedChange={(checked) =>
                      toggleDeveloperSelection(dev, !!checked)
                    }
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                  {dev.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="reasoning">
                    <AccordionTrigger>View Reasoning</AccordionTrigger>
                    <AccordionContent>{dev.reasoning}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))
        ) : (
          [...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <div className="flex justify-center">
        <Button
          onClick={() => setStep("JIRA")}
          disabled={selectedDevs.length === 0}
          size="lg"
        >
          Finalize Team ({selectedDevs.length} selected)
        </Button>
      </div>
    </div>
  );

  const renderJiraStep = () => (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <Rocket className="w-12 h-12 text-primary mx-auto mb-4" />
        <CardTitle className="font-headline text-3xl">Ready to Launch?</CardTitle>
        <CardDescription>
          Project '{repoName}' is ready with a team of {selectedDevs.length}{" "}
          members.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The next step will automatically create a Jira board and generate
          initial tasks based on the project analysis.
        </p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button onClick={handleCreateJira} size="lg">
          Generate Jira Tasks
        </Button>
      </CardFooter>
    </Card>
  );

  const parseJiraTask = (taskString: string) => {
    let task = taskString;
    let assignee: string | null = null;
    if (taskString.includes(" - Assigned to ")) {
      const parts = taskString.split(" - Assigned to ");
      task = parts[0];
      assignee = parts[1];
    }
    return { task, assignee };
  };

  const renderDashboardStep = () =>
    analysis &&
    jiraTasks && (
      <div className="w-full max-w-6xl grid gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <LayoutDashboard className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="font-headline text-4xl">{repoName}</CardTitle>
                <CardDescription>{analysis.summary}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="font-headline">Project Team</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {selectedDevs.map((dev) => (
                <div key={dev.name} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={`https://placehold.co/100x100.png`}
                      alt={dev.name}
                      data-ai-hint="person avatar"
                    />
                    <AvatarFallback>
                      {dev.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{dev.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline">Task Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Assigned To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jiraTasks.jiraTaskDetails.map((taskString, i) => {
                    const { task, assignee } = parseJiraTask(taskString);
                    return (
                      <TableRow key={i}>
                        <TableCell>{task}</TableCell>
                        <TableCell>
                          {assignee || (
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
            </CardContent>
          </Card>
        </div>
      </div>
    );

  const renderContent = () => {
    switch (step) {
      case "UPLOAD":
        return renderUploadStep();
      case "SETUP":
        return renderSetupStep();
      case "TEAM":
        return renderTeamStep();
      case "JIRA":
        return renderJiraStep();
      case "DASHBOARD":
        return renderDashboardStep();
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="font-headline text-5xl font-bold tracking-tighter">
          Project Genesis
        </h1>
        <p className="text-muted-foreground text-lg">
          Intelligently kickstart your software projects.
        </p>
      </div>

      <div className="w-full max-w-2xl mx-auto mb-12">
        <Progress value={stepConfig[step].value} className="w-full" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          {Object.values(stepConfig).map(
            (s) =>
              s.value <= stepConfig[step].value && (
                <span key={s.label}>{s.label}</span>
              )
          )}
        </div>
      </div>

      <div className="flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
            <p className="text-muted-foreground text-lg">{loadingMessage}</p>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}
