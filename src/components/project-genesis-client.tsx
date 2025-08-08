
"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';

import { UploadView } from "@/components/views/upload-view";
import { SetupView } from "@/components/views/setup-view";
import { DashboardView } from "@/components/views/dashboard-view";

export type JiraTaskStatus = 'To Do' | 'In Progress' | 'Done' | 'Blocked';

export type JiraTask = {
    ticket: string;
    description: string;
    status: JiraTaskStatus;
};

export type ProjectAnalysis = {
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

type ApiAnalysisResponse = {
  projectname: string;
  description: string;
  module_breakdown: {
    [key: string]: {
      title: string;
      description: string;
      suggested_developer: string;
      reasoning: string;
    }
  }
};

export type View = 'upload' | 'setup' | 'dashboard';
export type SetupStep = 'repository' | 'breakdown';


export function ProjectGenesisClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ProjectAnalysis | null>(null);

  const currentView = (searchParams.get('view') as View) || 'upload';
  const setupStep = (searchParams.get('step') as SetupStep) || 'repository';

  const [repoOption, setRepoOption] = useState('create');
  const [repoUrl, setRepoUrl] = useState('');
  const [repoName, setRepoName] = useState('project-genesis-app');
  const [assignedDevelopers, setAssignedDevelopers] = useState<Record<string, string[]>>({});

  const { toast } = useToast();

  const setCurrentView = (view: View) => {
    router.push(`/?view=${view}`);
  };

  const setSetupStep = (step: SetupStep) => {
    router.push(`/?view=setup&step=${step}`);
  };

  useEffect(() => {
    // Attempt to load analysis from session storage on initial load
    const storedAnalysis = sessionStorage.getItem('projectAnalysis');
    if (storedAnalysis) {
        try {
            const parsedAnalysis: ProjectAnalysis = JSON.parse(storedAnalysis);
            setAnalysisResult(parsedAnalysis);
            setRepoName(parsedAnalysis.repository.name);
            const initialAssignments: Record<string, string[]> = {};
            parsedAnalysis.projectBreakdown.forEach(part => {
                initialAssignments[part.part] = [part.suggestedDeveloper];
            });
            setAssignedDevelopers(initialAssignments);
        } catch (error) {
            console.error("Failed to parse analysis from session storage", error);
            sessionStorage.removeItem('projectAnalysis');
        }
    }
  }, []);

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

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("http://localhost:3000/analyse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status} - ${errorData.details || errorData.error}`);
      }

      const apiResult: ApiAnalysisResponse = await response.json();
      
      const projectBreakdown = Object.values(apiResult.module_breakdown).map(mod => ({
        part: mod.title,
        description: mod.description,
        suggestedDeveloper: mod.suggested_developer,
        suggestionReasoning: mod.reasoning,
        tickets: [], 
      }));

      const teamMap = new Map<string, { skills: string[], reasoning: string }>();
      projectBreakdown.forEach(part => {
        if (!teamMap.has(part.suggestedDeveloper)) {
            teamMap.set(part.suggestedDeveloper, { skills: [], reasoning: '' });
        }
        teamMap.get(part.suggestedDeveloper)!.skills.push(part.part);
        teamMap.get(part.suggestedDeveloper)!.reasoning = part.suggestionReasoning;
      });

      const team = Array.from(teamMap.entries()).map(([name, data]) => ({
          name,
          ...data,
      }));


      const result: ProjectAnalysis = {
        analysis: {
          summary: apiResult.description,
          keyAspects: '', 
        },
        repository: {
          name: apiResult.projectname.toLowerCase().replace(/\s+/g, '-'),
          url: '', 
        },
        projectBreakdown,
        team,
        dailyUpdates: [],
      };
      
      try {
          sessionStorage.setItem('projectAnalysis', JSON.stringify(result));
      } catch (error) {
          console.error("Failed to save analysis to session storage", error);
      }
      setAnalysisResult(result);
      setRepoName(result.repository.name);

      const initialAssignments: Record<string, string[]> = {};
      result.projectBreakdown.forEach(part => {
          if (part.suggestedDeveloper) {
            initialAssignments[part.part] = [part.suggestedDeveloper];
          }
      });
      setAssignedDevelopers(initialAssignments);
      setCurrentView('setup');

    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Could not analyze the project. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!analysisResult) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Project analysis data is missing.",
        });
        return;
    }

    setIsLoading(true);

    let requestBody;
    if (repoOption === 'create') {
        requestBody = {
            action: 'create-repo',
            name: repoName,
            description: analysisResult.analysis.summary,
        };
    } else {
        requestBody = {
            action: 'existing-repo',
            name: repoName,
            description: analysisResult.analysis.summary,
            repo_url: repoUrl,
        };
    }

    try {
        const response = await fetch("http://localhost:8000/projects", {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        toast({
            title: "Project Created!",
            description: "Your project repository has been set up.",
        });
        setCurrentView('dashboard');

    } catch (error) {
        console.error("Project creation failed:", error);
        toast({
            variant: "destructive",
            title: "Project Creation Failed",
            description: "Could not create or link the repository. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
};
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
            <p className="text-muted-foreground text-lg">Please wait...</p>
            <p className="text-sm text-muted-foreground">The agent is working its magic.</p>
        </div>
      );
    }

    switch (currentView) {
        case 'setup':
            return (
              <SetupView
                analysisResult={analysisResult}
                setupStep={setupStep}
                setSetupStep={setSetupStep}
                repoOption={repoOption}
                setRepoOption={setRepoOption}
                repoName={repoName}
                setRepoName={setRepoName}
                repoUrl={repoUrl}
                setRepoUrl={setRepoUrl}
                assignedDevelopers={assignedDevelopers}
                setAssignedDevelopers={setAssignedDevelopers}
                handleCreateProject={handleCreateProject}
              />
            );
        case 'dashboard':
            return (
              <DashboardView
                analysisResult={analysisResult}
                repoOption={repoOption}
                repoName={repoName}
                repoUrl={repoUrl}
                assignedDevelopers={assignedDevelopers}
                setCurrentView={setCurrentView}
                setSetupStep={setSetupStep}
              />
            );
        case 'upload':
        default:
            return (
              <UploadView 
                file={file}
                isLoading={isLoading}
                handleFileChange={handleFileChange}
                handleAnalyze={handleAnalyze}
              />
            );
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
