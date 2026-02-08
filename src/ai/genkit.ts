import {ai as genkitAI} from '@genkit-ai/next';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkitAI({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
