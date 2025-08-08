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
  
  export const developers: Developer[] = [
    {
      "github_username": "farhanfist10",
      "monthly_commits": 45,
      "average_commits_per_day": 7.0,
      "pull_request_approval_rate": "92%",
      "pull_request_reviews": 0,
      "languages": [
        "JavaScript",
        "Batchfile",
        "Procfile",
        "Shell",
        "CSS",
        "Makefile",
        "Jupyter Notebook",
        "Java",
        "PHP",
        "HCL",
        "Dockerfile",
        "HTML",
        "PLSQL",
        "PowerShell",
        "Python",
        "Roff"
      ],
      "skills_domains": [
        "DevOps",
        "Infrastructure as Code",
        "CI/CD",
        "Frontend",
        "Backend",
        "Data Science",
        "AI/ML",
        "Security",
        "Shell Scripting",
        "Cloud"
      ],
      "strengths": "Demonstrates high versatility across scripting, infrastructure automation, and full-stack development. Shows comfort with system-level configurations and DevOps pipelines. Capable of adapting to cross-functional tasks spanning web, data, and operational tooling.",
      "weakness": "Lack of publicly available pull requests or collaboration-related metrics makes it difficult to assess code quality, teamwork, or architectural decisions.",
      "type_of_work_in_percentage": {
        "features": 40,
        "bugs": 10,
        "infrastructure": 10,
        "documentation": 10
      }
    },
    {
      "github_username": "pavanjvm",
      "monthly_commits": 225,
      "average_commits_per_day": 7,
      "pull_request_approval_rate": "0.0%",
      "pull_request_reviews": 0,
      "languages": [
        "JavaScript",
        "HCL",
        "Python",
        "TypeScript",
        "Nix",
        "CSS",
        "HTML"
      ],
      "skills_domains": [
        "Frontend",
        "Backend",
        "Full-Stack Development",
        "Cloud",
        "DevOps",
        "Infrastructure as Code",
        "Automation",
        "AI-Ready UIs"
      ],
      "strengths": "High productivity with frequent, structured commits. Shows strong grasp of modular architecture and clean code principles across frontend and backend. Makes good use of modern JavaScript ecosystems and infrastructure tooling.",
      "weakness": "Minimal engagement in code reviews and architectural refactoring. Limited evidence of contributions in collaborative workflows or advanced algorithmic problem-solving.",
      "type_of_work_in_percentage": {
        "features": 50,
        "bugs": 20,
        "infrastructure": 20,
        "documentation": 10
      }
    },
    {
      "github_username": "Arul6851",
      "monthly_commits": 17,
      "average_commits_per_day": 0,
      "pull_request_approval_rate": "0%",
      "pull_request_reviews": 0,
      "languages": [
        "Java",
        "Swift",
        "Cython",
        "PHP",
        "CMake",
        "Kotlin",
        "Dart",
        "C++",
        "Python",
        "Dockerfile",
        "Shell",
        "Fortran",
        "Go",
        "C",
        "HCL",
        "JavaScript",
        "Forth",
        "Meson",
        "PowerShell",
        "CSS",
        "Objective-C",
        "TypeScript",
        "Jupyter Notebook",
        "HTML",
        "Batchfile"
      ],
      "skills_domains": [
        "Frontend",
        "Backend",
        "DevOps",
        "Data Science",
        "Cloud",
        "AI/ML",
        "Cross-Platform App Dev",
        "Embedded Systems"
      ],
      "strengths": "Demonstrates breadth across a wide range of programming languages and technologies, suggesting adaptability and a solid foundation across multiple domains including systems, mobile, and scientific computing.",
      "weakness": "Limited accessible data on code reviews and collaborative contributions restricts insight into code standards adherence and teamwork capabilities.",
      "type_of_work_in_percentage": {
        "features": 15,
        "bugs": 10,
        "infrastructure": 65,
        "documentation": 10
      }
    },
    {
      "github_username": "suhaib-md",
      "monthly_commits": 223,
      "average_commits_per_day": 7,
      "pull_request_approval_rate": "0%",
      "pull_request_reviews": 0,
      "languages": [
        "TypeScript",
        "PHP",
        "HTML",
        "Jinja",
        "Java",
        "EJS",
        "HCL",
        "Bicep",
        "Shell",
        "SCSS",
        "PowerShell",
        "CSS",
        "Python",
        "Jupyter Notebook",
        "C#",
        "Dockerfile",
        "JavaScript",
        "Smarty",
        "Procfile",
        "Nix",
        "Kotlin",
        "Makefile"
      ],
      "skills_domains": [
        "DevOps",
        "Frontend",
        "Backend",
        "Data Science",
        "Cloud",
        "AI/ML",
        "Infrastructure Automation",
        "Security & Compliance"
      ],
      "strengths": "Broad exposure to a wide range of languages, tools, and frameworks across multiple domains including DevOps, web development (frontend and backend), data science, and cloud-native tooling.",
      "weakness": "No available pull request reviews or diffs, so collaboration, code review participation, and detailed code quality aspects cannot be analyzed.",
      "type_of_work_in_percentage": {
        "features": 40,
        "bugs": 15,
        "infrastructure": 35,
        "documentation": 10
      }
    },
    {
      "github_username": "Guhanandan",
      "monthly_commits": 50,
      "average_commits_per_day": 2,
      "pull_request_approval_rate": "85%",
      "pull_request_reviews": 15,
      "languages": [ "Java", "Spring", "SQL", "JavaScript", "React" ],
      "skills_domains": [
        "Backend",
        "API Development",
        "Microservices",
        "State Management",
        "Database"
      ],
      "strengths": "Strong backend developer with expertise in Java and Spring Boot. Proficient in building robust and scalable microservices. Good understanding of database design and state management.",
      "weakness": "Could improve on frontend styling and complex UI interactions. Limited experience with DevOps and cloud infrastructure.",
      "type_of_work_in_percentage": {
        "features": 60,
        "bugs": 25,
        "infrastructure": 5,
        "documentation": 10
      }
    }
  ];
  
  export const getDeveloperByUsername = (username: string): Developer | undefined => {
      return developers.find(dev => dev.github_username === username);
  }
  
