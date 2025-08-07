import { config } from 'dotenv';
config();

import '@/ai/flows/create-jira-tasks.ts';
import '@/ai/flows/recommend-developers.ts';
import '@/ai/flows/analyze-project-requirements.ts';