// Recommend developers for a project based on project requirements.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendDevelopersInputSchema = z.object({
  projectRequirements: z
    .string()
    .describe('The project requirements derived from the uploaded PDF.'),
});
export type RecommendDevelopersInput = z.infer<typeof RecommendDevelopersInputSchema>;

const DeveloperSchema = z.object({
  name: z.string().describe('The name of the developer.'),
  skills: z.array(z.string()).describe('The skills of the developer.'),
  reasoning: z
    .string()
    .describe('The reasoning behind recommending this developer for the project.'),
});

const RecommendDevelopersOutputSchema = z.array(DeveloperSchema);
export type RecommendDevelopersOutput = z.infer<typeof RecommendDevelopersOutputSchema>;

export async function recommendDevelopers(input: RecommendDevelopersInput): Promise<RecommendDevelopersOutput> {
  return recommendDevelopersFlow(input);
}

const recommendDevelopersPrompt = ai.definePrompt({
  name: 'recommendDevelopersPrompt',
  input: {schema: RecommendDevelopersInputSchema},
  output: {schema: RecommendDevelopersOutputSchema},
  prompt: `You are a project manager who needs to assemble a team of developers for a new project.\n\n  Based on the following project requirements, recommend a list of developers with their skills and reasoning for why they are a good fit for the project.\n\n  Project Requirements: {{{projectRequirements}}}\n\n  Format your response as a JSON array of developers, each with a name, skills (as an array of strings), and reasoning.
  `,
});

const recommendDevelopersFlow = ai.defineFlow(
  {
    name: 'recommendDevelopersFlow',
    inputSchema: RecommendDevelopersInputSchema,
    outputSchema: RecommendDevelopersOutputSchema,
  },
  async input => {
    const {output} = await recommendDevelopersPrompt(input);
    return output!;
  }
);
