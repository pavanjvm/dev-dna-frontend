'use server';

/**
 * @fileOverview Creates Jira tasks based on project requirements and assigns them to developers.
 *
 * - createJiraTasks - A function that handles the creation of Jira tasks.
 * - CreateJiraTasksInput - The input type for the createJiraTasks function.
 * - CreateJiraTasksOutput - The return type for the createJiraTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateJiraTasksInputSchema = z.object({
  projectRequirements: z
    .string()
    .describe('Detailed project requirements extracted from the PDF.'),
  developers: z
    .array(z.string())
    .describe('List of developers assigned to the project.'),
  projectName: z.string().describe('The name of the project.'),
});
export type CreateJiraTasksInput = z.infer<typeof CreateJiraTasksInputSchema>;

const CreateJiraTasksOutputSchema = z.object({
  jiraTaskDetails: z
    .array(z.string())
    .describe('Details of the created Jira tasks, including task IDs and summaries.'),
});
export type CreateJiraTasksOutput = z.infer<typeof CreateJiraTasksOutputSchema>;

export async function createJiraTasks(input: CreateJiraTasksInput): Promise<CreateJiraTasksOutput> {
  return createJiraTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createJiraTasksPrompt',
  input: {
    schema: CreateJiraTasksInputSchema,
  },
  output: {
    schema: CreateJiraTasksOutputSchema,
  },
  prompt: `You are a project management expert specializing in Jira task creation and assignment.

Based on the project requirements and the list of developers, create Jira tasks and assign them to the appropriate developers.
Ensure each task is clearly defined and actionable.

Project Name: {{{projectName}}}
Project Requirements: {{{projectRequirements}}}
Developers: {{#each developers}}{{{this}}}, {{/each}}

Output the created Jira tasks, including task IDs and summaries.`,
});

const createJiraTasksFlow = ai.defineFlow(
  {
    name: 'createJiraTasksFlow',
    inputSchema: CreateJiraTasksInputSchema,
    outputSchema: CreateJiraTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
