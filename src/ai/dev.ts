
import { NextApiRequest, NextApiResponse } from 'next';
import { ai, dev } from 'genkit';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { googleAI } from '@genkit-ai/googleai';
import { stream } from 'genkit/dev-server';

// Initialize Genkit AI
ai({
  plugins: [
    googleAI(),
  ],
});

// Define Zod schemas for structured input and output
const UserMessageSchema = z.object({
  user: z.string(),
  message: z.string(),
});

const BotResponseSchema = z.object({
  response: z.string(),
  timestamp: z.string(),
});

const CreateRepoSchema = z.object({
  action: z.literal('create-repo'),
  name: z.string(),
  description: z.string(),
});

const AnalyseSchema = z.object({
  pdf: z.any(),
});

// Define the main query flow
const queryFlow = ai.defineFlow(
  {
    name: 'queryFlow',
    inputSchema: z.union([UserMessageSchema, CreateRepoSchema]),
    outputSchema: BotResponseSchema,
  },
  async (payload) => {
    let promptText = '';

    if ('message' in payload) {
      // User message
      if (payload.message.toLowerCase().includes('daily updates')) {
        promptText = `
          Generate a "Daily Updates" report for a project. 
          The report should list updates for each of the following developers: farhanfist10, pavanjvm, Arul6851, suhaib-md, Guhanandan.
          For each developer, invent a brief, plausible-sounding update related to their assigned tasks (e.g., "completed the user authentication UI," "fixed a bug in the payment gateway," "deployed the new database schema").
          Format each update as follows:
          1. **DeveloperName**: [The update]
          Start the entire response with "On [Today's Date], here are the daily updates:"
        `;
      } else {
        promptText = `You are an AI assistant for a software development project. A user named ${payload.user} says: "${payload.message}". Provide a helpful and relevant response.`;
      }
    } else if ('action' in payload && payload.action === 'create-repo') {
      // Create repo action
      return {
        response: `Successfully created repository "${payload.name}" with description: "${payload.description}"`,
        timestamp: new Date().toISOString(),
      };
    }

    const llmResponse = await ai.generate({
      prompt: promptText,
      model: 'googleai/gemini-1.5-flash-latest',
      config: { temperature: 0.7 },
    });

    return {
      response: llmResponse.text,
      timestamp: new Date().toISOString(),
    };
  }
);


// Define the analysis flow
const analyseFlow = ai.defineFlow(
  {
    name: 'analyseFlow',
    inputSchema: AnalyseSchema,
    outputSchema: z.any(), 
  },
  async (payload) => {
    // In a real application, you would process the PDF here.
    // For now, we return a mocked response.
    return {
        "projectname": "Online Bookstore Web Application",
        "description": "An application enabling users to browse, search, and purchase books online with a customer interface and administrative dashboard.",
        "module_breakdown": {
            "User Registration and Login": {
                "title": "User Authentication",
                "description": "Handles user registration, login, and secure authentication.",
                "suggested_developer": "suhaib-md",
                "reasoning": "suhaib-md has a strong background in security and backend development, making them an ideal choice for implementing secure authentication mechanisms with JWT."
            },
            "Search and Filter Books": {
                "title": "Book Discovery",
                "description": "Implements search and filter functionalities by category, author, and rating.",
                "suggested_developer": "pavanjvm",
                "reasoning": "pavanjvm specializes in frontend development and possesses skills in React.js, which are essential for implementing a dynamic and responsive search and filter feature."
            },
            "View Book Details and Reviews": {
                "title": "Book Detail View",
                "description": "Displays detailed book information and user reviews.",
                "suggested_developer": "pavanjvm",
                "reasoning": "Given pavanjvm's extensive experience in frontend development, they are well-suited to create intuitive interfaces for viewing book details and reviews."
            },
            "Shopping Cart Management": {
                "title": "Shopping Cart",
                "description": "Allows users to add, remove, and manage books in their shopping cart.",
                "suggested_developer": "Guhanandan",
                "reasoning": "Guhanandan has demonstrated proficiency in backend services which will be crucial for handling cart operations and state management."
            },
            "Checkout and Payment": {
                "title": "Checkout and Payment Processing",
                "description": "Integrates secure checkout and payment functionality using Stripe.",
                "suggested_developer": "farhanfist10",
                "reasoning": "farhanfist10's experience in infrastructure and security aligns with the requirements for implementing a dependable payment gateway using Stripe."
            },
            "Order and Inventory Management": {
                "title": "Admin Dashboard",
                "description": "Provides tools for inventory and order management through the admin dashboard.",
                "suggested_developer": "Arul6851",
                "reasoning": "Arul6851's versatility and background in both backend and frontend tasks make them the right fit to handle the complex logic required in an admin dashboard for order and inventory management."
            }
        }
    };
  }
);


export default dev({
  flows: [queryFlow, analyseFlow],
  options: {
    port: 3001,
    cors: {
      origin: '*', 
    },
  },
});
