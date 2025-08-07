"use client";

import { useState, ChangeEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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

export type View = 'upload' | 'setup' | 'dashboard';
export type SetupStep = 'repository' | 'breakdown';


export function ProjectGenesisClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ProjectAnalysis | null>(null);
  const [currentView, setCurrentView] = useState<View>('upload');
  const [setupStep, setSetupStep] = useState<SetupStep>('repository');
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
                setCurrentView={setCurrentView}
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
