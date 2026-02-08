'use server';

/**
 * @fileOverview An AI agent that suggests optimal API key scopes and permissions based on a description.
 *
 * - suggestApiKeyScopes - A function that handles the API key scope suggestion process.
 * - SuggestApiKeyScopesInput - The input type for the suggestApiKeyScopes function.
 * - SuggestApiKeyScopesOutput - The return type for the suggestApiKeyScopes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SuggestApiKeyScopesInputSchema = z.object({
  description: z
    .string()
    .describe("A description of the API key's intended use."),
});
export type SuggestApiKeyScopesInput = z.infer<typeof SuggestApiKeyScopesInputSchema>;

const SuggestApiKeyScopesOutputSchema = z.object({
  suggestedScopes: z
    .array(z.string())
    .describe('An array of suggested API key scopes.'),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the suggested scopes.'),
});
export type SuggestApiKeyScopesOutput = z.infer<typeof SuggestApiKeyScopesOutputSchema>;

export async function suggestApiKeyScopes(
  input: SuggestApiKeyScopesInput
): Promise<SuggestApiKeyScopesOutput> {
  const aiInstance = await ai();
  
  const prompt = aiInstance.definePrompt({
    name: 'suggestApiKeyScopesPrompt',
    input: {schema: SuggestApiKeyScopesInputSchema},
    output: {schema: SuggestApiKeyScopesOutputSchema},
    prompt: `You are an expert in API key security and access control.

    Based on the provided description of the API key's intended use, suggest the optimal scopes and permissions that should be granted to the key.

    Description: {{{description}}}

    Respond with a list of suggested scopes and a brief explanation of why each scope is necessary.

    Example output:
    {
      "suggestedScopes": ["read", "write"],
      "reasoning": "The API key will be used to read and write data, so both the 'read' and 'write' scopes are required."
    }
    `,
  });

  const suggestApiKeyScopesFlow = aiInstance.defineFlow(
    {
      name: 'suggestApiKeyScopesFlow',
      inputSchema: SuggestApiKeyScopesInputSchema,
      outputSchema: SuggestApiKeyScopesOutputSchema,
    },
    async (input) => {
      const {output} = await prompt(input);
      return output!;
    }
  );

  return suggestApiKeyScopesFlow(input);
}

