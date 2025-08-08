
"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';

import { UploadView } from "@/components/views/upload-view";
import { SetupView } from "@/components/views/setup-view";
import { DashboardView } from "@/components/views/dashboard-view";
import { Topbar } from "@/components/topbar";

export type JiraTaskStatus = 'To Do' | 'In Progress' | 'Done' | 'Blocked';

export type JiraTask = {
    ticket: string;
    description: string;
    status: JiraTaskStatus;
};

export type DailyUpdate = {
    developerName: string;
    update: string;
    date: string;
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
  dailyUpdates: DailyUpdate[];
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


export function DevDnaClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ProjectAnalysis | null>(null);

  const currentView = (searchParams.get('view') as View) || 'upload';
  const setupStep = (searchParams.get('step') as SetupStep) || 'repository';

  const [repoOption, setRepoOption] = useState('create');
  const [repoUrl, setRepoUrl] = useState('');
  const [repoName, setRepoName] = useState('dev-dna-app');
  const [assignedDevelopers, setAssignedDevelopers] = useState<Record<string, string[]>>({});

  const { toast } = useToast();

  const setCurrentView = (view: View, step?: SetupStep) => {
    let path = `/project?view=${view}`;
    if (view === 'setup' && step) {
        path += `&step=${step}`;
    }
    router.push(path);
};

  useEffect(() => {
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

    const handleDailyUpdates = (event: Event) => {
      const customEvent = event as CustomEvent<DailyUpdate[]>;
      setAnalysisResult(prev => {
        if (!prev) return null;
        const newUpdates = [...prev.dailyUpdates];
        customEvent.detail.forEach(newUpdate => {
          if (!newUpdates.some(existing => existing.developerName === newUpdate.developerName && existing.date === newUpdate.date && existing.update === newUpdate.update)) {
            newUpdates.push(newUpdate);
          }
        });
        const updatedAnalysis = { ...prev, dailyUpdates: newUpdates };
        sessionStorage.setItem('projectAnalysis', JSON.stringify(updatedAnalysis));
        return updatedAnalysis;
      });
    };

    window.addEventListener('dailyUpdatesReceived', handleDailyUpdates);

    return () => {
        window.removeEventListener('dailyUpdatesReceived', handleDailyUpdates);
    };

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

      const teamMap = new Map<string, { name: string, skills: string[], reasoning: string }>();
        projectBreakdown.forEach(part => {
        if (!teamMap.has(part.suggestedDeveloper)) {
            teamMap.set(part.suggestedDeveloper, { name: part.suggestedDeveloper, skills: [], reasoning: '' });
        }
        teamMap.get(part.suggestedDeveloper)!.skills.push(part.part);
        teamMap.get(part.suggestedDeveloper)!.reasoning = part.suggestionReasoning;
      });

      const team = Array.from(teamMap.values());


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
      setCurrentView('setup', 'repository');

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

    if (repoOption === 'create') {
        const requestBody = {
            action: 'create-repo',
            name: repoName,
            description: analysisResult.analysis.summary,
        };

        try {
            const response = await fetch("http://localhost:3001/query", {
                method: "POST",
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
                description: "Could not create the repository. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    } else {
        // For existing repo, just go to dashboard
        toast({
            title: "Project Linked!",
            description: "You are now viewing the dashboard for your existing project.",
        });
        setCurrentView('dashboard');
        setIsLoading(false);
    }
  };
  
  const renderContent = () => {
    if (isLoading && currentView !== 'dashboard') {
      return (
        <div className="flex flex-col items-center gap-4 text-center h-screen justify-center text-white">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
            <p className="text-lg">Please wait...</p>
            <p className="text-sm">The agent is working its magic.</p>
        </div>
      );
    }

    switch (currentView) {
        case 'setup':
            return (
              <div className="flex items-center justify-center min-h-screen">
                <SetupView
                  analysisResult={analysisResult}
                  setupStep={setupStep}
                  setSetupStep={(step) => setCurrentView('setup', step)}
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
              </div>
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
                setSetupStep={(step) => setCurrentView('setup', step)}
              />
            );
        case 'upload':
        default:
            return (
              <div className="flex items-center justify-center min-h-screen">
                <UploadView 
                  file={file}
                  isLoading={isLoading}
                  handleFileChange={handleFileChange}
                  handleAnalyze={handleAnalyze}
                />
              </div>
            );
    }
  };
  
  return (
    <div>
      {currentView === 'dashboard' && analysisResult && <Topbar projectTitle={analysisResult.repository.name} />}
       <div className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </div>
    </div>
  );
}
