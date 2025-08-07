'use server';

/**
 * @fileOverview Analyzes project requirements from a PDF document.
 *
 * - analyzeProjectRequirements - A function that handles the analysis of project requirements.
 * - AnalyzeProjectRequirementsInput - The input type for the analyzeProjectRequirements function.
 * - AnalyzeProjectRequirementsOutput - The return type for the analyzeProjectRequirements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeProjectRequirementsInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF document containing project specifications, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeProjectRequirementsInput = z.infer<typeof AnalyzeProjectRequirementsInputSchema>;

const AnalyzeProjectRequirementsOutputSchema = z.object({
  summary: z.string().describe('A summary of the project requirements.'),
  keyAspects: z.string().describe('The key aspects of the project.'),
});
export type AnalyzeProjectRequirementsOutput = z.infer<typeof AnalyzeProjectRequirementsOutputSchema>;

export async function analyzeProjectRequirements(
  input: AnalyzeProjectRequirementsInput
): Promise<AnalyzeProjectRequirementsOutput> {
  return analyzeProjectRequirementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeProjectRequirementsPrompt',
  input: {schema: AnalyzeProjectRequirementsInputSchema},
  output: {schema: AnalyzeProjectRequirementsOutputSchema},
  prompt: `You are a project manager tasked with analyzing project requirements from a PDF document.

  Please provide a summary of the project requirements and identify the key aspects of the project.

  PDF Document: {{media url=pdfDataUri}}`,
});

const analyzeProjectRequirementsFlow = ai.defineFlow(
  {
    name: 'analyzeProjectRequirementsFlow',
    inputSchema: AnalyzeProjectRequirementsInputSchema,
    outputSchema: AnalyzeProjectRequirementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
