import 'server-only';

import type {Genkit} from 'genkit';

let aiInstance: Genkit | null = null;

async function getAI(): Promise<Genkit> {
  if (aiInstance) {
    return aiInstance;
  }

  // Dynamically import genkit to avoid bundling server-only dependencies at build time
  const {genkit} = await import('genkit');
  const {googleAI} = await import('@genkit-ai/google-genai');

  aiInstance = genkit({
    plugins: [googleAI()],
    model: 'googleai/gemini-2.5-flash',
  });

  return aiInstance;
}

export {getAI as ai};
