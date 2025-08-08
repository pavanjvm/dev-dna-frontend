export type Developer = {
    github_username: string;
    monthly_commits: number;
    average_commits_per_day: number;
    pull_request_approval_rate: string;
    pull_request_reviews: number;
    languages: string[];
    skills_domains: string[];
    strengths: string;
    weakness: string;
    type_of_work_in_percentage: {
      features: number;
      bugs: number;
      infrastructure: number;
      documentation: number;
    };
  };
  
  export const developers: Developer[] = [];
  
  export const getDeveloperByUsername = (username: string): Developer | undefined => {
      // This function will now be less useful as data is managed in component state.
      // It can be adapted or removed if session/context data is used instead.
      if (typeof window !== 'undefined') {
        try {
          const storedAnalysis = sessionStorage.getItem('projectAnalysis');
          if (storedAnalysis) {
              const parsed = JSON.parse(storedAnalysis);
              const team: Developer[] = parsed.team;
              return team.find(dev => dev.github_username === username);
          }
        } catch (e) {
          console.error("Could not parse session storage", e)
        }
      }
      return undefined;
  }
  