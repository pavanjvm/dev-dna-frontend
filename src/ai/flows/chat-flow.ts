'use server';
/**
 * @fileOverview A simple chatbot flow.
 *
 * - chat - A function that handles the chat conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatMessageSchema = z.object({
  text: z.string(),
  sender: z.enum(['user', 'bot']),
});

const ChatInputSchema = z.object({
  message: z.string().describe('The user\'s current message.'),
  history: z.array(ChatMessageSchema).optional().describe('The conversation history.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: z.object({ response: z.string() }) },
  prompt: `You are a helpful AI assistant for a software development tool called Project Genesis. Your goal is to assist users with their projects.

  Keep your responses concise and helpful.
  
  Conversation History:
  {{#if history}}
    {{#each history}}
      {{sender}}: {{text}}
    {{/each}}
  {{else}}
    No history.
  {{/if}}
  
  User's new message:
  user: {{{message}}}
  
  Your response:`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
